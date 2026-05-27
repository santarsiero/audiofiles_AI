const fs = require('fs');
const path = require('path');

const { ensureDir, readJsonFile } = require('../utils/io');

function pct(x, digits = 1) {
  if (x === null || x === undefined || Number.isNaN(x)) return 'null';
  return `${(x * 100).toFixed(digits)}%`;
}

function normalizeSensitivityAsDescriptorDominance(sensitivity) {
  if (!Array.isArray(sensitivity)) return [];

  return sensitivity
    .filter((row) => row && typeof row.featureId === 'string' && row.regression && Array.isArray(row.regression.betas))
    .map((row) => {
      const betas = row.regression.betas
        .filter((b) => b && typeof b.inputId === 'string' && typeof b.beta === 'number' && Number.isFinite(b.beta))
        .map((b) => ({
          inputId: b.inputId,
          weight: b.beta,
          weightAbs: Math.abs(b.beta)
        }))
        .sort((a, b) => b.weightAbs - a.weightAbs);

      const sumAbs = betas.reduce((acc, b) => acc + b.weightAbs, 0);
      const dominanceTop1 = betas.length && sumAbs ? betas[0].weightAbs / sumAbs : null;

      return {
        featureId: row.featureId,
        candidateInputs: Array.isArray(row.candidateInputs) ? row.candidateInputs : null,
        topCorrelations: Array.isArray(row.topCorrelations) ? row.topCorrelations : null,
        regression: {
          n: safeNum(row.regression.n),
          r2: safeNum(row.regression.r2),
          dominanceTop1,
          betas
        }
      };
    });
}

function fmt(x, digits = 3) {
  if (x === null || x === undefined || Number.isNaN(x)) return 'null';
  return Number(x).toFixed(digits);
}

function safeNum(x) {
  return typeof x === 'number' && Number.isFinite(x) ? x : null;
}

function median(xs) {
  const vals = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const mid = Math.floor(vals.length / 2);
  return vals.length % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
}

