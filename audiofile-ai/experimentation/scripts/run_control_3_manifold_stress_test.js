const fs = require('fs');
const path = require('path');

const { ensureDir, writeJsonFile } = require('../utils/io');
const { loadMusicStoryBatches } = require('../utils/loadMusicStoryBatches');
const { normalizeFromDescriptors } = require('../../src/features/normalize');

function clamp(v, min, max) {
  if (v === null || v === undefined || Number.isNaN(v)) return null;
  return Math.max(min, Math.min(max, v));
}

function mean(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function std(xs) {
  const m = mean(xs);
  if (m === null) return null;
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  const v = vals.reduce((acc, x) => acc + (x - m) ** 2, 0) / vals.length;
  return Math.sqrt(v);
}

function median(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const mid = Math.floor(vals.length / 2);
  return vals.length % 2 === 0 ? (vals[mid - 1] + vals[mid]) / 2 : vals[mid];
}

function percentile(xs, p) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const idx = clamp((p / 100) * (vals.length - 1), 0, vals.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return vals[lo];
  const t = idx - lo;
  return vals[lo] * (1 - t) + vals[hi] * t;
}

function pearson(xs, ys) {
  const pairs = [];
  for (let i = 0; i < Math.min(xs.length, ys.length); i += 1) {
    const x = xs[i];
    const y = ys[i];
    if (typeof x === 'number' && !Number.isNaN(x) && typeof y === 'number' && !Number.isNaN(y)) {
      pairs.push([x, y]);
    }
  }
  if (pairs.length < 8) return { r: null, n: pairs.length };

  const mx = pairs.reduce((a, [x]) => a + x, 0) / pairs.length;
  const my = pairs.reduce((a, [, y]) => a + y, 0) / pairs.length;

  let num = 0;
  let dx = 0;
  let dy = 0;
  for (const [x, y] of pairs) {
    num += (x - mx) * (y - my);
    dx += (x - mx) ** 2;
    dy += (y - my) ** 2;
  }
  const den = Math.sqrt(dx * dy);
  if (!den) return { r: null, n: pairs.length };
  return { r: num / den, n: pairs.length };
}

function rankify(xs) {
  // Average ranks for ties
  const vals = xs.map((v, idx) => ({ v, idx })).filter((x) => typeof x.v === 'number' && !Number.isNaN(x.v));
  vals.sort((a, b) => a.v - b.v);

  const ranks = new Array(xs.length).fill(null);
  let i = 0;
  while (i < vals.length) {
    let j = i;
    while (j + 1 < vals.length && vals[j + 1].v === vals[i].v) j += 1;
    const avgRank = (i + 1 + (j + 1)) / 2;
    for (let k = i; k <= j; k += 1) ranks[vals[k].idx] = avgRank;
    i = j + 1;
  }
  return ranks;
}

function spearman(xs, ys) {
  const rx = rankify(xs);
  const ry = rankify(ys);
  return pearson(rx, ry);
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) s += a[i] * b[i];
  return s;
}

function norm(a) {
  return Math.sqrt(dot(a, a));
}

function normalizeVec(a) {
  const n = norm(a);
  if (!n) return a.map(() => 0);
  return a.map((x) => x / n);
}

function transpose(A) {
  const m = A.length;
  const n = A[0].length;
  const out = Array.from({ length: n }, () => Array.from({ length: m }, () => 0));
  for (let i = 0; i < m; i += 1) {
    for (let j = 0; j < n; j += 1) out[j][i] = A[i][j];
  }
  return out;
}

function matMul(A, B) {
  const m = A.length;
  const n = A[0].length;
  const p = B[0].length;
  const out = Array.from({ length: m }, () => Array.from({ length: p }, () => 0));
  for (let i = 0; i < m; i += 1) {
    for (let k = 0; k < n; k += 1) {
      const aik = A[i][k];
      for (let j = 0; j < p; j += 1) out[i][j] += aik * B[k][j];
    }
  }
  return out;
}

function matVec(A, v) {
  const m = A.length;
  const n = A[0].length;
  const out = Array.from({ length: m }, () => 0);
  for (let i = 0; i < m; i += 1) {
    let s = 0;
    for (let j = 0; j < n; j += 1) s += A[i][j] * v[j];
    out[i] = s;
  }
  return out;
}

