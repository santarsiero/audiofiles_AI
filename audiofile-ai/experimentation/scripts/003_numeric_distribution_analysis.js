const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { writeJsonFile, writeCsvFile, ensureDir, safeNumber, percentile } = require('../utils/io');
const {
  NUMERIC_DESCRIPTOR_KEYS,
  DESCRIPTOR_CATEGORIES,
  V1_ACTIVE_RELEVANT_KEYS
} = require('../utils/descriptorRegistry');

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

function median(sorted) {
  return percentile(sorted, 0.5);
}

function uniqueCount(values) {
  const s = new Set(values.map((v) => String(v)));
  return s.size;
}

function collapseFlag(stats) {
  if (!stats || stats.count === 0) return false;
  if (stats.uniqueValues !== null && stats.uniqueValues <= 3 && stats.count >= 10) return true;
  if (stats.std !== null && stats.std < 0.01 && stats.count >= 10) return true;
  return false;
}

function outlierFlag(stats) {
  if (!stats || stats.count === 0) return false;
  if (stats.p05 === null || stats.p95 === null) return false;
  const spread = stats.p95 - stats.p05;
  if (!Number.isFinite(spread)) return false;
  if (spread > 1.5) return true;
  if (stats.min < stats.p05 - spread * 2) return true;
  if (stats.max > stats.p95 + spread * 2) return true;
  return false;
}