function percentile(xs, p) {
  const vals = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  const idx = (p / 100) * (vals.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return vals[lo];
  const t = idx - lo;
  return vals[lo] * (1 - t) + vals[hi] * t;
}

function computeInputAvailabilityFromControl3(control3) {
  const sampled = Array.isArray(control3.sampledTracks) ? control3.sampledTracks : [];
  const inputIds = control3.summary && Array.isArray(control3.summary.coreInputs) ? control3.summary.coreInputs : [];

  const stats = {};
  for (const id of inputIds) {
    let n = 0;
    let present = 0;
    const values = [];
    for (const t of sampled) {
      n += 1;
      const it = t && t.inputTrace && t.inputTrace[id] ? t.inputTrace[id] : null;
      const v = it && it.available ? safeNum(it.value) : null;
      if (v !== null) {
        present += 1;
        values.push(v);
      }
    }
    stats[id] = {
      present,
      total: n,
      availabilityRate: n ? present / n : null,
      p10: percentile(values, 10),
      p50: median(values),
      p90: percentile(values, 90)
    };
  }

  return { inputIds, stats };
}

function buildFeatureClassification({ featureIds, featureStats, independence, correlations, descriptorDominance }) {
  const corrTop = correlations && Array.isArray(correlations.topAbsolute) ? correlations.topAbsolute : [];
  const corrMap = new Map();
  for (const p of corrTop) {
    if (!p || typeof p.a !== 'string' || typeof p.b !== 'string') continue;
    if (typeof p.absR !== 'number') continue;
    // Record max absR for each feature
    const curA = corrMap.get(p.a);
    const curB = corrMap.get(p.b);
    if (!curA || p.absR > curA.absR) corrMap.set(p.a, { other: p.b, absR: p.absR, r: p.r, n: p.n });
    if (!curB || p.absR > curB.absR) corrMap.set(p.b, { other: p.a, absR: p.absR, r: p.r, n: p.n });
  }

  const uvByFeature = new Map();
  if (independence && independence.byFeature) {
    for (const [k, v] of Object.entries(independence.byFeature)) {
      uvByFeature.set(k, safeNum(v && v.uniqueVariance));
    }
  }

  const domByFeature = new Map();
  if (descriptorDominance && Array.isArray(descriptorDominance)) {
    for (const row of descriptorDominance) {
      if (!row || typeof row.featureId !== 'string') continue;
      const d = row.regression || null;
      const dominanceTop1 = safeNum(d && d.dominanceTop1);
      const topBeta = d && Array.isArray(d.betas) && d.betas.length ? d.betas[0] : null;
      domByFeature.set(row.featureId, {
        dominanceTop1,
        topInputId: topBeta && typeof topBeta.inputId === 'string' ? topBeta.inputId : null,
        topWeightAbs: safeNum(topBeta && topBeta.weightAbs),
        r2: safeNum(d && d.r2),
        n: safeNum(d && d.n)
      });
    }
  }

  const out = [];

  for (const f of featureIds) {
    const s = featureStats && featureStats[f] ? featureStats[f] : null;
    const missingRate = s ? safeNum(s.missingRate) : null;
    const stdev = s ? safeNum(s.std) : null;
    const spread = s ? (safeNum(s.p90) !== null && safeNum(s.p10) !== null ? s.p90 - s.p10 : null) : null;

    const uv = uvByFeature.has(f) ? uvByFeature.get(f) : null;
    const maxCorr = corrMap.get(f) || null;
    const dom = domByFeature.get(f) || null;

    const isStarved = missingRate !== null && missingRate >= 0.5;

    let category = 'PARTIALLY TRUSTED / COUPLED';

    if (isStarved) {
      category = 'UNTRUSTWORTHY / DESCRIPTOR-STARVED';
    } else {
      const highlyCoupled = maxCorr && typeof maxCorr.absR === 'number' && maxCorr.absR >= 0.9;
      const lowVariance = stdev !== null && stdev < 0.02;
      const lowSpread = spread !== null && spread < 0.07;
      const descriptorWrapper = dom && dom.dominanceTop1 !== null && dom.dominanceTop1 >= 0.9;

      const independentEnough = uv !== null && uv >= 0.25;
      const stableEnough = (stdev !== null && stdev >= 0.03) || (spread !== null && spread >= 0.1);

      // A feature can be "trusted" even if it's a near-direct wrapper around a stable upstream descriptor.
      // Wrapper status is documented in the dependency report; it is not itself a reason to downgrade.
      if (independentEnough && stableEnough && !lowVariance) {
        category = 'TRUSTED CORE FEATURES';
      } else if (highlyCoupled || descriptorWrapper || lowVariance || lowSpread) {
        category = 'PARTIALLY TRUSTED / COUPLED';
      }

      // If it is a hard complement pair (|r| ~ 1) keep as coupled even if variance is fine.
      if (maxCorr && typeof maxCorr.absR === 'number' && maxCorr.absR >= 0.98) {
        category = 'PARTIALLY TRUSTED / COUPLED';
      }
    }

    const carryForward = category !== 'UNTRUSTWORTHY / DESCRIPTOR-STARVED';

    const reasons = [];
    if (missingRate !== null) reasons.push(`missingRate=${pct(missingRate, 1)}`);
    if (stdev !== null) reasons.push(`std=${fmt(stdev, 3)}`);
    if (spread !== null) reasons.push(`p90-p10=${fmt(spread, 3)}`);
    if (uv !== null) reasons.push(`uniqueVariance≈${fmt(uv, 3)}`);
    if (maxCorr && typeof maxCorr.absR === 'number') {
      reasons.push(`max|r|≈${fmt(maxCorr.absR, 3)} (vs ${maxCorr.other})`);
    }
    if (dom && dom.topInputId) {
      reasons.push(
        `dominanceTop1≈${dom.dominanceTop1 === null ? 'null' : fmt(dom.dominanceTop1, 3)} (top=${dom.topInputId})`
      );
    }

    out.push({
      featureId: f,
      category,
      carryForward,
      missingRate,
      std: stdev,
      spread,
      uniqueVariance: uv,
      maxCorrelation: maxCorr,
      dominance: dom,
      reasons
    });
  }

  // stable ordering: category then featureId
  const order = {
    'TRUSTED CORE FEATURES': 0,
    'PARTIALLY TRUSTED / COUPLED': 1,
    'UNTRUSTWORTHY / DESCRIPTOR-STARVED': 2
  };

  out.sort((a, b) => {
    const oa = order[a.category] ?? 9;
    const ob = order[b.category] ?? 9;
    if (oa !== ob) return oa - ob;
    return a.featureId.localeCompare(b.featureId);
  });

  return out;
}

function buildFeatureStabilityReport({ meta, classification }) {
  const lines = [];
  lines.push('# FINAL_FEATURE_STABILITY_REPORT (Music Story-only phase)');
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push(
    'Classify each normalized feature by representation quality under Music Story-only descriptors. This is a carry-forward assessment for the next phase (representation + mapping), not an ontology redesign.'
  );
  lines.push('');
  lines.push('## Evidence sources used');
  lines.push('');
  for (const s of meta.sources) lines.push(`- ${s}`);
  lines.push('');

  const byCat = {};
  for (const row of classification) {
    if (!byCat[row.category]) byCat[row.category] = [];
    byCat[row.category].push(row);
  }

  function section(cat) {
    const rows = byCat[cat] || [];
    lines.push(`## ${cat}`);
    lines.push('');
    for (const r of rows) {
      lines.push(`### ${r.featureId}`);
      lines.push('');
      lines.push(`- Carry forward: ${r.carryForward ? 'YES' : 'NO'}`);
      for (const reason of r.reasons) lines.push(`- ${reason}`);
      lines.push('');
    }
  }

  section('TRUSTED CORE FEATURES');
  section('PARTIALLY TRUSTED / COUPLED');
  section('UNTRUSTWORTHY / DESCRIPTOR-STARVED');

  lines.push('## Notes / guardrails for next phase');
  lines.push('');
  lines.push(
    '- Coupled features should not be treated as independent evidence sources for confidence or label agreement.'
  );
  lines.push('- Descriptor-starved features should not be used for downstream decisions until descriptor support exists.');
  lines.push('');

  return lines.join('\n');
}

function buildDescriptorDependencyReport({ meta, classification, inputAvailability, descriptorDominance, control3Global }) {
  const lines = [];
  lines.push('# FINAL_DESCRIPTOR_DEPENDENCY_REPORT (Music Story-only phase)');
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push(
    'Empirical descriptor → feature dependency summary: which upstream descriptors drive each feature, which features are descriptor wrappers, and which descriptors are high-leverage.'
  );
  lines.push('');
  lines.push('## Evidence sources used');
  lines.push('');
  for (const s of meta.sources) lines.push(`- ${s}`);
  lines.push('');

  lines.push('## Descriptor availability (CONTROL_3 sampled set)');
  lines.push('');
  for (const id of inputAvailability.inputIds) {
    const st = inputAvailability.stats[id];
    lines.push(
      `- ${id}: availability=${pct(st.availabilityRate, 1)} present=${st.present}/${st.total} p10/p50/p90=${fmt(st.p10, 3)} / ${fmt(
        st.p50,
        3
      )} / ${fmt(st.p90, 3)}`
    );
  }
  lines.push('');

  const dom = Array.isArray(descriptorDominance) ? descriptorDominance : [];
  const domSorted = dom
    .filter((x) => x && x.regression && typeof x.featureId === 'string')
    .map((x) => ({
      featureId: x.featureId,
      n: safeNum(x.regression.n),
      r2: safeNum(x.regression.r2),
      dominanceTop1: safeNum(x.regression.dominanceTop1),
      betas: Array.isArray(x.regression.betas) ? x.regression.betas : []
    }))
    .sort((a, b) => (b.dominanceTop1 || 0) - (a.dominanceTop1 || 0));

  lines.push('## Most “single-descriptor wrapper” features (dominanceTop1 ≥ 0.90)');
  lines.push('');
  if (!domSorted.length) {
    lines.push('- Note: no sensitivity/descriptor-dominance rows were available to summarize.');
    lines.push('');
  }
  for (const row of domSorted.filter((r) => r.dominanceTop1 !== null && r.dominanceTop1 >= 0.9)) {
    const top = row.betas && row.betas.length ? row.betas[0] : null;
    lines.push(
      `- ${row.featureId}: dominanceTop1=${fmt(row.dominanceTop1, 3)} regR²=${fmt(row.r2, 3)} n=${row.n} top=${
        top ? `${top.inputId} (|w|=${fmt(top.weightAbs, 3)})` : 'n/a'
      }`
    );
  }
  lines.push('');

  lines.push('## Dominant descriptor weights per feature (top 3 |weights|)');
  lines.push('');
  for (const row of domSorted) {
    const top3 = row.betas.slice(0, 3);
    if (!top3.length) continue;
    lines.push(`### ${row.featureId}`);
    lines.push('');
    lines.push(`- regression: n=${row.n} R²=${fmt(row.r2, 3)} dominanceTop1=${fmt(row.dominanceTop1, 3)}`);
    for (const b of top3) {
      lines.push(`- ${b.inputId}: weight=${fmt(b.weight, 3)} |w|=${fmt(b.weightAbs, 3)}`);
    }
    lines.push('');
  }

  lines.push('## Descriptor redundancy (CONTROL_3 global descriptor correlations, top absolute)');
  lines.push('');
  const descCorr =
    control3Global && control3Global.descriptorCorrelations && Array.isArray(control3Global.descriptorCorrelations.topAbsolute)
      ? control3Global.descriptorCorrelations.topAbsolute
      : [];
  for (const p of descCorr.slice(0, 25)) {
    lines.push(`- ${p.a} vs ${p.b}: r=${fmt(p.r, 3)} n=${p.n}`);
  }
  lines.push('');

  lines.push('## Carry-forward guidance (representation-quality only)');
  lines.push('');
  const carry = classification.filter((x) => x.carryForward);
  const starved = classification.filter((x) => !x.carryForward);
  lines.push(`- Carry-forward feature count: ${carry.length}`);
  lines.push(`- Descriptor-starved feature count: ${starved.length}`);
  lines.push('');
  lines.push(
    'If a feature is a near-single-descriptor wrapper, it can still be useful, but downstream systems must treat it as direct measurement of that descriptor (not an independent semantic estimate).' 
  );
  lines.push('');

  return lines.join('\n');
}

function buildLatentStructureSummary({ meta, control2, control3 }) {
  const lines = [];
  lines.push('# FINAL_LATENT_STRUCTURE_SUMMARY (Music Story-only phase)');
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('Concise, evidence-based summary of the latent structure and effective dimensionality of the current representation space.');
  lines.push('');
  lines.push('## Evidence sources used');
  lines.push('');
  for (const s of meta.sources) lines.push(`- ${s}`);
  lines.push('');

  const pcaF = control3.global && control3.global.pcaFeatures ? control3.global.pcaFeatures : null;
  const pcaD = control3.global && control3.global.pcaInputs ? control3.global.pcaInputs : null;

  function pcaSection(title, pca) {
    lines.push(`## ${title}`);
    lines.push('');
    if (!pca) {
      lines.push('- PCA not available');
      lines.push('');
      return;
    }
    lines.push(`- rows=${pca.n} dims=${pca.p}`);
    lines.push('');
    for (const c of (pca.components || []).slice(0, 6)) {
      const top = (c.topLoadings || []).slice(0, 6).map((x) => `${x.featureId}:${fmt(x.loading, 3)}`).join(', ');
      lines.push(`- PC${c.component}: explainedVarianceRatio=${fmt(c.explainedVarianceRatio, 3)} eigenvalue=${fmt(c.eigenvalue, 3)}`);
      lines.push(`  topLoadings=${top}`);
    }
    lines.push('');

    const ev = (pca.components || []).map((c) => safeNum(c.explainedVarianceRatio)).filter((x) => x !== null);
    const sum3 = ev.slice(0, 3).reduce((a, b) => a + b, 0);
    const sum6 = ev.slice(0, 6).reduce((a, b) => a + b, 0);
    lines.push(`- PC1–3 explainedVarianceRatio sum≈${fmt(sum3, 3)}`);
    lines.push(`- PC1–6 explainedVarianceRatio sum≈${fmt(sum6, 3)}`);
    lines.push('');
  }

  pcaSection('Feature space PCA (CONTROL_3)', pcaF);
  pcaSection('Descriptor space PCA (CONTROL_3 inputTrace)', pcaD);

  lines.push('## Coupled / alias relationships (evidence)');
  lines.push('');

  const topCorr = control3.global && control3.global.featureCorrelations ? control3.global.featureCorrelations.topAbsolute : [];
  const key = topCorr.slice(0, 12);
  for (const p of key) {
    lines.push(`- ${p.a} vs ${p.b}: r=${fmt(p.r, 3)} n=${p.n}`);
  }
  lines.push('');

  lines.push('## Effective dimensionality (practical)');
  lines.push('');
  lines.push('- In Music Story-only static descriptors, the representation behaves as low-rank with a few dominant axes.');
  lines.push('- Several named dimensions are redundant projections of these same axes (not independent coordinates).');
  lines.push('');

  // CONTROL_2 singularity note
  const partialNote = control2.partialCorrelations && control2.partialCorrelations.note ? control2.partialCorrelations.note : null;
  if (partialNote) {
    lines.push('## Covariance / conditioning note (CONTROL_2)');
    lines.push('');
    lines.push(`- Partial correlation inversion note: ${partialNote}`);
    lines.push('');
  }

  return lines.join('\n');
}

function buildPhaseClosureSummary({ meta, classification, control3, control1, control2 }) {
  const lines = [];
  lines.push('# MUSICSTORY_PHASE_CLOSURE_SUMMARY');
  lines.push('');
  lines.push('## Purpose');
  lines.push('');
  lines.push('Engineering closure summary for the Music Story-only experimentation phase. Evidence-based, non-speculative.');
  lines.push('');
  lines.push('## Evidence sources used');
  lines.push('');
  for (const s of meta.sources) lines.push(`- ${s}`);
  lines.push('');

  const trusted = classification.filter((x) => x.category === 'TRUSTED CORE FEATURES');
  const coupled = classification.filter((x) => x.category === 'PARTIALLY TRUSTED / COUPLED');
  const starved = classification.filter((x) => x.category === 'UNTRUSTWORTHY / DESCRIPTOR-STARVED');

  lines.push('## What worked');
  lines.push('');
  lines.push('- Music Story descriptors contain real semantic signal; normalized features show stable non-trivial distributions for a subset of dimensions.');
  lines.push('- A small set of dimensions retain meaningful independence and can be carried forward as reliable representation components.');
  lines.push('');

  lines.push('## What partially worked');
  lines.push('');
  lines.push('- Several dimensions contain signal but are highly coupled; they behave as multiple views of shared latent axes.');
  lines.push('- These features are usable as representation features but should not be treated as independent evidence channels.');
  lines.push('');

  lines.push('## What did not work (in Music Story-only static space)');
  lines.push('');
  lines.push('- Descriptor-starved features are nonfunctional under current cache coverage and cannot be trusted.');
  lines.push('- Multiple named semantic dimensions collapse into aliases due to upstream descriptor coupling and/or composite construction.');
  lines.push('');

  lines.push('## Known ceilings / limitations of static averaged descriptors');
  lines.push('');
  lines.push('- Temporal semantics (section contrast, dynamics over time, groove/microtiming) are not reliably recoverable from static averaged descriptors.');
  lines.push('- The representation behaves as low-rank: a few dominant axes explain most variance even under dataset expansion.');
  lines.push('- Adding more named dimensions without adding representational capacity increases redundancy more than expressivity.');
  lines.push('');

  lines.push('## Carry-forward feature assessment (final)');
  lines.push('');
  lines.push(`- Trusted core features: ${trusted.map((x) => x.featureId).join(', ') || '(none)'}`);
  lines.push(`- Coupled / partially trusted features: ${coupled.map((x) => x.featureId).join(', ') || '(none)'}`);
  lines.push(`- Descriptor-starved / untrustworthy features: ${starved.map((x) => x.featureId).join(', ') || '(none)'}`);
  lines.push('');

  // summarize CONTROL_3 PCA sums
  const pcaF = control3.global && control3.global.pcaFeatures ? control3.global.pcaFeatures : null;
  const pcaD = control3.global && control3.global.pcaInputs ? control3.global.pcaInputs : null;
  function sumTop(pca, k) {
    if (!pca || !Array.isArray(pca.components)) return null;
    return pca.components
      .slice(0, k)
      .map((c) => safeNum(c.explainedVarianceRatio))
      .filter((x) => x !== null)
      .reduce((a, b) => a + b, 0);
  }

  const f3 = sumTop(pcaF, 3);
  const d3 = sumTop(pcaD, 3);

  lines.push('## Representation reality (CONTROL_3)');
  lines.push('');
  lines.push(`- Feature PCA PC1–3 explainedVarianceRatio sum≈${f3 === null ? 'n/a' : fmt(f3, 3)}`);
  lines.push(`- Descriptor PCA PC1–3 explainedVarianceRatio sum≈${d3 === null ? 'n/a' : fmt(d3, 3)}`);
  lines.push('');

  lines.push('## Closure: what this phase proved');
  lines.push('');
  lines.push('- A stable subset of representation features exists and can be carried forward.');
  lines.push('- The Music Story-only descriptor ecosystem has a clear effective dimensionality ceiling and strong coupling.' );
  lines.push('- Static averaged descriptor representations alone cannot support a high-granularity independent semantic axis set.' );
  lines.push('');

  lines.push('## Stop conditions / non-goals (met)');
  lines.push('');
  lines.push('- No ontology expansion performed.' );
  lines.push('- No new providers added.' );
  lines.push('- No embeddings or temporal modeling introduced.' );
  lines.push('- No speculative semantics introduced.' );
  lines.push('');

  lines.push('## Next analytical step (single highest leverage; still experimentation)');
  lines.push('');
  lines.push(
    'Run the same CONTROL_3 stress-test suite on an overlapping batch augmented with one additional independent representation source (another provider or raw-audio windowed features) to measure whether the current ceiling is descriptor-limited or architecture-limited.'
  );
  lines.push('');

  return lines.join('\n');
}

function main() {
  const outputsDir = path.join(__dirname, '..', 'outputs');
  const reportsDir = path.join(__dirname, '..', 'reports');

  const overwrite = process.argv.includes('--overwrite');

  const control1 = readJsonFile(path.join(outputsDir, 'control_1_feature_calibration.json'));
  const control2 = readJsonFile(path.join(outputsDir, 'control_2_dimension_independence_analysis_v2.json'));
  const control3 = readJsonFile(path.join(outputsDir, 'control_3_manifold_stress_test.json'));

  const featureIds = control1.featureIds;
  const featureStats = control1.featureStats;

  const independence = control3.global && control3.global.independence ? control3.global.independence : null;
  const correlations = control3.global && control3.global.featureCorrelations ? control3.global.featureCorrelations : null;

  const descriptorDominance = normalizeSensitivityAsDescriptorDominance(control2.sensitivity);

  const inputAvailability = computeInputAvailabilityFromControl3(control3);

  const classification = buildFeatureClassification({
    featureIds,
    featureStats,
    independence,
    correlations,
    descriptorDominance
  });

  ensureDir(reportsDir);

  const meta = {
    generatedAt: new Date().toISOString(),
    sources: [
      'CONTROL_1: experimentation/outputs/control_1_feature_calibration.json',
      'CONTROL_2: experimentation/outputs/control_2_dimension_independence_analysis_v2.json',
      'CONTROL_3: experimentation/outputs/control_3_manifold_stress_test.json'
    ]
  };

  const featureMd = buildFeatureStabilityReport({ meta, classification });
  const depMd = buildDescriptorDependencyReport({
    meta,
    classification,
    inputAvailability,
    descriptorDominance: Array.isArray(descriptorDominance) ? descriptorDominance : [],
    control3Global: control3.global
  });
  const latentMd = buildLatentStructureSummary({ meta, control2, control3 });
  const closureMd = buildPhaseClosureSummary({ meta, classification, control3, control1, control2 });

  const out1 = path.join(reportsDir, 'final_feature_stability_report.md');
  const out2 = path.join(reportsDir, 'final_descriptor_dependency_report.md');
  const out3 = path.join(reportsDir, 'final_latent_structure_summary.md');
  const out4 = path.join(reportsDir, 'musicstory_phase_closure_summary.md');

  // Do not overwrite by default: if any exist, stop. Use --overwrite to re-generate during this closure pass.
  const outs = [out1, out2, out3, out4];
  for (const p of outs) {
    if (!overwrite && fs.existsSync(p)) {
      throw new Error(`Refusing to overwrite existing report: ${p}`);
    }
  }

  fs.writeFileSync(out1, featureMd + '\n');
  fs.writeFileSync(out2, depMd + '\n');
  fs.writeFileSync(out3, latentMd + '\n');
  fs.writeFileSync(out4, closureMd + '\n');

  console.log('[finalize_musicstory_experimentation_phase] wrote:');
  console.log('-', out1);
  console.log('-', out2);
  console.log('-', out3);
  console.log('-', out4);

  // Emit a compact stdout summary for verification.
  const counts = classification.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1;
      return acc;
    },
    {}
  );
  console.log('featureCountsByCategory:', counts);
}

try {
  main();
} catch (e) {
  console.error(e && e.message ? e.message : e);
  process.exitCode = 1;
}
