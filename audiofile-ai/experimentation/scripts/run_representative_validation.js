const path = require('path');

const { readJsonFile, writeJsonFile, ensureDir } = require('../utils/io');
const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');

const { normalizeFromDescriptors } = require('../../src/features/normalize');
const { scoreLabels } = require('../../src/mapping/labelScorer');
const { mappingConfig } = require('../../src/mapping/mappingConfig');

function safeLower(s) {
  return (s || '').toString().trim().toLowerCase();
}

function trackKey(artist, title) {
  return `${safeLower(artist)}|||${safeLower(title)}`;
}

function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function evidenceStrength(score, threshold) {
  if (score === null) return 0;
  const d = Math.abs(score - threshold);
  return clamp(d / 0.5, 0, 1);
}

function featureCoverage(required, normalizedFeatures) {
  if (!required || required.length === 0) return 0;
  let available = 0;
  for (const r of required) {
    if (normalizedFeatures[r] !== null && normalizedFeatures[r] !== undefined) available += 1;
  }
  return available / required.length;
}

function agreementScore(sourcesUsed) {
  if (!sourcesUsed || sourcesUsed.length === 0) return 0;
  return sourcesUsed.length >= 2 ? 1 : 0.5;
}

function computeSourceReliability(sourcesUsed) {
  let best = 0;
  for (const s of sourcesUsed || []) {
    const v = mappingConfig.confidence.sourceReliability[s];
    if (typeof v === 'number') best = Math.max(best, v);
  }
  return best;
}

function computeCandidateConfidence({ score, threshold, requiredFeatures, normalizedFeatures, sourcesUsed }) {
  const sr = computeSourceReliability(sourcesUsed);
  const fc = featureCoverage(requiredFeatures, normalizedFeatures);
  const es = evidenceStrength(score, threshold);
  const ag = agreementScore(sourcesUsed);

  const confidence = 0.45 * sr + 0.25 * fc + 0.2 * es + 0.1 * ag;
  return clamp(confidence, 0, 1);
}

function computeAllLabelDiagnostics(normalizedFeatures, analysis) {
  const sourcesUsed = (analysis && analysis.sourceCoverage && analysis.sourceCoverage.sourcesUsed) || [];

  const diagnostics = [];

  for (const [labelId, cfg] of Object.entries(mappingConfig.labels)) {
    const raw = normalizedFeatures[cfg.scoreField];
    const score = raw === null || raw === undefined ? null : cfg.invert ? clamp(1 - raw, 0, 1) : clamp(raw, 0, 1);

    const confidence = computeCandidateConfidence({
      score,
      threshold: cfg.threshold,
      requiredFeatures: cfg.requires,
      normalizedFeatures,
      sourcesUsed
    });

    const passesDirect = Boolean(cfg.direct) && score !== null && score >= cfg.threshold;
    const passesApplyRule =
      Boolean(cfg.applyRule) &&
      score !== null &&
      score >= cfg.applyRule.scoreMin &&
      confidence !== null &&
      confidence >= cfg.applyRule.confidenceMin;

    const wouldFire = passesDirect || passesApplyRule;

    const nearThreshold =
      score !== null && typeof cfg.threshold === 'number' && Math.abs(score - cfg.threshold) <= 0.05;

    const suppressedByConfidence =
      Boolean(cfg.applyRule) &&
      score !== null &&
      score >= cfg.applyRule.scoreMin &&
      !(confidence !== null && confidence >= cfg.applyRule.confidenceMin);

    const weakEvidenceCoverage = featureCoverage(cfg.requires, normalizedFeatures) < 1;

    diagnostics.push({
      labelId,
      score,
      confidence,
      threshold: cfg.threshold,
      requires: cfg.requires,
      wouldFire,
      nearThreshold,
      suppressedByConfidence,
      weakEvidenceCoverage
    });
  }

  return diagnostics;
}

function sortDimensionsDescending(normalizedFeatures) {
  const dims = Object.entries(normalizedFeatures)
    .filter(([, v]) => typeof v === 'number' && Number.isFinite(v))
    .map(([k, v]) => ({ key: k, value: v }))
    .sort((a, b) => b.value - a.value);
  return dims;
}

