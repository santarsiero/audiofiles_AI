function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function toNumberOrNull(v) {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function loudnessToScore(lufs) {
  const n = toNumberOrNull(lufs);
  if (n === null) return null;
  return clamp((n + 30) / 24, 0, 1);
}

function rolloffToScore(v) {
  const n = toNumberOrNull(v);
  if (n === null) return null;
  if (n >= 0 && n <= 1) return clamp(n, 0, 1);
  return clamp(n / 8000, 0, 1);
}

function computeSourceReliability(sourcesUsed) {
  let best = 0;
  for (const s of sourcesUsed) {
    if (s === 'music_story') best = Math.max(best, 0.9);
    else if (s === 'acousticbrainz') best = Math.max(best, 0.75);
    else if (s === 'metadata') best = Math.max(best, 0.45);
    else if (s === 'llm') best = Math.max(best, 0.3);
  }
  return best;
}

function normalizeFromDescriptors({ musicStory, acousticBrainz }) {
  const analysis = {
    missingFeatures: [],
    conflicts: [],
    sourceCoverage: {},
    modelVersion: 'audiofile-label-mapper-v0.1',
    ontologyVersion: 'audiofile-ontology-v0.1'
  };

  const sourcesUsed = [];
  const vendor = {
    musicStory: musicStory && musicStory.available ? musicStory.data : null,
    acousticBrainz: acousticBrainz && acousticBrainz.available ? acousticBrainz.data : null
  };

  if (vendor.musicStory) sourcesUsed.push('music_story');
  if (vendor.acousticBrainz) sourcesUsed.push('acousticbrainz');

  function pick(pathCandidates) {
    for (const c of pathCandidates) {
      const { source, path } = c;
      const root = source === 'music_story' ? vendor.musicStory : vendor.acousticBrainz;
      if (!root) continue;

      let cur = root;
      let ok = true;
      for (const p of path) {
        if (cur && Object.prototype.hasOwnProperty.call(cur, p)) cur = cur[p];
        else {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      const n = toNumberOrNull(cur);
      if (n === null) continue;

      return { value: n, source };
    }
    return { value: null, source: null };
  }

  function require01(name, candidates) {
    const chosen = pick(candidates);
    if (chosen.value === null) {
      analysis.missingFeatures.push(name);
      return { value: null, available: false, source: null };
    }
    return { value: clamp(chosen.value, 0, 1), available: true, source: chosen.source };
  }

  function requireRaw(name, candidates, transform) {
    const chosen = pick(candidates);
    if (chosen.value === null) {
      analysis.missingFeatures.push(name);
      return { value: null, available: false, source: null };
    }

    const out = transform ? transform(chosen.value) : chosen.value;
    if (out === null) {
      analysis.missingFeatures.push(name);
      return { value: null, available: false, source: null };
    }

    return { value: out, available: true, source: chosen.source };
  }

  const arousal = require01('arousal', [
    { source: 'music_story', path: ['arousal'] },
    { source: 'acousticbrainz', path: ['highlevel', 'arousal'] }
  ]);

  const intensity = require01('intensity', [
    { source: 'music_story', path: ['intensity'] },
    { source: 'acousticbrainz', path: ['highlevel', 'intensity'] }
  ]);

  const eventDensity = require01('event_density', [
    { source: 'music_story', path: ['event_density'] },
    { source: 'acousticbrainz', path: ['rhythm', 'event_density'] }
  ]);

  const pulseClarity = require01('pulse_clarity', [
    { source: 'music_story', path: ['pulse_clarity'] },
    { source: 'acousticbrainz', path: ['rhythm', 'pulse_clarity'] }
  ]);

  const rhythmicStability = require01('rhythmic_stability', [
    { source: 'music_story', path: ['rhythmic_stability'] },
    { source: 'acousticbrainz', path: ['rhythm', 'rhythmic_stability'] }
  ]);

  const loudnessScore = requireRaw(
    'loudness',
    [
      { source: 'music_story', path: ['loudness'] },
      { source: 'music_story', path: ['absolute_loudness'] }
    ],
    loudnessToScore
  );

  const spectralComplexity = require01('spectral_complexity', [
    { source: 'music_story', path: ['spectral_complexity'] },
    { source: 'music_story', path: ['complexity'] }
  ]);

  const timbralComplexity = require01('timbral_complexity', [
    { source: 'music_story', path: ['timbral_complexity'] }
  ]);

  const loudnessRange = require01('loudness_range', [
    { source: 'music_story', path: ['loudness_range'] }
  ]);

  const instrumentationDiversity = require01('instrumentation_diversity', [
    { source: 'music_story', path: ['instrumentation_diversity'] }
  ]);

  const spectralCentroidOrBrightness = require01('spectral_centroid_or_brightness', [
    { source: 'music_story', path: ['brightness'] }
  ]);

  const spectralRolloff = require01('spectral_rolloff', [
    { source: 'music_story', path: ['spectral_rolloff'] }
  ]);

  const spectralRolloffFromPayload = requireRaw('spectral_rolloff', [{ source: 'music_story', path: ['roll_off'] }], rolloffToScore);

  const flatness = require01('flatness', [
    { source: 'music_story', path: ['flatness'] }
  ]);

  const valence = require01('valence', [
    { source: 'music_story', path: ['valence'] },
    { source: 'acousticbrainz', path: ['highlevel', 'valence'] }
  ]);

  const lowEndScore = require01('low_end_score', [
    { source: 'music_story', path: ['low_end_score'] }
  ]);

  const vocalInstrumental = require01('vocal_instrumental', [
    { source: 'music_story', path: ['vocal_instrumental'] }
  ]);

  const musicSpeech = require01('music_speech', [
    { source: 'music_story', path: ['music_speech'] }
  ]);

  const harshness = require01('harshness_score', [
    { source: 'music_story', path: ['harshness_score'] }
  ]);

  const dissonance = require01('dissonance', [
    { source: 'music_story', path: ['dissonance'] }
  ]);

  const articulation = require01('articulation', [
    { source: 'music_story', path: ['articulation'] }
  ]);

  const transientStrength = require01('transient_strength', [
    { source: 'music_story', path: ['transient_strength'] }
  ]);

  const offbeat = require01('offbeat_score', [
    { source: 'music_story', path: ['offbeat_score'] }
  ]);

  const providerSyncopationOrRhythmComplexity = require01('provider_syncopation_or_rhythm_complexity', [
    { source: 'music_story', path: ['syncopation'] },
    { source: 'music_story', path: ['rhythm_complexity'] }
  ]);

  const lowValenceScore = valence.available ? { value: 1 - valence.value, available: true, source: valence.source } : { value: null, available: false, source: null };

  const energyScore = computeEnergyScore({ arousal, intensity, loudnessScore, eventDensity, pulseClarity });
  const densityScore = computeDensityScore({ eventDensity, spectralComplexity, timbralComplexity, loudnessRange, intensity });
  const layeredScore = computeLayeredScore({ timbralComplexity, instrumentationDiversity, spectralComplexity, densityScore });
  const brightnessScore = computeBrightnessScore({
    spectralCentroidOrBrightness,
    spectralRolloff: spectralRolloff.available ? spectralRolloff : spectralRolloffFromPayload,
    flatness,
    valence
  });
  const darknessScore = computeDarknessScore({ lowEndScore, brightnessScore, lowValenceScore });
  const pulseScore = computePulseScore({ pulseClarity, rhythmicStability });
  const drivingScore = computeDrivingScore({ pulseScore, energyScore, eventDensity, lowEndScore });
  const syncopationScore = computeSyncopationScore({ providerSyncopationOrRhythmComplexity, rhythmicStability, pulseScore });
  const moderateEnergyScore = computeModerateEnergyScore(energyScore);
  const bouncyScore = computeBouncyScore({ offbeat, pulseScore, valence, moderateEnergyScore });
  const vocalScore = computeVocalScore(vocalInstrumental);
  const instrumentalScore = computeInstrumentalScore(vocalInstrumental);
  const speechScore = computeSpeechScore(musicSpeech);
  const aggressiveScore = computeAggressiveScore({ energyScore, harshness, dissonance, flatness, lowValenceScore });
  const punchScore = computePunchScore({ transientStrength, articulation, eventDensity, lowEndScore, pulseScore });
  const calmScore = computeCalmScore({ energyScore, eventDensity, articulation, harshness, aggressiveScore, punchScore });

  const normalizedFeatures = {
    energy_score: energyScore,
    density_score: densityScore,
    layered_score: layeredScore,
    brightness_score: brightnessScore,
    darkness_score: darknessScore,
    pulse_score: pulseScore,
    rhythm_stability_score: rhythmicStability.available ? rhythmicStability.value : null,
    offbeat_score: offbeat.available ? offbeat.value : null,
    syncopation_score: syncopationScore,
    vocal_score: vocalScore,
    speech_score: speechScore,
    instrumental_score: instrumentalScore,
    harshness_score: harshness.available ? harshness.value : null,
    punch_score: punchScore,
    calm_score: calmScore,
    low_end_score: lowEndScore.available ? lowEndScore.value : null,
    acoustic_score: null,
    valence_score: valence.available ? valence.value : null,
    driving_score: drivingScore
  };

  analysis.sourceCoverage = {
    sourcesUsed,
    sourceReliability: computeSourceReliability(sourcesUsed)
  };

  analysis.inputTrace = {
    arousal,
    intensity,
    loudness_score: loudnessScore,
    event_density: eventDensity,
    pulse_clarity: pulseClarity,
    rhythmic_stability: rhythmicStability,
    spectral_complexity: spectralComplexity,
    timbral_complexity: timbralComplexity,
    loudness_range: loudnessRange,
    instrumentation_diversity: instrumentationDiversity,
    spectral_centroid_or_brightness: spectralCentroidOrBrightness,
    spectral_rolloff: spectralRolloff.available ? spectralRolloff : spectralRolloffFromPayload,
    flatness,
    valence,
    low_end_score: lowEndScore,
    vocal_instrumental: vocalInstrumental,
    music_speech: musicSpeech,
    harshness_score: harshness,
    dissonance,
    articulation,
    transient_strength: transientStrength,
    provider_syncopation_or_rhythm_complexity: providerSyncopationOrRhythmComplexity,
    offbeat_score: offbeat,
    low_valence_score: lowValenceScore
  };

  return {
    normalizedFeatures,
    analysis,
    internal: {
      inputs: {
        arousal,
        intensity,
        loudness_score: loudnessScore,
        event_density: eventDensity,
        pulse_clarity: pulseClarity,
        rhythmic_stability: rhythmicStability,
        spectral_complexity: spectralComplexity,
        timbral_complexity: timbralComplexity,
        loudness_range: loudnessRange,
        instrumentation_diversity: instrumentationDiversity,
        spectral_centroid_or_brightness: spectralCentroidOrBrightness,
        spectral_rolloff: spectralRolloff,
        flatness,
        valence,
        low_end_score: lowEndScore,
        vocal_instrumental: vocalInstrumental,
        music_speech: musicSpeech,
        harshness_score: harshness,
        dissonance,
        articulation,
        transient_strength: transientStrength,
        provider_syncopation_or_rhythm_complexity: providerSyncopationOrRhythmComplexity,
        offbeat_score: offbeat,
        low_valence_score: lowValenceScore
      }
    }
  };
}

function weightedAverage(items) {
  let weightSum = 0;
  let acc = 0;

  for (const i of items) {
    if (!i || i.value === null || i.value === undefined) continue;
    weightSum += i.weight;
    acc += i.weight * i.value;
  }

  if (weightSum === 0) return null;
  return clamp(acc / weightSum, 0, 1);
}

function computeEnergyScore({ arousal, intensity, loudnessScore, eventDensity, pulseClarity }) {
  const hasArousal = arousal.available;

  if (hasArousal) {
    return weightedAverage([
      { weight: 0.4, value: arousal.value },
      { weight: 0.25, value: intensity.available ? intensity.value : null },
      { weight: 0.15, value: loudnessScore.available ? loudnessScore.value : null },
      { weight: 0.1, value: eventDensity.available ? eventDensity.value : null },
      { weight: 0.1, value: pulseClarity.available ? pulseClarity.value : null }
    ]);
  }

  return weightedAverage([
    { weight: 0.35, value: intensity.available ? intensity.value : null },
    { weight: 0.25, value: loudnessScore.available ? loudnessScore.value : null },
    { weight: 0.2, value: eventDensity.available ? eventDensity.value : null },
    { weight: 0.2, value: pulseClarity.available ? pulseClarity.value : null }
  ]);
}

function computeDensityScore({ eventDensity, spectralComplexity, timbralComplexity, loudnessRange, intensity }) {
  const hasComplex = spectralComplexity.available && timbralComplexity.available;

  if (hasComplex) {
    return weightedAverage([
      { weight: 0.4, value: eventDensity.available ? eventDensity.value : null },
      { weight: 0.25, value: spectralComplexity.value },
      { weight: 0.2, value: timbralComplexity.value },
      { weight: 0.15, value: loudnessRange.available ? loudnessRange.value : null }
    ]);
  }

  return weightedAverage([
    { weight: 0.6, value: eventDensity.available ? eventDensity.value : null },
    { weight: 0.25, value: intensity.available ? intensity.value : null },
    { weight: 0.15, value: loudnessRange.available ? loudnessRange.value : null }
  ]);
}

function computeLayeredScore({ timbralComplexity, instrumentationDiversity, spectralComplexity, densityScore }) {
  return weightedAverage([
    { weight: 0.35, value: timbralComplexity.available ? timbralComplexity.value : null },
    { weight: 0.25, value: instrumentationDiversity.available ? instrumentationDiversity.value : null },
    { weight: 0.2, value: spectralComplexity.available ? spectralComplexity.value : null },
    { weight: 0.2, value: densityScore }
  ]);
}

function computeBrightnessScore({ spectralCentroidOrBrightness, spectralRolloff, flatness, valence }) {
  return weightedAverage([
    { weight: 0.55, value: spectralCentroidOrBrightness.available ? spectralCentroidOrBrightness.value : null },
    { weight: 0.2, value: spectralRolloff.available ? spectralRolloff.value : null },
    { weight: 0.15, value: flatness.available ? flatness.value : null },
    { weight: 0.1, value: valence.available ? valence.value : null }
  ]);
}

function computeDarknessScore({ lowEndScore, brightnessScore, lowValenceScore }) {
  return weightedAverage([
    { weight: 0.4, value: lowEndScore.available ? lowEndScore.value : null },
    { weight: 0.25, value: brightnessScore === null ? null : 1 - brightnessScore },
    { weight: 0.2, value: lowValenceScore.available ? lowValenceScore.value : null },
    { weight: 0.15, value: null }
  ]);
}

function computePulseScore({ pulseClarity, rhythmicStability }) {
  const both = pulseClarity.available && rhythmicStability.available;

  if (both) {
    return weightedAverage([
      { weight: 0.65, value: pulseClarity.value },
      { weight: 0.35, value: rhythmicStability.value }
    ]);
  }

  if (pulseClarity.available) return clamp(pulseClarity.value, 0, 1);
  if (rhythmicStability.available) return clamp(rhythmicStability.value, 0, 1);
  return null;
}

function computeDrivingScore({ pulseScore, energyScore, eventDensity, lowEndScore }) {
  return weightedAverage([
    { weight: 0.35, value: pulseScore },
    { weight: 0.25, value: energyScore },
    { weight: 0.2, value: eventDensity.available ? eventDensity.value : null },
    { weight: 0.2, value: lowEndScore.available ? lowEndScore.value : null }
  ]);
}

function computeModerateEnergyScore(energyScore) {
  if (energyScore === null) return null;
  return clamp(1 - Math.abs(energyScore - 0.55) / 0.55, 0, 1);
}

function computeBouncyScore({ offbeat, pulseScore, valence, moderateEnergyScore }) {
  return weightedAverage([
    { weight: 0.35, value: offbeat.available ? offbeat.value : null },
    { weight: 0.25, value: pulseScore },
    { weight: 0.2, value: valence.available ? valence.value : null },
    { weight: 0.2, value: moderateEnergyScore }
  ]);
}

function computeSyncopationScore({ providerSyncopationOrRhythmComplexity, rhythmicStability, pulseScore }) {
  const score = weightedAverage([
    { weight: 0.6, value: providerSyncopationOrRhythmComplexity.available ? providerSyncopationOrRhythmComplexity.value : null },
    { weight: 0.2, value: rhythmicStability.available ? 1 - rhythmicStability.value : null },
    { weight: 0.2, value: pulseScore }
  ]);

  return score;
}

function computeVocalScore(vocalInstrumental) {
  if (!vocalInstrumental.available) return null;
  return clamp(1 - vocalInstrumental.value, 0, 1);
}

function computeInstrumentalScore(vocalInstrumental) {
  if (!vocalInstrumental.available) return null;
  return clamp(vocalInstrumental.value, 0, 1);
}

function computeSpeechScore(musicSpeech) {
  if (!musicSpeech.available) return null;
  return clamp(musicSpeech.value, 0, 1);
}

function computeAggressiveScore({ energyScore, harshness, dissonance, flatness, lowValenceScore }) {
  return weightedAverage([
    { weight: 0.35, value: energyScore },
    { weight: 0.25, value: harshness.available ? harshness.value : null },
    { weight: 0.15, value: dissonance.available ? dissonance.value : null },
    { weight: 0.15, value: flatness.available ? flatness.value : null },
    { weight: 0.1, value: lowValenceScore.available ? lowValenceScore.value : null }
  ]);
}

function computePunchScore({ transientStrength, articulation, eventDensity, lowEndScore, pulseScore }) {
  const hasTransient = transientStrength.available;

  if (hasTransient) {
    return weightedAverage([
      { weight: 0.45, value: transientStrength.value },
      { weight: 0.25, value: articulation.available ? articulation.value : null },
      { weight: 0.15, value: eventDensity.available ? eventDensity.value : null },
      { weight: 0.15, value: lowEndScore.available ? lowEndScore.value : null }
    ]);
  }

  return weightedAverage([
    { weight: 0.35, value: articulation.available ? articulation.value : null },
    { weight: 0.25, value: eventDensity.available ? eventDensity.value : null },
    { weight: 0.2, value: pulseScore },
    { weight: 0.2, value: lowEndScore.available ? lowEndScore.value : null }
  ]);
}

function computeCalmScore({ energyScore, eventDensity, articulation, harshness, aggressiveScore, punchScore }) {
  const base = weightedAverage([
    { weight: 0.35, value: energyScore === null ? null : 1 - energyScore },
    { weight: 0.25, value: eventDensity.available ? 1 - eventDensity.value : null },
    { weight: 0.2, value: articulation.available ? 1 - articulation.value : null },
    { weight: 0.2, value: harshness.available ? 1 - harshness.value : null }
  ]);

  if (base === null) return null;

  if ((aggressiveScore !== null && aggressiveScore > 0.65) || (punchScore !== null && punchScore > 0.75)) {
    return clamp(base * 0.8, 0, 1);
  }

  return base;
}

module.exports = {
  normalizeFromDescriptors
};
