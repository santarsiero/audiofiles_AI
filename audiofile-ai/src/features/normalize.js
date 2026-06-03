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

function centroidToScore(v) {
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

function toDimensionObject({ score, confidence, evidence, missing, usable }) {
  const s = score === undefined ? null : score;
  const c = clamp(confidence === undefined ? 0 : confidence, 0, 1);
  return {
    score: s,
    confidence: c,
    evidence: Array.isArray(evidence) ? evidence : [],
    missing: Array.isArray(missing) ? missing : [],
    usable: usable === undefined ? c >= 0.4 : Boolean(usable)
  };
}

function trackEvidence(list, name, descriptorObj) {
  if (!descriptorObj || !descriptorObj.available) return;
  list.push(name);
}

function trackMissing(list, name, descriptorObj) {
  if (!descriptorObj || descriptorObj.available) return;
  list.push(name);
}

function computeConfidence({ score, primary = [], secondary = [], boosts = [], baseWhenAllPresent = 0.9, fallbackMode = null }) {
  if (score === null || score === undefined) {
    return { confidence: 0, evidence: [], missing: [] };
  }

  const evidence = [];
  const missing = [];

  for (const d of primary) {
    trackEvidence(evidence, d.name, d.obj);
    trackMissing(missing, d.name, d.obj);
  }

  for (const d of secondary) {
    trackEvidence(evidence, d.name, d.obj);
    trackMissing(missing, d.name, d.obj);
  }

  for (const d of boosts) {
    trackEvidence(evidence, d.name, d.obj);
    trackMissing(missing, d.name, d.obj);
  }

  let conf = baseWhenAllPresent;

  const presentPrimary = primary.filter((d) => d.obj && d.obj.available).length;
  const missingPrimary = primary.length - presentPrimary;

  if (primary.length > 0 && presentPrimary === 0) {
    return { confidence: 0, evidence, missing };
  }

  conf -= 0.35 * missingPrimary;

  const presentSecondary = secondary.filter((d) => d.obj && d.obj.available).length;
  const missingSecondary = secondary.length - presentSecondary;
  conf -= 0.12 * missingSecondary;

  const presentBoosts = boosts.filter((d) => d.obj && d.obj.available).length;
  conf += 0.05 * presentBoosts;

  if (fallbackMode === 'single_primary') {
    if (presentPrimary === 1 && primary.length >= 2) conf = Math.min(conf, 0.7);
  }

  if (fallbackMode === 'fallback_only') {
    conf = Math.min(conf, 0.4);
  }

  return { confidence: clamp(conf, 0, 1), evidence, missing };
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

  const loudnessScore = requireRaw('loudness', [{ source: 'music_story', path: ['loudness'] }], loudnessToScore);

  const loudnessRange = require01('loudness_range', [
    { source: 'music_story', path: ['loudness_range'] }
  ]);


  const danceability = require01('danceability', [
    { source: 'music_story', path: ['danceability'] }
  ]);

  const complexity = require01('complexity', [
    { source: 'music_story', path: ['complexity'] }
  ]);

  const spectralCentroidOrBrightness = require01('spectral_centroid_or_brightness', [
    { source: 'music_story', path: ['brightness'] }
  ]);

  const rollOffScore = requireRaw('roll_off', [{ source: 'music_story', path: ['roll_off'] }], rolloffToScore);

  const centroid = requireRaw('centroid', [{ source: 'music_story', path: ['centroid'] }], centroidToScore);

  const flatness = require01('flatness', [
    { source: 'music_story', path: ['flatness'] }
  ]);

  const valence = require01('valence', [
    { source: 'music_story', path: ['valence'] },
    { source: 'acousticbrainz', path: ['highlevel', 'valence'] }
  ]);

  const vocalInstrumental = require01('vocal_instrumental', [
    { source: 'music_story', path: ['vocal_instrumental'] }
  ]);

  const musicSpeech = require01('music_speech', [
    { source: 'music_story', path: ['music_speech'] }
  ]);

  const dissonance = require01('dissonance', [
    { source: 'music_story', path: ['dissonance'] }
  ]);

  const articulation = require01('articulation', [
    { source: 'music_story', path: ['articulation'] }
  ]);

  const lowValenceScore = valence.available ? { value: 1 - valence.value, available: true, source: valence.source } : { value: null, available: false, source: null };

  const energyScore = computeEnergyScore({ arousal, intensity, loudnessScore });
  const densityScore = computeDensityScore({ eventDensity, intensity, complexity });
  const brightnessScore = computeBrightnessScore({
    brightness: spectralCentroidOrBrightness,
    rollOffScore,
    centroid
  });
  const pulseScore = computePulseScore({ pulseClarity, rhythmicStability, danceability, articulation, complexity });
  const vocalScore = computeVocalScore(vocalInstrumental);
  const instrumentalScore = computeInstrumentalScore(vocalInstrumental);
  const speechScore = computeSpeechScore(musicSpeech);
  const punchScore = computePunchScore({ articulation, loudnessRange });

  const normalizedFeatures = {
    energy_score: energyScore,
    density_score: densityScore,
    brightness_score: brightnessScore,
    pulse_score: pulseScore,
    rhythm_stability_score: rhythmicStability.available ? rhythmicStability.value : null,
    vocal_score: vocalScore,
    vocal_presence_score: vocalScore,
    speech_score: speechScore,
    instrumental_score: instrumentalScore,
    punch_score: punchScore,
    layered_score: null,
    darkness_score: null,
    offbeat_score: null,
    syncopation_score: null,
    harshness_score: null,
    calm_score: null,
    low_end_score: null,
    acoustic_score: null,
    valence_score: valence.available ? valence.value : null,
    driving_score: null
  };

  const lowConfidenceDimensions = [];

  const dimensionObjects = {};

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: energyScore,
      primary: [
        { name: 'arousal', obj: arousal },
        { name: 'loudness', obj: loudnessScore },
        { name: 'intensity', obj: intensity }
      ],
      baseWhenAllPresent: 0.95
    });
    dimensionObjects.energy_score = toDimensionObject({ score: energyScore, confidence, evidence, missing });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: pulseScore,
      primary: [
        { name: 'pulse_clarity', obj: pulseClarity },
        { name: 'rhythmic_stability', obj: rhythmicStability }
      ],
      boosts: [
        { name: 'danceability', obj: danceability },
        { name: 'articulation', obj: articulation }
      ],
      secondary: [{ name: 'complexity', obj: complexity }],
      baseWhenAllPresent: 0.9,
      fallbackMode: 'single_primary'
    });
    dimensionObjects.pulse_score = toDimensionObject({ score: pulseScore, confidence, evidence, missing });
  }

  {
    const hasPrimary = spectralCentroidOrBrightness.available || rollOffScore.available;
    const fallbackMode = hasPrimary ? (spectralCentroidOrBrightness.available && rollOffScore.available ? null : 'single_primary') : 'fallback_only';

    const { confidence, evidence, missing } = computeConfidence({
      score: brightnessScore,
      primary: [
        { name: 'brightness', obj: spectralCentroidOrBrightness },
        { name: 'roll_off', obj: rollOffScore }
      ],
      secondary: [{ name: 'centroid', obj: centroid }],
      baseWhenAllPresent: 0.9,
      fallbackMode
    });

    dimensionObjects.brightness_score = toDimensionObject({ score: brightnessScore, confidence, evidence, missing });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: densityScore,
      primary: [{ name: 'event_density', obj: eventDensity }],
      secondary: [
        { name: 'intensity', obj: intensity },
        { name: 'complexity', obj: complexity }
      ],
      baseWhenAllPresent: 0.85
    });

    dimensionObjects.density_score = toDimensionObject({
      score: densityScore,
      confidence: Math.min(confidence, 0.7),
      evidence,
      missing
    });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: vocalScore,
      primary: [{ name: 'vocal_instrumental', obj: vocalInstrumental }],
      secondary: [{ name: 'music_speech', obj: musicSpeech }],
      baseWhenAllPresent: 0.85
    });

    let adjusted = confidence;
    if (vocalScore !== null && vocalScore >= 0.35 && vocalScore <= 0.65) {
      adjusted = adjusted * 0.7;
    }

    dimensionObjects.vocal_presence_score = toDimensionObject({
      score: vocalScore,
      confidence: Math.min(adjusted, 0.75),
      evidence,
      missing
    });

    dimensionObjects.vocal_score = toDimensionObject({
      score: vocalScore,
      confidence: Math.min(adjusted, 0.75),
      evidence,
      missing
    });

    const instrumentalConf = computeConfidence({
      score: instrumentalScore,
      primary: [{ name: 'vocal_instrumental', obj: vocalInstrumental }],
      secondary: [{ name: 'music_speech', obj: musicSpeech }],
      baseWhenAllPresent: 0.85
    });

    dimensionObjects.instrumental_score = toDimensionObject({
      score: instrumentalScore,
      confidence: Math.min(instrumentalConf.confidence, 0.75),
      evidence: instrumentalConf.evidence,
      missing: instrumentalConf.missing
    });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: speechScore,
      primary: [{ name: 'music_speech', obj: musicSpeech }],
      baseWhenAllPresent: 0.95
    });

    dimensionObjects.speech_score = toDimensionObject({ score: speechScore, confidence, evidence, missing });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: valence.available ? valence.value : null,
      primary: [{ name: 'valence', obj: valence }],
      baseWhenAllPresent: 0.95
    });

    dimensionObjects.valence_score = toDimensionObject({ score: valence.available ? valence.value : null, confidence, evidence, missing });
  }

  {
    const { confidence, evidence, missing } = computeConfidence({
      score: punchScore,
      primary: [
        { name: 'articulation', obj: articulation },
        { name: 'loudness_range', obj: loudnessRange }
      ],
      baseWhenAllPresent: 0.8,
      fallbackMode: 'single_primary'
    });

    dimensionObjects.punch_score = toDimensionObject({
      score: punchScore,
      confidence: Math.min(confidence, 0.7),
      evidence,
      missing
    });
  }

  for (const [k, v] of Object.entries(dimensionObjects)) {
    if (!dimensionObjects[k].usable) lowConfidenceDimensions.push(k);
  }

  // Preserve Phase A behavior for legacy scores by providing dimension objects, but without Phase C confidence modeling.
  for (const [k, v] of Object.entries(normalizedFeatures)) {
    if (dimensionObjects[k]) continue;
    dimensionObjects[k] = toDimensionObject({ score: v, confidence: v === null || v === undefined ? 0 : 1, evidence: [], missing: [] });
  }

  analysis.sourceCoverage = {
    sourcesUsed,
    sourceReliability: computeSourceReliability(sourcesUsed)
  };

  analysis.dimensionObjects = dimensionObjects;
  analysis.lowConfidenceDimensions = lowConfidenceDimensions;

  analysis.inputTrace = {
    arousal,
    intensity,
    loudness_score: loudnessScore,
    event_density: eventDensity,
    pulse_clarity: pulseClarity,
    rhythmic_stability: rhythmicStability,
    loudness_range: loudnessRange,
    danceability,
    complexity,
    spectral_centroid_or_brightness: spectralCentroidOrBrightness,
    roll_off: rollOffScore,
    centroid,
    flatness,
    valence,
    vocal_instrumental: vocalInstrumental,
    music_speech: musicSpeech,
    dissonance,
    articulation,
    low_valence_score: lowValenceScore
  };

  return {
    normalizedFeatures,
    analysis,
    dimensionObjects,
    internal: {
      inputs: {
        arousal,
        intensity,
        loudness_score: loudnessScore,
        event_density: eventDensity,
        pulse_clarity: pulseClarity,
        rhythmic_stability: rhythmicStability,
        loudness_range: loudnessRange,
        danceability,
        complexity,
        spectral_centroid_or_brightness: spectralCentroidOrBrightness,
        roll_off: rollOffScore,
        centroid,
        flatness,
        valence,
        vocal_instrumental: vocalInstrumental,
        music_speech: musicSpeech,
        dissonance,
        articulation,
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

function computeEnergyScore({ arousal, intensity, loudnessScore }) {
  return weightedAverage([
    { weight: 0.5, value: arousal.available ? arousal.value : null },
    { weight: 0.3, value: loudnessScore.available ? loudnessScore.value : null },
    { weight: 0.2, value: intensity.available ? intensity.value : null }
  ]);
}

function computeDensityScore({ eventDensity, intensity, complexity }) {
  return weightedAverage([
    { weight: 0.6, value: eventDensity.available ? eventDensity.value : null },
    { weight: 0.25, value: intensity.available ? intensity.value : null },
    { weight: 0.15, value: complexity.available ? complexity.value : null }
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

function computeBrightnessScore({ brightness, rollOffScore, centroid }) {
  const hasPrimary = brightness.available || rollOffScore.available;

  if (!hasPrimary) {
    return centroid.available ? clamp(centroid.value, 0, 1) : null;
  }

  return weightedAverage([
    { weight: 0.55, value: brightness.available ? brightness.value : null },
    { weight: 0.45, value: rollOffScore.available ? rollOffScore.value : null }
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

function computePulseScore({ pulseClarity, rhythmicStability, danceability, articulation, complexity }) {
  const base = weightedAverage([
    { weight: 0.55, value: pulseClarity.available ? pulseClarity.value : null },
    { weight: 0.25, value: rhythmicStability.available ? rhythmicStability.value : null },
    { weight: 0.1, value: danceability.available ? danceability.value : null },
    { weight: 0.1, value: articulation.available ? articulation.value : null }
  ]);

  if (base === null) return null;

  const c = complexity && complexity.available ? complexity.value : null;
  if (c === null) return clamp(base, 0, 1);

  return clamp(base - 0.15 * clamp(c, 0, 1), 0, 1);
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

function computePunchScore({ articulation, loudnessRange }) {
  return weightedAverage([
    { weight: 0.6, value: articulation.available ? articulation.value : null },
    { weight: 0.4, value: loudnessRange.available ? loudnessRange.value : null }
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