function pickDescriptorSubset(rawDescriptorData) {
  const keys = [
    'arousal',
    'valence',
    'vocal_instrumental',
    'music_speech',
    'danceability',
    'dissonance',
    'articulation',
    'rhythmic_stability',
    'event_density',
    'pulse_clarity',
    'bpm',
    'complexity',
    'roll_off',
    'brightness',
    'zero_cross_rate',
    'centroid',
    'spread',
    'flatness',
    'loudness',
    'absolute_loudness',
    'mfcc01'
  ];

  const out = {};
  for (const k of keys) {
    out[k] = Object.prototype.hasOwnProperty.call(rawDescriptorData || {}, k) ? rawDescriptorData[k] : null;
  }
  return out;
}

function formatValue(v) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'number') return Number.isFinite(v) ? v.toFixed(4) : String(v);
  return String(v);
}

function buildMarkdownReport(report) {
  const lines = [];
  lines.push('# Representative Track Validation (Runtime)');
  lines.push('');
  lines.push('## Dataset Context');
  lines.push('');
  lines.push(`- Tracks requested: ${report.summary.requestedCount}`);
  lines.push(`- Tracks matched to cached payloads: ${report.summary.matchedCount}`);
  lines.push(`- Tracks missing cached payloads: ${report.summary.missingCount}`);
  lines.push('');

  lines.push('## Aggregate Diagnostics');
  lines.push('');
  lines.push('### Label fire frequency');
  lines.push('');
  for (const row of report.aggregate.labelFireFrequency) {
    lines.push(`- ${row.labelId}: ${row.count}`);
  }
  lines.push('');

  lines.push('### Average confidence (fired labels only)');
  lines.push('');
  for (const row of report.aggregate.avgConfidenceFired) {
    lines.push(`- ${row.labelId}: ${formatValue(row.avgConfidence)}`);
  }
  lines.push('');

  lines.push('### Missing feature frequency');
  lines.push('');
  for (const row of report.aggregate.missingFeatureFrequency) {
    lines.push(`- ${row.feature}: ${row.count}`);
  }
  lines.push('');

  lines.push('### Conflicts');
  lines.push('');
  for (const row of report.aggregate.conflictFrequency) {
    lines.push(`- ${row.conflict}: ${row.count}`);
  }
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push('## Per-Track Validation');
  lines.push('');

  for (const t of report.tracks) {
    lines.push(`### ${t.track.artist} — ${t.track.title}`);
    lines.push('');

    if (!t.cacheHit) {
      lines.push('- Cache hit: false');
      lines.push('- Status: missing cached Music Story payload');
      lines.push('');
      continue;
    }

    lines.push('- Cache hit: true');
    if (t.cacheMeta && t.cacheMeta.batchFile) lines.push(`- Batch: ${t.cacheMeta.batchFile}`);
    if (t.cacheMeta && t.cacheMeta.providerRecordingId !== null && t.cacheMeta.providerRecordingId !== undefined) {
      lines.push(`- Provider recordingId: ${t.cacheMeta.providerRecordingId}`);
    }
    if (t.cacheMeta && t.cacheMeta.isrc) lines.push(`- ISRC: ${t.cacheMeta.isrc}`);
    lines.push('');

    lines.push('#### A) Raw descriptor evidence (subset)');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(t.rawDescriptorSubset, null, 2));
    lines.push('```');
    lines.push('');

    lines.push('#### B) Computed dimensions/features');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(t.normalizedFeatures, null, 2));
    lines.push('```');
    lines.push('');

    lines.push('#### B2) Strongest dimensions (descending)');
    lines.push('');
    for (const d of t.strongestDimensions.slice(0, 10)) {
      lines.push(`- ${d.key}: ${formatValue(d.value)}`);
    }
    lines.push('');

    lines.push('#### C) Fired labels');
    lines.push('');
    if (!t.firedLabels.length) {
      lines.push('- (none)');
    } else {
      for (const l of t.firedLabels) {
        lines.push(`- ${l.labelId}: score=${formatValue(l.score)} confidence=${formatValue(l.confidence)} conflicts=${(l.conflicts || []).join(',') || 'none'}`);
      }
    }
    lines.push('');

    lines.push('#### D) Missing evidence');
    lines.push('');
    if (!t.missingFeatures.length) {
      lines.push('- (none)');
    } else {
      for (const f of t.missingFeatures) lines.push(`- ${f}`);
    }
    lines.push('');

    lines.push('#### E) Input trace (what fed normalization)');
    lines.push('');
    lines.push('```json');
    lines.push(JSON.stringify(t.inputTrace || {}, null, 2));
    lines.push('```');
    lines.push('');

    lines.push('#### Validation diagnostics');
    lines.push('');

    const near = t.labelDiagnostics.filter((x) => x.nearThreshold);
    const suppressed = t.labelDiagnostics.filter((x) => x.suppressedByConfidence);
    const weak = t.labelDiagnostics.filter((x) => x.weakEvidenceCoverage);

    lines.push(`- Labels near threshold (+/- 0.05): ${near.length}`);
    if (near.length) {
      for (const x of near.slice(0, 15)) {
        lines.push(`  - ${x.labelId}: score=${formatValue(x.score)} threshold=${formatValue(x.threshold)}`);
      }
    }

    lines.push(`- Labels suppressed by confidence (score met, confidence did not): ${suppressed.length}`);
    if (suppressed.length) {
      for (const x of suppressed.slice(0, 15)) {
        lines.push(`  - ${x.labelId}: score=${formatValue(x.score)} conf=${formatValue(x.confidence)}`);
      }
    }

    lines.push(`- Labels with weak evidence coverage: ${weak.length}`);
    if (weak.length) {
      for (const x of weak.slice(0, 15)) {
        lines.push(`  - ${x.labelId}: requires=[${x.requires.join(', ')}] coverage<1`);
      }
    }

    lines.push('');
    if (t.track.expectedSemanticNotes) {
      lines.push('#### Expected semantic notes (input)');
      lines.push('');
      lines.push(t.track.expectedSemanticNotes);
      lines.push('');
    }
    if (t.track.expectedLabels && t.track.expectedLabels.length) {
      lines.push('#### Expected labels (input)');
      lines.push('');
      lines.push(`- ${t.track.expectedLabels.join(', ')}`);
      lines.push('');
    }
    if (t.track.comments) {
      lines.push('#### Comments (input)');
      lines.push('');
      lines.push(t.track.comments);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  return lines.join('\n');
}

