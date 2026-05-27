const fs = require('fs');
const path = require('path');

const { ensureDir, readJsonFile, writeJsonFile } = require('../utils/io');
const { normalizeFromDescriptors } = require('../../src/features/normalize');
const { scoreLabels } = require('../../src/mapping/labelScorer');
const { mappingConfig } = require('../../src/mapping/mappingConfig');

function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function mean(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function std(xs) {
  const m = mean(xs);
  if (m === null) return null;
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  const v = vals.reduce((acc, x) => acc + (x - m) ** 2, 0) / vals.length;
  return Math.sqrt(v);
}

function median(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const mid = Math.floor(vals.length / 2);
  return vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];
}

function percentile(xs, p) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const idx = clamp((p / 100) * (vals.length - 1), 0, vals.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return vals[lo];
  const t = idx - lo;
  return vals[lo] * (1 - t) + vals[hi] * t;
}

function isNonEmptyString(s) {
  return typeof s === 'string' && s.trim().length > 0;
}

function computeAllLabelDiagnostics(normalizedFeatures, analysis) {
  // Replicates labelScorer computations for *reporting*, without modifying the engine.
  const sourcesUsed = (analysis && analysis.sourceCoverage && analysis.sourceCoverage.sourcesUsed) || [];
  const sr = (() => {
    let best = 0;
    for (const s of sourcesUsed) {
      const v = mappingConfig.confidence.sourceReliability[s];
      if (typeof v === 'number') best = Math.max(best, v);
    }
    return best;
  })();

  const featureCoverage = (required) => {
    if (!required || required.length === 0) return 0;
    let available = 0;
    for (const r of required) {
      if (normalizedFeatures[r] !== null && normalizedFeatures[r] !== undefined) available += 1;
    }
    return available / required.length;
  };

  const evidenceStrength = (score, threshold) => {
    if (score === null) return 0;
    const d = Math.abs(score - threshold);
    return clamp(d / 0.5, 0, 1);
  };

  const agreementScore = () => {
    if (!sourcesUsed || sourcesUsed.length === 0) return 0;
    return sourcesUsed.length >= 2 ? 1 : 0.5;
  };

  const enrich = ({ labelId, score, threshold, requires }) => {
    const fc = featureCoverage(requires);
    const es = evidenceStrength(score, threshold);
    const ag = agreementScore();
    const confidence = 0.45 * sr + 0.25 * fc + 0.2 * es + 0.1 * ag;
    return {
      labelId,
      score: score === null ? null : clamp(score, 0, 1),
      threshold,
      confidence: clamp(confidence, 0, 1),
      sources: sourcesUsed,
      evidence: requires
    };
  };

  const applyRule = (label, cfg) => {
    if (cfg.direct) {
      return label.score !== null && label.score >= cfg.threshold;
    }
    if (!cfg.applyRule) return false;
    return (
      label.score !== null &&
      label.score >= cfg.applyRule.scoreMin &&
      label.confidence >= cfg.applyRule.confidenceMin
    );
  };

  const all = [];

  // Energy buckets.
  const energy = normalizedFeatures.energy_score;
  if (energy !== null && energy !== undefined) {
    if (energy < mappingConfig.energyBuckets.low_energy.maxExclusive) {
      all.push(enrich({
        labelId: 'low_energy',
        score: clamp(1 - energy, 0, 1),
        threshold: mappingConfig.energyBuckets.low_energy.maxExclusive,
        requires: ['energy_score']
      }));
    } else if (energy >= mappingConfig.energyBuckets.very_high_energy.minInclusive) {
      all.push(enrich({
        labelId: 'very_high_energy',
        score: energy,
        threshold: mappingConfig.energyBuckets.very_high_energy.minInclusive,
        requires: ['energy_score']
      }));
    } else if (
      energy >= mappingConfig.energyBuckets.high_energy.minInclusive &&
      energy < mappingConfig.energyBuckets.high_energy.maxExclusive
    ) {
      all.push(enrich({
        labelId: 'high_energy',
        score: energy,
        threshold: mappingConfig.energyBuckets.high_energy.minInclusive,
        requires: ['energy_score']
      }));
    }
  }

  for (const [labelId, cfg] of Object.entries(mappingConfig.labels)) {
    const raw = normalizedFeatures[cfg.scoreField];
    const score = raw === null || raw === undefined ? null : cfg.invert ? clamp(1 - raw, 0, 1) : clamp(raw, 0, 1);
    const l = enrich({ labelId, score, threshold: cfg.threshold, requires: cfg.requires });

    const fired = applyRule(l, cfg);

    let ruleDistance = null;
    if (cfg.direct) {
      ruleDistance = l.score === null ? null : l.score - cfg.threshold;
    } else {
      const dScore = l.score === null ? null : l.score - cfg.applyRule.scoreMin;
      const dConf = l.confidence === null ? null : l.confidence - cfg.applyRule.confidenceMin;
      if (dScore !== null && dConf !== null) ruleDistance = Math.min(dScore, dConf);
    }

    all.push({
      ...l,
      fired,
      ruleDistance
    });
  }

  // Ensure deterministic ordering.
  all.sort((a, b) => a.labelId.localeCompare(b.labelId));

  return all;
}