function pcaPowerIteration({ rows, featureIds, maxComponents = 6 }) {
  const n = rows.length;
  const p = featureIds.length;
  if (n < Math.max(12, p + 2)) {
    return { n, p, note: 'insufficient_rows', components: [] };
  }

  const means = Array.from({ length: p }, (_, j) => mean(rows.map((r) => r[j])));
  const stds = Array.from({ length: p }, (_, j) => std(rows.map((r) => r[j])) || 1);
  const Z = rows.map((r) => r.map((x, j) => (x - means[j]) / stds[j]));

  const Zt = transpose(Z);
  let C = matMul(Zt, Z);
  for (let i = 0; i < p; i += 1) {
    for (let j = 0; j < p; j += 1) C[i][j] /= Math.max(1, n - 1);
  }

  const totalVar = C.reduce((acc, row, i) => acc + row[i], 0);

  const components = [];
  let A = C;

  for (let k = 0; k < Math.min(maxComponents, p); k += 1) {
    let v = normalizeVec(Array.from({ length: p }, () => Math.random() - 0.5));
    for (let it = 0; it < 80; it += 1) {
      const Av = matVec(A, v);
      v = normalizeVec(Av);
    }
    const Av = matVec(A, v);
    const lambda = dot(v, Av);
    if (!lambda || lambda < 1e-9) break;

    const loadings = featureIds.map((featureId, idx) => ({ featureId, loading: v[idx] }));
    loadings.sort((a, b) => Math.abs(b.loading) - Math.abs(a.loading));

    components.push({
      component: k + 1,
      eigenvalue: lambda,
      explainedVarianceRatio: totalVar ? lambda / totalVar : null,
      topLoadings: loadings.slice(0, 10)
    });

    // Deflate
    const nextA = Array.from({ length: p }, () => Array.from({ length: p }, () => 0));
    for (let i = 0; i < p; i += 1) {
      for (let j = 0; j < p; j += 1) {
        nextA[i][j] = A[i][j] - lambda * v[i] * v[j];
      }
    }
    A = nextA;
  }

  return { n, p, note: null, totalVariance: totalVar, components };
}

function summarizeVector(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  return {
    nTotal: xs.length,
    nNumeric: vals.length,
    missingRate: xs.length ? 1 - vals.length / xs.length : null,
    mean: mean(vals),
    std: std(vals),
    min: vals.length ? Math.min(...vals) : null,
    max: vals.length ? Math.max(...vals) : null,
    p10: percentile(vals, 10),
    p50: median(vals),
    p90: percentile(vals, 90)
  };
}

function selectCoreFeatures({ featureIds, vectorsByFeature, maxMissingRate = 0.05, minNumeric = 40 }) {
  const core = [];
  const stats = {};
  for (const f of featureIds) {
    const s = summarizeVector(vectorsByFeature[f]);
    stats[f] = s;
    if (typeof s.missingRate === 'number' && s.missingRate <= maxMissingRate && s.nNumeric >= minNumeric) core.push(f);
  }
  core.sort();
  return { core, stats };
}

function buildVectors(items, ids, getter) {
  const by = {};
  for (const id of ids) {
    by[id] = items.map((it) => getter(it, id));
  }
  return by;
}

function euclid(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

function farthestPointSample({ points, targetSize, seedCount = 1 }) {
  // points: [{ id, vec }]
  if (points.length <= targetSize) return points.map((p) => p.id);

  // Start with a random seed (or multiple)
  const chosen = [];
  const used = new Set();

  function pickOne(idx) {
    chosen.push(points[idx].id);
    used.add(points[idx].id);
  }

  for (let s = 0; s < seedCount; s += 1) {
    const idx = Math.floor(Math.random() * points.length);
    if (!used.has(points[idx].id)) pickOne(idx);
  }

  const distToChosen = new Map();
  for (const p of points) distToChosen.set(p.id, Infinity);

  function updateDistances(newId) {
    const pNew = points.find((p) => p.id === newId);
    for (const p of points) {
      if (used.has(p.id)) continue;
      const d = euclid(p.vec, pNew.vec);
      const cur = distToChosen.get(p.id);
      if (d < cur) distToChosen.set(p.id, d);
    }
  }

  for (const id of chosen) updateDistances(id);

  while (chosen.length < targetSize) {
    let bestId = null;
    let bestD = -1;
    for (const p of points) {
      if (used.has(p.id)) continue;
      const d = distToChosen.get(p.id);
      if (d > bestD) {
        bestD = d;
        bestId = p.id;
      }
    }
    if (!bestId) break;
    chosen.push(bestId);
    used.add(bestId);
    updateDistances(bestId);
  }

  return chosen;
}

function quantileSeeds({ items, featureId, values, quantiles = [0, 0.05, 0.1, 0.5, 0.9, 0.95, 1] }) {
  const pairs = items
    .map((it, idx) => ({ it, v: values[idx] }))
    .filter((x) => typeof x.v === 'number')
    .sort((a, b) => a.v - b.v);

  if (!pairs.length) return [];

  const seeds = [];
  for (const q of quantiles) {
    const pos = Math.floor(clamp(q, 0, 1) * (pairs.length - 1));
    const chosen = pairs[pos];
    if (chosen && chosen.it && chosen.it.__id) {
      seeds.push({ id: chosen.it.__id, featureId, q, value: chosen.v });
    }
  }

  // unique
  const seen = new Set();
  return seeds.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });
}

