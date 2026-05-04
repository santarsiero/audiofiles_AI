const { mappingConfig } = require('./mappingConfig');

function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
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
  scoreLabels
};
