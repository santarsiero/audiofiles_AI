const fs = require('fs');
const path = require('path');

const { normalizeFromDescriptors } = require('../../src/features/normalize');
const { scoreAlignedLabels, surfaceAlignedLabels } = require('../../src/mapping/labelScorer');
const { buildRuntimeAlignmentOutput } = require('../../src/pipeline/processSong');

const DEFAULT_SOURCE = path.join(
  __dirname,
  '..',
  'outputs',
  'musicstory_successes_only.json'
);

const DEFAULT_OUT_JSON = path.join(__dirname, '..', 'outputs', 'calibration_analysis.json');
const DEFAULT_OUT_MD = path.join(__dirname, '..', 'reports', 'calibration_analysis_report.md');

const ACTIVE_LABELS = [
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
];

const INVERSE_LABELS = [
  { base: 'dense', inverse: 'sparse' },
  { base: 'energetic', inverse: 'calm' },
  { base: 'heavy', inverse: 'light' }
];

const DIMENSION_KEYS = [
  'energy',
  'pulse',
  'brightness',
  'density',
  'vocal_presence',
  'speech',
  'valence',
  'punch'
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function clamp01(x) {
  if (typeof x !== 'number' || !Number.isFinite(x)) return null;
  return Math.max(0, Math.min(1, x));
}

function pct(x) {
  if (x === null || x === undefined) return '—';
  const n = typeof x === 'number' ? x : Number(x);
  if (!Number.isFinite(n)) return '—';
  return n.toFixed(2);
}

function asArray(x) {
  return Array.isArray(x) ? x : [];
}

function pickSongIdentity(row) {
  return {
    title: (row && row.title) || null,
    artist: (row && row.artist) || null,
    isrc: (row && row.isrc) || null,
    spotify_id: (row && row.spotify_id) || null,
    apple_id: (row && row.apple_id) || null,
    inputMusicStoryRecordingId:
      row && Object.prototype.hasOwnProperty.call(row, 'inputMusicStoryRecordingId')
        ? row.inputMusicStoryRecordingId
        : null,
    providerRecordingId:
      row && Object.prototype.hasOwnProperty.call(row, 'providerRecordingId') ? row.providerRecordingId : null
  };
}

function extractInputSongs(sourceJson, fallbackSampleCount) {
  // Format A: consolidated successes cache: { rows: [...] }
  if (sourceJson && Array.isArray(sourceJson.rows)) {
    const rows = sourceJson.rows;
    const wanted =
      Number.isFinite(fallbackSampleCount) && fallbackSampleCount > 0
        ? Math.min(fallbackSampleCount, rows.length)
        : Math.min(8, rows.length);
    return rows.slice(0, wanted).map((r) => ({
      songIdentity: pickSongIdentity(r),
      payload: r && r.rawDescriptorData && typeof r.rawDescriptorData === 'object' ? r.rawDescriptorData : null,
      calibration: null
    }));
  }

  // Format B: joined calibration set: { matched: [{ calibration, cache }, ...] }
  if (sourceJson && Array.isArray(sourceJson.matched)) {
    return sourceJson.matched.map((m) => {
      const c = m && m.cache && typeof m.cache === 'object' ? m.cache : null;
      const calib = m && m.calibration && typeof m.calibration === 'object' ? m.calibration : null;
      return {
        songIdentity: pickSongIdentity(c || {}),
        payload: c && c.rawDescriptorData && typeof c.rawDescriptorData === 'object' ? c.rawDescriptorData : null,
        calibration: calib
      };
    });
  }

  return [];
}

// First-pass state model: optimized for human inspection.
// - confidence < 0.60 => UNCERTAIN (too low to trust)
// - confidence >= 0.60:
//    - score >= 0.65 => SUPPORTED
//    - score <= 0.35 => REJECTED
//    - else => UNCERTAIN
function labelState(score, confidence) {
  const s = clamp01(score);
  const c = clamp01(confidence);

  if (c === null || s === null) return 'UNCERTAIN';
  if (c < 0.6) return 'UNCERTAIN';
  if (s >= 0.65) return 'SUPPORTED';
  if (s <= 0.35) return 'REJECTED';
  return 'UNCERTAIN';
}

function byLabelId(labels) {
  const m = new Map();
  for (const l of asArray(labels)) {
    if (l && l.labelId) m.set(l.labelId, l);
  }
  return m;
}

function formatSuppression(label) {
  if (!label) return null;
  if (!label.suppressed) return null;
  const reasons = asArray(label.suppressionReasons).filter(Boolean);
  if (reasons.length) return reasons.join('; ');
  return 'suppressed';
}

function evaluateSongFromPayload({ songIdentity, payload, calibration }) {
  const { normalizedFeatures, dimensionObjects, analysis } = normalizeFromDescriptors({
    musicStory: { provider: 'music_story', available: true, data: payload },
    acousticBrainz: { provider: 'acousticbrainz', available: false, data: null }
  });

  const alignedLabels = scoreAlignedLabels(dimensionObjects, analysis);
  const surfacing = surfaceAlignedLabels({ alignedLabels, dimensionObjects });

  analysis.warnings = Array.isArray(analysis.warnings) ? analysis.warnings : [];
  analysis.warnings.push(...(surfacing.warnings || []));

  const runtimeOut = buildRuntimeAlignmentOutput({
    songIdentity,
    rawSources: { musicStory: payload },
    normalizedFeatures,
    aiLabels: [],
    dimensionObjects,
    surfacing,
    analysis
  });

  const nonSurfaced = asArray(runtimeOut.analysis && runtimeOut.analysis.nonSurfacedLabels);
  const denseNonSurfaced = nonSurfaced.find((l) => l && l.labelId === 'dense') || null;
  const sparseNonSurfaced = nonSurfaced.find((l) => l && l.labelId === 'sparse') || null;

  const alignedMap = byLabelId(alignedLabels);
  const activeEvaluations = ACTIVE_LABELS.map((labelId) => {
    const l = alignedMap.get(labelId) || null;
    const score = l ? l.score : null;
    const confidence = l ? l.confidence : null;
    return {
      labelId,
      score,
      confidence,
      state: labelState(score, confidence),
      suppressed: Boolean(l && l.suppressed),
      suppressionReason: formatSuppression(l)
    };
  });

  const inverseEvaluations = INVERSE_LABELS.map(({ base, inverse }) => {
    const baseLabel = alignedMap.get(base) || null;
    const baseScore = baseLabel ? baseLabel.score : null;
    const invScore = baseScore === null || baseScore === undefined ? null : clamp01(1 - baseScore);
    const confidence = baseLabel ? baseLabel.confidence : null;

    return {
      labelId: inverse,
      baseLabelId: base,
      score: invScore,
      confidence,
      state: labelState(invScore, confidence)
    };
  });

  const surfaced = asArray(runtimeOut.labels).map((l) => ({
    labelId: l.labelId,
    score: l.score,
    confidence: l.confidence
  }));

  const dims = {};
  for (const k of DIMENSION_KEYS) {
    dims[k] = runtimeOut.dimensions && runtimeOut.dimensions[k] ? runtimeOut.dimensions[k] : null;
  }

  return {
    songIdentity,
    calibration: calibration || null,
    expectedLabels: asArray(calibration && calibration.expectedLabels).filter(Boolean),
    surfacedLabels: surfaced,
    activeLabelAnalysis: activeEvaluations,
    inverseLabelAnalysis: inverseEvaluations,
    dimensions: dims,
    warnings: asArray(runtimeOut.analysis && runtimeOut.analysis.warnings),
    deferred: {
      dense: denseNonSurfaced,
      sparse: sparseNonSurfaced
    }
  };
}

function mdEscape(s) {
  return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function mdTable(headers, rows) {
  const h = `| ${headers.map(mdEscape).join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map((r) => `| ${r.map(mdEscape).join(' | ')} |`).join('\n');
  return [h, sep, body].filter(Boolean).join('\n');
}

function countSurfacedLabels(songs) {
  const counts = {};
  for (const id of ACTIVE_LABELS) counts[id] = 0;
  for (const s of songs) {
    for (const l of asArray(s && s.surfacedLabels)) {
      if (l && l.labelId && Object.prototype.hasOwnProperty.call(counts, l.labelId)) counts[l.labelId] += 1;
    }
  }
  return counts;
}

function expectedVsSurfaced(songs) {
  const byLabel = {};
  for (const id of ACTIVE_LABELS) byLabel[id] = { expected: 0, surfaced: 0, falseNegatives: 0, falsePositives: 0 };

  for (const s of songs) {
    const expected = new Set(asArray(s && s.expectedLabels));
    const surfaced = new Set(asArray(s && s.surfacedLabels).map((l) => (l ? l.labelId : null)).filter(Boolean));

    for (const id of ACTIVE_LABELS) {
      const exp = expected.has(id);
      const surf = surfaced.has(id);
      if (exp) byLabel[id].expected += 1;
      if (surf) byLabel[id].surfaced += 1;
      if (exp && !surf) byLabel[id].falseNegatives += 1;
      if (!exp && surf) byLabel[id].falsePositives += 1;
    }
  }

  return byLabel;
}

function parseSampleCount(arg, totalAvailable) {
  if (!arg) return totalAvailable;
  const s = String(arg).trim().toLowerCase();
  if (s === 'all') return totalAvailable;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return totalAvailable;
  return Math.min(Math.floor(n), totalAvailable);
}

function buildMarkdown({ meta, songs, stateDefinitions, knownLimitations, nextStep, filesCreated, filesModified }) {
  const lines = [];

  const surfacedCounts = countSurfacedLabels(songs);
  const evs = expectedVsSurfaced(songs);
  const noSurfaced = songs.filter((s) => !asArray(s && s.surfacedLabels).length);
  const energeticSurfaced = songs.filter((s) => asArray(s && s.surfacedLabels).some((l) => l && l.labelId === 'energetic'));

  const denseSurfaced = songs.filter((s) => asArray(s && s.surfacedLabels).some((l) => l && l.labelId === 'dense'));
  const sparseSurfaced = songs.filter((s) => asArray(s && s.surfacedLabels).some((l) => l && l.labelId === 'sparse'));
  const denseDeferred = songs.filter(
    (s) =>
      s &&
      s.deferred &&
      s.deferred.dense &&
      asArray(s.deferred.dense.nonSurfacedReasons).includes('deferred_label')
  );
  const sparseDeferred = songs.filter(
    (s) =>
      s &&
      s.deferred &&
      s.deferred.sparse &&
      asArray(s.deferred.sparse.nonSurfacedReasons).includes('deferred_label')
  );

  lines.push('# Calibration Analysis Reporting Layer');
  lines.push('');

  lines.push('## Summary');
  lines.push('');
  lines.push('- Offline-only run (no network calls).');
  lines.push(`- Total songs processed: ${meta.songCount}`);
  lines.push(`- Songs with no surfaced labels: ${noSurfaced.length}`);
  lines.push(`- Songs with energetic surfaced: ${energeticSurfaced.length}`);
  lines.push('');

  lines.push('## Surfaced label counts');
  lines.push('');
  lines.push(mdTable(
    ['label', 'surfacedCount'],
    ACTIVE_LABELS.map((id) => [id, String(surfacedCounts[id] || 0)])
  ));
  lines.push('');

  lines.push('## Expected vs surfaced summary');
  lines.push('');
  lines.push(mdTable(
    ['label', 'expected', 'surfaced', 'falseNegatives', 'falsePositives'],
    ACTIVE_LABELS.map((id) => {
      const r = evs[id];
      return [id, String(r.expected), String(r.surfaced), String(r.falseNegatives), String(r.falsePositives)];
    })
  ));
  lines.push('');

  lines.push('## False negatives by label');
  lines.push('');
  lines.push(mdTable(
    ['label', 'falseNegatives'],
    ACTIVE_LABELS.map((id) => [id, String(evs[id].falseNegatives)])
  ));
  lines.push('');

  lines.push('## False positives by label');
  lines.push('');
  lines.push(mdTable(
    ['label', 'falsePositives'],
    ACTIVE_LABELS.map((id) => [id, String(evs[id].falsePositives)])
  ));
  lines.push('');

  lines.push('## Songs with no surfaced labels');
  lines.push('');
  if (!noSurfaced.length) {
    lines.push('- (none)');
  } else {
    lines.push(mdTable(
      ['artist', 'title', 'isrc'],
      noSurfaced.map((s) => [s.songIdentity.artist, s.songIdentity.title, s.songIdentity.isrc])
    ));
  }
  lines.push('');

  lines.push('## Songs with energetic surfaced');
  lines.push('');
  if (!energeticSurfaced.length) {
    lines.push('- (none)');
  } else {
    lines.push(mdTable(
      ['artist', 'title', 'isrc', 'score', 'confidence'],
      energeticSurfaced.map((s) => {
        const l = asArray(s.surfacedLabels).find((x) => x && x.labelId === 'energetic');
        return [s.songIdentity.artist, s.songIdentity.title, s.songIdentity.isrc, pct(l && l.score), pct(l && l.confidence)];
      })
    ));
  }
  lines.push('');

  lines.push('## Dense/sparse deferral status');
  lines.push('');
  lines.push(`- dense surfaced count: ${denseSurfaced.length}`);
  lines.push(`- sparse surfaced count: ${sparseSurfaced.length}`);
  lines.push(`- dense present in nonSurfacedLabels with reason deferred_label: ${denseDeferred.length}`);
  lines.push(`- sparse present in nonSurfacedLabels with reason deferred_label: ${sparseDeferred.length}`);
  lines.push('');
  lines.push('Notes:');
  lines.push('- dense/sparse must not appear in surfaced runtime labels.');
  lines.push('- If present internally, they should appear only in analysis nonSurfacedLabels with reason deferred_label.');
  lines.push('');

  lines.push('## Run metadata');
  lines.push('');
  lines.push(`- Generated at: ${meta.generatedAt}`);
  lines.push(`- Source: ${meta.sourcePath}`);
  lines.push(`- Songs analyzed: ${meta.songCount}`);
  lines.push('');

  lines.push('## Files');
  lines.push('');
  lines.push('### Files modified');
  lines.push('');
  if (filesModified.length === 0) lines.push('- (none)');
  for (const f of filesModified) lines.push(`- ${f}`);
  lines.push('');

  lines.push('### Files created');
  lines.push('');
  for (const f of filesCreated) lines.push(`- ${f}`);
  lines.push('');

  lines.push('## State definitions');
  lines.push('');
  for (const l of stateDefinitions) lines.push(`- ${l}`);
  lines.push('');

  lines.push('## Report structure');
  lines.push('');
  lines.push('- Per-song: identity, surfaced labels, active label analysis (all active labels), inverse label analysis (experimental), and core dimensions.');
  lines.push('');

  lines.push('## Songs');
  lines.push('');

  for (const s of songs) {
    const titleArtist = `${s.songIdentity.artist || 'Unknown Artist'} - ${s.songIdentity.title || 'Unknown Title'}`;
    lines.push(`### ${titleArtist}`);
    lines.push('');

    lines.push('#### Song Identity');
    lines.push('');
    lines.push(mdTable(
      ['field', 'value'],
      [
        ['title', s.songIdentity.title],
        ['artist', s.songIdentity.artist],
        ['isrc', s.songIdentity.isrc],
        ['spotify_id', s.songIdentity.spotify_id],
        ['apple_id', s.songIdentity.apple_id],
        ['inputMusicStoryRecordingId', s.songIdentity.inputMusicStoryRecordingId],
        ['providerRecordingId', s.songIdentity.providerRecordingId]
      ]
    ));
    lines.push('');

    lines.push('#### Surfaced Labels');
    lines.push('');
    if (!s.surfacedLabels.length) {
      lines.push('- (none)');
    } else {
      lines.push(mdTable(
        ['label', 'score', 'confidence'],
        s.surfacedLabels.map((l) => [l.labelId, pct(l.score), pct(l.confidence)])
      ));
    }
    lines.push('');

    lines.push('#### Active Label Analysis');
    lines.push('');
    lines.push(mdTable(
      ['label', 'score', 'confidence', 'state', 'suppressed', 'suppressionReason'],
      s.activeLabelAnalysis.map((l) => [
        l.labelId,
        pct(l.score),
        pct(l.confidence),
        l.state,
        l.suppressed ? 'true' : 'false',
        l.suppressionReason || ''
      ])
    ));
    lines.push('');

    lines.push('#### Experimental Inverse Label Analysis');
    lines.push('');
    lines.push(mdTable(
      ['label', 'baseLabel', 'score', 'confidence', 'state'],
      s.inverseLabelAnalysis.map((l) => [l.labelId, l.baseLabelId, pct(l.score), pct(l.confidence), l.state])
    ));
    lines.push('');

    lines.push('#### Dimension Analysis');
    lines.push('');
    lines.push(mdTable(
      ['dimension', 'score', 'confidence', 'usable'],
      DIMENSION_KEYS.map((k) => {
        const d = s.dimensions[k];
        return [k, pct(d && d.score), pct(d && d.confidence), d && typeof d.usable === 'boolean' ? String(d.usable) : ''];
      })
    ));
    lines.push('');

    if (s.warnings.length) {
      lines.push('#### Warnings');
      lines.push('');
      for (const w of s.warnings) lines.push(`- ${w}`);
      lines.push('');
    }
  }

  lines.push('## Validation results');
  lines.push('');
  lines.push('- Generated Markdown report and JSON output without network calls.');
  lines.push(`- Confirmed active labels included: ${ACTIVE_LABELS.join(', ')}`);
  lines.push(`- Confirmed inverse labels included: ${INVERSE_LABELS.map((x) => x.inverse).join(', ')}`);
  lines.push('');

  lines.push('## Known limitations');
  lines.push('');
  for (const l of knownLimitations) lines.push(`- ${l}`);
  lines.push('');

  lines.push('## Next recommended step');
  lines.push('');
  lines.push(nextStep);
  lines.push('');

  return lines.join('\n');
}

function main() {
  const sourcePath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_SOURCE;
  const outJsonPath = process.argv[4] ? path.resolve(process.argv[4]) : DEFAULT_OUT_JSON;
  const outMdPath = process.argv[5] ? path.resolve(process.argv[5]) : DEFAULT_OUT_MD;

  const source = readJson(sourcePath);
  const allInputs = extractInputSongs(source, null);
  const sampleCount = parseSampleCount(process.argv[3], allInputs.length);
  const inputs = allInputs.slice(0, sampleCount);

  const songs = [];
  const errors = [];

  for (let i = 0; i < inputs.length; i += 1) {
    const inp = inputs[i];
    const songIdentity = inp.songIdentity;
    const payload = inp.payload;

    if (!payload) {
      errors.push({ index: i, songIdentity, error: 'missing rawDescriptorData' });
      continue;
    }

    try {
      const out = evaluateSongFromPayload({ songIdentity, payload, calibration: inp.calibration });
      songs.push(out);
    } catch (e) {
      errors.push({ index: i, songIdentity, error: String(e && e.message ? e.message : e) });
    }
  }

  const meta = {
    generatedAt: new Date().toISOString(),
    sourcePath,
    songCount: songs.length,
    requestedSampleCount: inputs.length,
    errors
  };

  const stateDefinitions = [
    '`SUPPORTED`: confidence >= 0.60 AND score >= 0.65',
    '`REJECTED`: confidence >= 0.60 AND score <= 0.35',
    '`UNCERTAIN`: confidence < 0.60 OR (0.35 < score < 0.65)'
  ];

  const filesCreated = [
    'audiofile-ai/experimentation/scripts/run_calibration_analysis_reporting.js',
    outJsonPath,
    outMdPath
  ];

  const filesModified = [];

  const knownLimitations = [
    'Inverse labels are computed as score = 1 - baseLabel.score and share the base label confidence (first-pass heuristic).',
    'State thresholds are intentionally simple and may be refined after human review.',
    'Selection is currently the first N songs in the input file (not randomized).'
  ];

  const nextStep = 'Rerun calibration report after dense deferral and energetic threshold adjustment.';

  ensureDir(path.dirname(outJsonPath));
  ensureDir(path.dirname(outMdPath));

  writeJson(outJsonPath, {
    meta,
    config: {
      activeLabels: ACTIVE_LABELS,
      inverseLabels: INVERSE_LABELS,
      dimensions: DIMENSION_KEYS,
      stateDefinitions
    },
    songs
  });

  const md = buildMarkdown({
    meta,
    songs,
    stateDefinitions,
    knownLimitations,
    nextStep,
    filesCreated,
    filesModified
  });

  fs.writeFileSync(outMdPath, md + '\n');

  console.log('[calibration_analysis] wrote:');
  console.log('-', outJsonPath);
  console.log('-', outMdPath);
  console.log('songs:', songs.length);
  if (errors.length) console.log('errors:', errors.length);
}

main();
