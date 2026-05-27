const fs = require('fs');
const path = require('path');

const { ensureDir, readJsonFile, writeJsonFile } = require('../utils/io');

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

function min(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return Math.min(...vals);
}

function max(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return Math.max(...vals);
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

function histogram01(xs, bins = 10) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).map((x) => clamp(x, 0, 1));
  const counts = Array.from({ length: bins }, () => 0);
  for (const v of vals) {
    const idx = Math.min(bins - 1, Math.floor(v * bins));
    counts[idx] += 1;
  }
  return {
    bins,
    counts,
    total: vals.length
  };
}

function pearson(xs, ys) {
  const pairs = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
    const x = xs[i];
    const y = ys[i];
    if (typeof x === 'number' && !Number.isNaN(x) && typeof y === 'number' && !Number.isNaN(y)) {
      pairs.push([x, y]);
    }
  }

  if (pairs.length < 10) return { r: null, n: pairs.length };

  const mx = pairs.reduce((a, [x]) => a + x, 0) / pairs.length;
  const my = pairs.reduce((a, [, y]) => a + y, 0) / pairs.length;

  let num = 0;
  let dx = 0;
  let dy = 0;
  for (const [x, y] of pairs) {
    num += (x - mx) * (y - my);
    dx += (x - mx) ** 2;
    dy += (y - my) ** 2;
  }

  const den = Math.sqrt(dx * dy);
  if (!den) return { r: null, n: pairs.length };

  return { r: num / den, n: pairs.length };
}

function cohensD(a, b) {
  const aa = a.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  const bb = b.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (aa.length < 5 || bb.length < 5) return { d: null, nA: aa.length, nB: bb.length };

  const ma = mean(aa);
  const mb = mean(bb);
  const sa = std(aa);
  const sb = std(bb);

  if (sa === null || sb === null) return { d: null, nA: aa.length, nB: bb.length };

  const pooled = Math.sqrt(((aa.length - 1) * sa ** 2 + (bb.length - 1) * sb ** 2) / (aa.length + bb.length - 2));
  if (!pooled) return { d: null, nA: aa.length, nB: bb.length };

  return { d: (ma - mb) / pooled, nA: aa.length, nB: bb.length };
}

function summarizeFeature(values) {
  const numeric = values.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  const nTotal = values.length;
  const nNumeric = numeric.length;
  const missingRate = nTotal ? 1 - nNumeric / nTotal : null;

  const satLow = numeric.filter((x) => x <= 0.02).length;
  const satHigh = numeric.filter((x) => x >= 0.98).length;

  return {
    nTotal,
    nNumeric,
    missingRate,
    mean: mean(numeric),
    std: std(numeric),
    min: min(numeric),
    max: max(numeric),
    p10: percentile(numeric, 10),
    p25: percentile(numeric, 25),
    p50: median(numeric),
    p75: percentile(numeric, 75),
    p90: percentile(numeric, 90),
    saturation: {
      low_le_0_02: nNumeric ? satLow / nNumeric : null,
      high_ge_0_98: nNumeric ? satHigh / nNumeric : null
    },
    histogram: histogram01(numeric, 10)
  };
}

function getAllFeatureIds(tracks) {
  const s = new Set();
  for (const t of tracks) {
    for (const k of Object.keys(t.normalizedFeatures || {})) s.add(k);
  }
  return Array.from(s).sort();
}

function getAllInputIds(tracks) {
  const s = new Set();
  for (const t of tracks) {
    const it = (t.analysis && t.analysis.inputTrace) || {};
    for (const k of Object.keys(it)) s.add(k);
  }
  return Array.from(s).sort();
}

function buildVectorsByFeature(tracks, featureIds) {
  const byFeature = {};
  for (const f of featureIds) {
    byFeature[f] = tracks.map((t) => {
      const v = t.normalizedFeatures ? t.normalizedFeatures[f] : null;
      return typeof v === 'number' ? v : null;
    });
  }
  return byFeature;
}

function buildVectorsByInput(tracks, inputIds) {
  const byInput = {};
  for (const i of inputIds) {
    byInput[i] = tracks.map((t) => {
      const it = (t.analysis && t.analysis.inputTrace) || {};
      const v = it[i] && it[i].available ? it[i].value : null;
      return typeof v === 'number' ? v : null;
    });
  }
  return byInput;
}