function computeDimensionProfile(normalizedFeatures) {
  const dims = Object.entries(normalizedFeatures)
    .filter(([, v]) => typeof v === 'number')
    .map(([k, v]) => ({ id: k, value: v }));

  dims.sort((a, b) => b.value - a.value);

  return {
    all: Object.fromEntries(Object.entries(normalizedFeatures).sort(([a], [b]) => a.localeCompare(b))),
    top: dims.slice(0, 10)
  };
}

function buildSongEvaluation({ expectedGroup, firedLabels, allLabelDiagnostics }) {
  const firedIds = new Set(firedLabels.map((l) => l.labelId));
  const expectedHit = expectedGroup ? firedIds.has(expectedGroup) : null;

  const conflicts = firedLabels
    .filter((l) => Array.isArray(l.conflicts) && l.conflicts.length)
    .map((l) => ({ labelId: l.labelId, conflicts: l.conflicts }));

  const nearThreshold = allLabelDiagnostics
    .filter((l) => !l.fired && typeof l.ruleDistance === 'number')
    .sort((a, b) => b.ruleDistance - a.ruleDistance)
    .slice(0, 12)
    .map((l) => ({
      labelId: l.labelId,
      score: l.score,
      confidence: l.confidence,
      ruleDistance: l.ruleDistance,
      threshold: l.threshold,
      evidence: l.evidence
    }));

  const abstentions = allLabelDiagnostics
    .filter((l) => !l.fired)
    .map((l) => l.labelId);

  return {
    expectedGroup,
    expectedHit,
    firedLabelIds: Array.from(firedIds).sort(),
    contradictions: conflicts,
    nearThreshold,
    abstentionsCount: abstentions.length
  };
}

