const { mappingConfig } = require('./mappingConfig');

function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function bool(v) {
  return Boolean(v);
}

function safeNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function getDim(dimensionObjects, key) {
  if (!dimensionObjects || typeof dimensionObjects !== 'object') return null;
  return dimensionObjects[key] || null;
}

function dimUsable(d) {
  if (!d) return false;
  if (d.usable === false) return false;
  const c = safeNumber(d.confidence);
  return c !== null && c >= 0.4;
}

function labelBaseConfidenceFromRequired(requiredDims) {
  if (!requiredDims || requiredDims.length === 0) return 0;
  const cs = requiredDims
    .map((d) => safeNumber(d && d.confidence))
    .filter((v) => v !== null);
  if (cs.length === 0) return 0;
  const avg = cs.reduce((a, b) => a + b, 0) / cs.length;
  return clamp(avg, 0, 1);
}

function scoreStrength(score, threshold, direction) {
  if (score === null || score === undefined) return 0;

  if (direction === 'gte') {
    if (score < threshold) return 0;
    return clamp((score - threshold) / (1 - threshold + 1e-9), 0, 1);
  }

  if (direction === 'lte') {
    if (score > threshold) return 0;
    return clamp((threshold - score) / (threshold + 1e-9), 0, 1);
  }

  return 0;
}

function makeLabel({ labelId, score, confidence, dimensionsUsed, evidence, suppressed, suppressionReasons }) {
  return {
    labelId,
    score: score === null || score === undefined ? null : clamp(score, 0, 1),
    confidence: clamp(confidence || 0, 0, 1),
    dimensionsUsed: Array.isArray(dimensionsUsed) ? dimensionsUsed : [],
    evidence: Array.isArray(evidence) ? evidence : [],
    suppressed: bool(suppressed),
    suppressionReasons: Array.isArray(suppressionReasons) ? suppressionReasons : []
  };
}

const ALIGNED_LABEL_CONFIDENCE_CEILINGS = {
  energetic: 0.95,
  driving: 0.95,
  steady: 0.95,
  bouncy: 0.95,
  hypnotic: 0.95,
  speech: 0.95,
  vocal: 0.75,
  instrumental: 0.75,
  heavy: 0.75,
  punchy: 0.7,
  dense: 0.65
};

function applyLabelConfidenceCeiling(label) {
  if (!label || typeof label !== 'object') return label;
  const ceil = ALIGNED_LABEL_CONFIDENCE_CEILINGS[label.labelId];
  if (typeof ceil !== 'number') return label;
  return {
    ...label,
    confidence: clamp(Math.min(label.confidence, ceil), 0, 1)
  };
}

function countUsablePrimaryDimensions(dimensionObjects) {
  const primary = [
    'energy_score',
    'pulse_score',
    'brightness_score',
    'density_score',
    'vocal_presence_score',
    'speech_score',
    'valence_score',
    'punch_score'
  ];

  let usable = 0;
  for (const k of primary) {
    const d = getDim(dimensionObjects, k);
    if (!d) continue;
    if (d.score === null || d.score === undefined) continue;
    if (!dimUsable(d)) continue;
    usable += 1;
  }
  return usable;
}