function buildAvailabilityByInput(tracks, inputIds) {
  const byInput = {};
  for (const i of inputIds) {
    let avail = 0;
    for (const t of tracks) {
      const it = (t.analysis && t.analysis.inputTrace) || {};
      if (it[i] && it[i].available) avail += 1;
    }
    byInput[i] = {
      availableCount: avail,
      total: tracks.length,
      availabilityRate: tracks.length ? avail / tracks.length : null
    };
  }
  return byInput;
}

function featureDependencyAnalysis({ tracks, featureIds, inputIds, vectorsByFeature, vectorsByInput }) {
  // For each feature, compute which raw inputs correlate most with the feature value.
  // This is a *proxy* for descriptor dependency; it does not prove causality.
  const out = [];

  for (const f of featureIds) {
    const fv = vectorsByFeature[f];

    const correlations = [];
    for (const i of inputIds) {
      const iv = vectorsByInput[i];
      const { r, n } = pearson(fv, iv);
      if (r === null) continue;
      correlations.push({ inputId: i, r, n, absR: Math.abs(r) });
    }

    correlations.sort((a, b) => b.absR - a.absR);

    // Presence coupling: does feature disappear when input is missing?
    const presenceCoupling = [];
    for (const i of inputIds) {
      let both = 0;
      let featurePresentWhenInputMissing = 0;
      let featureMissingWhenInputPresent = 0;

      for (let idx = 0; idx < tracks.length; idx += 1) {
        const fVal = fv[idx];
        const iVal = vectorsByInput[i][idx];
        const fPresent = typeof fVal === 'number';
        const iPresent = typeof iVal === 'number';
        if (!fPresent && !iPresent) continue;

        both += 1;
        if (!iPresent && fPresent) featurePresentWhenInputMissing += 1;
        if (iPresent && !fPresent) featureMissingWhenInputPresent += 1;
      }

      if (both < 10) continue;

      presenceCoupling.push({
        inputId: i,
        n: both,
        featurePresentWhenInputMissingRate: both ? featurePresentWhenInputMissing / both : null,
        featureMissingWhenInputPresentRate: both ? featureMissingWhenInputPresent / both : null
      });
    }

    presenceCoupling.sort((a, b) => (b.featureMissingWhenInputPresentRate || 0) - (a.featureMissingWhenInputPresentRate || 0));

    out.push({
      featureId: f,
      topInputCorrelations: correlations.slice(0, 8).map(({ inputId, r, n }) => ({ inputId, r, n })),
      topPresenceCoupling: presenceCoupling.slice(0, 8)
    });
  }

  return out;
}

function groupSeparability({ tracks, groups, featureIds, vectorsByFeature }) {
  const out = [];

  for (const g of groups) {
    const idxIn = tracks.map((t) => t.expectedGroup === g);

    const perFeature = [];
    for (const f of featureIds) {
      const fv = vectorsByFeature[f];
      const a = [];
      const b = [];
      for (let i = 0; i < fv.length; i += 1) {
        if (idxIn[i]) a.push(fv[i]);
        else b.push(fv[i]);
      }

      const { d, nA, nB } = cohensD(a, b);
      if (d === null) continue;

      perFeature.push({
        featureId: f,
        d,
        absD: Math.abs(d),
        meanIn: mean(a),
        meanOut: mean(b),
        stdIn: std(a),
        stdOut: std(b),
        nIn: nA,
        nOut: nB
      });
    }

    perFeature.sort((a, b) => b.absD - a.absD);

    out.push({
      group: g,
      topSeparatingFeatures: perFeature.slice(0, 15),
      allSeparatingFeatures: perFeature
    });
  }

  out.sort((a, b) => a.group.localeCompare(b.group));
  return out;
}

function correlationAnalysis({ featureIds, vectorsByFeature }) {
  const pairs = [];

  for (let i = 0; i < featureIds.length; i += 1) {
    for (let j = i + 1; j < featureIds.length; j += 1) {
      const a = featureIds[i];
      const b = featureIds[j];
      const { r, n } = pearson(vectorsByFeature[a], vectorsByFeature[b]);
      if (r === null) continue;
      pairs.push({ a, b, r, n, absR: Math.abs(r) });
    }
  }

  const strongest = [...pairs].sort((x, y) => y.absR - x.absR);
  const positive = strongest.filter((p) => p.r > 0).slice(0, 25);
  const negative = strongest.filter((p) => p.r < 0).slice(0, 25);

  return {
    totalPairs: pairs.length,
    topAbsolute: strongest.slice(0, 40),
    topPositive: positive,
    topNegative: negative
  };
}