function groupAggregate(tracks) {
  const groups = new Map();

  for (const t of tracks) {
    const g = t.expectedGroup || 'unknown';
    if (!groups.has(g)) {
      groups.set(g, {
        group: g,
        total: 0,
        hitCount: 0,
        firedLabelFrequency: {},
        conflictFrequency: {},
        dimensionStats: {},
        confidenceStats: []
      });
    }

    const agg = groups.get(g);
    agg.total += 1;
    if (t.evaluation.expectedHit) agg.hitCount += 1;

    for (const l of t.firedLabels) {
      agg.firedLabelFrequency[l.labelId] = (agg.firedLabelFrequency[l.labelId] || 0) + 1;
      if (typeof l.confidence === 'number') agg.confidenceStats.push(l.confidence);
    }

    for (const c of t.evaluation.contradictions) {
      for (const cf of c.conflicts) {
        agg.conflictFrequency[cf] = (agg.conflictFrequency[cf] || 0) + 1;
      }
    }

    for (const [k, v] of Object.entries(t.dimensionProfile.all)) {
      if (typeof v !== 'number') continue;
      if (!agg.dimensionStats[k]) agg.dimensionStats[k] = [];
      agg.dimensionStats[k].push(v);
    }
  }

  const out = Array.from(groups.values()).map((g) => {
    const dimensionAverages = {};
    const dimensionStd = {};
    for (const [k, vals] of Object.entries(g.dimensionStats)) {
      dimensionAverages[k] = mean(vals);
      dimensionStd[k] = std(vals);
    }

    const topDimensions = Object.entries(dimensionAverages)
      .filter(([, v]) => typeof v === 'number')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([id, value]) => ({ id, avg: value, std: dimensionStd[id] }));

    const firedLabelTop = Object.entries(g.firedLabelFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([labelId, count]) => ({ labelId, count, rate: count / g.total }));

    const conflictsTop = Object.entries(g.conflictFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([conflictId, count]) => ({ conflictId, count, rate: count / g.total }));

    const conf = g.confidenceStats;

    return {
      group: g.group,
      total: g.total,
      hitRate: g.total ? g.hitCount / g.total : null,
      hitCount: g.hitCount,
      dominantDimensions: topDimensions,
      firedLabelsTop: firedLabelTop,
      conflicts: conflictsTop,
      confidence: {
        mean: mean(conf),
        median: median(conf),
        p10: percentile(conf, 10),
        p90: percentile(conf, 90)
      }
    };
  });

  out.sort((a, b) => a.group.localeCompare(b.group));
  return out;
}

function labelAggregate(tracks) {
  const labels = new Map();

  const groups = Array.from(new Set(tracks.map((t) => t.expectedGroup).filter(Boolean))).sort();

  for (const t of tracks) {
    const g = t.expectedGroup;
    for (const d of t.allLabelDiagnostics) {
      if (!labels.has(d.labelId)) {
        labels.set(d.labelId, {
          labelId: d.labelId,
          firedCount: 0,
          total: 0,
          firedByGroup: Object.fromEntries(groups.map((gg) => [gg, 0])),
          totalByGroup: Object.fromEntries(groups.map((gg) => [gg, 0])),
          confidenceWhenFired: [],
          ruleDistanceWhenNotFired: []
        });
      }
      const agg = labels.get(d.labelId);
      agg.total += 1;
      if (g) agg.totalByGroup[g] = (agg.totalByGroup[g] || 0) + 1;

      if (d.fired) {
        agg.firedCount += 1;
        if (g) agg.firedByGroup[g] = (agg.firedByGroup[g] || 0) + 1;
        if (typeof d.confidence === 'number') agg.confidenceWhenFired.push(d.confidence);
      } else {
        if (typeof d.ruleDistance === 'number') agg.ruleDistanceWhenNotFired.push(d.ruleDistance);
      }
    }
  }

  const out = Array.from(labels.values()).map((l) => {
    const conf = l.confidenceWhenFired;
    const notFiredDist = l.ruleDistanceWhenNotFired;

    const byGroup = Object.entries(l.firedByGroup).map(([g, fired]) => ({
      group: g,
      fired,
      total: l.totalByGroup[g] || 0,
      rate: (l.totalByGroup[g] || 0) ? fired / l.totalByGroup[g] : null
    }));

    byGroup.sort((a, b) => (b.rate || 0) - (a.rate || 0));

    return {
      labelId: l.labelId,
      fireRateGlobal: l.total ? l.firedCount / l.total : null,
      firedCount: l.firedCount,
      total: l.total,
      byGroup,
      confidenceWhenFired: {
        mean: mean(conf),
        median: median(conf),
        p10: percentile(conf, 10),
        p90: percentile(conf, 90)
      },
      notFiredRuleDistance: {
        median: median(notFiredDist),
        p90: percentile(notFiredDist, 90)
      }
    };
  });

  out.sort((a, b) => (b.fireRateGlobal || 0) - (a.fireRateGlobal || 0));
  return out;
}

