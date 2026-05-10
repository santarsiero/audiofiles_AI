const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { writeJsonFile, writeCsvFile, ensureDir } = require('../utils/io');

function classifyFailure(errorMessage) {
  const msg = (errorMessage || '').toLowerCase();

  if (!msg) return 'other';
  if (msg.includes('no recording hit')) return 'no_recording_hit';
  if (msg.includes('status 404') || msg.includes('404')) return 'audiodescriptions_404';
  if (msg.includes('status 429') || msg.includes('rate limit') || msg.includes('429')) return 'rate_limited_429';
  return 'other';
}

function isrcPrefix(isrc) {
  if (!isrc || typeof isrc !== 'string') return null;
  const s = isrc.trim();
  if (s.length < 2) return null;
  return s.slice(0, 2).toUpperCase();
}

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

async function run() {
  const dataset = loadMusicStoryBatches();

  const outBase = path.join(__dirname, '..', 'outputs', 'coverage');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  if (dataset.summary.usableFilesLoaded === 0) {
    console.error('[001] No usable batch files were loaded.');
    console.error(JSON.stringify(dataset.warnings, null, 2));
    process.exitCode = 1;
    return;
  }

  const total = dataset.all.length;
  const successes = dataset.successes.length;
  const failures = dataset.failures.length;

  const byBatch = {};
  for (const b of dataset.batches) {
    const bTotal = b.entries.length;
    const bSuccess = b.entries.filter((e) => e.hasDescriptorData).length;
    const bFail = bTotal - bSuccess;
    byBatch[b.batchFile] = {
      total: bTotal,
      successes: bSuccess,
      failures: bFail,
      successRate: bTotal ? Number((bSuccess / bTotal).toFixed(4)) : 0
    };
  }

  const failureByError = {};
  const failureByType = {
    no_recording_hit: 0,
    audiodescriptions_404: 0,
    rate_limited_429: 0,
    other: 0
  };

  for (const e of dataset.failures) {
    const err = e.providerError || '';
    failureByError[err] = (failureByError[err] || 0) + 1;
    const t = classifyFailure(err);
    failureByType[t] += 1;
  }

  const withInputId = dataset.all.filter(
    (e) => e.inputMusicStoryRecordingId !== null && e.inputMusicStoryRecordingId !== undefined
  );
  const withoutInputId = dataset.all.filter(
    (e) => e.inputMusicStoryRecordingId === null || e.inputMusicStoryRecordingId === undefined
  );

  const successWithInputId = withInputId.filter((e) => e.hasDescriptorData).length;
  const successWithoutInputId = withoutInputId.filter((e) => e.hasDescriptorData).length;

  const byIsrcPrefix = {};
  for (const e of dataset.all) {
    const pfx = isrcPrefix(e.isrc) || 'UNKNOWN';
    if (!byIsrcPrefix[pfx]) {
      byIsrcPrefix[pfx] = { total: 0, successes: 0, failures: 0 };
    }
    byIsrcPrefix[pfx].total += 1;
    if (e.hasDescriptorData) byIsrcPrefix[pfx].successes += 1;
    else byIsrcPrefix[pfx].failures += 1;
  }

  const coverageSummary = {
    generatedAt: new Date().toISOString(),
    dataset: {
      filesLoaded: dataset.summary.filesLoaded,
      usableFilesLoaded: dataset.summary.usableFilesLoaded,
      totalEntries: total,
      successes,
      failures,
      successRate: total ? Number((successes / total).toFixed(4)) : 0,
      failureRate: total ? Number((failures / total).toFixed(4)) : 0
    },
    duplicates: {
      duplicateIsrcCount: dataset.summary.duplicateIsrcCount,
      duplicateRecordingIdCount: dataset.summary.duplicateRecordingIdCount,
      duplicateTitleArtistCount: dataset.summary.duplicateTitleArtistCount
    },
    byBatch,
    failuresByError: failureByError,
    failuresByType: failureByType,
    inputRecordingId: {
      totalWithInputId: withInputId.length,
      successesWithInputId: successWithInputId,
      failuresWithInputId: withInputId.length - successWithInputId,
      successRateWithInputId: withInputId.length
        ? Number((successWithInputId / withInputId.length).toFixed(4))
        : 0,
      totalWithoutInputId: withoutInputId.length,
      successesWithoutInputId: successWithoutInputId,
      failuresWithoutInputId: withoutInputId.length - successWithoutInputId,
      successRateWithoutInputId: withoutInputId.length
        ? Number((successWithoutInputId / withoutInputId.length).toFixed(4))
        : 0
    },
    byIsrcPrefix
  };

  const failuresCsvPath = path.join(outBase, 'failures.csv');
  const successesCsvPath = path.join(outBase, 'successes.csv');

  writeCsvFile(
    failuresCsvPath,
    [
      'batchFile',
      'batchCreatedAt',
      'index',
      'title',
      'artist',
      'isrc',
      'spotify_id',
      'apple_id',
      'inputMusicStoryRecordingId',
      'providerError',
      'providerRecordingId',
      'failureType'
    ],
    dataset.failures.map((e) => ({
      ...e,
      failureType: classifyFailure(e.providerError)
    }))
  );

  writeCsvFile(
    successesCsvPath,
    [
      'batchFile',
      'batchCreatedAt',
      'index',
      'title',
      'artist',
      'isrc',
      'spotify_id',
      'apple_id',
      'inputMusicStoryRecordingId',
      'providerRecordingId'
    ],
    dataset.successes.map((e) => ({
      batchFile: e.batchFile,
      batchCreatedAt: e.batchCreatedAt,
      index: e.index,
      title: e.title,
      artist: e.artist,
      isrc: e.isrc,
      spotify_id: e.spotify_id,
      apple_id: e.apple_id,
      inputMusicStoryRecordingId: e.inputMusicStoryRecordingId,
      providerRecordingId: e.providerRecordingId
    }))
  );

  const summaryPath = path.join(outBase, 'coverage_summary.json');
  writeJsonFile(summaryPath, coverageSummary);

  const reportPath = path.join(reportDir, '001_coverage_analysis.md');

  const batchRows = Object.entries(byBatch).map(([bf, v]) => [
    bf,
    v.total,
    v.successes,
    v.failures,
    percent(v.successes, v.total) + '%'
  ]);

  const failureTypeRows = Object.entries(failureByType)
    .sort((a, b) => b[1] - a[1])
    .map(([t, c]) => [t, c, percent(c, failures) + '%']);

  const topErrors = Object.entries(failureByError)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([err, c]) => [err || '(empty)', c, percent(c, failures) + '%']);

  const reportMd = `# 001 Coverage Analysis (Music Story cached batches)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${total}\n` +
    `- Successful payloads: ${successes}\n` +
    `- Failed payloads: ${failures}\n` +
    `- Success rate: ${percent(successes, total)}%\n` +
    `- Failure rate: ${percent(failures, total)}%\n\n` +
    `## Batch-by-batch Summary\n\n` +
    markdownTable(['Batch file', 'Total', 'Successes', 'Failures', 'Success rate'], batchRows) +
    `\n\n` +
    `## Failure Type Breakdown\n\n` +
    markdownTable(['Failure type', 'Count', '% of failures'], failureTypeRows) +
    `\n\n` +
    `## Top Failure Messages (Observed)\n\n` +
    markdownTable(['Error message', 'Count', '% of failures'], topErrors) +
    `\n\n` +
    `## Input recordingId vs ISRC-first (Observed)\n\n` +
    `- Entries with input musicStoryRecordingId: ${withInputId.length}\n` +
    `- Successes with input musicStoryRecordingId: ${successWithInputId}\n` +
    `- Failures with input musicStoryRecordingId: ${withInputId.length - successWithInputId}\n` +
    `- Success rate with input musicStoryRecordingId: ${percent(successWithInputId, withInputId.length)}%\n\n` +
    `- Entries without input musicStoryRecordingId: ${withoutInputId.length}\n` +
    `- Successes without input musicStoryRecordingId: ${successWithoutInputId}\n` +
    `- Failures without input musicStoryRecordingId: ${withoutInputId.length - successWithoutInputId}\n` +
    `- Success rate without input musicStoryRecordingId: ${percent(successWithoutInputId, withoutInputId.length)}%\n\n` +
    `## Observed Trends (Cautious)\n\n` +
    `- Observed: failure messages appear to cluster into a small set of recurring error strings.\n` +
    `- Observed: success rate may differ depending on whether an input recordingId is provided.\n` +
    `- Possible: certain ISRC prefixes may show different hit rates; this suggests a potential catalog coverage bias that needs validation.\n` +
    `- Needs validation: whether failures represent true catalog absence vs. lookup strategy limitations.\n\n` +
    `## Warnings\n\n` +
    '```json\n' + JSON.stringify(dataset.warnings, null, 2) + '\n```\n\n' +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), summaryPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), failuresCsvPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), successesCsvPath)}\n`;

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[001] Coverage analysis complete');
  console.log(`- ${summaryPath}`);
  console.log(`- ${failuresCsvPath}`);
  console.log(`- ${successesCsvPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
