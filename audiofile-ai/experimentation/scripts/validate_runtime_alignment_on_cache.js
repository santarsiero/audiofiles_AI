const fs = require('fs');
const path = require('path');

const { normalizeFromDescriptors } = require('../../src/features/normalize');
const { scoreAlignedLabels, surfaceAlignedLabels } = require('../../src/mapping/labelScorer');
const { buildRuntimeAlignmentOutput } = require('../../src/pipeline/processSong');

const CACHE_DIR = path.resolve(__dirname, '../../baseline/data/musicstory');
const OUT_JSON = path.resolve(__dirname, '../outputs/runtime_alignment/final_runtime_alignment_validation.json');
const OUT_MD = path.resolve(__dirname, '../reports/final_runtime_alignment_validation_report.md');

const EXPECTED_DIM_KEYS = [
  'energy',
  'pulse',
  'brightness',
  'density',
  'vocal_presence',
  'speech',
  'valence',
  'punch'
];

const ACTIVE_LABELS = new Set([
  'energetic',
  'driving',
  'steady',
  'bouncy',
  'heavy',
  'punchy',
  'vocal',
  'instrumental',
  'speech',
  'hypnotic'
]);

const DEFERRED_LABELS = new Set([
  'calm',
  'aggressive',
  'syncopated',
  'bright',
  'dark',
  'dense',
  'sparse',
  'layered',
  'low_energy',
  'very_high_energy',
  'floating',
  'airy',
  'builds',
  'drops',
  'breakdowns',
  'climaxes',
  'transitions',
  'emotional_arcs',
  'structural_evolution'
]);

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function listCacheFiles(cacheDir) {
  return fs
    .readdirSync(cacheDir)
    .filter((f) => f.endsWith('.json'))
    .filter((f) => f.includes('musicstory'))
    .filter((f) => !f.includes('control'))
    .map((f) => path.join(cacheDir, f))
    .sort();
}

function isSuccessful(r) {
  return (
    r &&
    r.musicStory &&
    r.musicStory.provider === 'music_story' &&
    r.musicStory.available === true &&
    r.musicStory.data &&
    typeof r.musicStory.data === 'object'
  );
}