function surfaceAlignedLabels({ alignedLabels, dimensionObjects }) {
  const warnings = [];
  const surfacedLabels = [];
  const nonSurfacedLabels = [];

  const capped = (alignedLabels || []).map(applyLabelConfidenceCeiling);

  const DEFERRED_SURFACED_LABEL_IDS = new Set(['dense', 'sparse']);

  const usableDimCount = countUsablePrimaryDimensions(dimensionObjects);
  const lowCoverage = usableDimCount < 4;
  if (lowCoverage) warnings.push('low_dimension_coverage');

  // 1) Partition suppressed vs candidates.
  for (const l of capped) {
    if (!l) continue;
    if (DEFERRED_SURFACED_LABEL_IDS.has(l.labelId)) {
      nonSurfacedLabels.push({ ...l, nonSurfacedReasons: ['deferred_label'] });
      continue;
    }
    if (l.suppressed) {
      nonSurfacedLabels.push({ ...l, nonSurfacedReasons: ['label_suppressed'] });
      continue;
    }
    if (l.confidence < 0.6) {
      nonSurfacedLabels.push({ ...l, nonSurfacedReasons: ['below_surface_confidence_threshold'] });
      continue;
    }
    surfacedLabels.push(l);
  }

  // 2) Sort deterministically for max-label selection.
  surfacedLabels.sort((a, b) => {
    const dc = (safeNumber(b.confidence) || 0) - (safeNumber(a.confidence) || 0);
    if (dc !== 0) return dc;
    return String(a.labelId).localeCompare(String(b.labelId));
  });

  // 3) Apply caps.
  const maxByCoverage = lowCoverage ? 2 : 5;
  const kept = surfacedLabels.slice(0, maxByCoverage);
  const dropped = surfacedLabels.slice(maxByCoverage);
  for (const l of dropped) {
    nonSurfacedLabels.push({
      ...l,
      nonSurfacedReasons: [lowCoverage ? 'excluded_by_low_coverage_cap' : 'excluded_by_max_label_cap']
    });
  }

  if (kept.length === 0) warnings.push('no_labels_surfaced');

  return { alignedLabels: capped, surfacedLabels: kept, nonSurfacedLabels, warnings, usableDimCount };
}

function suppressForLowConfidenceDims(requiredKeys, dimensionObjects) {
  const reasons = [];
  for (const k of requiredKeys) {
    const d = getDim(dimensionObjects, k);
    if (!dimUsable(d)) reasons.push(`low_confidence_dimension:${k}`);
  }
  return reasons;
}

function inputTraceValue(analysis, key) {
  if (!analysis || typeof analysis !== 'object') return null;
  if (!analysis.inputTrace || typeof analysis.inputTrace !== 'object') return null;
  const obj = analysis.inputTrace[key];
  if (!obj || typeof obj !== 'object') return null;
  if (obj.available && typeof obj.value === 'number') return obj.value;
  return null;
}

function inputTraceAvailable(analysis, key) {
  if (!analysis || typeof analysis !== 'object') return false;
  if (!analysis.inputTrace || typeof analysis.inputTrace !== 'object') return false;
  const obj = analysis.inputTrace[key];
  return !!(obj && obj.available);
}

function projectEnergetic(dimensionObjects) {
  const energy = getDim(dimensionObjects, 'energy_score');
  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['energy_score'], dimensionObjects));

  const energyScore = energy ? energy.score : null;
  const threshold = 0.67;
  if (energyScore === null || energyScore < threshold) suppressionReasons.push('energy_not_high_enough');

  const suppressed = suppressionReasons.length > 0;
  const strength = scoreStrength(energyScore, threshold, 'gte');
  const base = labelBaseConfidenceFromRequired([energy]);
  const confidence = suppressed ? 0 : clamp((0.65 + 0.35 * strength) * base, 0, 1);

  return makeLabel({
    labelId: 'energetic',
    score: energyScore,
    confidence,
    dimensionsUsed: ['energy_score'],
    evidence: ['energy_score'],
    suppressed,
    suppressionReasons
  });
}

