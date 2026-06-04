const fs = require('fs');
const path = require('path');

const PRE = path.resolve(__dirname, '../outputs/calibration_analysis_after_driving_confidence_fix.json');
const POST = path.resolve(__dirname, '../outputs/_tmp_post_cleanup_equivalence.json');

const DIM_KEYS = ['energy', 'pulse', 'brightness', 'density', 'vocal_presence', 'speech', 'valence', 'punch'];
const LABEL_IDS = ['energetic', 'driving', 'steady', 'bouncy', 'heavy', 'punchy', 'vocal', 'instrumental', 'speech', 'hypnotic'];

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function stableStringify(v) {
  return JSON.stringify(v === undefined ? null : v);
}

function songKey(s) {
  const si = (s && s.songIdentity) || {};
  return `${si.providerRecordingId ?? ''}|${si.title ?? ''}|${si.artist ?? ''}`;
}

function compareDimension(preDim, postDim) {
  const diffs = [];
  if (!preDim && postDim) return [{ field: 'presence', pre: false, post: true }];
  if (preDim && !postDim) return [{ field: 'presence', pre: true, post: false }];
  if (!preDim && !postDim) return diffs;

  for (const f of ['score', 'confidence', 'usable']) {
    if (stableStringify(preDim[f]) !== stableStringify(postDim[f])) diffs.push({ field: f, pre: preDim[f], post: postDim[f] });
  }
  if (stableStringify(preDim.evidence || []) !== stableStringify(postDim.evidence || [])) {
    diffs.push({ field: 'evidence', pre: preDim.evidence || [], post: postDim.evidence || [] });
  }
  if (stableStringify(preDim.missing || []) !== stableStringify(postDim.missing || [])) {
    diffs.push({ field: 'missing', pre: preDim.missing || [], post: postDim.missing || [] });
  }
  return diffs;
}

function compareLabel(preL, postL) {
  const diffs = [];
  if (!preL && postL) return [{ field: 'presence', pre: false, post: true }];
  if (preL && !postL) return [{ field: 'presence', pre: true, post: false }];
  if (!preL && !postL) return diffs;

  for (const f of ['score', 'confidence', 'suppressed']) {
    if (stableStringify(preL[f]) !== stableStringify(postL[f])) diffs.push({ field: f, pre: preL[f], post: postL[f] });
  }
  if (stableStringify(preL.suppressionReasons || []) !== stableStringify(postL.suppressionReasons || [])) {
    diffs.push({ field: 'suppressionReasons', pre: preL.suppressionReasons || [], post: postL.suppressionReasons || [] });
  }
  return diffs;
}

function main() {
  const pre = readJson(PRE);
  const post = readJson(POST);

  const preSongs = Array.isArray(pre.songs) ? pre.songs : [];
  const postSongs = Array.isArray(post.songs) ? post.songs : [];
  const preMap = new Map(preSongs.map((s) => [songKey(s), s]));

  const diffs = [];
  let matched = 0;
  let missingPre = 0;

  for (const sPost of postSongs) {
    const k = songKey(sPost);
    const sPre = preMap.get(k);
    if (!sPre) {
      missingPre += 1;
      diffs.push({ song: k, kind: 'song_missing_in_pre' });
      continue;
    }
    matched += 1;

    for (const dim of DIM_KEYS) {
      const d1 = sPre.dimensions ? sPre.dimensions[dim] : null;
      const d2 = sPost.dimensions ? sPost.dimensions[dim] : null;
      const dd = compareDimension(d1, d2);
      for (const entry of dd) diffs.push({ song: k, kind: 'dimension', dim, ...entry });
    }

    const preAligned = Array.isArray(sPre.alignedLabels) ? sPre.alignedLabels : [];
    const postAligned = Array.isArray(sPost.alignedLabels) ? sPost.alignedLabels : [];
    const preById = new Map(preAligned.map((l) => [l.labelId, l]));
    const postById = new Map(postAligned.map((l) => [l.labelId, l]));

    for (const id of LABEL_IDS) {
      const l1 = preById.get(id) || null;
      const l2 = postById.get(id) || null;
      const ld = compareLabel(l1, l2);
      for (const entry of ld) diffs.push({ song: k, kind: 'label', labelId: id, ...entry });
    }

    const surf1 = (Array.isArray(sPre.surfacedLabels) ? sPre.surfacedLabels : []).map((l) => l.labelId).sort();
    const surf2 = (Array.isArray(sPost.surfacedLabels) ? sPost.surfacedLabels : []).map((l) => l.labelId).sort();
    if (stableStringify(surf1) !== stableStringify(surf2)) {
      diffs.push({ song: k, kind: 'surfacedLabels', pre: surf1, post: surf2 });
    }
  }

  const summary = {
    preSongs: preSongs.length,
    postSongs: postSongs.length,
    matchedSongs: matched,
    missingPre,
    diffCount: diffs.length
  };

  console.log('=== Post-Cleanup Runtime Equivalence Validation ===');
  console.log('PRE :', PRE);
  console.log('POST:', POST);
  console.log(JSON.stringify(summary, null, 2));

  if (diffs.length === 0) {
    console.log('VERDICT: Perfect Equivalence');
    return;
  }

  console.log('---');
  console.log('Diff sample (first 80):');
  console.log(JSON.stringify(diffs.slice(0, 80), null, 2));
  console.log('---');
  console.log('VERDICT: Regression detected (aligned outputs differ)');
}

main();
