const fs = require('fs');
const path = require('path');

const { ensureDir, readJsonFile, writeJsonFile } = require('../utils/io');

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

function min(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return Math.min(...vals);
}

function max(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  if (!vals.length) return null;
  return Math.max(...vals);
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

function histogram01(xs, bins = 12) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x)).map((x) => clamp(x, 0, 1));
  const counts = Array.from({ length: bins }, () => 0);
  for (const v of vals) {
    const idx = Math.min(bins - 1, Math.floor(v * bins));
    counts[idx] += 1;
  }
  return { bins, counts, total: vals.length };
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

function identity(n) {
  const I = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  return I;
}

function invertMatrix(A) {
  // Gauss-Jordan (small matrices only)
  const n = A.length;
  const M = A.map((row) => row.slice());
  const Inv = identity(n);

  for (let col = 0; col < n; col += 1) {
    // Find pivot
    let pivot = col;
    for (let r = col + 1; r < n; r += 1) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }

    const pv = M[pivot][col];
    if (!pv || Math.abs(pv) < 1e-12) return null;

    if (pivot !== col) {
      [M[pivot], M[col]] = [M[col], M[pivot]];
      [Inv[pivot], Inv[col]] = [Inv[col], Inv[pivot]];
    }

    // Scale pivot row
    const scale = M[col][col];
    for (let j = 0; j < n; j += 1) {
      M[col][j] /= scale;
      Inv[col][j] /= scale;
    }

    // Eliminate other rows
    for (let r = 0; r < n; r += 1) {
      if (r === col) continue;
      const f = M[r][col];
      if (!f) continue;
      for (let j = 0; j < n; j += 1) {
        M[r][j] -= f * M[col][j];
        Inv[r][j] -= f * Inv[col][j];
      }
    }
  }

  return Inv;
}

function solveRidge(X, y, lambda = 1e-6) {
  // X: n x p, y: n
  // beta = (X^T X + lambda I)^-1 X^T y
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const p = XtX.length;
  for (let i = 0; i < p; i += 1) XtX[i][i] += lambda;

  const Inv = invertMatrix(XtX);
  if (!Inv) return null;

  const Xty = matVec(Xt, y);
  const beta = matVec(Inv, Xty);
  return beta;
}

function rSquared(y, yHat) {
  const pairs = [];
  for (let i = 0; i < Math.min(y.length, yHat.length); i += 1) {
    if (typeof y[i] === 'number' && typeof yHat[i] === 'number') pairs.push([y[i], yHat[i]]);
  }
  if (pairs.length < 8) return null;
  const yy = pairs.map(([a]) => a);
  const meanY = mean(yy);
  if (meanY === null) return null;
  let ssTot = 0;
  let ssRes = 0;
  for (const [a, b] of pairs) {
    ssTot += (a - meanY) ** 2;
    ssRes += (a - b) ** 2;
  }
  if (!ssTot) return null;
  return 1 - ssRes / ssTot;
}

function summarizeVector(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && !Number.isNaN(x));
  return {
    nTotal: xs.length,
    nNumeric: vals.length,
    missingRate: xs.length ? 1 - vals.length / xs.length : null,
    mean: mean(vals),
    std: std(vals),
    min: min(vals),
    max: max(vals),
    p10: percentile(vals, 10),
    p25: percentile(vals, 25),
    p50: median(vals),
    p75: percentile(vals, 75),
    p90: percentile(vals, 90),
    saturation: {
      low_le_0_02: vals.length ? vals.filter((x) => x <= 0.02).length / vals.length : null,
      high_ge_0_98: vals.length ? vals.filter((x) => x >= 0.98).length / vals.length : null
    },
    histogram: histogram01(vals, 12)
  };
}

function selectCoreFeatures({ featureIds, vectorsByFeature, maxMissingRate = 0.05, minNumeric = 20 }) {
  const core = [];
  const stats = {};

  for (const f of featureIds) {
    const s = summarizeVector(vectorsByFeature[f]);
    stats[f] = s;
    const mr = s.missingRate;
    if (typeof mr === 'number' && mr <= maxMissingRate && s.nNumeric >= minNumeric) core.push(f);
  }

  core.sort();
  return { coreFeatures: core, featureStats: stats };
}