function projectDriving(dimensionObjects) {
  const pulse = getDim(dimensionObjects, 'pulse_score');
  const energy = getDim(dimensionObjects, 'energy_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['pulse_score', 'energy_score'], dimensionObjects));

  const pulseScore = pulse ? pulse.score : null;
  const energyScore = energy ? energy.score : null;

  if (pulseScore === null || pulseScore < 0.35) suppressionReasons.push('pulse_too_low');
  if (energyScore === null || energyScore < 0.35) suppressionReasons.push('energy_too_low');

  const requiredThresholdPulse = 0.6;
  const requiredThresholdEnergy = 0.5;
  const driveCombo =
    pulseScore === null || energyScore === null ? null : clamp(0.6 * pulseScore + 0.4 * energyScore, 0, 1);
  const requiredCombo = 0.6;

  if (pulseScore === null || pulseScore < requiredThresholdPulse) suppressionReasons.push('pulse_below_required');
  if (energyScore === null || energyScore < requiredThresholdEnergy) suppressionReasons.push('energy_below_required');
  if (driveCombo === null || driveCombo < requiredCombo) suppressionReasons.push('drive_combo_below_required');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([pulse, energy]);

  const strengthPulse = scoreStrength(pulseScore, requiredThresholdPulse, 'gte');
  const strengthEnergy = scoreStrength(energyScore, requiredThresholdEnergy, 'gte');
  const strengthCombo = scoreStrength(driveCombo, requiredCombo, 'gte');

  const strengthForConfidence = clamp(0.5 * strengthCombo + 0.4 * strengthPulse + 0.1 * strengthEnergy, 0, 1);

  // Directional coupling note: downweight only when energy is barely above the minimum requirement.
  const couplingPenalty = energyScore !== null && energyScore < 0.55 ? 0.9 : 1;
  const confidence = suppressed ? 0 : clamp((0.55 + 0.45 * strengthForConfidence) * base * couplingPenalty, 0, 1);

  return makeLabel({
    labelId: 'driving',
    score: driveCombo,
    confidence,
    dimensionsUsed: ['pulse_score', 'energy_score'],
    evidence: ['pulse_score', 'energy_score'],
    suppressed,
    suppressionReasons
  });
}

function projectSteady(dimensionObjects, analysis) {
  const pulse = getDim(dimensionObjects, 'pulse_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['pulse_score'], dimensionObjects));

  const pulseScore = pulse ? pulse.score : null;
  const threshold = 0.55;
  if (pulseScore === null || pulseScore < threshold) suppressionReasons.push('pulse_not_high_enough');

  const rhythmicStability = inputTraceValue(analysis, 'rhythmic_stability');
  const complexity = inputTraceValue(analysis, 'complexity');

  // Supporting evidence only.
  const evidence = ['pulse_score'];
  if (rhythmicStability !== null) evidence.push('rhythmic_stability');
  if (complexity !== null) evidence.push('complexity');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([pulse]);
  const strength = scoreStrength(pulseScore, threshold, 'gte');

  // Mild support if stability present and not low.
  const stabilityBoost = rhythmicStability !== null && rhythmicStability >= 0.6 ? 1.05 : 1;
  const confidence = suppressed ? 0 : clamp((0.55 + 0.45 * strength) * base * stabilityBoost, 0, 1);

  return makeLabel({
    labelId: 'steady',
    score: pulseScore,
    confidence,
    dimensionsUsed: ['pulse_score'],
    evidence,
    suppressed,
    suppressionReasons
  });
}

function projectBouncy(dimensionObjects) {
  const pulse = getDim(dimensionObjects, 'pulse_score');
  const energy = getDim(dimensionObjects, 'energy_score');
  const valence = getDim(dimensionObjects, 'valence_score');
  const brightness = getDim(dimensionObjects, 'brightness_score');
  const punch = getDim(dimensionObjects, 'punch_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['pulse_score', 'energy_score'], dimensionObjects));

  const pulseScore = pulse ? pulse.score : null;
  const energyScore = energy ? energy.score : null;
  if (pulseScore === null || pulseScore < 0.35) suppressionReasons.push('pulse_too_low');
  if (energyScore === null || energyScore < 0.35) suppressionReasons.push('energy_too_low');

  const reqPulse = 0.6;
  const reqEnergy = 0.4;
  if (pulseScore === null || pulseScore < reqPulse) suppressionReasons.push('pulse_below_required');
  if (energyScore === null || energyScore < reqEnergy) suppressionReasons.push('energy_below_required');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([pulse, energy]);
  const strength = Math.min(scoreStrength(pulseScore, reqPulse, 'gte'), scoreStrength(energyScore, reqEnergy, 'gte'));

  let conf = suppressed ? 0 : clamp((0.5 + 0.5 * strength) * base, 0, 1);
  if (!suppressed) {
    if (valence && safeNumber(valence.score) !== null && valence.score >= 0.55) conf = clamp(conf + 0.05, 0, 1);
    if (brightness && safeNumber(brightness.score) !== null && brightness.score >= 0.45) conf = clamp(conf + 0.04, 0, 1);
    if (punch && safeNumber(punch.score) !== null && punch.score >= 0.55) conf = clamp(conf + 0.03, 0, 1);
  }

  return makeLabel({
    labelId: 'bouncy',
    score: pulseScore === null || energyScore === null ? null : clamp((pulseScore + energyScore) / 2, 0, 1),
    confidence: conf,
    dimensionsUsed: ['pulse_score', 'energy_score'],
    evidence: ['pulse_score', 'energy_score', 'valence_score', 'brightness_score', 'punch_score'],
    suppressed,
    suppressionReasons
  });
}

function projectHeavy(dimensionObjects) {
  const brightness = getDim(dimensionObjects, 'brightness_score');
  const energy = getDim(dimensionObjects, 'energy_score');
  const density = getDim(dimensionObjects, 'density_score');
  const punch = getDim(dimensionObjects, 'punch_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['brightness_score', 'energy_score'], dimensionObjects));

  const b = brightness ? brightness.score : null;
  const e = energy ? energy.score : null;

  if (b !== null && b > 0.55) suppressionReasons.push('brightness_too_high');
  if (e !== null && e < 0.4) suppressionReasons.push('energy_too_low');

  const reqBrightness = 0.4;
  const reqEnergy = 0.6;
  if (b === null || b > reqBrightness) suppressionReasons.push('brightness_not_low_enough');
  if (e === null || e < reqEnergy) suppressionReasons.push('energy_below_required');

  const p = punch && safeNumber(punch.score) !== null ? punch.score : null;
  if (e !== null && e < 0.7) {
    if (p === null || p < 0.55) suppressionReasons.push('punch_support_not_high_enough');
  }

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([brightness, energy]);

  const strengthBrightness = scoreStrength(b === null ? null : 1 - b, 1 - reqBrightness, 'gte');
  const strengthEnergy = scoreStrength(e, reqEnergy, 'gte');
  const strength = Math.min(strengthBrightness, strengthEnergy);

  let conf = suppressed ? 0 : clamp((0.5 + 0.5 * strength) * base, 0, 1);

  // Supporting evidence only (do not suppress on missing).
  const d = density && safeNumber(density.score) !== null ? density.score : null;
  if (!suppressed) {
    if (p !== null && p > 0.55) conf = clamp(conf + 0.03, 0, 1);
    if (b !== null && b < 0.25) conf = clamp(conf + 0.04, 0, 1);
  }

  return makeLabel({
    labelId: 'heavy',
    score: b === null ? null : clamp(1 - b, 0, 1),
    confidence: conf,
    dimensionsUsed: ['brightness_score', 'energy_score'],
    evidence: ['brightness_score', 'energy_score', 'density_score', 'punch_score'],
    suppressed,
    suppressionReasons
  });
}

function projectPunchy(dimensionObjects) {
  const punch = getDim(dimensionObjects, 'punch_score');
  const energy = getDim(dimensionObjects, 'energy_score');
  const pulse = getDim(dimensionObjects, 'pulse_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['punch_score'], dimensionObjects));

  const p = punch ? punch.score : null;
  const req = 0.55;
  if (p === null || p < req) suppressionReasons.push('punch_not_high_enough');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([punch]);
  const strength = scoreStrength(p, req, 'gte');

  let conf = suppressed ? 0 : clamp((0.55 + 0.45 * strength) * base, 0, 1);
  if (!suppressed) {
    if (energy && safeNumber(energy.score) !== null && energy.score >= 0.45) conf = clamp(conf + 0.03, 0, 1);
    if (pulse && safeNumber(pulse.score) !== null && pulse.score >= 0.55) conf = clamp(conf + 0.02, 0, 1);
  }

  return makeLabel({
    labelId: 'punchy',
    score: p,
    confidence: conf,
    dimensionsUsed: ['punch_score'],
    evidence: ['punch_score', 'energy_score', 'pulse_score'],
    suppressed,
    suppressionReasons
  });
}

function projectDense(dimensionObjects) {
  const density = getDim(dimensionObjects, 'density_score');
  const energy = getDim(dimensionObjects, 'energy_score');
  const punch = getDim(dimensionObjects, 'punch_score');

  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['density_score'], dimensionObjects));

  const d = density ? density.score : null;
  const req = 0.5;
  if (d === null || d < 0.4) suppressionReasons.push('density_hard_suppress');
  if (d === null || d < req) suppressionReasons.push('density_below_required');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([density]);
  const strength = scoreStrength(d, req, 'gte');

  let conf = suppressed ? 0 : clamp((0.45 + 0.55 * strength) * base, 0, 1);
  // Corroboration requirement: density alone should not produce high confidence.
  if (!suppressed) {
    const e = energy && safeNumber(energy.score) !== null ? energy.score : null;
    const p = punch && safeNumber(punch.score) !== null ? punch.score : null;
    if (e !== null && e >= 0.55) conf = clamp(conf + 0.03, 0, 1);
    if (p !== null && p >= 0.55) conf = clamp(conf + 0.02, 0, 1);
    conf = Math.min(conf, 0.8);
  }

  return makeLabel({
    labelId: 'dense',
    score: d,
    confidence: conf,
    dimensionsUsed: ['density_score'],
    evidence: ['density_score', 'energy_score', 'punch_score'],
    suppressed,
    suppressionReasons
  });
}

function projectVocal(dimensionObjects) {
  const vocal = getDim(dimensionObjects, 'vocal_presence_score');
  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['vocal_presence_score'], dimensionObjects));

  const v = vocal ? vocal.score : null;
  if (v === null) suppressionReasons.push('missing_vocal_presence');
  if (v !== null && v >= 0.35 && v <= 0.65) suppressionReasons.push('vocal_uncertainty_band');
  if (v !== null && v < 0.65) suppressionReasons.push('vocal_not_high_enough');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([vocal]);
  const strength = scoreStrength(v, 0.65, 'gte');
  const confidence = suppressed ? 0 : clamp((0.6 + 0.4 * strength) * base, 0, 1);

  return makeLabel({
    labelId: 'vocal',
    score: v,
    confidence,
    dimensionsUsed: ['vocal_presence_score'],
    evidence: ['vocal_presence_score'],
    suppressed,
    suppressionReasons
  });
}

function projectInstrumental(dimensionObjects) {
  const vocal = getDim(dimensionObjects, 'vocal_presence_score');
  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['vocal_presence_score'], dimensionObjects));

  const v = vocal ? vocal.score : null;
  if (v === null) suppressionReasons.push('missing_vocal_presence');
  if (v !== null && v >= 0.35 && v <= 0.65) suppressionReasons.push('vocal_uncertainty_band');
  if (v !== null && v > 0.4) suppressionReasons.push('instrumental_not_low_enough');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([vocal]);
  const strength = v === null ? 0 : clamp((0.4 - v) / 0.4, 0, 1);
  const confidence = suppressed ? 0 : clamp((0.6 + 0.4 * strength) * base, 0, 1);

  return makeLabel({
    labelId: 'instrumental',
    score: v === null ? null : clamp(1 - v, 0, 1),
    confidence,
    dimensionsUsed: ['vocal_presence_score'],
    evidence: ['vocal_presence_score'],
    suppressed,
    suppressionReasons
  });
}

