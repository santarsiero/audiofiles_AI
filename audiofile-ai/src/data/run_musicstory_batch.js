require('dotenv').config();

const fs = require('fs');
const path = require('path');

const { fetchMusicStoryDescriptors } = require('../providers/musicstory');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
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

  const inputPath = path.join(__dirname, '..', '..', 'baseline', 'data', 'input', inputFileName);
  const batch = readJson(inputPath);

  const batchName = path.basename(inputFileName, path.extname(inputFileName));
  const m = String(batchName).match(/^batch_(\d+)$/);
  const batchNumber = m ? m[1] : batchName;

  const outDir = path.join(__dirname, '..', '..', 'baseline', 'data', 'musicstory');
  const outPath = path.join(outDir, `batch_${batchNumber}_musicstory.json`);

  const results = [];

  for (let i = 0; i < batch.length; i += 1) {
    const song = batch[i];
    const label = `${song.artist || ''} - ${song.title || ''}`.trim();
    console.log(`[musicstory_batch] (${i + 1}/${batch.length}) ${label}`);

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

    results.push({
      index: i,
      song,
      musicStory: providerResult
    });
  }

  writeJson(outPath, {
    batchFile: inputFileName,
    createdAt: new Date().toISOString(),
    results
  });

  console.log(`[musicstory_batch] wrote: ${outPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
