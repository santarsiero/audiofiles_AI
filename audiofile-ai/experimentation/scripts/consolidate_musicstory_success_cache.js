const fs = require('fs');
const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');

const DEFAULT_OUT = path.join(__dirname, '..', 'outputs', 'musicstory_successes_only.json');
const DEFAULT_JOIN_PATCHED = path.join(
  __dirname,
  '..',
  'outputs',
  'control_1_musicstory_join_patched.json'
);

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function fileExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch {
    return false;
  }
}

function safeString(x) {
  if (x === null || x === undefined) return null;
  const s = String(x).trim();
  return s.length ? s : null;
}

function stableKey(e) {
  if (e && e.isrc) return `isrc:${e.isrc}`;
  if (e && e.providerRecordingId !== null && e.providerRecordingId !== undefined) return `recordingId:${String(e.providerRecordingId)}`;
  const a = (e && e.artist ? String(e.artist).toLowerCase() : '');
  const t = (e && e.title ? String(e.title).toLowerCase() : '');
  return `titleArtist:${a}|||${t}`;
}

function loadJoinPatched(joinPath) {
  if (!joinPath) return { rows: [], meta: null };
  if (!fileExists(joinPath)) return { rows: [], meta: { path: joinPath, loaded: false, error: 'missing' } };

  try {
    const json = JSON.parse(fs.readFileSync(joinPath, 'utf8'));
    const rows = Array.isArray(json.rows) ? json.rows : [];
    const successes = rows
      .filter((r) => r && r.musicStory && r.musicStory.available === true && r.musicStory.data && typeof r.musicStory.data === 'object')
      .map((r) => {
        const cacheMeta = r.cacheMeta && typeof r.cacheMeta === 'object' ? r.cacheMeta : {};
        return {
          batchFile: safeString(cacheMeta.batchFile) || 'control_1_musicstory_join_patched.json',
          batchCreatedAt: safeString(json.generatedAt) || null,
          index: typeof cacheMeta.index === 'number' ? cacheMeta.index : null,
          title: safeString(r.title),
          artist: safeString(r.artist),
          isrc: safeString(r.isrc),
          spotify_id: null,
          apple_id: null,
          inputMusicStoryRecordingId: null,
          providerAvailable: true,
          providerError: null,
          providerRecordingId:
            cacheMeta && Object.prototype.hasOwnProperty.call(cacheMeta, 'providerRecordingId')
              ? cacheMeta.providerRecordingId
              : null,
          hasDescriptorData: true,
          rawDescriptorData: r.musicStory.data,
          __source: 'join_patched'
        };
      });

    return {
      rows: successes,
      meta: { path: joinPath, loaded: true, totalRows: rows.length, successRows: successes.length }
    };
  } catch (e) {
    return {
      rows: [],
      meta: { path: joinPath, loaded: false, error: String(e && e.message ? e.message : e) }
    };
  }
}

function main() {
  const outPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_OUT;
  const joinPath = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_JOIN_PATCHED;

  const loaded = loadMusicStoryBatches();
  const successes = Array.isArray(loaded.successes) ? loaded.successes : [];

  const join = loadJoinPatched(joinPath);
  const merged = successes.concat(join.rows);

  // Deduplicate while preserving a stable deterministic winner: first occurrence in batch load order.
  const seen = new Set();
  const rows = [];
  for (const e of merged) {
    const k = stableKey(e);
    if (seen.has(k)) continue;
    seen.add(k);
    rows.push(e);
  }

  ensureDir(path.dirname(outPath));

  writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    sourceDir: path.join(__dirname, '..', '..', 'baseline', 'data', 'musicstory'),
    joinPatchedSource: join.meta,
    summary: {
      batchFilesLoaded: Array.isArray(loaded.batches) ? loaded.batches.length : 0,
      totalEntries: loaded.summary ? loaded.summary.totalEntries : null,
      totalSuccesses: loaded.summary ? loaded.summary.totalSuccesses : null,
      joinPatchedSuccesses: join.meta && join.meta.loaded ? join.meta.successRows : 0,
      successesDeduped: rows.length,
      duplicateIsrcCount: loaded.summary ? loaded.summary.duplicateIsrcCount : null,
      duplicateRecordingIdCount: loaded.summary ? loaded.summary.duplicateRecordingIdCount : null,
      duplicateTitleArtistCount: loaded.summary ? loaded.summary.duplicateTitleArtistCount : null
    },
    warnings: loaded.warnings || [],
    rows
  });

  console.log('[consolidate_musicstory_success_cache] wrote:', outPath);
  console.log('[consolidate_musicstory_success_cache] baseline successes:', successes.length);
  console.log('[consolidate_musicstory_success_cache] join_patched successes:', join.meta && join.meta.loaded ? join.meta.successRows : 0);
  console.log('[consolidate_musicstory_success_cache] successes deduped:', rows.length);
}

main();