function projectSpeech(dimensionObjects) {
  const speech = getDim(dimensionObjects, 'speech_score');
  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['speech_score'], dimensionObjects));

  const s = speech ? speech.score : null;
  const req = 0.6;
  if (s === null || s < req) suppressionReasons.push('speech_not_high_enough');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([speech]);
  const strength = scoreStrength(s, req, 'gte');
  const confidence = suppressed ? 0 : clamp((0.6 + 0.4 * strength) * base, 0, 1);

  return makeLabel({
    labelId: 'speech',
    score: s,
    confidence,
    dimensionsUsed: ['speech_score'],
    evidence: ['speech_score'],
    suppressed,
    suppressionReasons
  });
}

function projectHypnotic(dimensionObjects, analysis) {
  const pulse = getDim(dimensionObjects, 'pulse_score');
  const suppressionReasons = [];
  suppressionReasons.push(...suppressForLowConfidenceDims(['pulse_score'], dimensionObjects));

  const pulseScore = pulse ? pulse.score : null;
  if (pulseScore === null || pulseScore < 0.4) suppressionReasons.push('pulse_too_low');
  if (pulseScore === null || pulseScore < 0.65) suppressionReasons.push('pulse_below_required');

  const rhythmicStability = inputTraceValue(analysis, 'rhythmic_stability');
  const complexity = inputTraceValue(analysis, 'complexity');
  const eventDensity = inputTraceValue(analysis, 'event_density');

  const evidence = ['pulse_score'];
  if (rhythmicStability !== null) evidence.push('rhythmic_stability');
  if (complexity !== null) evidence.push('complexity');
  if (eventDensity !== null) evidence.push('event_density');

  // Must not fire from pulse alone: require at least one corroborating support.
  const hasSupport =
    (rhythmicStability !== null && rhythmicStability >= 0.7) ||
    (complexity !== null && complexity <= 0.45) ||
    (eventDensity !== null && eventDensity <= 0.6);

  if (!hasSupport) suppressionReasons.push('insufficient_supporting_evidence');
  if (complexity !== null && complexity >= 0.85) suppressionReasons.push('complexity_too_high');

  const suppressed = suppressionReasons.length > 0;
  const base = labelBaseConfidenceFromRequired([pulse]);
  const strength = scoreStrength(pulseScore, 0.65, 'gte');

  // Conservative by design.
  const supportBoost = hasSupport ? 1.05 : 1;
  const confidence = suppressed ? 0 : clamp((0.45 + 0.55 * strength) * base * supportBoost, 0, 1);

  return makeLabel({
    labelId: 'hypnotic',
    score: pulseScore,
    confidence,
    dimensionsUsed: ['pulse_score'],
    evidence,
    suppressed,
    suppressionReasons
  });
}

