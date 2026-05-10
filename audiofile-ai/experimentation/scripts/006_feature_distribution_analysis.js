const path = require('path');

const { readJsonFile, writeJsonFile, writeCsvFile, ensureDir, percentile } = require('../utils/io');

function mean(values) {
  if (!values.length) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stddev(values, m) {
  if (values.length < 2) return null;
  const mu = m === null || m === undefined ? mean(values) : m;
  const v = values.reduce((acc, x) => acc + (x - mu) * (x - mu), 0) / (values.length - 1);
  return Math.sqrt(v);
}

function uniqueCount(values) {
  const s = new Set(values.map((v) => String(v)));
  return s.size;
}

function collapseFlag(stats) {
  if (!stats || stats.count === 0) return false;
  if (stats.uniqueValues !== null && stats.uniqueValues <= 3 && stats.count >= 10) return true;
  if (stats.std !== null && stats.std < 0.02 && stats.count >= 10) return true;
  return false;
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

  const inputPath = path.join(outBase, 'generated_feature_scores.json');
  const data = readJsonFile(inputPath);

  const rows = data.rows || [];
  const dataset = data.dataset || {};

  const featureKeys = [
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1'
  ];

  const byFeature = {};

  for (const fk of featureKeys) {
    const values = [];
    let missing = 0;

    for (const r of rows) {
      const f = r.features && r.features[fk];
      const s = f ? f.score : null;
      if (typeof s === 'number' && Number.isFinite(s)) values.push(s);
      else missing += 1;
    }

    values.sort((a, b) => a - b);
    const m = mean(values);
    const sd = stddev(values, m);

    const stats = {
      featureName: fk,
      count: values.length,
      missing,
      min: values.length ? values[0] : null,
      max: values.length ? values[values.length - 1] : null,
      mean: values.length ? Number(m.toFixed(6)) : null,
      median: values.length ? Number(percentile(values, 0.5).toFixed(6)) : null,
      std: values.length && sd !== null ? Number(sd.toFixed(6)) : null,
      p05: values.length ? Number(percentile(values, 0.05).toFixed(6)) : null,
      p25: values.length ? Number(percentile(values, 0.25).toFixed(6)) : null,
      p50: values.length ? Number(percentile(values, 0.5).toFixed(6)) : null,
      p75: values.length ? Number(percentile(values, 0.75).toFixed(6)) : null,
      p95: values.length ? Number(percentile(values, 0.95).toFixed(6)) : null,
      uniqueValues: values.length ? uniqueCount(values) : null
    };

    stats.possibleCollapse = collapseFlag(stats);

    byFeature[fk] = stats;
  }

  const jsonOutPath = path.join(outBase, 'feature_distribution_summary.json');
  writeJsonFile(jsonOutPath, {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: dataset.totalEntries,
      successfulPayloads: dataset.successfulPayloads,
      failedPayloads: dataset.failedPayloads
    },
    byFeature
  });

  const csvOutPath = path.join(outBase, 'feature_distribution_summary.csv');
  const csvRows = Object.values(byFeature).map((s) => ({
    featureName: s.featureName,
    count: s.count,
    missing: s.missing,
    min: s.min,
    max: s.max,
    mean: s.mean,
    median: s.median,
    std: s.std,
    p05: s.p05,
    p25: s.p25,
    p50: s.p50,
    p75: s.p75,
    p95: s.p95,
    uniqueValues: s.uniqueValues,
    possibleCollapse: s.possibleCollapse
  }));

  writeCsvFile(
    csvOutPath,
    [
      'featureName',
      'count',
      'missing',
      'min',
      'max',
      'mean',
      'median',
      'std',
      'p05',
      'p25',
      'p50',
      'p75',
      'p95',
      'uniqueValues',
      'possibleCollapse'
    ],
    csvRows
  );

  const collapsed = csvRows.filter((r) => r.possibleCollapse).map((r) => [r.featureName, r.std, r.uniqueValues]);
  const strongestSpread = csvRows
    .filter((r) => r.std !== null)
    .sort((a, b) => (b.std || 0) - (a.std || 0))
    .map((r) => [r.featureName, r.std, r.uniqueValues])
    .slice(0, 10);

  const reportPath = path.join(reportDir, '006_feature_distribution_analysis.md');
  const reportMd = `# 006 Feature Distribution Analysis (Composite features)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${dataset.totalEntries}\n` +
    `- Successful payloads: ${dataset.successfulPayloads}\n` +
    `- Failed payloads: ${dataset.failedPayloads}\n\n` +
    `## Summary (Observed, cautious)\n\n` +
    `This analysis summarizes distribution statistics for experimental composite features. It appears useful for detecting collapse risk and outliers, but requires validation.\n\n` +
    `## Strongest Spread Features (Observed)\n\n` +
    markdownTable(['Feature', 'Std', 'Unique'], strongestSpread) +
    `\n\n` +
    `## Possible Collapse Flags (Observed)\n\n` +
    markdownTable(['Feature', 'Std', 'Unique'], collapsed.length ? collapsed : [['(none flagged)', '', '']]) +
    `\n\n` +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), jsonOutPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), csvOutPath)}\n`;

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[006] Feature distribution analysis complete');
  console.log(`- ${jsonOutPath}`);
  console.log(`- ${csvOutPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