function aggregateDiagnostics(trackReports) {
  const labelFire = new Map();
  const labelConfSum = new Map();
  const labelConfCount = new Map();
  const missingFeature = new Map();
  const conflictFreq = new Map();

  for (const t of trackReports) {
    if (!t.cacheHit) continue;

    for (const f of t.missingFeatures || []) {
      missingFeature.set(f, (missingFeature.get(f) || 0) + 1);
    }

    for (const l of t.firedLabels || []) {
      labelFire.set(l.labelId, (labelFire.get(l.labelId) || 0) + 1);
      if (typeof l.confidence === 'number' && Number.isFinite(l.confidence)) {
        labelConfSum.set(l.labelId, (labelConfSum.get(l.labelId) || 0) + l.confidence);
        labelConfCount.set(l.labelId, (labelConfCount.get(l.labelId) || 0) + 1);
      }

      for (const c of l.conflicts || []) {
        conflictFreq.set(c, (conflictFreq.get(c) || 0) + 1);
      }
    }
  }

  const labelFireFrequency = Array.from(labelFire.entries())
    .map(([labelId, count]) => ({ labelId, count }))
    .sort((a, b) => b.count - a.count || a.labelId.localeCompare(b.labelId));

  const avgConfidenceFired = Array.from(labelConfSum.entries())
    .map(([labelId, sum]) => {
      const c = labelConfCount.get(labelId) || 0;
      return { labelId, avgConfidence: c ? sum / c : null };
    })
    .sort((a, b) => (b.avgConfidence || 0) - (a.avgConfidence || 0) || a.labelId.localeCompare(b.labelId));

  const missingFeatureFrequency = Array.from(missingFeature.entries())
    .map(([feature, count]) => ({ feature, count }))
    .sort((a, b) => b.count - a.count || a.feature.localeCompare(b.feature));

  const conflictFrequency = Array.from(conflictFreq.entries())
    .map(([conflict, count]) => ({ conflict, count }))
    .sort((a, b) => b.count - a.count || a.conflict.localeCompare(b.conflict));

  return {
    labelFireFrequency,
    avgConfidenceFired,
    missingFeatureFrequency,
    conflictFrequency
  };
}