function scoreAlignedLabels(dimensionObjects, analysis) {
  const results = [];

  results.push(projectEnergetic(dimensionObjects));
  results.push(projectDriving(dimensionObjects));
  results.push(projectSteady(dimensionObjects, analysis));
  results.push(projectBouncy(dimensionObjects));
  results.push(projectHeavy(dimensionObjects));
  results.push(projectPunchy(dimensionObjects));
  results.push(projectDense(dimensionObjects));
  results.push(projectVocal(dimensionObjects));
  results.push(projectInstrumental(dimensionObjects));
  results.push(projectSpeech(dimensionObjects));
  results.push(projectHypnotic(dimensionObjects, analysis));

  return results.map(applyLabelConfidenceCeiling);
}

function computeSourceReliability(sourcesUsed) {
  let best = 0;
  for (const s of sourcesUsed) {
    const v = mappingConfig.confidence.sourceReliability[s];
    if (typeof v === 'number') best = Math.max(best, v);
  }
  return best;
}

function evidenceStrength(score, threshold) {
  if (score === null) return 0;
  const d = Math.abs(score - threshold);
  return clamp(d / 0.5, 0, 1);
}

function agreementScore(sourcesUsed) {
  if (!sourcesUsed || sourcesUsed.length === 0) return 0;
  return sourcesUsed.length >= 2 ? 1 : 0.5;
}

