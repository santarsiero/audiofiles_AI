const fs = require('fs');

function safeNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function quantile(sorted, p) {
  if (!sorted.length) return null;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const t = idx - lo;
  return sorted[lo] * (1 - t) + sorted[hi] * t;
}

function dist(values) {
  const a = (values || []).map(safeNumber).filter((v) => v !== null).sort((x, y) => x - y);
  const mean = a.length ? a.reduce((s, v) => s + v, 0) / a.length : null;
  return {
    n: a.length,
    min: a[0] ?? null,
    max: a[a.length - 1] ?? null,
    mean,
    median: quantile(a, 0.5),
    p10: quantile(a, 0.1),
    p25: quantile(a, 0.25),
    p50: quantile(a, 0.5),
    p75: quantile(a, 0.75),
    p90: quantile(a, 0.9),
    p95: quantile(a, 0.95),
    p99: quantile(a, 0.99)
  };
}

function computeDensityScore({ event_density, intensity, complexity }) {
  const ed = safeNumber(event_density);
  const it = safeNumber(intensity);
  const cx = safeNumber(complexity);

  // Match normalize.js weightedAverage behavior: ignore missing terms and renormalize weights.
  const items = [
    { w: 0.6, v: ed },
    { w: 0.25, v: it },
    { w: 0.15, v: cx }
  ].filter((x) => x.v !== null);

  if (!items.length) return null;
  const wsum = items.reduce((s, x) => s + x.w, 0);
  const acc = items.reduce((s, x) => s + x.w * x.v, 0);
  const raw = acc / wsum;
  return Math.max(0, Math.min(1, raw));
}

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function main() {
  const successesPath = process.argv[2] || 'experimentation/outputs/musicstory_successes_only.json';
  const joinedCalPath = process.argv[3] || 'experimentation/outputs/calibration_set_1_with_descriptors.json';
  const outPath = process.argv[4] || 'experimentation/outputs/density_distribution_investigation.json';

  console.log('[density_distribution_investigation] start');

  const successes = loadJson(successesPath);
  const rows = Array.isArray(successes.rows) ? successes.rows : [];

  const eventDensity = [];
  const intensity = [];
  const complexity = [];
  const densityScore = [];

  for (const r of rows) {
    const raw = r.rawDescriptorData || {};
    const ed = safeNumber(raw.event_density);
    const it = safeNumber(raw.intensity);
    const cx = safeNumber(raw.complexity);
    const ds = computeDensityScore(raw);

    eventDensity.push(ed);
    intensity.push(it);
    complexity.push(cx);
    densityScore.push(ds);
  }

  const joined = loadJson(joinedCalPath);
  const expectedDenseSubset = [];
  for (const m of joined.matched || []) {
    const exp = m?.calibration?.expectedLabels || [];
    if (!exp.includes('dense')) continue;

    const raw = m?.cache?.rawDescriptorData || {};
    expectedDenseSubset.push({
      artist: m?.calibration?.artist ?? m?.cache?.artist ?? null,
      title: m?.calibration?.title ?? m?.cache?.title ?? null,
      event_density: safeNumber(raw.event_density),
      intensity: safeNumber(raw.intensity),
      complexity: safeNumber(raw.complexity),
      density_score: computeDensityScore(raw)
    });
  }

  const out = {
    meta: {
      successesPath,
      joinedCalPath,
      successesCount: rows.length
    },
    distributions: {
      event_density: dist(eventDensity),
      intensity: dist(intensity),
      complexity: dist(complexity),
      density_score: dist(densityScore)
    },
    expectedDenseSubset
  };

  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('[density_distribution_investigation] wrote:', outPath);
  console.log('[density_distribution_investigation] rows:', rows.length);
  console.log('[density_distribution_investigation] expectedDenseSubset:', expectedDenseSubset.length);
}

main();
