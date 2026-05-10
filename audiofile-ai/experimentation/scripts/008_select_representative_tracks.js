const path = require('path');

const { readJsonFile, writeJsonFile, ensureDir } = require('../utils/io');

function pickByScore(sorted, n) {
  return sorted.slice(0, n).map((r) => ({
    title: r.title,
    artist: r.artist,
    isrc: r.isrc,
    recordingId: r.recordingId,
    score: r.score
  }));
}

function markdownList(items) {
  return items.map((x) => `- ${x.artist || ''} - ${x.title || ''} (${x.isrc || ''}) score=${x.score}`).join('\n');
}

async function run() {
  const outBase = path.join(__dirname, '..', 'outputs', 'features');
  const reportDir = path.join(__dirname, '..', 'reports');
  ensureDir(outBase);
  ensureDir(reportDir);

  const inputPath = path.join(outBase, 'generated_feature_scores.json');
  const data = readJsonFile(inputPath);

  const dataset = data.dataset || {};
  const rows = data.rows || [];

  const featureKeys = [
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1'
  ];

  const out = {
    generatedAt: new Date().toISOString(),
    dataset: {
      totalEntries: dataset.totalEntries,
      successfulPayloads: dataset.successfulPayloads,
      failedPayloads: dataset.failedPayloads
    },
    byFeature: {}
  };

  for (const fk of featureKeys) {
    const scored = rows
      .map((r) => ({
        title: r.title,
        artist: r.artist,
        isrc: r.isrc,
        recordingId: r.recordingId,
        score: r.features && r.features[fk] ? r.features[fk].score : null
      }))
      .filter((x) => typeof x.score === 'number' && Number.isFinite(x.score))
      .sort((a, b) => a.score - b.score);

    const n = scored.length;
    const low = pickByScore(scored, 10);
    const high = pickByScore(scored.slice().reverse(), 10);

    const medianStart = Math.max(0, Math.floor(n / 2) - 5);
    const nearMedian = pickByScore(scored.slice(medianStart, medianStart + 10), 10);

    out.byFeature[fk] = {
      count: n,
      lowest: low,
      highest: high,
      nearMedian
    };
  }

  const jsonOutPath = path.join(outBase, 'representative_tracks.json');
  writeJsonFile(jsonOutPath, out);

  // Report
  const reportPath = path.join(reportDir, '008_select_representative_tracks.md');

  let md = `# 008 Representative Track Selection (for later human sanity-review)\n\n`;
  md += `## Dataset Context\n\n`;
  md += `- Total entries: ${dataset.totalEntries}\n`;
  md += `- Successful payloads: ${dataset.successfulPayloads}\n`;
  md += `- Failed payloads: ${dataset.failedPayloads}\n\n`;
  md += `## Notes (Cautious)\n\n`;
  md += `These selections appear useful for later manual review. They do not validate semantics by themselves.\n\n`;

  for (const fk of featureKeys) {
    const b = out.byFeature[fk];
    md += `## ${fk}\n\n`;
    md += `### Highest (top 10)\n\n`;
    md += markdownList(b.highest) + '\n\n';
    md += `### Lowest (bottom 10)\n\n`;
    md += markdownList(b.lowest) + '\n\n';
    md += `### Near median\n\n`;
    md += markdownList(b.nearMedian) + '\n\n';
  }

  md += `## Output Artifacts\n\n`;
  md += `- ${path.relative(path.join(__dirname, '..'), jsonOutPath)}\n`;

  require('fs').writeFileSync(reportPath, md);

  console.log('[008] Representative track selection complete');
  console.log(`- ${jsonOutPath}`);
  console.log(`- ${reportPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
