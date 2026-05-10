const path = require('path');

const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { writeJsonFile, writeCsvFile, ensureDir } = require('../utils/io');
const {
  NUMERIC_DESCRIPTOR_KEYS,
  ARRAY_DESCRIPTOR_KEYS
} = require('../utils/descriptorRegistry');

function typeOfValue(v) {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  return typeof v;
}

function inc(obj, key, by = 1) {
  obj[key] = (obj[key] || 0) + by;
}

function escapeLower(s) {
  return String(s || '').trim().toLowerCase();
}

function flattenMoodName(m) {
  if (!m) return null;
  if (typeof m === 'string') return m;
  if (typeof m === 'object') {
    if (typeof m.name === 'string') return m.name;
  }
  return null;
}

async function run() {
  const dataset = loadMusicStoryBatches();

  const outBase = path.join(__dirname, '..', 'outputs', 'descriptors');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  if (dataset.summary.usableFilesLoaded === 0) {
    console.error('[002] No usable batch files were loaded.');
    console.error(JSON.stringify(dataset.warnings, null, 2));
    process.exitCode = 1;
    return;
  }

  const successes = dataset.successes;
  const successCount = successes.length;
  const total = dataset.all.length;
  const failures = dataset.failures.length;

  const keyStats = {}; // key -> counters
  const observedKeys = new Set();

  const moodFreq = {};
  const timbreFreq = {};
  const themeFreq = {};

  function ensureKey(k) {
    if (!keyStats[k]) {
      keyStats[k] = {
        present: 0,
        missing: 0,
        null: 0,
        number: 0,
        string: 0,
        array: 0,
        object: 0,
        boolean: 0,
        undefined: 0,
        other: 0
      };
    }
    return keyStats[k];
  }

  // Determine union of keys across successful payloads
  for (const e of successes) {
    const d = e.rawDescriptorData;
    if (!d || typeof d !== 'object') continue;
    for (const k of Object.keys(d)) {
      observedKeys.add(k);
    }
  }

  const allKeys = Array.from(observedKeys).sort();

  // For each successful payload, count key presence/types
  for (const e of successes) {
    const d = e.rawDescriptorData;
    if (!d || typeof d !== 'object') continue;

    for (const k of allKeys) {
      const stats = ensureKey(k);
      if (!Object.prototype.hasOwnProperty.call(d, k)) {
        stats.missing += 1;
        continue;
      }

      stats.present += 1;
      const v = d[k];
      const t = typeOfValue(v);
      inc(stats, t, 1);

      if (t === 'number' && Number.isFinite(v)) stats.number += 0; // already counted
      if (t === 'object' && v !== null) stats.object += 0; // already counted

      if (k === 'moods' && Array.isArray(v)) {
        for (const item of v) {
          const name = flattenMoodName(item);
          if (name) inc(moodFreq, name, 1);
        }
      }
      if (k === 'timbres' && Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string' && item.trim()) inc(timbreFreq, item.trim(), 1);
        }
      }
      if (k === 'themes' && Array.isArray(v)) {
        for (const item of v) {
          if (typeof item === 'string' && item.trim()) inc(themeFreq, item.trim(), 1);
        }
      }
    }
  }

  // Determine expected keys from registry
  const registryKeys = new Set([...NUMERIC_DESCRIPTOR_KEYS, ...ARRAY_DESCRIPTOR_KEYS]);
  const observedKeySet = new Set(allKeys);
  const unexpectedKeys = allKeys.filter((k) => !registryKeys.has(k));
  const registryNotObserved = Array.from(registryKeys).filter((k) => !observedKeySet.has(k)).sort();

  const fieldsPresentInAll = allKeys.filter((k) => keyStats[k] && keyStats[k].missing === 0);
  const fieldsMissingInAny = allKeys.filter((k) => keyStats[k] && keyStats[k].missing > 0);

  const audit = {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: total,
      successfulPayloads: successCount,
      failedPayloads: failures
    },
    observedKeys: allKeys,
    fieldStats: keyStats,
    fieldsPresentInAllSuccessfulPayloads: fieldsPresentInAll,
    fieldsMissingInAnySuccessfulPayload: fieldsMissingInAny,
    unexpectedFieldsNotInRegistry: unexpectedKeys,
    registryFieldsNotObserved: registryNotObserved,
    arrayFrequencies: {
      moods: moodFreq,
      timbres: timbreFreq,
      themes: themeFreq
    },
    warnings: dataset.warnings
  };

  const schemaPath = path.join(outBase, 'schema_audit.json');
  writeJsonFile(schemaPath, audit);

  // Field coverage CSV
  const fieldCoverageRows = allKeys.map((k) => {
    const s = keyStats[k];
    const present = s ? s.present : 0;
    const missing = s ? s.missing : successCount;
    const nullCount = s ? s.null : 0;
    const numberCount = s ? s.number : 0;
    const arrayCount = s ? s.array : 0;
    const objectCount = s ? s.object : 0;
    const coveragePct = successCount ? Number(((present / successCount) * 100).toFixed(2)) : 0;
    return {
      key: k,
      present,
      missing,
      null: nullCount,
      number: numberCount,
      array: arrayCount,
      object: objectCount,
      coverage_pct_successes: coveragePct
    };
  });

  const fieldCoverageCsvPath = path.join(outBase, 'field_coverage.csv');
  writeCsvFile(
    fieldCoverageCsvPath,
    ['key', 'present', 'missing', 'null', 'number', 'array', 'object', 'coverage_pct_successes'],
    fieldCoverageRows
  );

  function freqToRows(freqObj) {
    return Object.entries(freqObj)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }

  const moodCsvPath = path.join(outBase, 'mood_frequencies.csv');
  const timbreCsvPath = path.join(outBase, 'timbre_frequencies.csv');
  const themeCsvPath = path.join(outBase, 'theme_frequencies.csv');

  writeCsvFile(moodCsvPath, ['name', 'count'], freqToRows(moodFreq));
  writeCsvFile(timbreCsvPath, ['name', 'count'], freqToRows(timbreFreq));
  writeCsvFile(themeCsvPath, ['name', 'count'], freqToRows(themeFreq));

  // Markdown report
  const reportPath = path.join(reportDir, '002_descriptor_schema_audit.md');

  const topUnexpected = unexpectedKeys.slice(0, 40);
  const topRegistryMissing = registryNotObserved.slice(0, 40);

  const reportMd = `# 002 Descriptor Schema Audit (Music Story successful payloads)\n\n` +
    `## Dataset Context\n\n` +
    `- Total entries: ${total}\n` +
    `- Successful payloads: ${successCount}\n` +
    `- Failed payloads: ${failures}\n\n` +
    `## Summary (Observed)\n\n` +
    `- Observed keys (unique): ${allKeys.length}\n` +
    `- Fields present in all successful payloads: ${fieldsPresentInAll.length}\n` +
    `- Fields missing in at least one successful payload: ${fieldsMissingInAny.length}\n\n` +
    `## Unexpected Fields (Not in registry)\n\n` +
    `These fields were observed in successful payloads but are not currently listed in the registry. This suggests the registry may need extension, or these fields may be non-essential.\n\n` +
    '```text\n' + topUnexpected.join('\n') + '\n```\n\n' +
    `## Registry Fields Not Observed\n\n` +
    `These fields were listed in the registry but were not observed in the current successful payloads. This suggests they may be optional, absent for this dataset, or named differently.\n\n` +
    '```text\n' + topRegistryMissing.join('\n') + '\n```\n\n' +
    `## Array Field Notes (Cautious)\n\n` +
    `- Observed: array fields (moods/timbres/themes) appear to vary in frequency and vocabulary across tracks.\n` +
    `- Possible: mood names may represent a useful semantic layer, but requires later validation.\n\n` +
    `## Output Artifacts\n\n` +
    `- ${path.relative(path.join(__dirname, '..'), schemaPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), fieldCoverageCsvPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), moodCsvPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), timbreCsvPath)}\n` +
    `- ${path.relative(path.join(__dirname, '..'), themeCsvPath)}\n\n` +
    `## Warnings\n\n` +
    '```json\n' + JSON.stringify(dataset.warnings, null, 2) + '\n```\n';

  require('fs').writeFileSync(reportPath, reportMd);

  console.log('[002] Descriptor schema audit complete');
  console.log(`- ${schemaPath}`);
  console.log(`- ${fieldCoverageCsvPath}`);
  console.log(`- ${moodCsvPath}`);
  console.log(`- ${timbreCsvPath}`);
  console.log(`- ${themeCsvPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