function detectDeadBrokenFeatures(featureStats) {
  const issues = [];

  for (const [featureId, s] of Object.entries(featureStats)) {
    const missing = s.missingRate;
    const st = s.std;
    const satLow = s.saturation.low_le_0_02;
    const satHigh = s.saturation.high_ge_0_98;

    const flags = [];
    if (missing !== null && missing > 0.25) flags.push(`missingRate>${missing.toFixed(2)}`);
    if (st !== null && st < 0.02) flags.push(`stdVeryLow(${st.toFixed(3)})`);
    if (satLow !== null && satLow > 0.7) flags.push(`saturatedLow(${satLow.toFixed(2)})`);
    if (satHigh !== null && satHigh > 0.7) flags.push(`saturatedHigh(${satHigh.toFixed(2)})`);

    if (flags.length) {
      issues.push({
        featureId,
        severityScore: (missing || 0) * 2 + (st !== null && st < 0.02 ? 1 : 0) + (satLow || 0) + (satHigh || 0),
        flags,
        stats: s
      });
    }
  }

  issues.sort((a, b) => b.severityScore - a.severityScore);
  return issues;
}

function buildMarkdown({ meta, summary, featureStats, deadBroken, groupSeparabilityReport, correlationReport, inputAvailability, featureDependency }) {
  const lines = [];
  lines.push('# Feature Calibration + Separability Analysis');
  lines.push('');
  lines.push('## Run metadata');
  lines.push('');
  lines.push(`- Generated at: ${meta.generatedAt}`);
  lines.push(`- Source: ${meta.sourcePath}`);
  lines.push(`- Tracks processed (found only): ${summary.tracks}`);
  lines.push(`- Groups: ${summary.groups.join(', ')}`);
  lines.push('');

  lines.push('## Dead / broken feature detection (prioritized)');
  lines.push('');
  for (const d of deadBroken.slice(0, 20)) {
    lines.push(`- ${d.featureId}: ${d.flags.join(', ')} | mean=${d.stats.mean === null ? 'null' : d.stats.mean.toFixed(3)} std=${d.stats.std === null ? 'null' : d.stats.std.toFixed(3)} missing=${d.stats.missingRate === null ? 'null' : d.stats.missingRate.toFixed(3)}`);
  }
  lines.push('');

  lines.push('## Feature distribution highlights');
  lines.push('');

  const sortedByStd = Object.entries(featureStats)
    .map(([featureId, s]) => ({ featureId, std: s.std, mean: s.mean, missing: s.missingRate }))
    .filter((x) => typeof x.std === 'number')
    .sort((a, b) => b.std - a.std);

  lines.push('### Highest variance (potentially most informative)');
  lines.push('');
  for (const x of sortedByStd.slice(0, 10)) {
    lines.push(`- ${x.featureId}: std=${x.std.toFixed(3)} mean=${x.mean === null ? 'null' : x.mean.toFixed(3)} missing=${x.missing === null ? 'null' : x.missing.toFixed(3)}`);
  }
  lines.push('');

  lines.push('### Lowest variance (compressed/collapsed)');
  lines.push('');
  for (const x of sortedByStd.slice(-10).reverse()) {
    lines.push(`- ${x.featureId}: std=${x.std.toFixed(3)} mean=${x.mean === null ? 'null' : x.mean.toFixed(3)} missing=${x.missing === null ? 'null' : x.missing.toFixed(3)}`);
  }
  lines.push('');

  lines.push('## Group separability (top features by |Cohen\'s d|)');
  lines.push('');
  for (const g of groupSeparabilityReport) {
    lines.push(`### ${g.group}`);
    lines.push('');
    for (const f of g.topSeparatingFeatures.slice(0, 10)) {
      lines.push(`- ${f.featureId}: d=${f.d.toFixed(3)} meanIn=${f.meanIn === null ? 'null' : f.meanIn.toFixed(3)} meanOut=${f.meanOut === null ? 'null' : f.meanOut.toFixed(3)} nIn=${f.nIn} nOut=${f.nOut}`);
    }
    lines.push('');
  }

  lines.push('## Correlation analysis (collapsed/redundant candidates)');
  lines.push('');
  lines.push('### Top absolute correlations');
  lines.push('');
  for (const p of correlationReport.topAbsolute.slice(0, 20)) {
    lines.push(`- ${p.a} vs ${p.b}: r=${p.r.toFixed(3)} n=${p.n}`);
  }
  lines.push('');

  lines.push('## Input (descriptor) availability');
  lines.push('');
  const avail = Object.entries(inputAvailability)
    .map(([inputId, s]) => ({ inputId, rate: s.availabilityRate, count: s.availableCount }))
    .sort((a, b) => (b.rate || 0) - (a.rate || 0));

  for (const a of avail.slice(0, 25)) {
    lines.push(`- ${a.inputId}: availabilityRate=${a.rate === null ? 'null' : a.rate.toFixed(3)} available=${a.count}/${summary.tracks}`);
  }
  lines.push('');

  lines.push('## Feature dependency proxy (top raw inputs correlated with feature)');
  lines.push('');
  for (const f of featureDependency.slice(0, 10)) {
    lines.push(`### ${f.featureId}`);
    lines.push('');
    for (const c of f.topInputCorrelations.slice(0, 6)) {
      lines.push(`- ${c.inputId}: r=${c.r.toFixed(3)} n=${c.n}`);
    }
    lines.push('');
  }

  lines.push('');
  lines.push('## Full results');
  lines.push('');
  lines.push(`- See JSON: ${meta.outputJsonPath}`);

  return lines.join('\n');
}