function categoryForKey(k) {
  for (const [cat, keys] of Object.entries(DESCRIPTOR_CATEGORIES)) {
    if (Array.isArray(keys) && keys.includes(k)) return cat;
  }
  return 'uncategorized';
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((v) => String(v)).join(' | ')} |`).join('\n');
  return [headerLine, sepLine, body].filter(Boolean).join('\n');
}

async function run() {
  const dataset = loadMusicStoryBatches();

  const outBase = path.join(__dirname, '..', 'outputs', 'descriptors');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  if (dataset.summary.usableFilesLoaded === 0) {
    console.error('[003] No usable batch files were loaded.');
    console.error(JSON.stringify(dataset.warnings, null, 2));
    process.exitCode = 1;
    return;
  }

  const successes = dataset.successes;
  const successCount = successes.length;
  const total = dataset.all.length;
  const failures = dataset.failures.length;

  const byKey = {};

  for (const k of NUMERIC_DESCRIPTOR_KEYS) {
    const values = [];
    let present = 0;
    let missing = 0;
    let nullCount = 0;
    let nonNumeric = 0;

    for (const e of successes) {
      const d = e.rawDescriptorData;
      if (!d || typeof d !== 'object') {
        missing += 1;
        continue;
      }
      if (!Object.prototype.hasOwnProperty.call(d, k)) {
        missing += 1;
        continue;
      }
      present += 1;
      const v = d[k];
      if (v === null) {
        nullCount += 1;
        continue;
      }
      const n = safeNumber(v);
      if (n === null) {
        nonNumeric += 1;
        continue;
      }
      values.push(n);
    }

    values.sort((a, b) => a - b);

    const m = mean(values);
    const sd = stddev(values, m);

    const stats = {
      key: k,
      category: categoryForKey(k),
      v1Relevant: V1_ACTIVE_RELEVANT_KEYS.includes(k),
      count: values.length,
      present,
      missing,
      null: nullCount,
      nonNumeric,
      coveragePctAmongSuccesses: successCount ? Number(((present / successCount) * 100).toFixed(2)) : 0,
      min: values.length ? values[0] : null,
      max: values.length ? values[values.length - 1] : null,
      mean: values.length ? Number(m.toFixed(6)) : null,
      median: values.length ? Number(median(values).toFixed(6)) : null,
      std: values.length && sd !== null ? Number(sd.toFixed(6)) : null,
      p05: values.length ? Number(percentile(values, 0.05).toFixed(6)) : null,
      p25: values.length ? Number(percentile(values, 0.25).toFixed(6)) : null,
      p50: values.length ? Number(percentile(values, 0.5).toFixed(6)) : null,
      p75: values.length ? Number(percentile(values, 0.75).toFixed(6)) : null,
      p95: values.length ? Number(percentile(values, 0.95).toFixed(6)) : null,
      uniqueValues: values.length ? uniqueCount(values) : null
    };

    stats.possibleCollapse = collapseFlag(stats);
    stats.possibleOutliers = outlierFlag(stats);

    byKey[k] = stats;
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: total,
      successfulPayloads: successCount,
      failedPayloads: failures
    },
    byKey,
    warnings: dataset.warnings
  };

  const jsonOutPath = path.join(outBase, 'numeric_distribution_summary.json');
  writeJsonFile(jsonOutPath, summary);

  const csvOutPath = path.join(outBase, 'numeric_distribution_summary.csv');
  const csvRows = Object.values(byKey)
    .sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.key.localeCompare(b.key);
    })
    .map((s) => ({
      key: s.key,
      category: s.category,
      v1Relevant: s.v1Relevant,
      count: s.count,
      present: s.present,
      missing: s.missing,
      null: s.null,
      nonNumeric: s.nonNumeric,
      coveragePctAmongSuccesses: s.coveragePctAmongSuccesses,
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
      possibleCollapse: s.possibleCollapse,
      possibleOutliers: s.possibleOutliers
    }));

  writeCsvFile(
    csvOutPath,
    [
      'key',
      'category',
      'v1Relevant',
      'count',
      'present',
      'missing',
      'null',
      'nonNumeric',
      'coveragePctAmongSuccesses',
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
      'possibleCollapse',
      'possibleOutliers'
    ],
    csvRows
  );

  // Markdown report (cautious language)
  const reportPath = path.join(reportDir, '003_numeric_distribution_analysis.md');

  const strongSpread = csvRows
    .filter((r) => r.std !== null && r.std >= 0.1 && r.count >= 20)
    .sort((a, b) => b.std - a.std)
    .slice(0, 20)
    .map((r) => [r.key, r.category, r.count, r.std, r.uniqueValues, r.v1Relevant]);

  const weakSpread = csvRows
    .filter((r) => r.std !== null && r.std <= 0.02 && r.count >= 20)
    .sort((a, b) => a.std - b.std)
    .slice(0, 20)
    .map((r) => [r.key, r.category, r.count, r.std, r.uniqueValues, r.v1Relevant]);

  const v1Rows = csvRows
    .filter((r) => r.v1Relevant)
    .sort((a, b) => (b.coveragePctAmongSuccesses || 0) - (a.coveragePctAmongSuccesses || 0))
    .map((r) => [r.key, r.count, r.coveragePctAmongSuccesses + '%', r.std, r.possibleCollapse]);

  const reportMd = `# 003 Numeric Distribution Analysis (Music Story numeric fields)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${total}\n` +
    `- Successful payloads: ${successCount}\n` +
    `- Failed payloads: ${failures}\n\n` +
    `## Notes (Cautious)\n\n` +
    `This analysis summarizes numeric descriptor distributions across successful payloads. It appears useful for identifying: (a) descriptors with strong spread, (b) descriptors with weak spread (possible collapse), and (c) descriptors that may require normalization review.\n\n` +
    `No feature formulas or label mappings are defined here.\n\n` +
    `## Descriptors with Strong Spread (Observed)\n\n` +
    markdownTable(['Key', 'Category', 'Count', 'Std', 'Unique', 'V1 relevant'], strongSpread) +
    `\n\n` +
    `## Descriptors with Weak Spread (Observed)\n\n` +
    markdownTable(['Key', 'Category', 'Count', 'Std', 'Unique', 'V1 relevant'], weakSpread) +
    `\n\n` +
    `## V1 Active / Relevant Keys (Observed coverage + variability)\n\n` +
    markdownTable(['Key', 'Count', 'Coverage', 'Std', 'Possible collapse'], v1Rows) +
    `\n\n` +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), jsonOutPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), csvOutPath)}\n\n` +
    `## Warnings\n\n` +
    '```json\n' + JSON.stringify(dataset.warnings, null, 2) + '\n```\n';

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[003] Numeric distribution analysis complete');
  console.log(`- ${jsonOutPath}`);
  console.log(`- ${csvOutPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