async function run() {
  const validationPath = path.join(__dirname, '..', 'validation', 'representative_tracks.json');
  const tracks = readJsonFile(validationPath);

  const cache = loadMusicStoryBatches();
  const successes = cache.successes;

  const byRecordingId = new Map();
  const byIsrc = new Map();
  const byTitleArtist = new Map();

  for (const e of successes) {
    if (e.providerRecordingId !== null && e.providerRecordingId !== undefined) {
      byRecordingId.set(String(e.providerRecordingId), e);
    }
    if (e.isrc) byIsrc.set(String(e.isrc), e);
    byTitleArtist.set(trackKey(e.artist, e.title), e);
  }

  const trackReports = [];

  for (const t of tracks) {
    const artist = t.artist || '';
    const title = t.title || '';

    let hit = null;
    if (t.recordingId !== null && t.recordingId !== undefined && String(t.recordingId).trim() !== '') {
      hit = byRecordingId.get(String(t.recordingId)) || null;
    }
    if (!hit && t.isrc) {
      hit = byIsrc.get(String(t.isrc)) || null;
    }
    if (!hit) {
      hit = byTitleArtist.get(trackKey(artist, title)) || null;
    }

    if (!hit) {
      trackReports.push({
        track: t,
        cacheHit: false
      });
      continue;
    }

    const musicStory = {
      provider: 'music_story',
      available: true,
      data: hit.rawDescriptorData
    };

    const { normalizedFeatures, analysis } = normalizeFromDescriptors({
      musicStory,
      acousticBrainz: { provider: 'acousticbrainz', available: false, data: null }
    });

    const firedLabels = scoreLabels(normalizedFeatures, analysis).map((l) => ({
      ...l,
      ontologyVersion: mappingConfig.versions.ontologyVersion,
      mappingVersion: mappingConfig.versions.mappingVersion
    }));

    const labelDiagnostics = computeAllLabelDiagnostics(normalizedFeatures, analysis);

    trackReports.push({
      track: t,
      cacheHit: true,
      cacheMeta: {
        batchFile: hit.batchFile,
        batchCreatedAt: hit.batchCreatedAt,
        index: hit.index,
        providerRecordingId: hit.providerRecordingId,
        isrc: hit.isrc
      },
      rawDescriptorSubset: pickDescriptorSubset(hit.rawDescriptorData),
      normalizedFeatures,
      strongestDimensions: sortDimensionsDescending(normalizedFeatures),
      firedLabels,
      missingFeatures: (analysis && Array.isArray(analysis.missingFeatures) ? analysis.missingFeatures : []).slice(),
      conflicts: firedLabels.flatMap((l) => l.conflicts || []),
      inputTrace: analysis ? analysis.inputTrace : null,
      labelDiagnostics
    });
  }

  const aggregate = aggregateDiagnostics(trackReports);

  const report = {
    generatedAt: new Date().toISOString(),
    versions: {
      ontologyVersion: mappingConfig.versions.ontologyVersion,
      mappingVersion: mappingConfig.versions.mappingVersion
    },
    cacheSummary: cache.summary,
    summary: {
      requestedCount: tracks.length,
      matchedCount: trackReports.filter((x) => x.cacheHit).length,
      missingCount: trackReports.filter((x) => !x.cacheHit).length
    },
    aggregate,
    tracks: trackReports
  };

  const outJson = path.join(__dirname, '..', 'outputs', 'representative_validation.json');
  const outMd = path.join(__dirname, '..', 'reports', 'representative_validation.md');

  ensureDir(path.dirname(outJson));
  ensureDir(path.dirname(outMd));

  writeJsonFile(outJson, report);

  const md = buildMarkdownReport({
    summary: report.summary,
    aggregate: report.aggregate,
    tracks: report.tracks
  });

  require('fs').writeFileSync(outMd, md + '\n');

  console.log('[representative_validation] wrote:');
  console.log('-', outJson);
  console.log('-', outMd);

  if (cache.warnings && cache.warnings.length) {
    console.log('[representative_validation] cache warnings:', cache.warnings.length);
  }
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
