const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { readJsonFile, writeJsonFile, writeCsvFile, ensureDir, safeNumber } = require('../utils/io');

function pearsonCorrelation(x, y) {
  const n = Math.min(x.length, y.length);
  if (n < 3) return null;

  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i += 1) {
    sx += x[i];
    sy += y[i];
  }
  const mx = sx / n;
  const my = sy / n;

  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i += 1) {
    const vx = x[i] - mx;
    const vy = y[i] - my;
    num += vx * vy;
    dx += vx * vx;
    dy += vy * vy;
  }
  if (dx === 0 || dy === 0) return null;
  return num / Math.sqrt(dx * dy);
}

function toFixedOrNull(n, digits = 6) {
  if (n === null || n === undefined) return null;
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(digits));
}

function keyPair(a, b) {
  return a < b ? `${a}|||${b}` : `${b}|||${a}`;
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((v) => String(v)).join(' | ')} |`).join('\n');
  return [headerLine, sepLine, body].filter(Boolean).join('\n');
}

async function run() {
  const outBase = path.join(__dirname, '..', 'outputs', 'features');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  const featurePath = path.join(outBase, 'generated_feature_scores.json');
  const featuresJson = readJsonFile(featurePath);
  const rows = featuresJson.rows || [];
  const dataset = featuresJson.dataset || {};

  // Load descriptor rows for the same dataset (successful only)
  const msDataset = loadMusicStoryBatches();
  const successEntries = msDataset.successes;

  const featureKeys = [
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1'
  ];

  // Build index by ISRC to join to descriptors (best-effort)
  const isrcToEntry = new Map();
  for (const e of successEntries) {
    if (e.isrc) isrcToEntry.set(e.isrc, e);
  }

  const descriptorKeys = [
    'arousal',
    'intensity',
    'loudness',
    'pulse_clarity',
    'rhythmic_stability',
    'danceability',
    'complexity',
    'brightness',
    'roll_off',
    'centroid',
    'flatness',
    'event_density',
    'loudness_range',
    'spread',
    'vocal_instrumental',
    'music_speech'
  ];

  const numericRows = [];
  for (const r of rows) {
    const row = { isrc: r.isrc };
    for (const fk of featureKeys) {
      const s = r.features && r.features[fk] ? r.features[fk].score : null;
      row[fk] = typeof s === 'number' && Number.isFinite(s) ? s : null;
    }

    const e = r.isrc ? isrcToEntry.get(r.isrc) : null;
    const d = e && e.rawDescriptorData ? e.rawDescriptorData : null;
    for (const dk of descriptorKeys) {
      row[dk] = d && Object.prototype.hasOwnProperty.call(d, dk) ? safeNumber(d[dk]) : null;
    }

    numericRows.push(row);
  }

  function correlate(keyA, keyB) {
    const xs = [];
    const ys = [];
    for (const row of numericRows) {
      const a = row[keyA];
      const b = row[keyB];
      if (a === null || a === undefined) continue;
      if (b === null || b === undefined) continue;
      xs.push(a);
      ys.push(b);
    }
    if (xs.length < 10) return null;
    const r = pearsonCorrelation(xs, ys);
    if (r === null) return null;
    return { a: keyA, b: keyB, r: toFixedOrNull(r), n: xs.length };
  }

  const matrix = {};
  const rowsOut = [];

  // feature-feature
  for (let i = 0; i < featureKeys.length; i += 1) {
    for (let j = i + 1; j < featureKeys.length; j += 1) {
      const a = featureKeys[i];
      const b = featureKeys[j];
      const rec = correlate(a, b);
      if (!rec) continue;
      matrix[keyPair(a, b)] = rec;
      rowsOut.push({ ...rec, type: 'feature_vs_feature' });
    }
  }

  // feature-descriptor
  for (const fk of featureKeys) {
    for (const dk of descriptorKeys) {
      const rec = correlate(fk, dk);
      if (!rec) continue;
      matrix[keyPair(fk, dk)] = rec;
      rowsOut.push({ ...rec, type: 'feature_vs_descriptor' });
    }
  }

  rowsOut.sort((p, q) => Math.abs(q.r) - Math.abs(p.r));

  const jsonOutPath = path.join(outBase, 'feature_correlations.json');
  writeJsonFile(jsonOutPath, {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: dataset.totalEntries,
      successfulPayloads: dataset.successfulPayloads,
      failedPayloads: dataset.failedPayloads
    },
    correlation: {
      method: 'pearson',
      minPairN: 10,
      note:
        'Spearman correlation is not implemented yet (Phase 1/2). Pearson correlations only.'
    },
    matrix,
    top: rowsOut.slice(0, 100)
  });

  const csvOutPath = path.join(outBase, 'feature_correlations.csv');
  writeCsvFile(csvOutPath, ['type', 'a', 'b', 'r', 'n'], rowsOut.map((r) => ({
    type: r.type,
    a: r.a,
    b: r.b,
    r: r.r,
    n: r.n
  })));

  // Report
  const reportPath = path.join(reportDir, '007_feature_correlation_analysis.md');

  const topFeatureFeature = rowsOut
    .filter((r) => r.type === 'feature_vs_feature')
    .slice(0, 15)
    .map((r) => [r.a, r.b, r.r, r.n]);

  const topFeatureDescriptor = rowsOut
    .filter((r) => r.type === 'feature_vs_descriptor')
    .slice(0, 15)
    .map((r) => [r.a, r.b, r.r, r.n]);

  const reportMd = `# 007 Feature Correlation Analysis (Composite features)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${dataset.totalEntries}\n` +
    `- Successful payloads: ${dataset.successfulPayloads}\n` +
    `- Failed payloads: ${dataset.failedPayloads}\n\n` +
    `## Method\n\n` +
    `- Correlation: Pearson\n` +
    `- Minimum pair sample size (n): 10\n` +
    `- Limitation: Spearman correlation not implemented (Phase 2).\n\n` +
    `## Strongest Feature vs Feature Correlations (Observed, cautious)\n\n` +
    markdownTable(['Feature A', 'Feature B', 'r', 'n'], topFeatureFeature) +
    `\n\n` +
    `## Strongest Feature vs Descriptor Correlations (Observed, cautious)\n\n` +
    markdownTable(['Feature', 'Descriptor', 'r', 'n'], topFeatureDescriptor) +
    `\n\n` +
    `## Interpretation Notes (Cautious)\n\n` +
    `- Observed: some composite features may correlate strongly with each other, which suggests redundancy.\n` +
    `- Possible: a feature could be dominated by a single descriptor; check contributor metadata and correlations.\n` +
    `- Needs validation: correlation structure may change as more batches are added.\n\n` +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), jsonOutPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), csvOutPath)}\n`;

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[007] Feature correlation analysis complete');
  console.log(`- ${jsonOutPath}`);
  console.log(`- ${csvOutPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
