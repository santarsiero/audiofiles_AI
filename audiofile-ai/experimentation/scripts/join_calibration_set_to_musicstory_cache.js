const fs = require('fs');
const path = require('path');

const DEFAULT_CAL_SET = path.join(__dirname, '..', 'outputs', 'calibration_set_1.json');
const DEFAULT_CACHE = path.join(__dirname, '..', 'outputs', 'musicstory_successes_only.json');
const DEFAULT_OUT = path.join(__dirname, '..', 'outputs', 'calibration_set_1_with_descriptors.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function writeJson(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2));
}

function safeString(x) {
  if (x === null || x === undefined) return '';
  return String(x);
}

function canonicalize(s) {
  return safeString(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(feat|ft|featuring)\b\.?/g, '')
    .replace(/\([^)]*\)/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(s) {
  const c = canonicalize(s);
  if (!c) return new Set();
  return new Set(c.split(' ').filter(Boolean));
}

function jaccard(a, b) {
  if (!a.size && !b.size) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  const union = a.size + b.size - inter;
  return union ? inter / union : 0;
}

function isContained(a, b) {
  // a contains b OR b contains a (string contains)
  const aa = canonicalize(a);
  const bb = canonicalize(b);
  if (!aa || !bb) return false;
  return aa.includes(bb) || bb.includes(aa);
}

function scoreCandidate({ calArtist, calTitle, cacheArtist, cacheTitle }) {
  const a1 = tokenSet(calArtist);
  const a2 = tokenSet(cacheArtist);
  const t1 = tokenSet(calTitle);
  const t2 = tokenSet(cacheTitle);

  const aScore = jaccard(a1, a2);
  const tScore = jaccard(t1, t2);

  const artistContain = isContained(calArtist, cacheArtist) ? 0.1 : 0;
  const titleContain = isContained(calTitle, cacheTitle) ? 0.1 : 0;

  // Weight title higher than artist (title tends to be more specific)
  return tScore * 0.65 + aScore * 0.35 + artistContain + titleContain;
}

function main() {
  const calPath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_CAL_SET;
  const cachePath = process.argv[3] ? path.resolve(process.argv[3]) : DEFAULT_CACHE;
  const outPath = process.argv[4] ? path.resolve(process.argv[4]) : DEFAULT_OUT;

  const cal = readJson(calPath);
  const cache = readJson(cachePath);

  const calRows = Array.isArray(cal) ? cal : [];
  const cacheRows = Array.isArray(cache.rows) ? cache.rows : [];

  const matched = [];
  const missing = [];

  for (const c of calRows) {
    const calArtist = safeString(c.artist);
    const calTitle = safeString(c.title);

    let best = null;
    let bestScore = -1;

    for (const r of cacheRows) {
      const s = scoreCandidate({
        calArtist,
        calTitle,
        cacheArtist: r.artist,
        cacheTitle: r.title
      });

      if (s > bestScore) {
        bestScore = s;
        best = r;
      }
    }

    // Conservative acceptance threshold.
    // We prefer to miss rather than mis-join.
    if (!best || bestScore < 0.69) {
      missing.push({
        artist: calArtist || null,
        title: calTitle || null,
        genreBucket: c.genreBucket || null,
        expectedLabels: Array.isArray(c.expectedLabels) ? c.expectedLabels : [],
        notes: c.notes || null,
        bestCandidate: best
          ? {
              artist: best.artist || null,
              title: best.title || null,
              isrc: best.isrc || null,
              providerRecordingId:
                Object.prototype.hasOwnProperty.call(best, 'providerRecordingId') ? best.providerRecordingId : null,
              score: bestScore
            }
          : null
      });
      continue;
    }

    matched.push({
      calibration: {
        artist: calArtist || null,
        title: calTitle || null,
        genreBucket: c.genreBucket || null,
        expectedLabels: Array.isArray(c.expectedLabels) ? c.expectedLabels : [],
        notes: c.notes || null
      },
      cache: {
        index: typeof best.index === 'number' ? best.index : null,
        title: best.title || null,
        artist: best.artist || null,
        isrc: best.isrc || null,
        spotify_id: best.spotify_id || null,
        apple_id: best.apple_id || null,
        inputMusicStoryRecordingId:
          Object.prototype.hasOwnProperty.call(best, 'inputMusicStoryRecordingId') ? best.inputMusicStoryRecordingId : null,
        providerRecordingId:
          Object.prototype.hasOwnProperty.call(best, 'providerRecordingId') ? best.providerRecordingId : null,
        rawDescriptorData:
          best.rawDescriptorData && typeof best.rawDescriptorData === 'object' ? best.rawDescriptorData : null
      },
      match: {
        score: bestScore
      }
    });
  }

  ensureDir(path.dirname(outPath));

  writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    calibrationSetPath: calPath,
    cachePath,
    summary: {
      calibrationSongs: calRows.length,
      cacheRows: cacheRows.length,
      matched: matched.length,
      missing: missing.length
    },
    matched,
    missing
  });

  console.log('[join_calibration_set] wrote:', outPath);
  console.log('[join_calibration_set] matched:', matched.length);
  console.log('[join_calibration_set] missing:', missing.length);
}

main();
