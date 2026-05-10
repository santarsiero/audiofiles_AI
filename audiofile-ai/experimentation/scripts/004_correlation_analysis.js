const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { writeJsonFile, writeCsvFile, ensureDir, safeNumber } = require('../utils/io');
const {
  NUMERIC_DESCRIPTOR_KEYS,
  V1_ACTIVE_RELEVANT_KEYS
} = require('../utils/descriptorRegistry');

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

function keyPair(a, b) {
  return a < b ? `${a}|||${b}` : `${b}|||${a}`;
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((v) => String(v)).join(' | ')} |`).join('\n');
  return [headerLine, sepLine, body].filter(Boolean).join('\n');
}

function toFixedOrNull(n, digits = 4) {
  if (n === null || n === undefined) return null;
  if (!Number.isFinite(n)) return null;
  return Number(n.toFixed(digits));
}

async function run() {
  const dataset = loadMusicStoryBatches();

  const outBase = path.join(__dirname, '..', 'outputs', 'correlations');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  if (dataset.summary.usableFilesLoaded === 0) {
    console.error('[004] No usable batch files were loaded.');
    console.error(JSON.stringify(dataset.warnings, null, 2));
    process.exitCode = 1;
    return;
  }

  const successes = dataset.successes;
  const successCount = successes.length;
  const total = dataset.all.length;
  const failures = dataset.failures.length;

  // Build per-key vectors aligned by song (only include if both values exist)
  const keyToValues = {};
  for (const k of NUMERIC_DESCRIPTOR_KEYS) keyToValues[k] = [];

  // We'll compute pairwise by scanning entries and collecting per pair.
  // For memory simplicity, store per entry numeric map.
  const numericRows = [];
  for (const e of successes) {
    const d = e.rawDescriptorData;
    if (!d || typeof d !== 'object') continue;
    const row = {};
    for (const k of NUMERIC_DESCRIPTOR_KEYS) {
      if (!Object.prototype.hasOwnProperty.call(d, k)) continue;
      const n = safeNumber(d[k]);
      if (n === null) continue;
      row[k] = n;
    }
    numericRows.push(row);
  }

  const matrix = {}; // pairKey -> {a,b,r,n}
  const topPairs = [];

  for (let i = 0; i < NUMERIC_DESCRIPTOR_KEYS.length; i += 1) {
    for (let j = i + 1; j < NUMERIC_DESCRIPTOR_KEYS.length; j += 1) {
      const a = NUMERIC_DESCRIPTOR_KEYS[i];
      const b = NUMERIC_DESCRIPTOR_KEYS[j];

      const xs = [];
      const ys = [];

      for (const row of numericRows) {
        if (row[a] === undefined || row[b] === undefined) continue;
        xs.push(row[a]);
        ys.push(row[b]);
      }

      if (xs.length < 10) continue; // require enough data

      const r = pearsonCorrelation(xs, ys);
      if (r === null) continue;

      const rec = { a, b, r: toFixedOrNull(r, 6), n: xs.length };
      matrix[keyPair(a, b)] = rec;
      topPairs.push(rec);
    }
  }

  topPairs.sort((p, q) => Math.abs(q.r) - Math.abs(p.r));

  const top = topPairs.slice(0, 80).map((p) => ({
    a: p.a,
    b: p.b,
    r: p.r,
    n: p.n,
    direction: p.r >= 0 ? 'positive' : 'negative'
  }));

  const v1RelevantPairsWanted = [
    ['arousal', 'intensity'],
    ['arousal', 'loudness'],
    ['arousal', 'danceability'],
    ['arousal', 'pulse_clarity'],
    ['danceability', 'pulse_clarity'],
    ['danceability', 'rhythmic_stability'],
    ['pulse_clarity', 'rhythmic_stability'],
    ['brightness', 'centroid'],
    ['brightness', 'roll_off'],
    ['brightness', 'flatness'],
    ['music_speech', 'vocal_instrumental'],
    ['event_density', 'complexity'],
    ['event_density', 'intensity'],
    ['dissonance', 'valence'],
    ['articulation', 'danceability']
  ];

  const v1RelevantPairs = [];
  for (const [a, b] of v1RelevantPairsWanted) {
    const rec = matrix[keyPair(a, b)] || null;
    v1RelevantPairs.push({
      a,
      b,
      r: rec ? rec.r : null,
      n: rec ? rec.n : 0,
      observed: Boolean(rec)
    });
  }

  const outMatrixPath = path.join(outBase, 'correlation_matrix.json');
  writeJsonFile(outMatrixPath, {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: total,
      successfulPayloads: successCount,
      failedPayloads: failures
    },
    correlation: {
      method: 'pearson',
      minPairN: 10,
      note:
        'Spearman correlation is not implemented in Phase 1. This file contains Pearson correlations only.'
    },
    matrix,
    warnings: dataset.warnings
  });

  const topCsvPath = path.join(outBase, 'top_correlations.csv');
  writeCsvFile(topCsvPath, ['a', 'b', 'r', 'n', 'direction'], top);

  const v1CsvPath = path.join(outBase, 'v1_relevant_correlations.csv');
  writeCsvFile(v1CsvPath, ['a', 'b', 'r', 'n', 'observed'], v1RelevantPairs);

  // Markdown report (cautious)
  const reportPath = path.join(reportDir, '004_correlation_analysis.md');

  const topPos = top
    .filter((t) => t.r !== null && t.r > 0)
    .slice(0, 15)
    .map((t) => [t.a, t.b, t.r, t.n]);

  const topNeg = top
    .filter((t) => t.r !== null && t.r < 0)
    .slice(0, 15)
    .map((t) => [t.a, t.b, t.r, t.n]);

  const v1Rows = v1RelevantPairs.map((p) => [p.a, p.b, p.observed ? p.r : '(not observed)', p.n]);

  const reportMd = `# 004 Correlation Analysis (Pearson, numeric descriptors)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${total}\n` +
    `- Successful payloads: ${successCount}\n` +
    `- Failed payloads: ${failures}\n\n` +
    `## Method\n\n` +
    `- Correlation: Pearson\n` +
    `- Minimum pair sample size (n): 10\n` +
    `- Limitation: Spearman correlation is not implemented yet (Phase 1).\n\n` +
    `## Strongest Observed Positive Correlations (Cautious)\n\n` +
    markdownTable(['A', 'B', 'r', 'n'], topPos) +
    `\n\n` +
    `## Strongest Observed Negative Correlations (Cautious)\n\n` +
    markdownTable(['A', 'B', 'r', 'n'], topNeg) +
    `\n\n` +
    `## V1-relevant Pairs (Requested inspection)\n\n` +
    markdownTable(['A', 'B', 'r (Pearson)', 'n'], v1Rows) +
    `\n\n` +
    `## Interpretation Notes (Cautious)\n\n` +
    `- Observed: some descriptor pairs may show strong linear relationships, which suggests potential redundancy.\n` +
    `- Possible: correlations may be dataset-dependent; additional batches may change these relationships.\n` +
    `- Needs validation: correlations do not imply causal meaning and should not be treated as ground truth mapping.\n\n` +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), outMatrixPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), topCsvPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), v1CsvPath)}\n\n` +
    `## Warnings\n\n` +
    '```json\n' + JSON.stringify(dataset.warnings, null, 2) + '\n```\n';

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[004] Correlation analysis complete');
  console.log(`- ${outMatrixPath}`);
  console.log(`- ${topCsvPath}`);
  console.log(`- ${v1CsvPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
