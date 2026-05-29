const fs = require('fs');
const path = require('path');

const IN_PATH = path.join(__dirname, '..', 'outputs', 'musicstory_successes_only.json');
const OUT_PATH = path.join(__dirname, '..', 'outputs', 'musicstory_successes_only_minimal.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function main() {
  const inPath = process.argv[2] ? path.resolve(process.argv[2]) : IN_PATH;
  const outPath = process.argv[3] ? path.resolve(process.argv[3]) : OUT_PATH;

  const json = readJson(inPath);
  const rows = Array.isArray(json.rows) ? json.rows : [];

  const minimalRows = rows.map((r, i) => ({
    index: typeof r.index === 'number' ? r.index : i,
    title: r.title ?? null,
    artist: r.artist ?? null,
    isrc: r.isrc ?? null,
    spotify_id: r.spotify_id ?? null,
    apple_id: r.apple_id ?? null,
    inputMusicStoryRecordingId:
      Object.prototype.hasOwnProperty.call(r, 'inputMusicStoryRecordingId') ? r.inputMusicStoryRecordingId : null,
    providerRecordingId:
      Object.prototype.hasOwnProperty.call(r, 'providerRecordingId') ? r.providerRecordingId : null
  }));

  ensureDir(path.dirname(outPath));

  writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    sourcePath: inPath,
    rowCount: minimalRows.length,
    rows: minimalRows
  });

  console.log('[slim_musicstory_successes_only] wrote:', outPath);
  console.log('[slim_musicstory_successes_only] rows:', minimalRows.length);
}

main();
