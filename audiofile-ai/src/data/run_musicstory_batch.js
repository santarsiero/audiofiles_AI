require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { fetchMusicStoryDescriptors } = require('../providers/musicstory');

function isRateLimited(providerResult) {
  const err = providerResult && providerResult.error ? String(providerResult.error) : '';
  return err.includes('(429)') || err.toLowerCase().includes('rate limit') || err.includes('429');
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function toIndexMap(resultsArray) {
  const m = new Map();
  if (!Array.isArray(resultsArray)) return m;
  for (const r of resultsArray) {
    if (!r || typeof r !== 'object') continue;
    if (typeof r.index !== 'number') continue;
    m.set(r.index, r);
  }
  return m;
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

async function run() {
  const inputFileName = process.argv[2];
  if (!inputFileName) {
    console.log('Usage: node src/data/run_musicstory_batch.js batch_1.json');
    process.exitCode = 1;
    return;
  }

  const resume = process.argv.includes('--resume');

  const inputPath = path.join(__dirname, '..', '..', 'baseline', 'data', 'input', inputFileName);
  const batch = readJson(inputPath);

  const batchName = path.basename(inputFileName, path.extname(inputFileName));
  const m = String(batchName).match(/^batch_(\d+)$/);
  const batchNumber = m ? m[1] : batchName;

  const outDir = path.join(__dirname, '..', '..', 'baseline', 'data', 'musicstory');
  const outPath = path.join(outDir, `batch_${batchNumber}_musicstory.json`);

  let existing = null;
  if (resume && fileExists(outPath)) {
    try {
      existing = readJson(outPath);
    } catch {
      existing = null;
    }
  }

  const existingResults = existing && Array.isArray(existing.results) ? existing.results : [];
  const existingIndexMap = toIndexMap(existingResults);

  // Determine start index (first index not already present)
  let startIndex = 0;
  if (resume && existingIndexMap.size) {
    // if the file explicitly has a stoppedAtIndex, resume after it; otherwise resume after the max index present
    const stoppedAt = typeof existing.stoppedAtIndex === 'number' ? existing.stoppedAtIndex : null;
    if (stoppedAt !== null) {
      startIndex = stoppedAt + 1;
    } else {
      startIndex = Math.max(...Array.from(existingIndexMap.keys())) + 1;
    }
  }

  const results = resume ? existingResults.slice() : [];
  let stoppedEarly = false;
  let stoppedAtIndex = null;
  let stoppedSong = null;

  for (let i = startIndex; i < batch.length; i += 1) {
    const song = batch[i];
    const label = `${song.artist || ''} - ${song.title || ''}`.trim();
    console.log(`[musicstory_batch] (${i + 1}/${batch.length}) ${label}`);

    if (resume && existingIndexMap.has(i)) {
      // Already have a cached result for this index. Skip to avoid wasting API calls.
      continue;
    }

    const providerResult = await fetchMusicStoryDescriptors(
      {
        title: song.title || null,
        artist: song.artist || null,
        isrc: song.isrc || null
      },
      {
        recordingId: song.musicStoryRecordingId || null,
        isrc: song.isrc || null
      }
    );

    const row = {
      index: i,
      song,
      musicStory: providerResult
    };

    if (resume) {
      results.push(row);
      existingIndexMap.set(i, row);
    } else {
      results.push(row);
    }

    if (isRateLimited(providerResult)) {
      stoppedEarly = true;
      stoppedAtIndex = i;
      stoppedSong = {
        title: song.title || null,
        artist: song.artist || null,
        isrc: song.isrc || null
      };
      console.log(
        `[musicstory_batch] stopping early due to rate limit at index ${i} (${label})`
      );
      break;
    }
  }

  writeJson(outPath, {
    batchFile: inputFileName,
    createdAt: new Date().toISOString(),
    stoppedEarly,
    stoppedAtIndex,
    stoppedSong,
    results: results
      .filter((r) => r && typeof r.index === 'number')
      .sort((a, b) => a.index - b.index)
  });

  console.log(`[musicstory_batch] wrote: ${outPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