function scoreEnergyBuckets(normalizedFeatures, analysis) {
  const energy = normalizedFeatures.energy_score;

  if (energy === null) return [];

  const out = [];
  if (energy < mappingConfig.energyBuckets.low_energy.maxExclusive) {
    out.push({ labelId: 'low_energy', score: clamp(1 - energy, 0, 1), threshold: mappingConfig.energyBuckets.low_energy.maxExclusive });
  } else if (energy >= mappingConfig.energyBuckets.very_high_energy.minInclusive) {
    out.push({ labelId: 'very_high_energy', score: energy, threshold: mappingConfig.energyBuckets.very_high_energy.minInclusive });
  } else if (energy >= mappingConfig.energyBuckets.high_energy.minInclusive && energy < mappingConfig.energyBuckets.high_energy.maxExclusive) {
    out.push({ labelId: 'high_energy', score: energy, threshold: mappingConfig.energyBuckets.high_energy.minInclusive });
  }

  return out.map((l) => enrichLabel(l, analysis, ['energy_score']));
}

function featureCoverage(required, normalizedFeatures) {
  if (!required || required.length === 0) return 0;
  let available = 0;
  for (const r of required) {
    if (normalizedFeatures[r] !== null && normalizedFeatures[r] !== undefined) available += 1;
  }
  return available / required.length;
}