function kmeans({ points, k = 6, maxIters = 40 }) {
  if (points.length < k) {
    return {
      k,
      assignments: points.map(() => 0),
      centroids: [meanVec(points.map((p) => p.vec))]
    };
  }

  // init centroids by farthest sampling for stability
  const initIds = farthestPointSample({ points, targetSize: k, seedCount: 1 });
  let centroids = initIds.map((id) => points.find((p) => p.id === id).vec.slice());

  let assignments = new Array(points.length).fill(0);

  for (let iter = 0; iter < maxIters; iter += 1) {
    let changed = 0;

    // assign
    for (let i = 0; i < points.length; i += 1) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < centroids.length; c += 1) {
        const d = euclid(points[i].vec, centroids[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best;
        changed += 1;
      }
    }

    if (!changed && iter > 0) break;

    // recompute centroids
    const buckets = Array.from({ length: k }, () => []);
    for (let i = 0; i < points.length; i += 1) buckets[assignments[i]].push(points[i].vec);

    centroids = buckets.map((bucket, idx) => {
      if (!bucket.length) return centroids[idx];
      return meanVec(bucket);
    });
  }

  return { k, assignments, centroids };
}

function meanVec(vs) {
  const d = vs[0].length;
  const out = Array.from({ length: d }, () => 0);
  for (const v of vs) {
    for (let i = 0; i < d; i += 1) out[i] += v[i];
  }
  for (let i = 0; i < d; i += 1) out[i] /= vs.length;
  return out;
}

function localPairCorrelation({ points, featureA, featureB, k = 12 }) {
  // For each point, compute correlation of A vs B within its kNN neighborhood.
  // points: { id, vec, features }
  const locals = [];

  const vecs = points.map((p) => p.vec);

  for (let i = 0; i < points.length; i += 1) {
    const dists = [];
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      dists.push({ j, d: euclid(vecs[i], vecs[j]) });
    }
    dists.sort((a, b) => a.d - b.d);
    const neighbors = dists.slice(0, k).map((x) => x.j);

    const xs = [];
    const ys = [];
    for (const j of neighbors) {
      xs.push(points[j].features[featureA]);
      ys.push(points[j].features[featureB]);
    }

    const { r, n } = pearson(xs, ys);
    if (r === null) continue;
    locals.push({ r, n });
  }

  const rs = locals.map((x) => x.r);
  return {
    k,
    neighborhoods: locals.length,
    r_mean: mean(rs),
    r_median: median(rs),
    r_p10: percentile(rs, 10),
    r_p90: percentile(rs, 90)
  };
}

function pairCorrelationReport(ids, vectorsById) {
  const pairs = [];
  for (let i = 0; i < ids.length; i += 1) {
    for (let j = i + 1; j < ids.length; j += 1) {
      const a = ids[i];
      const b = ids[j];
      const { r, n } = pearson(vectorsById[a], vectorsById[b]);
      if (r === null) continue;
      pairs.push({ a, b, r, n, absR: Math.abs(r) });
    }
  }
  pairs.sort((x, y) => y.absR - x.absR);
  return {
    totalPairs: pairs.length,
    topAbsolute: pairs.slice(0, 60),
    topPositive: pairs.filter((p) => p.r > 0).slice(0, 30),
    topNegative: pairs.filter((p) => p.r < 0).slice(0, 30),
    all: pairs
  };
}

