const path = require('path');
const { spawnSync } = require('child_process');

const { readJsonFile, ensureDir } = require('../utils/io');

function runNodeScript(scriptRelPath) {
  const scriptPath = path.join(__dirname, scriptRelPath);
  console.log(`\n[run_all] START ${scriptRelPath}`);

  const res = spawnSync(process.execPath, [scriptPath], {
    stdio: 'inherit'
  });

  if (res.status !== 0) {
    console.error(`\n[run_all] FAIL ${scriptRelPath} (exit=${res.status})`);
    return { ok: false, exitCode: res.status };
  }

  console.log(`[run_all] END   ${scriptRelPath}`);
  return { ok: true, exitCode: 0 };
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((v) => String(v)).join(' | ')} |`).join('\n');
  return [headerLine, sepLine, body].filter(Boolean).join('\n');
}

function topNFreq(freqObj, n) {
  return Object.entries(freqObj || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

function generateLatestSummary() {
  const root = path.join(__dirname, '..');
  const outputsCoverage = path.join(root, 'outputs', 'coverage', 'coverage_summary.json');
  const outputsSchema = path.join(root, 'outputs', 'descriptors', 'schema_audit.json');
  const outputsNumeric = path.join(root, 'outputs', 'descriptors', 'numeric_distribution_summary.json');
  const outputsCorr = path.join(root, 'outputs', 'correlations', 'correlation_matrix.json');
  const outputsFeatureScores = path.join(root, 'outputs', 'features', 'generated_feature_scores.json');
  const outputsFeatureDist = path.join(root, 'outputs', 'features', 'feature_distribution_summary.json');
  const outputsFeatureCorr = path.join(root, 'outputs', 'features', 'feature_correlations.json');

  const coverage = readJsonFile(outputsCoverage);
  const schema = readJsonFile(outputsSchema);
  const numeric = readJsonFile(outputsNumeric);
  const corr = readJsonFile(outputsCorr);
  let featureScores = null;
  let featureDist = null;
  let featureCorr = null;
  try {
    featureScores = readJsonFile(outputsFeatureScores);
    featureDist = readJsonFile(outputsFeatureDist);
    featureCorr = readJsonFile(outputsFeatureCorr);
  } catch {
    featureScores = null;
    featureDist = null;
    featureCorr = null;
  }

  const dataset = coverage.dataset;
  const failuresByType = coverage.failuresByType;

  const consistentFieldsCount = Array.isArray(schema.fieldsPresentInAllSuccessfulPayloads)
    ? schema.fieldsPresentInAllSuccessfulPayloads.length
    : 0;

  const numericKeysAnalyzed = numeric && numeric.byKey ? Object.keys(numeric.byKey).length : 0;

  const moodsTop = topNFreq(schema.arrayFrequencies && schema.arrayFrequencies.moods, 15);
  const timbresTop = topNFreq(schema.arrayFrequencies && schema.arrayFrequencies.timbres, 15);
  const themesTop = topNFreq(schema.arrayFrequencies && schema.arrayFrequencies.themes, 15);

  const corrPairs = Object.values((corr && corr.matrix) || {});
  corrPairs.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
  const top10 = corrPairs.slice(0, 10).map((p) => [p.a, p.b, p.r, p.n]);

  // For V1 relevant pairs, use the v1 CSV output would be easier, but keep to JSON-only reads here.
  // We'll just surface strongest correlations where both keys are in V1_ACTIVE_RELEVANT_KEYS.
  const v1Set = new Set([
    'arousal',
    'intensity',
    'loudness',
    'loudness_range',
    'event_density',
    'brightness',
    'centroid',
    'pulse_clarity',
    'rhythmic_stability',
    'danceability',
    'vocal_instrumental',
    'music_speech'
  ]);

  const v1Pairs = corrPairs
    .filter((p) => v1Set.has(p.a) && v1Set.has(p.b))
    .slice(0, 10)
    .map((p) => [p.a, p.b, p.r, p.n]);

  let compositeSection = '';
  if (featureScores && featureDist && featureCorr) {
    const fsDataset = featureScores.dataset || {};
    const featureDefs = featureScores.featureDefinitions || {};
    const featureCount = Object.keys(featureDefs).length;

    const distByFeature = featureDist.byFeature || {};
    const possibleCollapsed = Object.values(distByFeature)
      .filter((x) => x && x.possibleCollapse)
      .map((x) => x.featureName);

    const featureCorrTop = (featureCorr.top || []).filter((r) => r.type === 'feature_vs_feature').slice(0, 10);
    const topFeatureCorrRows = featureCorrTop.map((r) => [r.a, r.b, r.r, r.n]);

    // Coverage from feature generation rows
    const fRows = featureScores.rows || [];
    const featureKeys = Object.keys((fRows[0] && fRows[0].features) || {});
    const cov = {};
    for (const fk of featureKeys) {
      let c = 0;
      for (const r of fRows) {
        const s = r.features && r.features[fk] ? r.features[fk].score : null;
        if (typeof s === 'number' && Number.isFinite(s)) c += 1;
      }
      cov[fk] = { count: c };
    }
    const covRows = Object.entries(cov)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([k, v]) => [k, v.count]);

    compositeSection = `## Composite Feature Research (Observed, exploratory)\n\n` +
      `### Dataset Context (Feature generation)\n\n` +
      `- Total entries: ${fsDataset.totalEntries}\n` +
      `- Successful payloads: ${fsDataset.successfulPayloads}\n` +
      `- Failed payloads: ${fsDataset.failedPayloads}\n\n` +
      `### Summary (Cautious)\n\n` +
      `- Feature count (defined): ${featureCount}\n` +
      `- Possible collapsed features (heuristic): ${possibleCollapsed.length ? possibleCollapsed.join(', ') : '(none flagged)'}\n\n` +
      `### Feature Coverage (Observed counts)\n\n` +
      markdownTable(['Feature', 'Count'], covRows) +
      `\n\n` +
      `### Strongest Feature vs Feature Correlations (Pearson, observed)\n\n` +
      markdownTable(['A', 'B', 'r', 'n'], topFeatureCorrRows.length ? topFeatureCorrRows : [['(none)', '', '', '']]) +
      `\n\n` +
      `### Notes (Cautious)\n\n` +
      `- Observed: composite features may show partial redundancy depending on shared descriptors.\n` +
      `- Possible: some features may be dominated by a single descriptor; check feature-vs-descriptor correlations.\n` +
      `- Needs validation: feature orientation (e.g., vocal presence) may be ambiguous without listening review.\n\n`;
  } else {
    compositeSection = `## Composite Feature Research\n\n` +
      `Composite feature outputs were not found. This suggests Phase 2 scripts were not executed yet.\n\n`;
  }

  const warnings = [];
  if (Array.isArray(coverage.warnings) && coverage.warnings.length) warnings.push(...coverage.warnings);
  if (Array.isArray(schema.warnings) && schema.warnings.length) warnings.push(...schema.warnings);
  if (Array.isArray(numeric.warnings) && numeric.warnings.length) warnings.push(...numeric.warnings);
  if (Array.isArray(corr.warnings) && corr.warnings.length) warnings.push(...corr.warnings);

  const reportDir = path.join(root, 'reports');
  ensureDir(reportDir);
  const outPath = path.join(reportDir, 'latest_experiment_summary.md');

  const md = `# Latest Experiment Summary (Music Story cache analysis)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${dataset.totalEntries}\n` +
    `- Successful payloads: ${dataset.successes}\n` +
    `- Failed payloads: ${dataset.failures}\n` +
    `- Success rate: ${Number((dataset.successRate * 100).toFixed(2))}%\n\n` +
    `## Failure Types (Observed)\n\n` +
    '```json\n' + JSON.stringify(failuresByType, null, 2) + '\n```\n\n' +
    `## Descriptor Schema (Observed)\n\n` +
    `- Numeric descriptors analyzed: ${numericKeysAnalyzed}\n` +
    `- Fields present in all successful payloads: ${consistentFieldsCount}\n\n` +
    `## Most Common Moods (Observed)\n\n` +
    markdownTable(['Mood', 'Count'], moodsTop.map((m) => [m.name, m.count])) +
    `\n\n` +
    `## Most Common Timbres (Observed)\n\n` +
    markdownTable(['Timbre', 'Count'], timbresTop.map((m) => [m.name, m.count])) +
    `\n\n` +
    `## Most Common Themes (Observed)\n\n` +
    markdownTable(['Theme', 'Count'], themesTop.map((m) => [m.name, m.count])) +
    `\n\n` +
    `## Top 10 Strongest Correlations (Pearson, observed)\n\n` +
    markdownTable(['A', 'B', 'r', 'n'], top10) +
    `\n\n` +
    `## Top 10 V1-relevant Correlations (Pearson, observed)\n\n` +
    markdownTable(['A', 'B', 'r', 'n'], v1Pairs) +
    `\n\n` +
    compositeSection +
    `## Warnings\n\n` +
    `These warnings suggest possible dataset or parsing issues. They do not necessarily indicate incorrect provider behavior.\n\n` +
    '```json\n' + JSON.stringify(warnings, null, 2) + '\n```\n\n' +
    `## Known Limitations\n\n` +
    `- Spearman correlation is not implemented yet (Phase 1). Pearson correlations only.\n` +
    `- Correlations appear dataset-dependent; additional batches may change these values.\n` +
    `- This summary is exploratory and does not represent validated mapping or ground truth.\n\n` +
    `## Next Recommended Analysis Step (Cautious)\n\n` +
    `- Possible: manually review a small set of high-correlation pairs and representative tracks to see if the relationship appears meaningful.\n` +
    `- Possible: extend datasets incrementally (more batches) and compare whether distributions/correlations remain stable.\n`;

  require('fs').writeFileSync(outPath, md);
  console.log(`\n[run_all] Wrote latest summary: ${outPath}`);
}

async function run() {
  const scripts = [
    '001_coverage_analysis.js',
    '002_descriptor_schema_audit.js',
    '003_numeric_distribution_analysis.js',
    '004_correlation_analysis.js',
    '005_generate_feature_scores.js',
    '006_feature_distribution_analysis.js',
    '007_feature_correlation_analysis.js',
    '008_select_representative_tracks.js'
  ];

  for (const s of scripts) {
    const res = runNodeScript(s);
    if (!res.ok) {
      process.exitCode = 1;
      return;
    }
  }

  console.log('\n[run_all] All experiments completed successfully.');
  generateLatestSummary();
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
