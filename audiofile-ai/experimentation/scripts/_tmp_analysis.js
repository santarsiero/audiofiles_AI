const fs = require('fs');
const path = require('path');

const INPUT_JSON = path.resolve(__dirname, '../outputs/calibration_analysis_after_driving_confidence_fix.json');
const OUTPUT_MD = path.resolve(__dirname, '../reports/human_audit_calibration_set_1.md');

function safeNumber(n) {
  return Number.isFinite(n) ? n : null;
}

function fmt(n, digits = 2) {
  const v = safeNumber(n);
  if (v === null) return '';
  return v.toFixed(digits);
}

function sortByConfidenceDesc(items) {
  return items.slice().sort((a, b) => {
    const ac = safeNumber(a.confidence);
    const bc = safeNumber(b.confidence);
    if (ac === null && bc === null) return 0;
    if (ac === null) return 1;
    if (bc === null) return -1;
    if (bc !== ac) return bc - ac;
    const as = safeNumber(a.score);
    const bs = safeNumber(b.score);
    if (as === null && bs === null) return 0;
    if (as === null) return 1;
    if (bs === null) return -1;
    return bs - as;
  });
}

function labelRowsTable(rows) {
  if (!rows.length) return '_None_\n';
  const lines = [];
  lines.push('| label | baseLabel | score | confidence | state |');
  lines.push('| --- | --- | ---: | ---: | --- |');
  for (const r of rows) {
    lines.push(`| ${r.labelId} | ${r.baseLabelId || ''} | ${fmt(r.score)} | ${fmt(r.confidence)} | ${r.state || ''} |`);
  }
  lines.push('');
  return lines.join('\n');
}

function assignedLabelsTable(surfacedLabels) {
  const ids = (surfacedLabels || []).map((l) => l.labelId);
  if (!ids.length) return '_None_\n';
  const lines = [];
  lines.push('| label | isValid |');
  lines.push('| --- | --- |');
  for (const id of ids) {
    lines.push(`| ${id} | null |`);
  }
  lines.push('');
  return lines.join('\n');
}

function generate() {
  const data = JSON.parse(fs.readFileSync(INPUT_JSON, 'utf8'));
  const songs = data.songs || [];

  const out = [];
  out.push('# Human Audit — Calibration Set 1 (38 songs)');
  out.push('');
  out.push('This file is intended for manual labeling QA.');
  out.push('');
  out.push('Rules:');
  out.push('- For each **Assigned Label**, set `isValid` to `true` or `false` (start as `null`).');
  out.push('- Use the label groups below as decision support (sorted by descending confidence).');
  out.push('');

  for (let i = 0; i < songs.length; i += 1) {
    const s = songs[i];
    const id = s.songIdentity || {};
    const expected = s.expectedLabels || [];
    const surfaced = s.surfacedLabels || [];

    const active = (s.activeLabelAnalysis || []).map((l) => ({
      labelId: l.labelId,
      baseLabelId: '',
      score: l.score,
      confidence: l.confidence,
      state: l.state
    }));
    const inverse = (s.inverseLabelAnalysis || []).map((l) => ({
      labelId: l.labelId,
      baseLabelId: l.baseLabelId,
      score: l.score,
      confidence: l.confidence,
      state: l.state
    }));

    const all = active.concat(inverse);
    const confirmed = sortByConfidenceDesc(all.filter((l) => l.state === 'SUPPORTED'));
    const uncertain = sortByConfidenceDesc(all.filter((l) => l.state === 'UNCERTAIN'));
    const cut = sortByConfidenceDesc(all.filter((l) => l.state === 'REJECTED'));

    out.push(`---\n\n## ${i + 1}. ${id.artist || ''} — ${id.title || ''}`);
    out.push('');
    out.push('### Assigned Labels (surfaced)');
    out.push('');
    out.push(assignedLabelsTable(surfaced));

    out.push('### Expected Labels (calibration reference)');
    out.push('');
    out.push(expected.length ? expected.map((x) => `- ${x}`).join('\n') : '_None_');
    out.push('');

    out.push('### Label Evidence');
    out.push('');

    out.push('#### Confirmed');
    out.push('');
    out.push(labelRowsTable(confirmed));

    out.push('#### Uncertain');
    out.push('');
    out.push(labelRowsTable(uncertain));

    out.push('#### Cut');
    out.push('');
    out.push(labelRowsTable(cut));

    out.push('### Notes');
    out.push('');
    out.push('');
  }

  fs.writeFileSync(OUTPUT_MD, out.join('\n'), 'utf8');
  console.log(`[human_audit] wrote: ${OUTPUT_MD}`);
}

generate();
