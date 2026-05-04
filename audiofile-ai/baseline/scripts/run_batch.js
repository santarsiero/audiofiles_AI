const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const { callGpt } = require('./call_gpt');
const { callClaude } = require('./call_claude');
const { normalizeAllRawOutputs } = require('./normalize');
const { spawnSync } = require('child_process');

const PROMPT_VERSION = 'v1';

function expectedOutputKeys(promptsByType) {
  const promptTypes = Object.keys(promptsByType);
  const models = ['gpt', 'claude'];
  const keys = [];
  for (const p of promptTypes) {
    for (const m of models) {
      keys.push(`${m}||${p}`);
    }
  }
  return keys;
}

function getOutputKey(o) {
  const model = o && typeof o.model === 'string' ? o.model : 'unknown';
  const promptType = o && typeof o.prompt_type === 'string' ? o.prompt_type : 'unknown';
  return `${model}||${promptType}`;
}

function isSongRawComplete(raw, promptsByType) {
  if (!raw || raw.prompt_version !== PROMPT_VERSION) return false;
  const outputs = raw && Array.isArray(raw.outputs) ? raw.outputs : [];
  const seen = new Set(outputs.map(getOutputKey));
  for (const k of expectedOutputKeys(promptsByType)) {
    if (!seen.has(k)) return false;
  }
  return true;
}

function confidenceSumFromParsed(parsed) {
  const labels = parsed && Array.isArray(parsed.labels) ? parsed.labels : [];
  let sum = 0;
  for (const l of labels) {
    const n = Number(l && l.confidence);
    if (Number.isFinite(n)) sum += n;
  }
  return sum;
}

function tryReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function safeSlug(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80);
}

function songId(index, song) {
  const idx = String(index + 1).padStart(4, '0');
  return `${idx}_${safeSlug(song.artist)}-${safeSlug(song.title)}`;
}

function loadPrompt(promptPath) {
  return fs.readFileSync(promptPath, 'utf8');
}

function injectSong(prompt, song) {
  const withTitle = prompt.replaceAll('{TITLE}', song.title || '');
  const withArtist = withTitle.replaceAll('{ARTIST}', song.artist || '');
  if (song.genre) {
    return withArtist + `\n\nGenre: ${song.genre}`;
  }
  return withArtist;
}

function loadBatch(inputFileName) {
  const inputPath = path.join(__dirname, '..', 'data', 'input', inputFileName);
  return JSON.parse(fs.readFileSync(inputPath, 'utf8'));
}

function batchNameFromFile(inputFileName) {
  return path.basename(inputFileName, path.extname(inputFileName));
}

function batchNumberFromName(batchName) {
  const m = String(batchName).match(/^batch_(\d+)$/);
  return m ? m[1] : batchName;
}

async function runForSong(song, promptsByType) {
  const outputs = [];

  for (const [promptType, promptText] of Object.entries(promptsByType)) {
    const prompt = injectSong(promptText, song);

    try {
      const response = await callGpt({ prompt });
      outputs.push({
        model: 'gpt',
        prompt_type: promptType,
        confidence_sum: confidenceSumFromParsed(response ? response.parsed : null),
        response
      });
    } catch (e) {
      console.log(`[run_batch] GPT failed (${promptType}) for ${song.artist} - ${song.title}: ${e && e.message ? e.message : e}`);
      outputs.push({
        model: 'gpt',
        prompt_type: promptType,
        confidence_sum: 0,
        response: { responseText: null, parsed: null, parseError: String(e && e.message ? e.message : e) }
      });
    }

    try {
      const response = await callClaude({ prompt });
      outputs.push({
        model: 'claude',
        prompt_type: promptType,
        confidence_sum: confidenceSumFromParsed(response ? response.parsed : null),
        response
      });
    } catch (e) {
      console.log(`[run_batch] Claude failed (${promptType}) for ${song.artist} - ${song.title}: ${e && e.message ? e.message : e}`);
      outputs.push({
        model: 'claude',
        prompt_type: promptType,
        confidence_sum: 0,
        response: { responseText: null, parsed: null, parseError: String(e && e.message ? e.message : e) }
      });
    }
  }

  return outputs;
}

