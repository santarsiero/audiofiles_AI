const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { FEATURE_DEFINITIONS, FEATURE_KEYS } = require('../utils/featureRegistry');
const { computeDatasetMinMax, computeAllFeatures } = require('../utils/featureConstruction');
const { writeJsonFile, writeCsvFile, ensureDir } = require('../utils/io');

function percent(n, d) {
  if (!d) return 0;
  return Number(((n / d) * 100).toFixed(2));
}

function markdownTable(headers, rows) {
  const headerLine = `| ${headers.join(' | ')} |`;
  const sepLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map((v) => String(v)).join(' | ')} |`).join('\n');
  return [headerLine, sepLine, body].filter(Boolean).join('\n');
}

function flattenFeatureForCsv(featureObj) {
  if (!featureObj || typeof featureObj !== 'object') return { score: null, contributors: '', missing: '' };
  return {
    score: featureObj.score,
    contributors: Array.isArray(featureObj.contributors) ? featureObj.contributors.join('|') : '',
    missing: Array.isArray(featureObj.missingDescriptors) ? featureObj.missingDescriptors.join('|') : ''
  };
}

async function run() {
  const dataset = loadMusicStoryBatches();

  const outBase = path.join(__dirname, '..', 'outputs', 'features');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  if (dataset.summary.usableFilesLoaded === 0) {
    console.error('[005] No usable batch files were loaded.');
    console.error(JSON.stringify(dataset.warnings, null, 2));
    process.exitCode = 1;
    return;
  }

  const total = dataset.all.length;
  const successes = dataset.successes.length;
  const failures = dataset.failures.length;

  const successEntries = dataset.successes;

  // Compute dataset min/max scaling for descriptors used by features
  const allDescriptorKeys = Array.from(
    new Set(
      FEATURE_KEYS.flatMap((k) => (FEATURE_DEFINITIONS[k] && FEATURE_DEFINITIONS[k].contributors) || [])
    )
  );

  const minMax = computeDatasetMinMax(successEntries, allDescriptorKeys);

  const rows = [];
  for (const e of successEntries) {
    const features = computeAllFeatures(e, { minMax });

    rows.push({
      title: e.title,
      artist: e.artist,
      isrc: e.isrc,
      recordingId: e.providerRecordingId,
      features: {
        energy_score_v1: features.energy_score_v1,
        brightness_score_v1: features.brightness_score_v1,
        pulse_score_v1: features.pulse_score_v1,
        vocal_presence_score_v1: features.vocal_presence_score_v1,
        density_score_v1: features.density_score_v1
      }
    });
  }

  const jsonOutPath = path.join(outBase, 'generated_feature_scores.json');
  writeJsonFile(jsonOutPath, {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: total,
      successfulPayloads: successes,
      failedPayloads: failures
    },
    featureDefinitions: FEATURE_DEFINITIONS,
    descriptorScaling: {
      method: 'dataset_min_max',
      keys: minMax
    },
    rows,
    warnings: dataset.warnings
  });

  // CSV export
  const csvOutPath = path.join(outBase, 'generated_feature_scores.csv');
  const headers = [
    'title',
    'artist',
    'isrc',
    'recordingId',
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1',
    'energy_contributors',
    'brightness_contributors',
    'pulse_contributors',
    'vocal_contributors',
    'density_contributors',
    'energy_missing',
    'brightness_missing',
    'pulse_missing',
    'vocal_missing',
    'density_missing'
  ];

  const csvRows = rows.map((r) => {
    const e = flattenFeatureForCsv(r.features.energy_score_v1);
    const b = flattenFeatureForCsv(r.features.brightness_score_v1);
    const p = flattenFeatureForCsv(r.features.pulse_score_v1);
    const v = flattenFeatureForCsv(r.features.vocal_presence_score_v1);
    const d = flattenFeatureForCsv(r.features.density_score_v1);

    return {
      title: r.title,
      artist: r.artist,
      isrc: r.isrc,
      recordingId: r.recordingId,
      energy_score_v1: e.score,
      brightness_score_v1: b.score,
      pulse_score_v1: p.score,
      vocal_presence_score_v1: v.score,
      density_score_v1: d.score,
      energy_contributors: e.contributors,
      brightness_contributors: b.contributors,
      pulse_contributors: p.contributors,
      vocal_contributors: v.contributors,
      density_contributors: d.contributors,
      energy_missing: e.missing,
      brightness_missing: b.missing,
      pulse_missing: p.missing,
      vocal_missing: v.missing,
      density_missing: d.missing
    };
  });

  writeCsvFile(csvOutPath, headers, csvRows);

  // Coverage per feature
  const featureCoverage = {};
  for (const fk of [
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1'
  ]) {
    let count = 0;
    for (const r of rows) {
      const s = r.features[fk] && r.features[fk].score;
      if (typeof s === 'number' && Number.isFinite(s)) count += 1;
    }
    featureCoverage[fk] = {
      count,
      coveragePctAmongSuccesses: percent(count, successes)
    };
  }

  // extremes
  function topBottom(featureKey, n) {
    const arr = rows
      .map((r) => ({
        title: r.title,
        artist: r.artist,
        isrc: r.isrc,
        recordingId: r.recordingId,
        score: r.features[featureKey] ? r.features[featureKey].score : null
      }))
      .filter((x) => typeof x.score === 'number' && Number.isFinite(x.score))
      .sort((a, b) => a.score - b.score);

    return {
      lowest: arr.slice(0, n),
      highest: arr.slice(Math.max(0, arr.length - n)).reverse()
    };
  }

  const extremes = {
    energy_score_v1: topBottom('energy_score_v1', 10),
    brightness_score_v1: topBottom('brightness_score_v1', 10),
    pulse_score_v1: topBottom('pulse_score_v1', 10),
    vocal_presence_score_v1: topBottom('vocal_presence_score_v1', 10),
    density_score_v1: topBottom('density_score_v1', 10)
  };

  // Report
  const reportPath = path.join(reportDir, '005_generate_feature_scores.md');

  const coverageRows = Object.entries(featureCoverage).map(([k, v]) => [k, v.count, v.coveragePctAmongSuccesses + '%']);

  const formulaRows = Object.values(FEATURE_DEFINITIONS).map((d) => [
    d.featureName,
    (d.contributors || []).join(', ')
  ]);

  const reportMd = `# 005 Generate Feature Scores (Composite Feature Research)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${total}\n` +
    `- Successful payloads: ${successes}\n` +
    `- Failed payloads: ${failures}\n\n` +
    `## Feature Formulas (Exploratory)\n\n` +
    `These formulas are experimental composites built from Music Story descriptors. They appear useful for research, but they do not represent validated semantics or final mapping.\n\n` +
    markdownTable(['Feature', 'Descriptor contributors'], formulaRows) +
    `\n\n` +
    `## Normalization Assumptions\n\n` +
    `- Method: dataset min-max scaling per descriptor (computed from successful payloads only).\n` +
    `- Scores are clamped to [0, 1].\n` +
    `- Missing descriptors are handled gracefully; contributor metadata records what was used.\n\n` +
    `## Feature Coverage (Observed)\n\n` +
    markdownTable(['Feature', 'Count', 'Coverage among successes'], coverageRows) +
    `\n\n` +
    `## Extremes (Observed, for later human sanity-review)\n\n` +
    `This section lists the highest/lowest scoring songs per feature. These extremes may help manual validation, but do not imply semantic truth.\n\n` +
    `## Warnings\n\n` +
    '```json\n' + JSON.stringify(dataset.warnings, null, 2) + '\n```\n\n' +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), jsonOutPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), csvOutPath)}\n`;

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[005] Feature score generation complete');
  console.log(`- ${jsonOutPath}`);
  console.log(`- ${csvOutPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