function enrichLabel({ labelId, score, threshold, evidence = [], conflicts = [] }, analysis, requiredFeatures) {
  const sourcesUsed = (analysis && analysis.sourceCoverage && analysis.sourceCoverage.sourcesUsed) || [];
  const sr = computeSourceReliability(sourcesUsed);
  const fc = featureCoverage(requiredFeatures, analysis.__normalizedFeatures || {});

  const es = evidenceStrength(score, threshold);
  const ag = agreementScore(sourcesUsed);

  const confidence =
    0.45 * sr +
    0.25 * fc +
    0.2 * es +
    0.1 * ag;

  return {
    labelId,
    score: score === null ? null : clamp(score, 0, 1),
    confidence: clamp(confidence, 0, 1),
    sources: sourcesUsed,
    evidence,
    conflicts
  };
}

function applyLabelRules(label, config) {
  if (config.direct) {
    return label.score !== null && label.score >= config.threshold;
  }

  if (!config.applyRule) return false;

  return (
    label.score !== null &&
    label.score >= config.applyRule.scoreMin &&
    label.confidence >= config.applyRule.confidenceMin
  );
}

function applyConflictRules(labels) {
  const byId = new Map(labels.map((l) => [l.labelId, l]));

  const bright = byId.get('bright');
  const dark = byId.get('dark');
  if (bright && dark && bright.score >= 0.7 && dark.score >= 0.7) {
    bright.conflicts = [...(bright.conflicts || []), 'tone_conflict'];
    dark.conflicts = [...(dark.conflicts || []), 'tone_conflict'];
    bright.confidence = clamp(bright.confidence * 0.7, 0, 1);
    dark.confidence = clamp(dark.confidence * 0.7, 0, 1);
  }

  const calm = byId.get('calm');
  const aggressive = byId.get('aggressive');
  if (calm && aggressive && calm.score >= 0.7 && aggressive.score >= 0.7) {
    calm.conflicts = [...(calm.conflicts || []), 'force_conflict'];
    aggressive.conflicts = [...(aggressive.conflicts || []), 'force_conflict'];
    calm.confidence = clamp(calm.confidence * 0.75, 0, 1);
    aggressive.confidence = clamp(aggressive.confidence * 0.75, 0, 1);
  }

  const vocal = byId.get('vocal');
  const instrumental = byId.get('instrumental');
  if (vocal && instrumental && vocal.score >= 0.7 && instrumental.score >= 0.7) {
    vocal.conflicts = [...(vocal.conflicts || []), 'content_conflict'];
    instrumental.conflicts = [...(instrumental.conflicts || []), 'content_conflict'];
    vocal.confidence = clamp(vocal.confidence * 0.75, 0, 1);
    instrumental.confidence = clamp(instrumental.confidence * 0.75, 0, 1);
  }

  return labels;
}

function scoreLabels(normalizedFeatures, analysis) {
  analysis.__normalizedFeatures = normalizedFeatures;

  const results = [];

  results.push(...scoreEnergyBuckets(normalizedFeatures, analysis));

  for (const [labelId, cfg] of Object.entries(mappingConfig.labels)) {
    const raw = normalizedFeatures[cfg.scoreField];
    const score = raw === null || raw === undefined ? null : cfg.invert ? clamp(1 - raw, 0, 1) : clamp(raw, 0, 1);

    const label = enrichLabel(
      {
        labelId,
        score,
        threshold: cfg.threshold,
        evidence: cfg.requires,
        conflicts: []
      },
      analysis,
      cfg.requires
    );

    if (applyLabelRules(label, cfg)) results.push(label);
  }

  return applyConflictRules(results);
}

module.exports = {
  scoreLabels,
  scoreAlignedLabels,
  surfaceAlignedLabels
};