function mean(nums) {
  const xs = nums.filter((n) => typeof n === 'number' && Number.isFinite(n));
  if (xs.length === 0) return null;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function validateOne(out) {
  const failures = [];

  for (const k of ['songIdentity', 'provider', 'pipelineVersion', 'dimensions', 'labels', 'analysis', 'versions']) {
    if (!(k in out)) failures.push({ type: 'schema', message: `missing root:${k}` });
  }

  const dimKeys = Object.keys(out.dimensions || {}).sort();
  const expected = [...EXPECTED_DIM_KEYS].sort();
  if (JSON.stringify(dimKeys) !== JSON.stringify(expected)) {
    failures.push({ type: 'schema', message: `dimensions keys mismatch: ${dimKeys.join(',')}` });
  }

  for (const k of EXPECTED_DIM_KEYS) {
    const d = out.dimensions && out.dimensions[k];
    if (!d) {
      failures.push({ type: 'dimension', message: `missing dimension:${k}` });
      continue;
    }
    for (const f of ['score', 'confidence', 'evidence', 'missing', 'usable']) {
      if (!(f in d)) failures.push({ type: 'dimension', message: `dimension ${k} missing:${f}` });
    }
    const c = d.confidence;
    if (typeof c !== 'number' || !Number.isFinite(c) || c < 0 || c > 1) {
      failures.push({ type: 'dimension', message: `dimension ${k} confidence invalid:${c}` });
    }
  }

  const caps = { density: 0.7, vocal_presence: 0.75, punch: 0.7 };
  for (const [k, cap] of Object.entries(caps)) {
    const d = out.dimensions && out.dimensions[k];
    if (d && typeof d.confidence === 'number' && d.confidence > cap + 1e-9) {
      failures.push({ type: 'dimension', message: `cap violated ${k}:${d.confidence}` });
    }
  }

  if (!Array.isArray(out.labels)) failures.push({ type: 'label', message: 'labels not array' });
  if (Array.isArray(out.labels)) {
    if (out.labels.length > 5) failures.push({ type: 'label', message: `surfaced > 5: ${out.labels.length}` });
    for (const l of out.labels) {
      if (!l || typeof l !== 'object') {
        failures.push({ type: 'label', message: 'label not object' });
        continue;
      }
      if (l.suppressed) failures.push({ type: 'label', message: `suppressed label surfaced:${l.labelId}` });
      if (typeof l.confidence !== 'number' || l.confidence < 0.6) failures.push({ type: 'label', message: `surfaced <0.60:${l.labelId}:${l.confidence}` });
      if (DEFERRED_LABELS.has(l.labelId)) failures.push({ type: 'label', message: `deferred surfaced:${l.labelId}` });
      if (!ACTIVE_LABELS.has(l.labelId)) failures.push({ type: 'label', message: `unknown label surfaced:${l.labelId}` });
    }
  }

  if (out.analysis && typeof out.analysis === 'object') {
    for (const k of [
      'missingDescriptors',
      'missingDimensions',
      'lowConfidenceDimensions',
      'suppressedLabels',
      'nonSurfacedLabels',
      'alignedLabels',
      'surfacedLabels',
      'warnings'
    ]) {
      if (!(k in out.analysis)) failures.push({ type: 'analysis', message: `analysis missing:${k}` });
      if (k in out.analysis && !Array.isArray(out.analysis[k])) failures.push({ type: 'analysis', message: `analysis not array:${k}` });
    }
  } else {
    failures.push({ type: 'analysis', message: 'analysis missing or not object' });
  }

  if (out.versions && typeof out.versions === 'object') {
    for (const k of ['ontologyVersion', 'semanticCompositionVersion', 'runtimeAlignmentVersion']) {
      if (!(k in out.versions)) failures.push({ type: 'versions', message: `versions missing:${k}` });
    }
  } else {
    failures.push({ type: 'versions', message: 'versions missing or not object' });
  }

  return failures;
}

function makeRuntimeOutput({ songIdentity, payload }) {
  const { normalizedFeatures, dimensionObjects, analysis } = normalizeFromDescriptors({
    musicStory: { provider: 'music_story', available: true, data: payload },
    acousticBrainz: { provider: 'acousticbrainz', available: false, data: null }
  });
  const aligned = scoreAlignedLabels(dimensionObjects, analysis);
  const surfacing = surfaceAlignedLabels({ alignedLabels: aligned, dimensionObjects });
  analysis.warnings = Array.isArray(analysis.warnings) ? analysis.warnings : [];
  analysis.warnings.push(...(surfacing.warnings || []));

  return buildRuntimeAlignmentOutput({
    songIdentity,
    rawSources: { musicStory: payload },
    normalizedFeatures,
    aiLabels: [],
    dimensionObjects,
    surfacing,
    analysis
  });
}

function initStats() {
  const dims = {};
  for (const k of EXPECTED_DIM_KEYS) {
    dims[k] = { scores: [], confs: [], usable: 0, unusable: 0, missingScore: 0, lowConf: 0 };
  }
  const labels = {};
  for (const id of ACTIVE_LABELS) labels[id] = { surfaced: 0, confs: [] };
  return { dims, labels };
}

function updateStats(stats, out) {
  for (const k of EXPECTED_DIM_KEYS) {
    const d = out.dimensions[k];
    if (typeof d.score === 'number') stats.dims[k].scores.push(d.score);
    else stats.dims[k].missingScore += 1;
    if (typeof d.confidence === 'number') stats.dims[k].confs.push(d.confidence);
    if (d.usable) stats.dims[k].usable += 1;
    else stats.dims[k].unusable += 1;
    if (typeof d.confidence === 'number' && d.confidence < 0.4) stats.dims[k].lowConf += 1;
  }
  for (const l of out.labels) {
    if (!stats.labels[l.labelId]) continue;
    stats.labels[l.labelId].surfaced += 1;
    stats.labels[l.labelId].confs.push(l.confidence);
  }
}

function pickExample(examples, key, cand) {
  if (!examples[key]) examples[key] = cand;
}

function toMarkdown(report) {
  const lines = [];
  lines.push('# Final Runtime Alignment Validation Report');
  lines.push('');
  lines.push(`## Summary`);
  lines.push('');
  lines.push(`- **Cache source used**: \`${report.cacheSource}\``);
  lines.push(`- **Validation result**: **${report.pass ? 'PASS' : 'FAIL'}**`);
  lines.push(`- **Total cache entries inspected**: ${report.batch.totalEntries}`);
  lines.push(`- **Successful payloads found**: ${report.batch.successfulPayloads}`);
  lines.push(`- **Payloads skipped**: ${report.batch.skipped}`);
  lines.push(`- **Runtime outputs produced**: ${report.batch.outputsProduced}`);
  lines.push(`- **Runtime failures**: ${report.batch.runtimeFailures}`);
  lines.push(`- **Schema failures**: ${report.batch.schemaFailures}`);
  lines.push('');

  lines.push('## Surfacing statistics');
  lines.push('');
  lines.push(`- **Average surfaced labels/song**: ${report.surfacing.avgSurfacedPerSong.toFixed(3)}`);
  lines.push(`- **0 labels**: ${report.surfacing.count0}`);
  lines.push(`- **1–2 labels**: ${report.surfacing.count1to2}`);
  lines.push(`- **3–5 labels**: ${report.surfacing.count3to5}`);
  lines.push('');

  lines.push('## Warning statistics');
  lines.push('');
  lines.push(`- **low_dimension_coverage**: ${report.warnings.low_dimension_coverage}`);
  lines.push(`- **no_labels_surfaced**: ${report.warnings.no_labels_surfaced}`);
  lines.push('');

  lines.push('## Dimension statistics');
  lines.push('');
  lines.push('| dimension | avg_score | avg_conf | usable | unusable | missing_score | low_conf |');
  lines.push('|---|---:|---:|---:|---:|---:|---:|');
  for (const k of EXPECTED_DIM_KEYS) {
    const d = report.dimensions[k];
    lines.push(`| ${k} | ${d.avgScore === null ? 'null' : d.avgScore.toFixed(4)} | ${d.avgConfidence === null ? 'null' : d.avgConfidence.toFixed(4)} | ${d.usableCount} | ${d.unusableCount} | ${d.missingScoreCount} | ${d.lowConfidenceCount} |`);
  }
  lines.push('');

  lines.push('## Label statistics (surfaced only)');
  lines.push('');
  lines.push('| label | surfaced_count | avg_surfaced_conf |');
  lines.push('|---|---:|---:|');
  for (const id of [...ACTIVE_LABELS].sort()) {
    const l = report.labels[id];
    lines.push(`| ${id} | ${l.surfacedCount} | ${l.avgSurfacedConfidence === null ? 'null' : l.avgSurfacedConfidence.toFixed(4)} |`);
  }
  lines.push('');

  lines.push('## Example outputs');
  lines.push('');
  lines.push('### High-label-count song');
  lines.push('```json');
  lines.push(JSON.stringify(report.examples.highLabelCount, null, 2));
  lines.push('```');
  lines.push('');
  if (report.examples.abstention) {
    lines.push('### Abstention / no-label song');
    lines.push('```json');
    lines.push(JSON.stringify(report.examples.abstention, null, 2));
    lines.push('```');
    lines.push('');
  }
  if (report.examples.lowCoverage) {
    lines.push('### Low-dimension-coverage song');
    lines.push('```json');
    lines.push(JSON.stringify(report.examples.lowCoverage, null, 2));
    lines.push('```');
    lines.push('');
  }

  lines.push('## Known limitations');
  lines.push('');
  lines.push('- This validation uses cached Music Story payloads only and does not include representative semantic evaluation.');
  lines.push('');
  lines.push('## Recommended next step');
  lines.push('');
  lines.push('- Build Representative Semantic Validation Set');
  lines.push('');

  return lines.join('\n');
}

function main() {
  const cacheFiles = listCacheFiles(CACHE_DIR);
  let totalEntries = 0;
  let successfulPayloads = 0;
  let skipped = 0;
  let outputsProduced = 0;

  let runtimeFailures = 0;
  let schemaFailures = 0;
  const failures = [];

  const stats = initStats();

  const warningsCounter = { low_dimension_coverage: 0, no_labels_surfaced: 0, other: {} };
  const surfacedCountBuckets = { count0: 0, count1to2: 0, count3to5: 0, totalSurfaced: 0 };

  const examples = { highLabelCount: null, abstention: null, lowCoverage: null };

  for (const f of cacheFiles) {
    const batch = readJson(f);
    const results = Array.isArray(batch.results) ? batch.results : [];
    for (const r of results) {
      totalEntries += 1;
      if (!isSuccessful(r)) {
        skipped += 1;
        continue;
      }

      successfulPayloads += 1;

      const songIdentity = (r.musicStory && r.musicStory.songIdentity) || r.song || { title: null, artist: null, isrc: null };
      try {
        const out = makeRuntimeOutput({ songIdentity, payload: r.musicStory.data });
        outputsProduced += 1;

        const oneFailures = validateOne(out);
        if (oneFailures.length > 0) {
          schemaFailures += 1;
          failures.push({ songIdentity, failures: oneFailures });
        }

        updateStats(stats, out);

        const surfaced = Array.isArray(out.labels) ? out.labels.length : 0;
        surfacedCountBuckets.totalSurfaced += surfaced;
        if (surfaced === 0) surfacedCountBuckets.count0 += 1;
        else if (surfaced <= 2) surfacedCountBuckets.count1to2 += 1;
        else surfacedCountBuckets.count3to5 += 1;

        if (out.analysis && Array.isArray(out.analysis.warnings)) {
          for (const w of out.analysis.warnings) {
            if (w === 'low_dimension_coverage') warningsCounter.low_dimension_coverage += 1;
            else if (w === 'no_labels_surfaced') warningsCounter.no_labels_surfaced += 1;
            else {
              warningsCounter.other[w] = (warningsCounter.other[w] || 0) + 1;
            }
          }
        }

        if (!examples.highLabelCount || surfaced > (examples.highLabelCount.labels ? examples.highLabelCount.labels.length : -1)) {
          pickExample(examples, 'highLabelCount', out);
        }
        if (!examples.abstention && surfaced === 0) pickExample(examples, 'abstention', out);
        if (!examples.lowCoverage && out.analysis && Array.isArray(out.analysis.warnings) && out.analysis.warnings.includes('low_dimension_coverage')) {
          pickExample(examples, 'lowCoverage', out);
        }
      } catch (e) {
        runtimeFailures += 1;
        failures.push({ songIdentity, failures: [{ type: 'runtime', message: String(e && e.stack ? e.stack : e) }] });
      }
    }
  }

  const dimSummary = {};
  for (const k of EXPECTED_DIM_KEYS) {
    const d = stats.dims[k];
    dimSummary[k] = {
      avgScore: mean(d.scores),
      avgConfidence: mean(d.confs),
      usableCount: d.usable,
      unusableCount: d.unusable,
      missingScoreCount: d.missingScore,
      lowConfidenceCount: d.lowConf
    };
  }

  const labelSummary = {};
  for (const id of [...ACTIVE_LABELS]) {
    const l = stats.labels[id];
    labelSummary[id] = {
      surfacedCount: l.surfaced,
      avgSurfacedConfidence: mean(l.confs)
    };
  }

  const avgSurfacedPerSong = successfulPayloads === 0 ? 0 : surfacedCountBuckets.totalSurfaced / successfulPayloads;

  const report = {
    cacheSource: CACHE_DIR,
    pass: runtimeFailures === 0 && schemaFailures === 0,
    batch: {
      totalEntries,
      successfulPayloads,
      skipped,
      outputsProduced,
      runtimeFailures,
      schemaFailures
    },
    dimensions: dimSummary,
    labels: labelSummary,
    surfacing: {
      avgSurfacedPerSong,
      count0: surfacedCountBuckets.count0,
      count1to2: surfacedCountBuckets.count1to2,
      count3to5: surfacedCountBuckets.count3to5
    },
    warnings: warningsCounter,
    failures,
    examples
  };

  ensureDir(path.dirname(OUT_JSON));
  ensureDir(path.dirname(OUT_MD));
  fs.writeFileSync(OUT_JSON, JSON.stringify(report, null, 2));
  fs.writeFileSync(OUT_MD, toMarkdown(report));

  console.log(JSON.stringify({ pass: report.pass, outputsProduced, runtimeFailures, schemaFailures, outJson: OUT_JSON, outMd: OUT_MD }));

  process.exit(report.pass ? 0 : 1);
}

main();