function independenceApprox({ ids, vectorsById }) {
  // Approximate unique variance: for each feature, regress on top 6 correlated other features.
  // This avoids singular full regression.
  const out = {};

  const corrAll = pairCorrelationReport(ids, vectorsById).all;
  const neighbors = {};
  for (const id of ids) neighbors[id] = [];
  for (const p of corrAll) {
    neighbors[p.a].push({ other: p.b, absR: p.absR });
    neighbors[p.b].push({ other: p.a, absR: p.absR });
  }
  for (const id of ids) neighbors[id].sort((a, b) => b.absR - a.absR);

  function solveRidge(X, y, lambda = 1e-5) {
    const Xt = transpose(X);
    const XtX = matMul(Xt, X);
    const p = XtX.length;
    for (let i = 0; i < p; i += 1) XtX[i][i] += lambda;

    const Inv = invertMatrix(XtX);
    if (!Inv) return null;

    const Xty = matVec(Xt, y);
    return matVec(Inv, Xty);
  }

  function invertMatrix(A) {
    const n = A.length;
    const M = A.map((r) => r.slice());
    const I = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

    for (let col = 0; col < n; col += 1) {
      let pivot = col;
      for (let r = col + 1; r < n; r += 1) {
        if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
      }
      const pv = M[pivot][col];
      if (!pv || Math.abs(pv) < 1e-12) return null;
      if (pivot !== col) {
        [M[pivot], M[col]] = [M[col], M[pivot]];
        [I[pivot], I[col]] = [I[col], I[pivot]];
      }
      const scale = M[col][col];
      for (let j = 0; j < n; j += 1) {
        M[col][j] /= scale;
        I[col][j] /= scale;
      }
      for (let r = 0; r < n; r += 1) {
        if (r === col) continue;
        const f = M[r][col];
        if (!f) continue;
        for (let j = 0; j < n; j += 1) {
          M[r][j] -= f * M[col][j];
          I[r][j] -= f * I[col][j];
        }
      }
    }
    return I;
  }

  function rSquared(y, yHat) {
    const pairs = [];
    for (let i = 0; i < Math.min(y.length, yHat.length); i += 1) {
      if (typeof y[i] === 'number' && typeof yHat[i] === 'number') pairs.push([y[i], yHat[i]]);
    }
    if (pairs.length < 10) return null;
    const yy = pairs.map(([a]) => a);
    const my = mean(yy);
    let ssTot = 0;
    let ssRes = 0;
    for (const [a, b] of pairs) {
      ssTot += (a - my) ** 2;
      ssRes += (a - b) ** 2;
    }
    if (!ssTot) return null;
    return 1 - ssRes / ssTot;
  }

  for (const target of ids) {
    const preds = neighbors[target].slice(0, 6).map((x) => x.other);

    const y = [];
    const X = [];
    for (let i = 0; i < vectorsById[target].length; i += 1) {
      const yv = vectorsById[target][i];
      if (typeof yv !== 'number') continue;
      const row = [1];
      let ok = true;
      for (const p of preds) {
        const pv = vectorsById[p][i];
        if (typeof pv !== 'number') {
          ok = false;
          break;
        }
        row.push(pv);
      }
      if (!ok) continue;
      X.push(row);
      y.push(yv);
    }

    if (y.length < 12) {
      out[target] = { n: y.length, r2: null, uniqueVariance: null, predictors: preds };
      continue;
    }

    const beta = solveRidge(X, y);
    if (!beta) {
      out[target] = { n: y.length, r2: null, uniqueVariance: null, predictors: preds };
      continue;
    }

    const yHat = X.map((row) => dot(row, beta));
    const r2 = rSquared(y, yHat);
    out[target] = { n: y.length, r2, uniqueVariance: r2 === null ? null : clamp(1 - r2, 0, 1), predictors: preds };
  }

  const rankings = Object.entries(out)
    .map(([featureId, m]) => ({ featureId, ...m }))
    .filter((x) => typeof x.uniqueVariance === 'number')
    .sort((a, b) => b.uniqueVariance - a.uniqueVariance);

  const redundancy = Object.entries(out)
    .map(([featureId, m]) => ({ featureId, ...m }))
    .filter((x) => typeof x.r2 === 'number')
    .sort((a, b) => (b.r2 || 0) - (a.r2 || 0));

  return { byFeature: out, rankings, redundancy };
}

