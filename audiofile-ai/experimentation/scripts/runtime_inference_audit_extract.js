const fs = require('fs');

function safeNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function nums(arr) {
  return (arr || []).map(safeNumber).filter((v) => v !== null).sort((a, b) => a - b);
}

function q(sorted, p) {
  if (!sorted.length) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const t = idx - lo;
  return sorted[lo] * (1 - t) + sorted[hi] * t;
}

function dist(arr) {
  const a = nums(arr);
  if (!a.length) {
    return { n: 0, min: null, p25: null, p50: null, p75: null, max: null, mean: null };
  }
  const mean = a.reduce((s, v) => s + v, 0) / a.length;
  return {
    n: a.length,
    min: a[0],
    p25: q(a, 0.25),
    p50: q(a, 0.5),
    p75: q(a, 0.75),
    max: a[a.length - 1],
    mean
  };
}

function getLabel(song, labelId) {
  return (song.activeLabelAnalysis || []).find((l) => l && l.labelId === labelId) || null;
}

function isSurfaced(song, labelId) {
  return (song.surfacedLabels || []).some((l) => l && l.labelId === labelId);
}

function loadJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

function main() {
  const analysisPath = process.argv[2] || 'experimentation/outputs/calibration_analysis.json';
  const joinedPath = process.argv[3] || 'experimentation/outputs/calibration_set_1_with_descriptors.json';
  const outPath = process.argv[4] || 'experimentation/outputs/runtime_inference_audit_stats.json';

  console.log('[runtime_inference_audit_extract] start');

  const t0 = Date.now();
  const analysis = loadJson(analysisPath);
  const joined = loadJson(joinedPath);

  const songs = analysis.songs || [];

  const byKey = new Map();
  for (const m of joined.matched || []) {
    const artist = String(m?.cache?.artist || '').toLowerCase();
    const title = String(m?.cache?.title || '').toLowerCase();
    byKey.set(`${artist}::${title}`, m);
  }

  const energeticScores = songs.map((s) => getLabel(s, 'energetic')?.score ?? null);
  const energeticConfs = songs.map((s) => getLabel(s, 'energetic')?.confidence ?? null);
  const energyScores = songs.map((s) => s?.dimensions?.energy?.score ?? null);
  const energyConfs = songs.map((s) => s?.dimensions?.energy?.confidence ?? null);

  const energeticFailures = [];
  for (const s of songs) {
    const e = s?.dimensions?.energy;
    const energyScore = safeNumber(e?.score);
    if (energyScore === null || energyScore < 0.65) continue;
    if (isSurfaced(s, 'energetic')) continue;

    const l = getLabel(s, 'energetic');
    energeticFailures.push({
      artist: s?.songIdentity?.artist ?? null,
      title: s?.songIdentity?.title ?? null,
      energyScore: energyScore,
      energyConfidence: safeNumber(e?.confidence),
      energeticScore: safeNumber(l?.score),
      energeticConfidence: safeNumber(l?.confidence),
      suppressionReason: l?.suppressionReason ?? null
    });
  }

  const densityScores = songs.map((s) => s?.dimensions?.density?.score ?? null);
  const densityConfs = songs.map((s) => s?.dimensions?.density?.confidence ?? null);

  const expectedDense = [];
  for (const s of songs) {
    const key = `${String(s?.songIdentity?.artist || '').toLowerCase()}::${String(
      s?.songIdentity?.title || ''
    ).toLowerCase()}`;
    const m = byKey.get(key);
    const exp = m?.calibration?.expectedLabels || [];
    if (!exp.includes('dense')) continue;

    const raw = m?.cache?.rawDescriptorData || {};
    expectedDense.push({
      artist: s?.songIdentity?.artist ?? null,
      title: s?.songIdentity?.title ?? null,
      densityScore: safeNumber(s?.dimensions?.density?.score),
      densityConfidence: safeNumber(s?.dimensions?.density?.confidence),
      event_density: raw.event_density ?? null,
      intensity: raw.intensity ?? null,
      complexity: raw.complexity ?? null
    });
  }

  const pulseElec = [];
  const pulseNon = [];
  for (const s of songs) {
    const key = `${String(s?.songIdentity?.artist || '').toLowerCase()}::${String(
      s?.songIdentity?.title || ''
    ).toLowerCase()}`;
    const m = byKey.get(key);
    const gb = m?.calibration?.genreBucket ?? null;

    const p = s?.dimensions?.pulse;
    const score = safeNumber(p?.score);
    if (score === null) continue;

    if (gb === 'electronic_dance') pulseElec.push(p);
    else pulseNon.push(p);
  }

  function avg(arr, field) {
    const xs = (arr || []).map((o) => safeNumber(o?.[field])).filter((v) => v !== null);
    if (!xs.length) return null;
    return xs.reduce((s, v) => s + v, 0) / xs.length;
  }

  const active = analysis?.config?.activeLabels || [];
  const expectedCounts = Object.fromEntries(active.map((l) => [l, 0]));
  const surfacedCounts = Object.fromEntries(active.map((l) => [l, 0]));

  for (const s of songs) {
    const key = `${String(s?.songIdentity?.artist || '').toLowerCase()}::${String(
      s?.songIdentity?.title || ''
    ).toLowerCase()}`;
    const m = byKey.get(key);
    const exp = m?.calibration?.expectedLabels || [];

    for (const l of active) {
      if (exp.includes(l)) expectedCounts[l]++;
      if (isSurfaced(s, l)) surfacedCounts[l]++;
    }
  }

  const out = {
    meta: {
      songs: songs.length,
      ms: Date.now() - t0,
      analysisPath,
      joinedPath
    },
    energetic: {
      energeticScoreDist: dist(energeticScores),
      energeticConfidenceDist: dist(energeticConfs),
      energyScoreDist: dist(energyScores),
      energyConfidenceDist: dist(energyConfs),
      failuresCount: energeticFailures.length,
      failures: energeticFailures
    },
    density: {
      densityScoreDist: dist(densityScores),
      densityConfidenceDist: dist(densityConfs),
      expectedDenseCount: expectedDense.length,
      expectedDense
    },
    pulse: {
      electronicN: pulseElec.length,
      nonElectronicN: pulseNon.length,
      electronicAvgPulse: avg(pulseElec, 'score'),
      electronicAvgConfidence: avg(pulseElec, 'confidence'),
      nonElectronicAvgPulse: avg(pulseNon, 'score'),
      nonElectronicAvgConfidence: avg(pulseNon, 'confidence')
    },
    surfaceRates: {
      expectedCounts,
      surfacedCounts
    }
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`[runtime_inference_audit_extract] wrote: ${outPath}`);
  console.log(`[runtime_inference_audit_extract] songs: ${songs.length}`);
}

main();
