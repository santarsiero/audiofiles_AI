const { safeNumber } = require('./io');

function clamp01(x) {
  if (x === null || x === undefined) return null;
  if (!Number.isFinite(x)) return null;
  if (x < 0) return 0;
  if (x > 1) return 1;
  return x;
}

function minMaxNormalize(value, min, max) {
  const v = safeNumber(value);
  if (v === null) return null;
  if (min === null || min === undefined || max === null || max === undefined) return null;
  if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
  if (max === min) return null;
  return clamp01((v - min) / (max - min));
}

function zScore(value, mean, std) {
  const v = safeNumber(value);
  if (v === null) return null;
  if (mean === null || mean === undefined || std === null || std === undefined) return null;
  if (!Number.isFinite(mean) || !Number.isFinite(std) || std === 0) return null;
  return (v - mean) / std;
}

function weightedAverage(pairs) {
  // pairs: [{ key, value, weight }]
  const usable = pairs.filter((p) => p.value !== null && p.value !== undefined && Number.isFinite(p.value));
  if (!usable.length) return { score: null, used: [], missing: pairs.map((p) => p.key) };

  let num = 0;
  let den = 0;
  for (const p of usable) {
    const w = p.weight === null || p.weight === undefined ? 1 : p.weight;
    if (!Number.isFinite(w) || w <= 0) continue;
    num += p.value * w;
    den += w;
  }
  if (!den) return { score: null, used: [], missing: pairs.map((p) => p.key) };

  const usedKeys = usable.map((p) => p.key);
  const missingKeys = pairs.filter((p) => !usedKeys.includes(p.key)).map((p) => p.key);
  return { score: num / den, used: usedKeys, missing: missingKeys };
}

function computeDatasetMinMax(successEntries, descriptorKeys) {
  const out = {};
  for (const k of descriptorKeys) {
    let min = null;
    let max = null;
    let count = 0;

    for (const e of successEntries) {
      const d = e.rawDescriptorData;
      if (!d || typeof d !== 'object') continue;
      if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
      const n = safeNumber(d[k]);
      if (n === null) continue;
      count += 1;
      if (min === null || n < min) min = n;
      if (max === null || n > max) max = n;
    }

    out[k] = { min, max, count };
  }
  return out;
}

function computeFeature_energy_score_v1(entry, mm) {
  const d = entry.rawDescriptorData || {};

  const pairs = [
    { key: 'arousal', value: minMaxNormalize(d.arousal, mm.arousal.min, mm.arousal.max), weight: 1 },
    { key: 'intensity', value: minMaxNormalize(d.intensity, mm.intensity.min, mm.intensity.max), weight: 1 },
    { key: 'loudness', value: minMaxNormalize(d.loudness, mm.loudness.min, mm.loudness.max), weight: 1 },
    { key: 'articulation', value: minMaxNormalize(d.articulation, mm.articulation.min, mm.articulation.max), weight: 0.7 },
    { key: 'pulse_clarity', value: minMaxNormalize(d.pulse_clarity, mm.pulse_clarity.min, mm.pulse_clarity.max), weight: 0.7 }
  ];

  const { score, used, missing } = weightedAverage(pairs);
  return {
    featureName: 'energy_score_v1',
    score: score === null ? null : clamp01(score),
    contributors: used,
    missingDescriptors: missing,
    notes: [
      'Exploratory composite. Uses dataset min-max scaling for each descriptor.',
      'Weights are heuristic and may need revision.'
    ]
  };
}

function computeFeature_brightness_score_v1(entry, mm) {
  const d = entry.rawDescriptorData || {};

  // Avoid over-weighting highly correlated descriptors: use equal weights.
  const pairs = [
    { key: 'brightness', value: minMaxNormalize(d.brightness, mm.brightness.min, mm.brightness.max), weight: 1 },
    { key: 'roll_off', value: minMaxNormalize(d.roll_off, mm.roll_off.min, mm.roll_off.max), weight: 1 },
    { key: 'centroid', value: minMaxNormalize(d.centroid, mm.centroid.min, mm.centroid.max), weight: 1 },
    { key: 'flatness', value: minMaxNormalize(d.flatness, mm.flatness.min, mm.flatness.max), weight: 1 }
  ];

  const { score, used, missing } = weightedAverage(pairs);
  return {
    featureName: 'brightness_score_v1',
    score: score === null ? null : clamp01(score),
    contributors: used,
    missingDescriptors: missing,
    notes: [
      'Exploratory composite. Uses dataset min-max scaling for each descriptor.',
      'Spectral descriptors appear correlated; this feature may be redundant with individual descriptors.'
    ]
  };
}