async function run() {
  const sourcePath = path.join(__dirname, '..', 'outputs', 'control_1_semantic_validation.json');
  const validation = readJsonFile(sourcePath);

  const tracks = Array.isArray(validation.tracks) ? validation.tracks : [];
  const groups = Array.from(new Set(tracks.map((t) => t.expectedGroup).filter(Boolean))).sort();

  const featureIds = getAllFeatureIds(tracks);
  const inputIds = getAllInputIds(tracks);

  const vectorsByFeature = buildVectorsByFeature(tracks, featureIds);
  const vectorsByInput = buildVectorsByInput(tracks, inputIds);
  const inputAvailability = buildAvailabilityByInput(tracks, inputIds);

  const featureStats = {};
  for (const f of featureIds) {
    featureStats[f] = summarizeFeature(vectorsByFeature[f]);
  }

  const deadBroken = detectDeadBrokenFeatures(featureStats);

  const groupSeparabilityReport = groupSeparability({ tracks, groups, featureIds, vectorsByFeature });
  const correlationReport = correlationAnalysis({ featureIds, vectorsByFeature });

  const featureDependency = featureDependencyAnalysis({ tracks, featureIds, inputIds, vectorsByFeature, vectorsByInput });
  featureDependency.sort((a, b) => a.featureId.localeCompare(b.featureId));

  const outJson = path.join(__dirname, '..', 'outputs', 'control_1_feature_calibration.json');
  const outMd = path.join(__dirname, '..', 'reports', 'control_1_feature_calibration.md');

  ensureDir(path.dirname(outJson));
  ensureDir(path.dirname(outMd));

  const meta = {
    generatedAt: new Date().toISOString(),
    sourcePath,
    outputJsonPath: outJson
  };

  const summary = {
    tracks: tracks.length,
    groups
  };

  writeJsonFile(outJson, {
    meta,
    summary,
    featureIds,
    inputIds,
    featureStats,
    deadBroken,
    groupSeparability: groupSeparabilityReport,
    correlations: correlationReport,
    inputAvailability,
    featureDependency
  });

  const md = buildMarkdown({
    meta,
    summary,
    featureStats,
    deadBroken,
    groupSeparabilityReport,
    correlationReport,
    inputAvailability,
    featureDependency
  });

  fs.writeFileSync(outMd, md + '\n');

  console.log('[feature_calibration] wrote:');
  console.log('-', outJson);
  console.log('-', outMd);
  console.log('tracks:', tracks.length);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
