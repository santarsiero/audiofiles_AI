const path = require('path');

const { readJsonFile, writeJsonFile, ensureDir } = require('../utils/io');
const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');

function safeLower(s) {
  return (s || '').toString().trim().toLowerCase();
}

function titleArtistKey(artist, title) {
  return `${safeLower(artist)}|||${safeLower(title)}`;
}

function isNonEmptyString(x) {
  return typeof x === 'string' && x.trim().length > 0;
}

function buildCacheIndexes(successes) {
  const byRecordingId = new Map();
  const byIsrc = new Map();
  const byTitleArtist = new Map();

  for (const e of successes) {
    if (e.providerRecordingId !== null && e.providerRecordingId !== undefined) {
      byRecordingId.set(String(e.providerRecordingId), e);
    }
    if (e.isrc) byIsrc.set(String(e.isrc), e);
    byTitleArtist.set(titleArtistKey(e.artist, e.title), e);
  }

  return { byRecordingId, byIsrc, byTitleArtist };
}

function resolveCacheHit(track, indexes) {
  const recId = track && track.recordingId !== null && track.recordingId !== undefined ? track.recordingId : null;
  const isrc = track && isNonEmptyString(track.isrc) ? track.isrc : null;
  const artist = track && isNonEmptyString(track.artist) ? track.artist : '';
  const title = track && isNonEmptyString(track.title) ? track.title : '';

  if (recId !== null && recId !== undefined && String(recId).trim() !== '') {
    const hit = indexes.byRecordingId.get(String(recId)) || null;
    if (hit) return { hit, matchType: 'recordingId', matchValue: String(recId) };
  }

  if (isrc) {
    const hit = indexes.byIsrc.get(String(isrc)) || null;
    if (hit) return { hit, matchType: 'isrc', matchValue: String(isrc) };
  }

  const k = titleArtistKey(artist, title);
  const hit = indexes.byTitleArtist.get(k) || null;
  if (hit) return { hit, matchType: 'title_artist', matchValue: k };

  return { hit: null, matchType: null, matchValue: null };
}

function flattenControlSetGroups(controlSet) {
  const groups = (controlSet && controlSet.groups && typeof controlSet.groups === 'object' ? controlSet.groups : {}) || {};

  const flat = [];
  for (const [groupName, items] of Object.entries(groups)) {
    if (!Array.isArray(items)) continue;
    for (const item of items) {
      flat.push({
        group: groupName,
        track: item
      });
    }
  }

  return flat;
}

function aggregateSummary(rows) {
  const byGroup = new Map();
  let found = 0;
  let missing = 0;

  for (const r of rows) {
    const g = r.group;
    if (!byGroup.has(g)) byGroup.set(g, { group: g, total: 0, found: 0, missing: 0, matchTypes: {} });
    const s = byGroup.get(g);
    s.total += 1;

    if (r.found) {
      found += 1;
      s.found += 1;
      const mt = r.match && r.match.matchType ? r.match.matchType : 'unknown';
      s.matchTypes[mt] = (s.matchTypes[mt] || 0) + 1;
    } else {
      missing += 1;
      s.missing += 1;
    }
  }

  const groups = Array.from(byGroup.values()).sort((a, b) => a.group.localeCompare(b.group));

  return {
    total: rows.length,
    found,
    missing,
    groups
  };
}