function getFeatureIds(tracks) {
  const s = new Set();
  for (const t of tracks) {
    const nf = t.normalizedFeatures || {};
    for (const k of Object.keys(nf)) s.add(k);
  }
  return Array.from(s).sort();
}

function getInputIds(tracks) {
  const s = new Set();
  for (const t of tracks) {
    const it = (t.analysis && t.analysis.inputTrace) || {};
    for (const k of Object.keys(it)) s.add(k);
  }
  return Array.from(s).sort();
}

function buildFeatureVectors(tracks, featureIds) {
  const out = {};
  for (const f of featureIds) {
    out[f] = tracks.map((t) => {
      const v = t.normalizedFeatures ? t.normalizedFeatures[f] : null;
      return typeof v === 'number' ? v : null;
    });
  }
  return out;
}

function buildInputVectors(tracks, inputIds) {
  const out = {};
  for (const i of inputIds) {
    out[i] = tracks.map((t) => {
      const it = (t.analysis && t.analysis.inputTrace) || {};
      const v = it[i] && it[i].available ? it[i].value : null;
      return typeof v === 'number' ? v : null;
    });
  }
  return out;
}

function pairwiseFeatureCorrelations(featureIds, vectorsByFeature) {
  const pairs = [];
  for (let i = 0; i < featureIds.length; i += 1) {
    for (let j = i + 1; j < featureIds.length; j += 1) {
      const a = featureIds[i];
      const b = featureIds[j];
      const { r, n } = pearson(vectorsByFeature[a], vectorsByFeature[b]);
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

function independenceMetrics({ tracks, featureIds, vectorsByFeature }) {
  // For each feature, regress it on all others and compute R^2, unique variance, VIF.
  const byFeature = {};

  // Build complete-case matrix for each feature separately.
  for (const target of featureIds) {
    const predictors = featureIds.filter((f) => f !== target);

    const y = [];
    const X = [];

    for (let i = 0; i < tracks.length; i += 1) {
      const row = [];
      const yv = vectorsByFeature[target][i];
      if (typeof yv !== 'number') continue;

      let ok = true;
      for (const p of predictors) {
        const pv = vectorsByFeature[p][i];
        if (typeof pv !== 'number') {
          ok = false;
          break;
        }
        row.push(pv);
      }
      if (!ok) continue;

      // add intercept
      row.unshift(1);
      X.push(row);
      y.push(yv);
    }

    if (y.length < Math.max(12, predictors.length + 3)) {
      byFeature[target] = {
        n: y.length,
        r2: null,
        uniqueVariance: null,
        vif: null,
        note: 'insufficient_complete_cases'
      };
      continue;
    }

    const beta = solveRidge(X, y, 1e-5);
    if (!beta) {
      byFeature[target] = {
        n: y.length,
        r2: null,
        uniqueVariance: null,
        vif: null,
        note: 'singular_matrix'
      };
      continue;
    }

    const yHat = X.map((row) => dot(row, beta));
    const r2 = rSquared(y, yHat);

    const uniqueVariance = r2 === null ? null : clamp(1 - r2, 0, 1);
    const vif = r2 === null || r2 >= 0.999999 ? null : 1 / (1 - r2);

    byFeature[target] = {
      n: y.length,
      r2,
      uniqueVariance,
      vif,
      note: null
    };
  }

  const rankings = Object.entries(byFeature)
    .map(([featureId, m]) => ({ featureId, ...m }))
    .filter((x) => typeof x.uniqueVariance === 'number')
    .sort((a, b) => b.uniqueVariance - a.uniqueVariance);

  const redundancy = Object.entries(byFeature)
    .map(([featureId, m]) => ({ featureId, ...m }))
    .filter((x) => typeof x.r2 === 'number')
    .sort((a, b) => (b.r2 || 0) - (a.r2 || 0));

  return { byFeature, rankings, redundancy };
}

function partialCorrelationMatrix(featureIds, vectorsByFeature) {
  // Partial correlations via inverse correlation matrix on complete-case rows.
  // Returns null if inversion fails.
  const p = featureIds.length;
  if (!p) return null;

  const rows = [];
  for (let r = 0; r < vectorsByFeature[featureIds[0]].length; r += 1) {
    const row = [];
    let ok = true;
    for (const f of featureIds) {
      const v = vectorsByFeature[f][r];
      if (typeof v !== 'number') {
        ok = false;
        break;
      }
      row.push(v);
    }
    if (ok) rows.push(row);
  }

  if (rows.length < Math.max(12, p + 2)) return { n: rows.length, p, note: 'insufficient_complete_cases', partials: [] };

  // Standardize
  const means = Array.from({ length: p }, (_, j) => mean(rows.map((x) => x[j])));
  const stds = Array.from({ length: p }, (_, j) => std(rows.map((x) => x[j])) || 1);
  const Z = rows.map((x) => x.map((v, j) => (v - means[j]) / stds[j]));

  // Correlation matrix ~= covariance since standardized
  const Zt = transpose(Z);
  let R = matMul(Zt, Z);
  for (let i = 0; i < p; i += 1) {
    for (let j = 0; j < p; j += 1) R[i][j] /= Math.max(1, rows.length - 1);
  }

  const P = invertMatrix(R);
  if (!P) return { n: rows.length, p, note: 'singular_matrix', partials: [] };

  const partials = [];
  for (let i = 0; i < p; i += 1) {
    for (let j = i + 1; j < p; j += 1) {
      const pij = -P[i][j] / Math.sqrt(P[i][i] * P[j][j]);
      partials.push({ a: featureIds[i], b: featureIds[j], r: pij, absR: Math.abs(pij) });
    }
  }
  partials.sort((a, b) => b.absR - a.absR);

  return { n: rows.length, p, note: null, partials };
}

function sharedVarianceClusters({ featureIds, corrAll, thresholdAbsR = 0.85 }) {
  // Simple graph clustering: connect edges where |r| >= threshold.
  const adj = new Map(featureIds.map((f) => [f, new Set()]));
  for (const p of corrAll) {
    if (p.absR >= thresholdAbsR) {
      adj.get(p.a).add(p.b);
      adj.get(p.b).add(p.a);
    }
  }

  const seen = new Set();
  const clusters = [];

  for (const f of featureIds) {
    if (seen.has(f)) continue;
    const stack = [f];
    const comp = [];
    seen.add(f);
    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);
      for (const nb of adj.get(cur)) {
        if (!seen.has(nb)) {
          seen.add(nb);
          stack.push(nb);
        }
      }
    }
    comp.sort();
    clusters.push(comp);
  }

  clusters.sort((a, b) => b.length - a.length);

  return {
    thresholdAbsR,
    clusters: clusters.map((c) => ({ size: c.length, features: c }))
  };
}

function normalizationStability({ featureIds, vectorsByFeature, inputIds, vectorsByInput }) {
  // For specific features, compare raw input spreads to output spreads.
  // Also keep general per-feature range/spread.
  const featureDistribution = {};
  for (const f of featureIds) featureDistribution[f] = summarizeVector(vectorsByFeature[f]);

  const inputDistribution = {};
  for (const i of inputIds) inputDistribution[i] = summarizeVector(vectorsByInput[i]);

  // For each feature, find top correlated raw inputs (proxy contributors)
  const dependency = {};
  for (const f of featureIds) {
    const corr = [];
    for (const i of inputIds) {
      const { r, n } = pearson(vectorsByFeature[f], vectorsByInput[i]);
      if (r === null) continue;
      corr.push({ inputId: i, r, n, absR: Math.abs(r) });
    }
    corr.sort((a, b) => b.absR - a.absR);
    dependency[f] = {
      topInputs: corr.slice(0, 10).map(({ inputId, r, n }) => ({ inputId, r, n })),
      correlationCount: corr.length
    };
  }

  return { featureDistribution, inputDistribution, dependency };
}

function formulaSensitivityProxy({ featureIds, inputIds, vectorsByFeature, vectorsByInput }) {
  // Proxy: standardized regression of feature on raw inputs (not causal, but reveals dominance).
  // We use a small subset of top correlated inputs to keep stable.
  const out = [];

  for (const f of featureIds) {
    const corr = [];
    for (const i of inputIds) {
      const { r, n } = pearson(vectorsByFeature[f], vectorsByInput[i]);
      if (r === null) continue;
      corr.push({ inputId: i, r, n, absR: Math.abs(r) });
    }
    corr.sort((a, b) => b.absR - a.absR);
    const candidates = corr.slice(0, 6).map((c) => c.inputId);

    // Build complete-case regression dataset
    const y = [];
    const X = [];

    for (let idx = 0; idx < vectorsByFeature[f].length; idx += 1) {
      const yv = vectorsByFeature[f][idx];
      if (typeof yv !== 'number') continue;

      const row = [];
      let ok = true;
      for (const inputId of candidates) {
        const iv = vectorsByInput[inputId][idx];
        if (typeof iv !== 'number') {
          ok = false;
          break;
        }
        row.push(iv);
      }
      if (!ok) continue;
      row.unshift(1);
      X.push(row);
      y.push(yv);
    }

    let dominance = null;
    let r2 = null;
    let betas = null;

    if (y.length >= 12 && candidates.length >= 1) {
      // Standardize predictors (not intercept)
      const cols = candidates.length;
      const colMeans = Array.from({ length: cols }, (_, c) => mean(X.map((r) => r[c + 1])));
      const colStds = Array.from({ length: cols }, (_, c) => std(X.map((r) => r[c + 1])));

      const Xs = X.map((r) => {
        const rr = r.slice();
        for (let c = 0; c < cols; c += 1) {
          const s = colStds[c] || 1;
          rr[c + 1] = (rr[c + 1] - colMeans[c]) / s;
        }
        return rr;
      });

      const beta = solveRidge(Xs, y, 1e-5);
      if (beta) {
        const yHat = Xs.map((row) => dot(row, beta));
        r2 = rSquared(y, yHat);
        betas = candidates.map((inputId, c) => ({ inputId, beta: beta[c + 1] }));
        betas.sort((a, b) => Math.abs(b.beta) - Math.abs(a.beta));
        const totalAbs = betas.reduce((acc, b) => acc + Math.abs(b.beta), 0);
        dominance = totalAbs ? Math.abs(betas[0].beta) / totalAbs : null;
      }
    }

    out.push({
      featureId: f,
      candidateInputs: candidates,
      topCorrelations: corr.slice(0, 6).map(({ inputId, r, n }) => ({ inputId, r, n })),
      regression: {
        n: y.length,
        r2,
        dominanceTop1: dominance,
        betas
      }
    });
  }

  // Sort: most dominated first (high dominanceTop1), then by regression r2
  out.sort((a, b) => {
    const da = a.regression && typeof a.regression.dominanceTop1 === 'number' ? a.regression.dominanceTop1 : -1;
    const db = b.regression && typeof b.regression.dominanceTop1 === 'number' ? b.regression.dominanceTop1 : -1;
    if (db !== da) return db - da;
    const ra = a.regression && typeof a.regression.r2 === 'number' ? a.regression.r2 : -1;
    const rb = b.regression && typeof b.regression.r2 === 'number' ? b.regression.r2 : -1;
    return rb - ra;
  });

  return out;
}

function pcaAnalysis({ featureIds, vectorsByFeature, maxComponents = 6 }) {
  // PCA on standardized features with complete cases.
  // We restrict to complete-case rows across all features to keep it simple + stable.
  const matrix = [];

  for (let row = 0; row < vectorsByFeature[featureIds[0]].length; row += 1) {
    const vec = [];
    let ok = true;
    for (const f of featureIds) {
      const v = vectorsByFeature[f][row];
      if (typeof v !== 'number') {
        ok = false;
        break;
      }
      vec.push(v);
    }
    if (ok) matrix.push(vec);
  }

  const n = matrix.length;
  const p = featureIds.length;
  if (n < Math.max(12, p + 1)) {
    return {
      n,
      p,
      note: 'insufficient_complete_cases_for_pca',
      components: [],
      explainedVariance: []
    };
  }

  // Standardize columns
  const colMeans = Array.from({ length: p }, (_, j) => mean(matrix.map((r) => r[j])));
  const colStds = Array.from({ length: p }, (_, j) => std(matrix.map((r) => r[j])) || 1);
  const Z = matrix.map((r) => r.map((x, j) => (x - colMeans[j]) / colStds[j]));

  // Covariance = (Z^T Z)/(n-1)
  const Zt = transpose(Z);
  let C = matMul(Zt, Z);
  for (let i = 0; i < p; i += 1) {
    for (let j = 0; j < p; j += 1) C[i][j] /= Math.max(1, n - 1);
  }

  // Total variance = trace
  const totalVar = C.reduce((acc, row, i) => acc + row[i], 0);

  const components = [];
  const explainedVariance = [];

  let A = C;

  for (let k = 0; k < Math.min(maxComponents, p); k += 1) {
    // Power iteration
    let v = normalizeVec(Array.from({ length: p }, () => Math.random() - 0.5));
    for (let it = 0; it < 80; it += 1) {
      const Av = matVec(A, v);
      const nv = normalizeVec(Av);
      v = nv;
    }

    const Av = matVec(A, v);
    const lambda = dot(v, Av);

    if (!lambda || lambda < 1e-9) break;

    // Deflate: A = A - lambda v v^T
    const outer = Array.from({ length: p }, () => Array.from({ length: p }, () => 0));
    for (let i = 0; i < p; i += 1) {
      for (let j = 0; j < p; j += 1) outer[i][j] = lambda * v[i] * v[j];
    }
    const nextA = Array.from({ length: p }, (_, i) => Array.from({ length: p }, (_, j) => A[i][j] - outer[i][j]));
    A = nextA;

    const loadings = featureIds.map((featureId, idx) => ({ featureId, loading: v[idx] }));
    loadings.sort((a, b) => Math.abs(b.loading) - Math.abs(a.loading));

    components.push({
      component: k + 1,
      eigenvalue: lambda,
      explainedVarianceRatio: totalVar ? lambda / totalVar : null,
      topLoadings: loadings.slice(0, 10)
    });

    explainedVariance.push(totalVar ? lambda / totalVar : null);
  }

  return {
    n,
    p,
    totalVariance: totalVar,
    explainedVariance,
    components
  };
}

function featureHealthMatrix({ featureIds, featureDist, independence, corrPairs, dependency, inputAvailability }) {
  const corrByFeatureMaxAbs = {};
  for (const f of featureIds) corrByFeatureMaxAbs[f] = 0;
  for (const p of corrPairs) {
    corrByFeatureMaxAbs[p.a] = Math.max(corrByFeatureMaxAbs[p.a], p.absR);
    corrByFeatureMaxAbs[p.b] = Math.max(corrByFeatureMaxAbs[p.b], p.absR);
  }

  const health = [];
  for (const f of featureIds) {
    const dist = featureDist[f];
    const indep = independence.byFeature[f] || {};
    const dep = dependency[f] || { topInputs: [] };

    // Descriptor availability proxy: mean availability of top 3 inputs
    const topInputs = dep.topInputs.slice(0, 3).map((x) => x.inputId);
    const availRates = topInputs
      .map((id) => (inputAvailability[id] ? inputAvailability[id].availabilityRate : null))
      .filter((x) => typeof x === 'number');

    const descriptorAvailability = availRates.length ? mean(availRates) : null;

    const varianceQuality = dist && typeof dist.std === 'number' ? dist.std : null;
    const normalizationQuality = (() => {
      if (!dist || dist.nNumeric === 0) return 'missing';
      const spread = dist.p90 !== null && dist.p10 !== null ? dist.p90 - dist.p10 : null;
      if (spread !== null && spread < 0.08) return 'compressed';
      if (dist.saturation && (dist.saturation.low_le_0_02 > 0.6 || dist.saturation.high_ge_0_98 > 0.6)) return 'saturated';
      return 'ok';
    })();

    const independenceScore = typeof indep.uniqueVariance === 'number' ? indep.uniqueVariance : null;
    const redundancyScore = corrByFeatureMaxAbs[f] || null;

    const classification = (() => {
      if (dist && dist.missingRate === 1) return 'Underdeveloped / Descriptor-Starved';
      if (normalizationQuality === 'compressed' && (varianceQuality !== null && varianceQuality < 0.03)) return 'Artificially Collapsed';
      if (typeof indep.r2 === 'number' && indep.r2 > 0.92) return 'Likely Redundant';
      if (typeof indep.uniqueVariance === 'number' && indep.uniqueVariance > 0.25 && (varianceQuality || 0) > 0.08) return 'Strong Core Dimension';
      if (typeof indep.uniqueVariance === 'number' && indep.uniqueVariance > 0.12) return 'Useful but Entangled';
      if (varianceQuality !== null && varianceQuality < 0.03) return 'Not Currently Reliable';
      return 'Useful but Entangled';
    })();

    health.push({
      featureId: f,
      variance: dist,
      normalizationQuality,
      independence: indep,
      redundancyMaxAbsR: redundancyScore,
      descriptorAvailability,
      dependencyTopInputs: dep.topInputs.slice(0, 5),
      classification
    });
  }

  // Rank by (classification + independenceScore)
  health.sort((a, b) => {
    const ia = typeof a.independence.uniqueVariance === 'number' ? a.independence.uniqueVariance : -1;
    const ib = typeof b.independence.uniqueVariance === 'number' ? b.independence.uniqueVariance : -1;
    return ib - ia;
  });

  return health;
}

function buildMarkdown({ meta, summary, correlations, correlationsCore, independenceCore, partialCore, clusters, clustersCore, stability, sensitivity, pca, health }) {
  const lines = [];
  lines.push('# CONTROL_2_DIMENSION_INDEPENDENCE_ANALYSIS');
  lines.push('');
  lines.push('## Run metadata');
  lines.push('');
  lines.push(`- Generated at: ${meta.generatedAt}`);
  lines.push(`- Source: ${meta.sourcePath}`);
  lines.push(`- Tracks (found only): ${summary.tracks}`);
  lines.push(`- Features: ${summary.features}`);
  lines.push(`- Inputs: ${summary.inputs}`);
  lines.push(`- Core features used for independence/PCA: ${summary.coreFeatures}`);
  lines.push('');

  lines.push('## Part 1 — Unique variance contribution (regress each feature on all others)');
  lines.push('');
  lines.push('### Most independent (highest uniqueVariance = 1 - R²)');
  lines.push('');
  for (const r of independenceCore.rankings.slice(0, 12)) {
    lines.push(`- ${r.featureId}: uniqueVariance=${r.uniqueVariance.toFixed(3)} R²=${r.r2.toFixed(3)} VIF=${r.vif === null ? 'null' : r.vif.toFixed(2)} n=${r.n}`);
  }
  lines.push('');

  lines.push('### Most redundant (highest R² when predicted by others)');
  lines.push('');
  for (const r of independenceCore.redundancy.slice(0, 12)) {
    lines.push(`- ${r.featureId}: R²=${r.r2.toFixed(3)} uniqueVariance=${r.uniqueVariance === null ? 'null' : r.uniqueVariance.toFixed(3)} VIF=${r.vif === null ? 'null' : r.vif.toFixed(2)} n=${r.n}`);
  }
  lines.push('');

  lines.push('### Partial correlations (core features only)');
  lines.push('');
  if (!partialCore || partialCore.note) {
    lines.push(`- Note: ${partialCore ? partialCore.note : 'missing'}`);
  } else {
    for (const p of partialCore.partials.slice(0, 20)) {
      lines.push(`- ${p.a} vs ${p.b}: partial_r=${p.r.toFixed(3)}`);
    }
  }
  lines.push('');

  lines.push('## Shared-variance clusters (|r| >= ' + clusters.thresholdAbsR + ')');
  lines.push('');
  for (const c of clusters.clusters.slice(0, 10)) {
    lines.push(`- size=${c.size}: ${c.features.join(', ')}`);
  }
  lines.push('');

  lines.push('## Shared-variance clusters (core features only)');
  lines.push('');
  for (const c of clustersCore.clusters.slice(0, 10)) {
    lines.push(`- size=${c.size}: ${c.features.join(', ')}`);
  }
  lines.push('');

  lines.push('## Part 2 — Normalization stability (range/spread/saturation)');
  lines.push('');
  const focus = ['density_score', 'brightness_score', 'syncopation_score', 'calm_score', 'driving_score', 'darkness_score'];
  for (const f of focus) {
    const d = stability.featureDistribution[f];
    if (!d) continue;
    const spread = d.p90 !== null && d.p10 !== null ? d.p90 - d.p10 : null;
    lines.push(`### ${f}`);
    lines.push('');
    lines.push(`- mean=${d.mean === null ? 'null' : d.mean.toFixed(3)} std=${d.std === null ? 'null' : d.std.toFixed(3)} min=${d.min === null ? 'null' : d.min.toFixed(3)} max=${d.max === null ? 'null' : d.max.toFixed(3)}`);
    lines.push(`- p10/p50/p90=${d.p10 === null ? 'null' : d.p10.toFixed(3)} / ${d.p50 === null ? 'null' : d.p50.toFixed(3)} / ${d.p90 === null ? 'null' : d.p90.toFixed(3)} spread(p90-p10)=${spread === null ? 'null' : spread.toFixed(3)}`);
    lines.push(`- saturation low/high=${d.saturation.low_le_0_02 === null ? 'null' : d.saturation.low_le_0_02.toFixed(3)} / ${d.saturation.high_ge_0_98 === null ? 'null' : d.saturation.high_ge_0_98.toFixed(3)}`);
    lines.push('- top raw input correlations:');
    for (const c of (stability.dependency[f] ? stability.dependency[f].topInputs.slice(0, 6) : [])) {
      lines.push(`  - ${c.inputId}: r=${c.r.toFixed(3)} n=${c.n}`);
    }
    lines.push('');
  }

  lines.push('## Part 3 — Formula sensitivity proxy (descriptor dominance)');
  lines.push('');
  lines.push('Top dominated features (dominanceTop1 close to 1 means basically one descriptor):');
  lines.push('');
  for (const s of sensitivity.slice(0, 12)) {
    const dom = s.regression && typeof s.regression.dominanceTop1 === 'number' ? s.regression.dominanceTop1 : null;
    const r2 = s.regression && typeof s.regression.r2 === 'number' ? s.regression.r2 : null;
    lines.push(`- ${s.featureId}: dominanceTop1=${dom === null ? 'null' : dom.toFixed(3)} regR²=${r2 === null ? 'null' : r2.toFixed(3)} n=${s.regression.n}`);
    for (const c of s.topCorrelations.slice(0, 3)) {
      lines.push(`  - corr ${c.inputId}: r=${c.r.toFixed(3)} n=${c.n}`);
    }
  }
  lines.push('');

  lines.push('## Part 4 — Latent semantic axis discovery (PCA on standardized features, complete-case rows)');
  lines.push('');
  lines.push(`- PCA rows used: ${pca.n} (features: ${pca.p})`);
  if (pca.note) lines.push(`- Note: ${pca.note}`);
  lines.push('');
  if (pca.components && pca.components.length) {
    for (const c of pca.components.slice(0, 6)) {
      lines.push(`### PC${c.component} explainedVarianceRatio=${c.explainedVarianceRatio === null ? 'null' : c.explainedVarianceRatio.toFixed(3)} eigenvalue=${c.eigenvalue.toFixed(3)}`);
      lines.push('Top loadings:');
      for (const l of c.topLoadings.slice(0, 8)) {
        lines.push(`- ${l.featureId}: loading=${l.loading.toFixed(3)}`);
      }
      lines.push('');
    }
  }

  lines.push('## Part 5 — Feature health matrix (top)');
  lines.push('');
  for (const h of health.slice(0, 18)) {
    const uv = h.independence && typeof h.independence.uniqueVariance === 'number' ? h.independence.uniqueVariance : null;
    const mx = typeof h.redundancyMaxAbsR === 'number' ? h.redundancyMaxAbsR : null;
    const st = h.variance && typeof h.variance.std === 'number' ? h.variance.std : null;
    lines.push(`- ${h.featureId}: class=${h.classification} uniqueVar=${uv === null ? 'null' : uv.toFixed(3)} max|r|=${mx === null ? 'null' : mx.toFixed(3)} std=${st === null ? 'null' : st.toFixed(3)} norm=${h.normalizationQuality}`);
  }

  lines.push('');
  lines.push('## Correlation highlights (top absolute)');
  lines.push('');
  for (const p of correlations.topAbsolute.slice(0, 20)) {
    lines.push(`- ${p.a} vs ${p.b}: r=${p.r.toFixed(3)} n=${p.n}`);
  }

  lines.push('');
  lines.push('## Full outputs');
  lines.push('');
  lines.push(`- JSON: ${meta.outputJsonPath}`);

  return lines.join('\n');
}

async function run() {
  const sourcePath = path.join(__dirname, '..', 'outputs', 'control_1_semantic_validation.json');
  const validation = readJsonFile(sourcePath);
  const tracks = Array.isArray(validation.tracks) ? validation.tracks : [];

  const featureIds = getFeatureIds(tracks);
  const inputIds = getInputIds(tracks);

  const vectorsByFeature = buildFeatureVectors(tracks, featureIds);
  const vectorsByInput = buildInputVectors(tracks, inputIds);

  const { coreFeatures, featureStats } = selectCoreFeatures({ featureIds, vectorsByFeature, maxMissingRate: 0.05, minNumeric: 20 });

  // Inputs availability (for health)
  const inputAvailability = {};
  for (const id of inputIds) {
    const v = vectorsByInput[id];
    const s = summarizeVector(v);
    inputAvailability[id] = {
      availableCount: s.nNumeric,
      total: s.nTotal,
      availabilityRate: s.nTotal ? s.nNumeric / s.nTotal : null
    };
  }

  const correlations = pairwiseFeatureCorrelations(featureIds, vectorsByFeature);
  const correlationsCore = pairwiseFeatureCorrelations(coreFeatures, vectorsByFeature);
  const independenceCore = independenceMetrics({ tracks, featureIds: coreFeatures, vectorsByFeature });
  const partialCore = partialCorrelationMatrix(coreFeatures, vectorsByFeature);

  const clusters = sharedVarianceClusters({ featureIds, corrAll: correlations.all, thresholdAbsR: 0.85 });
  const clustersCore = sharedVarianceClusters({ featureIds: coreFeatures, corrAll: correlationsCore.all, thresholdAbsR: 0.85 });

  const stability = normalizationStability({ featureIds, vectorsByFeature, inputIds, vectorsByInput });

  const sensitivity = formulaSensitivityProxy({ featureIds, inputIds, vectorsByFeature, vectorsByInput });

  const pca = pcaAnalysis({ featureIds: coreFeatures, vectorsByFeature, maxComponents: 6 });

  const health = featureHealthMatrix({
    featureIds,
    featureDist: stability.featureDistribution,
    independence: {
      byFeature: { ...independenceCore.byFeature },
      rankings: independenceCore.rankings,
      redundancy: independenceCore.redundancy
    },
    corrPairs: correlations.all,
    dependency: stability.dependency,
    inputAvailability
  });

  const outJson = path.join(__dirname, '..', 'outputs', 'control_2_dimension_independence_analysis_v2.json');
  const outMd = path.join(__dirname, '..', 'reports', 'control_2_dimension_independence_analysis_v2.md');

  ensureDir(path.dirname(outJson));
  ensureDir(path.dirname(outMd));

  const meta = {
    generatedAt: new Date().toISOString(),
    sourcePath,
    outputJsonPath: outJson
  };

  const summary = {
    tracks: tracks.length,
    features: featureIds.length,
    inputs: inputIds.length,
    coreFeatures: coreFeatures.length,
    coreFeatureIds: coreFeatures
  };

  writeJsonFile(outJson, {
    meta,
    summary,
    featureIds,
    inputIds,
    correlations,
    correlationsCore,
    independenceCore,
    partialCore,
    clusters,
    clustersCore,
    stability,
    sensitivity,
    pca,
    health,
    featureStats
  });

  const md = buildMarkdown({
    meta,
    summary,
    correlations,
    correlationsCore,
    independenceCore,
    partialCore,
    clusters,
    clustersCore,
    stability,
    sensitivity,
    pca,
    health
  });
  fs.writeFileSync(outMd, md + '\n');

  console.log('[control_2_dimension_independence_analysis] wrote:');
  console.log('-', outJson);
  console.log('-', outMd);
  console.log('tracks:', tracks.length, 'features:', featureIds.length, 'inputs:', inputIds.length);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