function dimensionAggregate(tracks) {
  const dimMap = new Map();

  for (const t of tracks) {
    for (const [k, v] of Object.entries(t.dimensionProfile.all)) {
      if (typeof v !== 'number') continue;
      if (!dimMap.has(k)) dimMap.set(k, []);
      dimMap.get(k).push(v);
    }
  }

  const out = Array.from(dimMap.entries()).map(([dimId, vals]) => ({
    dimId,
    mean: mean(vals),
    median: median(vals),
    std: std(vals),
    p10: percentile(vals, 10),
    p90: percentile(vals, 90)
  }));

  out.sort((a, b) => (b.std || 0) - (a.std || 0));
  return out;
}

function buildMarkdown({ meta, summary, groupDiagnostics, labelDiagnostics, dimensionDiagnostics, tracks }) {
  const lines = [];
  lines.push('# Control Semantic Validation Pass');
  lines.push('');
  lines.push('## Run Metadata');
  lines.push('');
  lines.push(`- Generated at: ${meta.generatedAt}`);
  lines.push(`- Dataset: ${meta.datasetName}`);
  lines.push(`- Source: ${meta.sourcePath}`);
  lines.push(`- Mapping version: ${meta.versions.mappingVersion}`);
  lines.push(`- Ontology version: ${meta.versions.ontologyVersion}`);
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push(`- Found tracks processed: ${summary.processedCount}`);
  lines.push(`- Groups: ${summary.groups.join(', ')}`);
  lines.push('');

  lines.push('## Group Diagnostics');
  lines.push('');
  for (const g of groupDiagnostics) {
    lines.push(`### ${g.group}`);
    lines.push('');
    lines.push(`- Total: ${g.total}`);
    lines.push(`- Hit rate (label==group fired): ${g.hitRate === null ? 'null' : g.hitRate.toFixed(3)}`);
    lines.push(`- Confidence mean/median: ${g.confidence.mean === null ? 'null' : g.confidence.mean.toFixed(3)} / ${g.confidence.median === null ? 'null' : g.confidence.median.toFixed(3)}`);
    lines.push('');

    lines.push('#### Dominant dimensions (avg ± std)');
    lines.push('');
    for (const d of g.dominantDimensions.slice(0, 10)) {
      lines.push(`- ${d.id}: ${d.avg === null ? 'null' : d.avg.toFixed(3)} ± ${d.std === null ? 'null' : d.std.toFixed(3)}`);
    }
    lines.push('');

    lines.push('#### Fired labels (top)');
    lines.push('');
    for (const l of g.firedLabelsTop.slice(0, 12)) {
      lines.push(`- ${l.labelId}: count=${l.count} rate=${l.rate.toFixed(3)}`);
    }
    lines.push('');

    lines.push('#### Conflicts');
    lines.push('');
    if (!g.conflicts.length) {
      lines.push('- (none)');
    } else {
      for (const c of g.conflicts) lines.push(`- ${c.conflictId}: count=${c.count} rate=${c.rate.toFixed(3)}`);
    }
    lines.push('');
  }

  lines.push('## Label Diagnostics (global fire rate)');
  lines.push('');
  for (const l of labelDiagnostics.slice(0, 30)) {
    lines.push(`- ${l.labelId}: fireRate=${l.fireRateGlobal === null ? 'null' : l.fireRateGlobal.toFixed(3)} fired=${l.firedCount}/${l.total} confMedian=${l.confidenceWhenFired.median === null ? 'null' : l.confidenceWhenFired.median.toFixed(3)}`);
  }
  lines.push('');

  lines.push('## Dimension Diagnostics (highest variability)');
  lines.push('');
  for (const d of dimensionDiagnostics.slice(0, 20)) {
    lines.push(`- ${d.dimId}: std=${d.std === null ? 'null' : d.std.toFixed(3)} mean=${d.mean === null ? 'null' : d.mean.toFixed(3)}`);
  }
  lines.push('');

  lines.push('## Per-song raw outputs');
  lines.push('');
  lines.push(`- See JSON: ${meta.outputJsonPath}`);
  lines.push('');

  // Provide a compact per-song index with fired labels.
  lines.push('## Per-song index');
  lines.push('');
  for (const t of tracks) {
    const fired = t.firedLabels.map((l) => `${l.labelId}(${l.confidence === null ? 'null' : l.confidence.toFixed(2)})`).join(', ');
    lines.push(`- ${t.track.artist} — ${t.track.title} [${t.expectedGroup}] hit=${t.evaluation.expectedHit ? 'yes' : 'no'} fired=[${fired}]`);
  }
  lines.push('');

  return lines.join('\n');
}