async function main() {
  const inputFileName = process.argv[2];
  if (!inputFileName) {
    console.log('Usage: node baseline/scripts/run_batch.js batch_1.json');
    process.exitCode = 1;
    return;
  }

  const baselineRoot = path.join(__dirname, '..');

  const promptsDir = path.join(baselineRoot, 'prompts');
  const rawDir = path.join(baselineRoot, 'data', 'raw_outputs');
  const normalizedDir = path.join(baselineRoot, 'data', 'normalized');

  const batchName = batchNameFromFile(inputFileName);
  const batchNumber = batchNumberFromName(batchName);
  const batchSongRawDir = path.join(rawDir, batchName);

  fs.mkdirSync(rawDir, { recursive: true });
  fs.mkdirSync(normalizedDir, { recursive: true });

  fs.mkdirSync(batchSongRawDir, { recursive: true });

  const batchRawPath = path.join(rawDir, `batch_${batchNumber}_raw.json`);
  const batchRaw = {
    batchFile: inputFileName,
    songs: []
  };

  const promptsByType = {
    perceptual: loadPrompt(path.join(promptsDir, 'perceptual.txt')),
    structural: loadPrompt(path.join(promptsDir, 'structural.txt')),
    conservative: loadPrompt(path.join(promptsDir, 'conservative.txt'))
  };

  const batch = loadBatch(inputFileName);

  console.log(`[run_batch] loaded ${batch.length} songs from ${inputFileName}`);

  for (let i = 0; i < batch.length; i += 1) {
    const song = batch[i];
    const id = songId(i, song);

    const rawPath = path.join(batchSongRawDir, `${id}.json`);
    if (fs.existsSync(rawPath)) {
      const existingRaw = tryReadJson(rawPath);
      if (existingRaw && isSongRawComplete(existingRaw, promptsByType)) {
        console.log(`[run_batch] (${i + 1}/${batch.length}) ${id} (skip: already complete)`);
        continue;
      }
      console.log(`[run_batch] (${i + 1}/${batch.length}) ${id} (resume: reprocessing incomplete)`);
    } else {
      console.log(`[run_batch] (${i + 1}/${batch.length}) ${id}`);
    }

    const outputs = await runForSong(song, promptsByType);

    const raw = {
      prompt_version: PROMPT_VERSION,
      song,
      outputs
    };

    fs.writeFileSync(rawPath, JSON.stringify(raw, null, 2));
  }

  const songRawFiles = fs
    .readdirSync(batchSongRawDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  for (const f of songRawFiles) {
    const raw = tryReadJson(path.join(batchSongRawDir, f));
    if (!raw) continue;
    batchRaw.songs.push({ songId: path.basename(f, '.json'), ...raw });
  }

  fs.writeFileSync(batchRawPath, JSON.stringify(batchRaw, null, 2));

  const normalizedBatchPath = path.join(normalizedDir, `batch_${batchNumber}_norm.json`);
  normalizeAllRawOutputs({ rawDir: batchSongRawDir, normalizedDir: null, resultsPath: normalizedBatchPath });

  const cleanResult = spawnSync(process.execPath, [path.join(__dirname, 'clean.js'), inputFileName], {
    stdio: 'inherit'
  });
  if (cleanResult.status !== 0) {
    throw new Error(`[run_batch] clean step failed with exit code ${cleanResult.status}`);
  }

  try {
    if (fs.existsSync(batchSongRawDir)) {
      fs.rmSync(batchSongRawDir, { recursive: true, force: true });
    }
  } catch (e) {
    console.log(`[run_batch] warning: failed to remove intermediate raw dir ${batchSongRawDir}: ${e && e.message ? e.message : e}`);
  }

  console.log(`[run_batch] done. normalized batch: ${normalizedBatchPath}`);
  console.log(`[run_batch] raw batch: ${batchRawPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
