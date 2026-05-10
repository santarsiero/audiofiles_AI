const fs = require('fs');
const path = require('path');

const DEFAULT_GLOB_DIR = path.join(__dirname, '..', '..', 'baseline', 'data', 'musicstory');

function isBatchFileName(name) {
  return /^batch_\d+_musicstory\.json$/i.test(name);
}

function safeString(x) {
  if (x === null || x === undefined) return null;
  const s = String(x).trim();
  return s.length ? s : null;
}

function normalizeEntry(batchMeta, result, warnings) {
  if (!result || typeof result !== 'object') {
    warnings.push({
      type: 'malformed_entry',
      message: 'Result row is not an object',
      batchFile: batchMeta.batchFile,
      index: null
    });
    return null;
  }

  const song = result.song && typeof result.song === 'object' ? result.song : null;
  const ms = result.musicStory && typeof result.musicStory === 'object' ? result.musicStory : null;

  const title = song ? safeString(song.title) : null;
  const artist = song ? safeString(song.artist) : null;
  const isrc = song ? safeString(song.isrc) : null;

  const rawDescriptorData = ms && ms.data && typeof ms.data === 'object' ? ms.data : null;
  const providerAvailable = ms ? Boolean(ms.available) : false;
  const hasDescriptorData = Boolean(providerAvailable && rawDescriptorData);

  if (providerAvailable && !rawDescriptorData) {
    warnings.push({
      type: 'success_without_data',
      message: 'musicStory.available was true but musicStory.data was missing/null',
      batchFile: batchMeta.batchFile,
      index: typeof result.index === 'number' ? result.index : null,
      title,
      artist,
      isrc
    });
  }

  if (!providerAvailable && ms && !ms.error) {
    warnings.push({
      type: 'failure_without_error',
      message: 'musicStory.available was false but musicStory.error was missing/null',
      batchFile: batchMeta.batchFile,
      index: typeof result.index === 'number' ? result.index : null,
      title,
      artist,
      isrc
    });
  }

  return {
    batchFile: batchMeta.batchFile,
    batchCreatedAt: batchMeta.batchCreatedAt,

    index: typeof result.index === 'number' ? result.index : null,

    title,
    artist,
    isrc,
    spotify_id: song ? safeString(song.spotify_id) : null,
    apple_id: song ? safeString(song.apple_id) : null,
    inputMusicStoryRecordingId:
      song && Object.prototype.hasOwnProperty.call(song, 'musicStoryRecordingId')
        ? song.musicStoryRecordingId
        : null,

    providerAvailable,
    providerError: ms ? safeString(ms.error) : null,
    providerRecordingId:
      ms && Object.prototype.hasOwnProperty.call(ms, 'recordingId') ? ms.recordingId : null,

    hasDescriptorData,
    rawDescriptorData
  };
}

function findDefaultBatchFiles(warnings) {
  let files = [];
  try {
    files = fs
      .readdirSync(DEFAULT_GLOB_DIR)
      .filter((f) => isBatchFileName(f))
      .map((f) => path.join(DEFAULT_GLOB_DIR, f))
      .sort((a, b) => {
        const na = Number(path.basename(a).match(/batch_(\d+)_/i)[1]);
        const nb = Number(path.basename(b).match(/batch_(\d+)_/i)[1]);
        return na - nb;
      });
  } catch (e) {
    warnings.push({
      type: 'missing_musicstory_dir',
      message: 'Unable to read baseline musicstory directory',
      dir: DEFAULT_GLOB_DIR,
      error: String(e && e.message ? e.message : e)
    });
    return [];
  }

  if (files.length === 0) {
    warnings.push({
      type: 'no_batch_files_found',
      message: 'No batch_*_musicstory.json files were found',
      dir: DEFAULT_GLOB_DIR
    });
  }

  return files;
}

function validateDuplicates(allEntries, warnings) {
  const isrcToCount = new Map();
  const recIdToCount = new Map();
  const titleArtistToCount = new Map();

  for (const e of allEntries) {
    if (e.isrc) isrcToCount.set(e.isrc, (isrcToCount.get(e.isrc) || 0) + 1);
    if (e.providerRecordingId !== null && e.providerRecordingId !== undefined) {
      const k = String(e.providerRecordingId);
      recIdToCount.set(k, (recIdToCount.get(k) || 0) + 1);
    }
    if (e.title || e.artist) {
      const k = `${(e.artist || '').toLowerCase()}|||${(e.title || '').toLowerCase()}`;
      titleArtistToCount.set(k, (titleArtistToCount.get(k) || 0) + 1);
    }
  }

  const dupIsrc = Array.from(isrcToCount.entries()).filter(([, c]) => c > 1);
  const dupRecId = Array.from(recIdToCount.entries()).filter(([, c]) => c > 1);
  const dupTitleArtist = Array.from(titleArtistToCount.entries()).filter(([, c]) => c > 1);

  if (dupIsrc.length) {
    warnings.push({
      type: 'duplicate_isrc',
      message: 'Duplicate ISRCs observed',
      count: dupIsrc.length
    });
  }
  if (dupRecId.length) {
    warnings.push({
      type: 'duplicate_recording_id',
      message: 'Duplicate provider recordingIds observed',
      count: dupRecId.length
    });
  }
  if (dupTitleArtist.length) {
    warnings.push({
      type: 'duplicate_title_artist',
      message: 'Duplicate title/artist pairs observed',
      count: dupTitleArtist.length
    });
  }

  return {
    duplicateIsrcCount: dupIsrc.length,
    duplicateRecordingIdCount: dupRecId.length,
    duplicateTitleArtistCount: dupTitleArtist.length
  };
}