function buildMarkdownReport({ controlMeta, cacheSummary, summary, examplesMissing, examplesFound }) {
  const lines = [];
  lines.push('# Control Set → Music Story Cache Join');
  lines.push('');
  lines.push('## Inputs');
  lines.push('');
  lines.push(`- Dataset: ${controlMeta.datasetName || 'unknown'} v${controlMeta.version || 'unknown'}`);
  lines.push(`- Description: ${controlMeta.description || ''}`);
  lines.push('');
  lines.push('## Cache Context');
  lines.push('');
  lines.push(`- Batch files loaded: ${cacheSummary.usableFilesLoaded}`);
  lines.push(`- Total cached entries: ${cacheSummary.totalEntries}`);
  lines.push(`- Successful cached payloads: ${cacheSummary.totalSuccesses}`);
  lines.push(`- Failed cached payloads: ${cacheSummary.totalFailures}`);
  lines.push('');

  lines.push('## Join Summary');
  lines.push('');
  lines.push(`- Total control tracks: ${summary.total}`);
  lines.push(`- Found in cache: ${summary.found}`);
  lines.push(`- Missing from cache: ${summary.missing}`);
  lines.push('');

  lines.push('### By group');
  lines.push('');
  for (const g of summary.groups) {
    lines.push(`- ${g.group}: total=${g.total} found=${g.found} missing=${g.missing} matchTypes=${JSON.stringify(g.matchTypes)}`);
  }
  lines.push('');

  lines.push('## Examples (Missing)');
  lines.push('');
  if (!examplesMissing.length) {
    lines.push('- (none)');
  } else {
    for (const e of examplesMissing) {
      lines.push(`- ${e.group}: ${e.artist} — ${e.title} (isrc=${e.isrc || 'null'})`);
    }
  }
  lines.push('');

  lines.push('## Examples (Found)');
  lines.push('');
  if (!examplesFound.length) {
    lines.push('- (none)');
  } else {
    for (const e of examplesFound) {
      lines.push(`- ${e.group}: ${e.artist} — ${e.title} (match=${e.matchType}:${e.matchValue})`);
    }
  }
  lines.push('');

  return lines.join('\n');
}

async function run() {
  const controlPath = path.join(__dirname, '..', '..', 'baseline', 'data', 'input', 'control_1_calibrated.json');
  const controlSet = readJsonFile(controlPath);

  const cache = loadMusicStoryBatches();
  const indexes = buildCacheIndexes(cache.successes);

  const flat = flattenControlSetGroups(controlSet);

  const rows = [];

  for (const item of flat) {
    const { track, group } = item;
    const { hit, matchType, matchValue } = resolveCacheHit(track, indexes);

    if (!hit) {
      rows.push({
        group,
        artist: track.artist || null,
        title: track.title || null,
        isrc: track.isrc || null,
        recordingId: track.recordingId !== undefined ? track.recordingId : null,
        expectedDescriptors: Array.isArray(track.descriptors) ? track.descriptors : [],
        found: false,
        match: null,
        cacheMeta: null,
        musicStory: {
          available: false,
          data: null
        }
      });
      continue;
    }

    rows.push({
      group,
      artist: track.artist || null,
      title: track.title || null,
      isrc: track.isrc || null,
      recordingId: track.recordingId !== undefined ? track.recordingId : null,
      expectedDescriptors: Array.isArray(track.descriptors) ? track.descriptors : [],
      found: true,
      match: {
        matchType,
        matchValue
      },
      cacheMeta: {
        batchFile: hit.batchFile,
        index: hit.index,
        providerRecordingId: hit.providerRecordingId,
        providerError: hit.providerError || null,
        inputMusicStoryRecordingId: hit.inputMusicStoryRecordingId
      },
      musicStory: {
        available: true,
        data: hit.rawDescriptorData
      }
    });
  }

  const summary = aggregateSummary(rows);

  const outJson = path.join(__dirname, '..', 'outputs', 'control_1_musicstory_join.json');
  const outMd = path.join(__dirname, '..', 'reports', 'control_1_musicstory_join.md');

  ensureDir(path.dirname(outJson));
  ensureDir(path.dirname(outMd));

  writeJsonFile(outJson, {
    generatedAt: new Date().toISOString(),
    control: {
      datasetName: controlSet.datasetName || null,
      version: controlSet.version || null,
      description: controlSet.description || null,
      sourcePath: controlPath
    },
    cache: {
      summary: cache.summary,
      warnings: cache.warnings
    },
    summary,
    rows
  });

  const examplesMissing = rows
    .filter((r) => !r.found)
    .slice(0, 20)
    .map((r) => ({ group: r.group, artist: r.artist, title: r.title, isrc: r.isrc }));

  const examplesFound = rows
    .filter((r) => r.found)
    .slice(0, 20)
    .map((r) => ({
      group: r.group,
      artist: r.artist,
      title: r.title,
      matchType: r.match ? r.match.matchType : null,
      matchValue: r.match ? r.match.matchValue : null
    }));

  const md = buildMarkdownReport({
    controlMeta: controlSet,
    cacheSummary: cache.summary,
    summary,
    examplesMissing,
    examplesFound
  });

  require('fs').writeFileSync(outMd, md + '\n');

  console.log('[control_1_musicstory_join] wrote:');
  console.log('-', outJson);
  console.log('-', outMd);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