function buildMarkdown({ meta, summary, dataset, global, local, descriptor, nonlinear, conclusions }) {
  const lines = [];
  lines.push('# CONTROL_3_MANIFOLD_STRESS_TEST');
  lines.push('');
  lines.push('## Run metadata');
  lines.push('');
  lines.push(`- Generated at: ${meta.generatedAt}`);
  lines.push(`- Source cache: ${meta.cacheSummaryPath}`);
  lines.push(`- Total cache successes: ${meta.totalSuccesses}`);
  lines.push(`- Sampled tracks: ${summary.sampled}`);
  lines.push(`- Core feature count: ${summary.coreFeatures.length}`);
  lines.push(`- Core input count: ${summary.coreInputs.length}`);
  lines.push('');

  lines.push('## Part 1 — Controlled dataset expansion');
  lines.push('');
  lines.push(`- Selection strategy: ${dataset.strategy}`);
  lines.push(`- Seeds (quantiles): ${dataset.seedCount}`);
  lines.push(`- Farthest-point fill: ${dataset.farthestFillCount}`);
  lines.push('');

  lines.push('## Part 2 — Latent structure re-evaluation (global)');
  lines.push('');
  lines.push('### Core-feature correlation highlights (top absolute)');
  lines.push('');
  for (const p of global.featureCorrelations.topAbsolute.slice(0, 20)) {
    lines.push(`- ${p.a} vs ${p.b}: r=${p.r.toFixed(3)} n=${p.n}`);
  }
  lines.push('');

  lines.push('### PCA (features)');
  lines.push('');
  lines.push(`- PCA rows: ${global.pcaFeatures.n} (features: ${global.pcaFeatures.p})`);
  if (global.pcaFeatures.note) lines.push(`- Note: ${global.pcaFeatures.note}`);
  lines.push('');
  for (const c of global.pcaFeatures.components.slice(0, 6)) {
    lines.push(`- PC${c.component}: explainedVarianceRatio=${c.explainedVarianceRatio === null ? 'null' : c.explainedVarianceRatio.toFixed(3)}`);
    lines.push(`  topLoadings=${c.topLoadings.slice(0, 6).map((x) => `${x.featureId}:${x.loading.toFixed(3)}`).join(', ')}`);
  }
  lines.push('');

  lines.push('### Unique variance (approx)');
  lines.push('');
  for (const r of global.independence.rankings.slice(0, 10)) {
    lines.push(`- ${r.featureId}: uniqueVariance=${r.uniqueVariance.toFixed(3)} R²=${r.r2.toFixed(3)} preds=${r.predictors.join(',')}`);
  }
  lines.push('');

  lines.push('## Part 3 — Local vs global collapse');
  lines.push('');
  lines.push(`- KMeans clusters: k=${local.kmeans.k}`);
  lines.push('');
  lines.push('### Key pair correlations by cluster');
  lines.push('');
  for (const pair of local.keyPairByCluster) {
    lines.push(`- ${pair.a} vs ${pair.b}: ${pair.byCluster.map((x) => `c${x.cluster}:r=${x.r === null ? 'null' : x.r.toFixed(3)}(n=${x.n})`).join(' | ')}`);
  }
  lines.push('');

  lines.push('## Part 4 — Descriptor bottleneck analysis (inputTrace descriptors)');
  lines.push('');
  lines.push('### Descriptor PCA');
  lines.push('');
  lines.push(`- PCA rows: ${descriptor.pcaInputs.n} (inputs: ${descriptor.pcaInputs.p})`);
  if (descriptor.pcaInputs.note) lines.push(`- Note: ${descriptor.pcaInputs.note}`);
  for (const c of descriptor.pcaInputs.components.slice(0, 6)) {
    lines.push(`- PC${c.component}: explainedVarianceRatio=${c.explainedVarianceRatio === null ? 'null' : c.explainedVarianceRatio.toFixed(3)}`);
    lines.push(`  topLoadings=${c.topLoadings.slice(0, 6).map((x) => `${x.featureId}:${x.loading.toFixed(3)}`).join(', ')}`);
  }
  lines.push('');

  lines.push('## Part 5 — Nonlinear structure testing (proxy)');
  lines.push('');
  lines.push('### Spearman correlations for key pairs');
  lines.push('');
  for (const p of nonlinear.keyPairSpearman) {
    lines.push(`- ${p.a} vs ${p.b}: spearman_r=${p.r === null ? 'null' : p.r.toFixed(3)} n=${p.n}`);
  }
  lines.push('');

  lines.push('### Local neighborhood correlations (kNN) for key pairs');
  lines.push('');
  for (const p of nonlinear.keyPairLocal) {
    lines.push(`- ${p.a} vs ${p.b}: mean=${p.local.r_mean === null ? 'null' : p.local.r_mean.toFixed(3)} median=${p.local.r_median === null ? 'null' : p.local.r_median.toFixed(3)} p10=${p.local.r_p10 === null ? 'null' : p.local.r_p10.toFixed(3)} p90=${p.local.r_p90 === null ? 'null' : p.local.r_p90.toFixed(3)} neighborhoods=${p.local.neighborhoods}`);
  }
  lines.push('');

  lines.push('## Part 6 — Semantic axis stability conclusions');
  lines.push('');
  for (const c of conclusions.dimensionClassifications) {
    lines.push(`- ${c.featureId}: ${c.classification} (confidence=${c.confidence}) note=${c.note}`);
  }
  lines.push('');

  lines.push('## Final required answers');
  lines.push('');
  lines.push(`- Independent semantic axes (features PCA, rough): ${conclusions.axisEstimate.features}`);
  lines.push(`- Independent semantic axes (descriptor PCA, rough): ${conclusions.axisEstimate.descriptors}`);
  lines.push(`- Bottleneck assessment: ${conclusions.bottleneckAssessment}`);
  lines.push(`- Highest-leverage next analytical step: ${conclusions.nextStep}`);
  lines.push('');

  lines.push('## Full outputs');
  lines.push('');
  lines.push(`- JSON: ${meta.outputJsonPath}`);

  return lines.join('\n');
}