function loadMusicStoryBatches(opts = {}) {
  const warnings = [];
  const inputPaths = Array.isArray(opts.paths) && opts.paths.length ? opts.paths : null;

  const batchPaths = inputPaths ? inputPaths : findDefaultBatchFiles(warnings);

  if (!batchPaths.length) {
    return {
      all: [],
      successes: [],
      failures: [],
      batches: [],
      warnings,
      summary: {
        filesAttempted: inputPaths ? inputPaths.length : null,
        filesLoaded: 0,
        usableFilesLoaded: 0,
        totalEntries: 0,
        totalSuccesses: 0,
        totalFailures: 0,
        duplicateIsrcCount: 0,
        duplicateRecordingIdCount: 0,
        duplicateTitleArtistCount: 0
      }
    };
  }

  const batches = [];
  const all = [];

  let filesLoaded = 0;
  let usableFilesLoaded = 0;

  for (const p of batchPaths) {
    let json;
    try {
      json = JSON.parse(fs.readFileSync(p, 'utf8'));
      filesLoaded += 1;
    } catch (e) {
      warnings.push({
        type: 'file_read_error',
        message: 'Failed to read/parse batch json',
        path: p,
        error: String(e && e.message ? e.message : e)
      });
      continue;
    }

    const batchFile = path.basename(p);
    const batchCreatedAt = json && typeof json === 'object' ? safeString(json.createdAt) : null;
    const results = json && typeof json === 'object' ? json.results : null;

    if (!Array.isArray(results)) {
      warnings.push({
        type: 'missing_results_array',
        message: 'Batch json missing results[] array',
        path: p,
        batchFile
      });
      batches.push({
        path: p,
        batchFile,
        batchCreatedAt,
        entries: [],
        entryCount: 0
      });
      continue;
    }

    usableFilesLoaded += 1;

    const batchMeta = { batchFile, batchCreatedAt };
    const entries = [];

    for (const r of results) {
      const e = normalizeEntry(batchMeta, r, warnings);
      if (e) {
        entries.push(e);
        all.push(e);
      }
    }

    batches.push({
      path: p,
      batchFile,
      batchCreatedAt,
      entries,
      entryCount: entries.length
    });
  }

  if (!usableFilesLoaded) {
    warnings.push({
      type: 'zero_usable_files',
      message: 'No usable batch files could be loaded (files had parse errors or missing results[])'
    });
  }

  // warn if fewer usable files loaded than discovered/attempted
  if (!inputPaths) {
    // default discovery path: batchPaths are the discovered list
    if (usableFilesLoaded > 0 && usableFilesLoaded < batchPaths.length) {
      warnings.push({
        type: 'fewer_usable_files_than_discovered',
        message: 'Fewer usable batch files loaded than discovered',
        discovered: batchPaths.length,
        usable: usableFilesLoaded
      });
    }
  } else if (usableFilesLoaded > 0 && usableFilesLoaded < inputPaths.length) {
    warnings.push({
      type: 'fewer_usable_files_than_attempted',
      message: 'Fewer usable batch files loaded than attempted',
      attempted: inputPaths.length,
      usable: usableFilesLoaded
    });
  }

  const successes = all.filter((e) => e.hasDescriptorData);
  const failures = all.filter((e) => !e.hasDescriptorData);

  const dups = validateDuplicates(all, warnings);

  return {
    all,
    successes,
    failures,
    batches,
    warnings,
    summary: {
      filesAttempted: inputPaths ? inputPaths.length : null,
      filesLoaded,
      usableFilesLoaded,
      totalEntries: all.length,
      totalSuccesses: successes.length,
      totalFailures: failures.length,
      duplicateIsrcCount: dups.duplicateIsrcCount,
      duplicateRecordingIdCount: dups.duplicateRecordingIdCount,
      duplicateTitleArtistCount: dups.duplicateTitleArtistCount
    }
  };
}

module.exports = {
  loadMusicStoryBatches
};