function computeFeature_pulse_score_v1(entry, mm) {
  const d = entry.rawDescriptorData || {};

  const pulse = minMaxNormalize(d.pulse_clarity, mm.pulse_clarity.min, mm.pulse_clarity.max);
  const stability = minMaxNormalize(d.rhythmic_stability, mm.rhythmic_stability.min, mm.rhythmic_stability.max);
  const dance = minMaxNormalize(d.danceability, mm.danceability.min, mm.danceability.max);
  const complexity = minMaxNormalize(d.complexity, mm.complexity.min, mm.complexity.max);

  const pairs = [
    { key: 'pulse_clarity', value: pulse, weight: 1 },
    { key: 'rhythmic_stability', value: stability, weight: 1 },
    { key: 'danceability', value: dance, weight: 1 },
    // negative contributor
    { key: 'complexity', value: complexity === null ? null : 1 - complexity, weight: 0.8 }
  ];

  const { score, used, missing } = weightedAverage(pairs);
  return {
    featureName: 'pulse_score_v1',
    score: score === null ? null : clamp01(score),
    contributors: used,
    missingDescriptors: missing,
    notes: [
      'Exploratory composite. Uses (1 - normalized_complexity) as a negative contributor.',
      'Descriptor orientation and weighting may need revision.'
    ]
  };
}

function computeFeature_vocal_presence_score_v1(entry, mm) {
  const d = entry.rawDescriptorData || {};

  const vi = minMaxNormalize(d.vocal_instrumental, mm.vocal_instrumental.min, mm.vocal_instrumental.max);
  const ms = minMaxNormalize(d.music_speech, mm.music_speech.min, mm.music_speech.max);

  // NOTE: vocal_instrumental orientation may be reversed (higher might mean more instrumental).
  // To keep this exploratory but usable, we currently assume higher => more vocal presence.
  // This should be validated; if reversed, we would use (1 - vi) instead.

  const pairs = [
    { key: 'vocal_instrumental', value: vi, weight: 1 },
    { key: 'music_speech', value: ms, weight: 0.8 }
  ];

  const { score, used, missing } = weightedAverage(pairs);
  return {
    featureName: 'vocal_presence_score_v1',
    score: score === null ? null : clamp01(score),
    contributors: used,
    missingDescriptors: missing,
    notes: [
      'Exploratory composite. Uses dataset min-max scaling for each descriptor.',
      'Orientation is uncertain for vocal_instrumental; needs validation before any semantic use.'
    ]
  };
}

function computeFeature_density_score_v1(entry, mm) {
  const d = entry.rawDescriptorData || {};

  const pairs = [
    { key: 'event_density', value: minMaxNormalize(d.event_density, mm.event_density.min, mm.event_density.max), weight: 1 },
    { key: 'complexity', value: minMaxNormalize(d.complexity, mm.complexity.min, mm.complexity.max), weight: 1 },
    { key: 'loudness_range', value: minMaxNormalize(d.loudness_range, mm.loudness_range.min, mm.loudness_range.max), weight: 0.7 },
    { key: 'spread', value: minMaxNormalize(d.spread, mm.spread.min, mm.spread.max), weight: 0.7 }
  ];

  const { score, used, missing } = weightedAverage(pairs);
  return {
    featureName: 'density_score_v1',
    score: score === null ? null : clamp01(score),
    contributors: used,
    missingDescriptors: missing,
    notes: [
      'Highly experimental composite. event_density may be collapsed or unstable.',
      'Exploratory only; validate with larger dataset.'
    ]
  };
}

function computeAllFeatures(entry, ctx) {
  const mm = ctx && ctx.minMax ? ctx.minMax : {};

  return {
    energy_score_v1: computeFeature_energy_score_v1(entry, mm),
    brightness_score_v1: computeFeature_brightness_score_v1(entry, mm),
    pulse_score_v1: computeFeature_pulse_score_v1(entry, mm),
    vocal_presence_score_v1: computeFeature_vocal_presence_score_v1(entry, mm),
    density_score_v1: computeFeature_density_score_v1(entry, mm)
  };
}

module.exports = {
  clamp01,
  minMaxNormalize,
  zScore,
  weightedAverage,
  computeDatasetMinMax,
  computeAllFeatures
};