async function run() {
  const sourcePath = path.join(__dirname, '..', 'outputs', 'control_1_musicstory_join_patched.json');
  const join = readJsonFile(sourcePath);

  const rows = Array.isArray(join.rows) ? join.rows : [];
  const found = rows.filter((r) => r && r.found === true && r.musicStory && r.musicStory.available);

  const tracks = [];

  for (const r of found) {
    const musicStory = { provider: 'music_story', available: true, data: r.musicStory.data };
    const acousticBrainz = { provider: 'acousticbrainz', available: false, data: {} };

    const { normalizedFeatures, analysis } = normalizeFromDescriptors({ musicStory, acousticBrainz });
    const firedLabels = scoreLabels(normalizedFeatures, analysis);

    const allLabelDiagnostics = computeAllLabelDiagnostics(normalizedFeatures, analysis);

    const expectedGroup = r.group;

    const dimensionProfile = computeDimensionProfile(normalizedFeatures);

    const evaluation = buildSongEvaluation({
      expectedGroup,
      firedLabels,
      allLabelDiagnostics
    });

    // Heuristic: top dims influencing a label = label evidence fields sorted by value.
    const perLabelInfluences = {};
    for (const l of allLabelDiagnostics) {
      const ev = Array.isArray(l.evidence) ? l.evidence : [];
      const scored = ev
        .map((dimId) => ({ dimId, value: normalizedFeatures[dimId] }))
        .filter((x) => typeof x.value === 'number')
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
      perLabelInfluences[l.labelId] = scored;
    }

    tracks.push({
      track: {
        artist: r.artist,
        title: r.title,
        isrc: r.isrc || null,
        recordingId: r.recordingId || null
      },
      expectedGroup,
      expectedDescriptors: r.expectedDescriptors || [],
      raw: {
        musicStory: r.musicStory.data
      },
      normalizedFeatures,
      analysis,
      dimensionProfile,
      firedLabels,
      allLabelDiagnostics,
      perLabelInfluences,
      evaluation
    });
  }

  const groups = Array.from(new Set(tracks.map((t) => t.expectedGroup).filter(Boolean))).sort();

  const groupDiagnostics = groupAggregate(tracks);
  const labelDiagnostics = labelAggregate(tracks);
  const dimensionDiagnostics = dimensionAggregate(tracks);

  const outputJsonPath = path.join(__dirname, '..', 'outputs', 'control_1_semantic_validation.json');
  const outputMdPath = path.join(__dirname, '..', 'reports', 'control_1_semantic_validation.md');

  ensureDir(path.dirname(outputJsonPath));
  ensureDir(path.dirname(outputMdPath));

  const meta = {
    generatedAt: new Date().toISOString(),
    datasetName: (join.control && join.control.datasetName) || 'control_1',
    sourcePath,
    versions: mappingConfig.versions,
    outputJsonPath
  };

  const summary = {
    processedCount: tracks.length,
    groups
  };

  writeJsonFile(outputJsonPath, {
    meta,
    summary,
    groupDiagnostics,
    labelDiagnostics,
    dimensionDiagnostics,
    tracks
  });

  const md = buildMarkdown({ meta, summary, groupDiagnostics, labelDiagnostics, dimensionDiagnostics, tracks });
  fs.writeFileSync(outputMdPath, md + '\n');

  console.log('[control_semantic_validation] wrote:');
  console.log('-', outputJsonPath);
  console.log('-', outputMdPath);
  console.log('processed:', tracks.length);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