async function run() {
  const cache = loadMusicStoryBatches();
  const successes = cache.successes;

  const normalized = [];

  for (let i = 0; i < successes.length; i += 1) {
    const e = successes[i];
    const musicStory = { provider: 'music_story', available: true, data: e.rawDescriptorData };
    const acousticBrainz = { provider: 'acousticbrainz', available: false, data: {} };

    const { normalizedFeatures, analysis } = normalizeFromDescriptors({ musicStory, acousticBrainz });

    normalized.push({
      __id: `${e.batchFile}::${e.index}::${e.isrc || ''}::${e.title || ''}`,
      title: e.title,
      artist: e.artist,
      isrc: e.isrc,
      providerRecordingId: e.providerRecordingId,
      batchFile: e.batchFile,
      index: e.index,
      normalizedFeatures,
      analysis,
      rawDescriptorData: e.rawDescriptorData
    });
  }

  // Define key feature list (if present)
  const featureIds = Array.from(
    new Set(
      normalized.flatMap((t) => Object.keys(t.normalizedFeatures || {}))
    )
  ).sort();

  const vectorsByFeature = buildVectors(normalized, featureIds, (t, f) => {
    const v = t.normalizedFeatures ? t.normalizedFeatures[f] : null;
    return typeof v === 'number' ? v : null;
  });

  const { core: coreFeatures } = selectCoreFeatures({ featureIds, vectorsByFeature, maxMissingRate: 0.05, minNumeric: 60 });

  // Inputs from inputTrace
  const inputIds = Array.from(
    new Set(
      normalized.flatMap((t) => Object.keys((t.analysis && t.analysis.inputTrace) || {}))
    )
  ).sort();

  const vectorsByInput = buildVectors(normalized, inputIds, (t, id) => {
    const it = (t.analysis && t.analysis.inputTrace) || {};
    const v = it[id] && it[id].available ? it[id].value : null;
    return typeof v === 'number' ? v : null;
  });

  const { core: coreInputs } = selectCoreFeatures({ featureIds: inputIds, vectorsByFeature: vectorsByInput, maxMissingRate: 0.05, minNumeric: 60 });

  // Dataset expansion: quantile seeds across key dimensions + farthest-point fill on core feature space
  const keyForSeeding = [
    'energy_score',
    'calm_score',
    'pulse_score',
    'driving_score',
    'punch_score',
    'syncopation_score',
    'brightness_score',
    'darkness_score',
    'valence_score',
    'density_score',
    'vocal_score',
    'instrumental_score',
    'speech_score'
  ].filter((f) => featureIds.includes(f));

  const seedMeta = [];
  const seedIds = new Set();

  for (const f of keyForSeeding) {
    const seeds = quantileSeeds({ items: normalized, featureId: f, values: vectorsByFeature[f] });
    for (const s of seeds) {
      seedMeta.push(s);
      seedIds.add(s.id);
    }
  }

  // Prepare points for coverage sampling
  const points = normalized
    .map((t) => {
      const vec = coreFeatures.map((f) => t.normalizedFeatures[f]);
      const ok = vec.every((x) => typeof x === 'number');
      return ok ? { id: t.__id, vec } : null;
    })
    .filter(Boolean);

  const TARGET = Math.min(260, Math.max(120, Math.floor(points.length * 0.75)));

  // Start with seeds (that are in the points set)
  const seedInPoints = new Set(points.map((p) => p.id));
  const initial = Array.from(seedIds).filter((id) => seedInPoints.has(id));

  // Use farthest-point sampling for the remainder, but ensure seeds included
  const selected = new Set(initial);

  // Create a reduced points list excluding selected
  const remainingPoints = points.filter((p) => !selected.has(p.id));

  // If we already exceeded target (unlikely), truncate deterministically
  if (selected.size > TARGET) {
    const keep = Array.from(selected).slice(0, TARGET);
    selected.clear();
    for (const id of keep) selected.add(id);
  }

  const toFill = TARGET - selected.size;
  let fillIds = [];
  if (toFill > 0) {
    // Create a combined list where chosen seeds are treated as already chosen by pre-seeding dist map.
    const allPoints = points;
    // We will do naive farthest sampling by running farthestPointSample on allPoints to get TARGET,
    // then union with seeds. This biases to coverage.
    const fps = farthestPointSample({ points: allPoints, targetSize: TARGET, seedCount: 2 });
    fillIds = fps;
    for (const id of fillIds) selected.add(id);

    // Enforce target size
    const final = Array.from(selected);
    if (final.length > TARGET) {
      // Prefer keeping seeds; drop extras
      const seedsFirst = final.sort((a, b) => (seedIds.has(b) ? 1 : 0) - (seedIds.has(a) ? 1 : 0));
      selected.clear();
      for (const id of seedsFirst.slice(0, TARGET)) selected.add(id);
    }
  }

  const sampled = normalized.filter((t) => selected.has(t.__id));

  // Build sampled vectors
  const sampledFeatureVectors = buildVectors(sampled, coreFeatures, (t, f) => t.normalizedFeatures[f]);
  const sampledInputVectors = buildVectors(sampled, coreInputs, (t, id) => {
    const it = (t.analysis && t.analysis.inputTrace) || {};
    return it[id] && it[id].available ? it[id].value : null;
  });

  const globalFeatureCorr = pairCorrelationReport(coreFeatures, sampledFeatureVectors);
  const globalInputCorr = pairCorrelationReport(coreInputs, sampledInputVectors);

  const globalIndependence = independenceApprox({ ids: coreFeatures, vectorsById: sampledFeatureVectors });

  // PCA on feature space
  const featureRows = [];
  for (let i = 0; i < sampled.length; i += 1) {
    const row = coreFeatures.map((f) => sampled[i].normalizedFeatures[f]);
    if (row.every((x) => typeof x === 'number')) featureRows.push(row);
  }
  const pcaFeatures = pcaPowerIteration({ rows: featureRows, featureIds: coreFeatures, maxComponents: 6 });

  // PCA on descriptor/input space
  const inputRows = [];
  for (let i = 0; i < sampled.length; i += 1) {
    const it = (sampled[i].analysis && sampled[i].analysis.inputTrace) || {};
    const row = coreInputs.map((id) => (it[id] && it[id].available ? it[id].value : null));
    if (row.every((x) => typeof x === 'number')) inputRows.push(row);
  }
  const pcaInputs = pcaPowerIteration({ rows: inputRows, featureIds: coreInputs, maxComponents: 6 });

  // Local vs global collapse via kmeans on core feature space
  const pointObjs = sampled
    .map((t) => {
      const vec = coreFeatures.map((f) => t.normalizedFeatures[f]);
      const ok = vec.every((x) => typeof x === 'number');
      if (!ok) return null;
      return {
        id: t.__id,
        vec,
        features: t.normalizedFeatures
      };
    })
    .filter(Boolean);

  const km = kmeans({ points: pointObjs, k: 6, maxIters: 50 });

  const keyPairs = [
    ['energy_score', 'calm_score'],
    ['pulse_score', 'driving_score'],
    ['pulse_score', 'punch_score'],
    ['darkness_score', 'valence_score'],
    ['density_score', 'energy_score'],
    ['syncopation_score', 'pulse_score'],
    ['brightness_score', 'valence_score']
  ].filter(([a, b]) => coreFeatures.includes(a) && coreFeatures.includes(b));

  const keyPairByCluster = [];

  for (const [a, b] of keyPairs) {
    const byCluster = [];
    for (let c = 0; c < km.k; c += 1) {
      const xs = [];
      const ys = [];
      for (let i = 0; i < pointObjs.length; i += 1) {
        if (km.assignments[i] !== c) continue;
        xs.push(pointObjs[i].features[a]);
        ys.push(pointObjs[i].features[b]);
      }
      const { r, n } = pearson(xs, ys);
      byCluster.push({ cluster: c, r, n });
    }
    keyPairByCluster.push({ a, b, byCluster });
  }

  // Nonlinear testing proxies: spearman + local kNN correlations
  const keyPairSpearman = [];
  const keyPairLocal = [];

  for (const [a, b] of keyPairs) {
    const xs = sampledFeatureVectors[a];
    const ys = sampledFeatureVectors[b];
    const sp = spearman(xs, ys);
    keyPairSpearman.push({ a, b, ...sp });

    const local = localPairCorrelation({ points: pointObjs, featureA: a, featureB: b, k: 14 });
    keyPairLocal.push({ a, b, local });
  }

  // Descriptor bottleneck: compare descriptor axis count vs feature axis count
  const axisEstimate = {
    features: pcaFeatures.components.slice(0, 6).map((c) => c.explainedVarianceRatio).filter((x) => typeof x === 'number'),
    descriptors: pcaInputs.components.slice(0, 6).map((c) => c.explainedVarianceRatio).filter((x) => typeof x === 'number')
  };

  // Dimension stability classification (rule-based from results)
  const dimensionClassifications = coreFeatures.map((f) => {
    const indep = globalIndependence.byFeature[f];
    const uv = indep && typeof indep.uniqueVariance === 'number' ? indep.uniqueVariance : null;

    let classification = 'Descriptor-Limited';
    let confidence = 'medium';
    let note = '';

    if (uv !== null && uv > 0.25) {
      classification = 'Globally Independent';
      confidence = 'high';
      note = 'retains unique variance after conditioning on nearest correlated dimensions';
    } else if (uv !== null && uv > 0.12) {
      classification = 'Locally/Moderately Independent';
      confidence = 'medium';
      note = 'some unique variance remains, but entangled';
    } else if (uv !== null && uv < 0.05) {
      classification = 'Fundamentally Redundant (in current descriptor space)';
      confidence = 'high';
      note = 'can be predicted almost entirely by correlated dimensions';
    }

    // Special-case descriptor-starved features excluded from core
    return { featureId: f, classification, confidence, note };
  });

  const bottleneckAssessment = (() => {
    const f2 = axisEstimate.features;
    const d2 = axisEstimate.descriptors;
    const fTop = f2.slice(0, 3).reduce((a, b) => a + (b || 0), 0);
    const dTop = d2.slice(0, 3).reduce((a, b) => a + (b || 0), 0);

    if (dTop && fTop && Math.abs(dTop - fTop) < 0.1) {
      return 'Descriptor-induced bottleneck likely: descriptor PCA explains similar variance with similar axis count; feature collapse may reflect upstream descriptor capacity.';
    }
    if (dTop > fTop + 0.15) {
      return 'Architecture/formula-induced collapse likely: descriptors retain more independent variance than features.';
    }
    if (fTop > dTop + 0.15) {
      return 'Unexpected: features appear to expand variance beyond descriptors (likely due to nonlinear mixes); verify.';
    }
    return 'Mixed evidence: both descriptor limitations and architecture-induced coupling likely contribute.';
  })();

  const conclusions = {
    axisEstimate: {
      features: axisEstimate.features.length ? `PC1-3 sum≈${axisEstimate.features.slice(0, 3).reduce((a, b) => a + b, 0).toFixed(3)}` : 'n/a',
      descriptors: axisEstimate.descriptors.length ? `PC1-3 sum≈${axisEstimate.descriptors.slice(0, 3).reduce((a, b) => a + b, 0).toFixed(3)}` : 'n/a'
    },
    bottleneckAssessment,
    dimensionClassifications,
    nextStep:
      'Acquire additional descriptor providers or raw-audio features for at least one expanded batch, then rerun this same stress test to directly measure descriptor-space dimensional capacity vs current Music Story ceiling.'
  };

  const meta = {
    generatedAt: new Date().toISOString(),
    cacheSummaryPath: 'baseline/data/musicstory (via loadMusicStoryBatches)',
    totalSuccesses: successes.length,
    outputJsonPath: path.join(__dirname, '..', 'outputs', 'control_3_manifold_stress_test.json')
  };

  const summary = {
    sampled: sampled.length,
    coreFeatures,
    coreInputs
  };

  const dataset = {
    strategy: 'Quantile seeding across key dimensions + farthest-point sampling for coverage in core feature space',
    seedCount: seedMeta.length,
    farthestFillCount: sampled.length - initial.length,
    target: TARGET,
    keySeedingFeatures: keyForSeeding,
    seedMeta: seedMeta.slice(0, 60)
  };

  const global = {
    featureCorrelations: globalFeatureCorr,
    descriptorCorrelations: globalInputCorr,
    independence: globalIndependence,
    pcaFeatures,
    pcaInputs
  };

  const local = {
    kmeans: { k: km.k, centroids: km.centroids },
    keyPairByCluster
  };

  const descriptor = {
    coreInputs,
    pcaInputs,
    descriptorCorrelations: globalInputCorr
  };

  const nonlinear = {
    keyPairSpearman,
    keyPairLocal
  };

  const outJson = path.join(__dirname, '..', 'outputs', 'control_3_manifold_stress_test.json');
  const outMd = path.join(__dirname, '..', 'reports', 'control_3_manifold_stress_test.md');

  ensureDir(path.dirname(outJson));
  ensureDir(path.dirname(outMd));

  writeJsonFile(outJson, {
    meta,
    summary,
    cacheSummary: cache.summary,
    dataset,
    sampledTracks: sampled.map((t) => ({
      id: t.__id,
      title: t.title,
      artist: t.artist,
      isrc: t.isrc,
      providerRecordingId: t.providerRecordingId,
      batchFile: t.batchFile,
      index: t.index,
      normalizedFeatures: t.normalizedFeatures,
      inputTrace: t.analysis && t.analysis.inputTrace ? t.analysis.inputTrace : {},
      missingFeatures: t.analysis && Array.isArray(t.analysis.missingFeatures) ? t.analysis.missingFeatures : []
    })),
    global,
    local,
    descriptor,
    nonlinear,
    conclusions
  });

  const md = buildMarkdown({ meta, summary, dataset, global, local, descriptor, nonlinear, conclusions });
  fs.writeFileSync(outMd, md + '\n');

  console.log('[control_3_manifold_stress_test] wrote:');
  console.log('-', outJson);
  console.log('-', outMd);
  console.log('sampled:', sampled.length, 'coreFeatures:', coreFeatures.length, 'coreInputs:', coreInputs.length);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
