const fs = require('fs');

function safeNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function mean(arr) {
  const xs = (arr || []).map(safeNumber).filter((v) => v !== null);
  if (!xs.length) return null;
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}

function variance(arr, mu) {
  const xs = (arr || []).map(safeNumber).filter((v) => v !== null);
  if (xs.length < 2) return null;
  const m = typeof mu === 'number' ? mu : mean(xs);
  let acc = 0;
  for (const x of xs) acc += (x - m) * (x - m);
  return acc / (xs.length - 1);
}

function cohenD(a, b) {
  const xa = (a || []).map(safeNumber).filter((v) => v !== null);
  const xb = (b || []).map(safeNumber).filter((v) => v !== null);
  if (xa.length < 2 || xb.length < 2) return null;

  const ma = mean(xa);
  const mb = mean(xb);
  const va = variance(xa, ma);
  const vb = variance(xb, mb);
  if (va === null || vb === null) return null;

  const sp = Math.sqrt(((xa.length - 1) * va + (xb.length - 1) * vb) / (xa.length + xb.length - 2));
  if (!Number.isFinite(sp) || sp === 0) return null;
  return (ma - mb) / sp;
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const joinedPath = process.argv[2] || 'experimentation/outputs/calibration_set_1_with_descriptors.json';
  const outJsonPath = process.argv[3] || 'experimentation/outputs/descriptor_separation_dense_sparse.json';

  console.log('[descriptor_separation_dense_sparse] start');

  const joined = loadJson(joinedPath);
  const matched = Array.isArray(joined.matched) ? joined.matched : [];

  const dense = [];
  const sparse = [];

  for (const m of matched) {
    const exp = m?.calibration?.expectedLabels || [];
    const raw = m?.cache?.rawDescriptorData || null;
    if (!raw) continue;

    const row = {
      artist: m?.cache?.artist ?? m?.calibration?.artist ?? null,
      title: m?.cache?.title ?? m?.calibration?.title ?? null,
      expectedLabels: exp,
      raw
    };

    if (exp.includes('dense')) dense.push(row);
    if (exp.includes('sparse')) sparse.push(row);
  }

  const denseRaw = dense.map((r) => r.raw);
  const sparseRaw = sparse.map((r) => r.raw);

  // Descriptor keys: union across both groups; numeric only.
  const keySet = new Set();
  for (const r of denseRaw) for (const k of Object.keys(r || {})) keySet.add(k);
  for (const r of sparseRaw) for (const k of Object.keys(r || {})) keySet.add(k);

  const results = [];
  for (const key of [...keySet].sort()) {
    const da = denseRaw.map((r) => (r ? r[key] : null));
    const sb = sparseRaw.map((r) => (r ? r[key] : null));

    // Keep only descriptors that are numeric in at least some songs.
    const denseVals = da.map(safeNumber).filter((v) => v !== null);
    const sparseVals = sb.map(safeNumber).filter((v) => v !== null);
    if (denseVals.length === 0 || sparseVals.length === 0) continue;

    const dm = mean(denseVals);
    const sm = mean(sparseVals);
    const diff = dm === null || sm === null ? null : Math.abs(dm - sm);
    const d = cohenD(denseVals, sparseVals);

    results.push({
      descriptor: key,
      denseN: denseVals.length,
      sparseN: sparseVals.length,
      denseMean: dm,
      sparseMean: sm,
      absDiff: diff,
      effectSize: d,
      separationStrength: d === null ? null : Math.abs(d)
    });
  }

  // Rank by absolute effect size first; tie-breaker by absDiff.
  results.sort((a, b) => {
    const ea = a.separationStrength;
    const eb = b.separationStrength;
    if (ea === null && eb === null) return 0;
    if (ea === null) return 1;
    if (eb === null) return -1;
    if (eb !== ea) return eb - ea;
    const da = a.absDiff || 0;
    const db = b.absDiff || 0;
    return db - da;
  });

  const out = {
    meta: {
      joinedPath,
      denseGroupSize: dense.length,
      sparseGroupSize: sparse.length,
      denseSongs: dense.map((r) => ({ artist: r.artist, title: r.title })),
      sparseSongs: sparse.map((r) => ({ artist: r.artist, title: r.title }))
    },
    rankedDescriptors: results,
    top15: results.slice(0, 15)
  };

  fs.writeFileSync(outJsonPath, JSON.stringify(out, null, 2));
  console.log('[descriptor_separation_dense_sparse] wrote:', outJsonPath);
  console.log('[descriptor_separation_dense_sparse] dense songs:', dense.length);
  console.log('[descriptor_separation_dense_sparse] sparse songs:', sparse.length);
  console.log('[descriptor_separation_dense_sparse] descriptors ranked:', results.length);
}

main();
