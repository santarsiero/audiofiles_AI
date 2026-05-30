#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, obj) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
}

function writeText(p, s) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
}

function safeNumber(v) {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  return null;
}

function mean(xs) {
  if (!xs.length) return null;
  return xs.reduce((s, v) => s + v, 0) / xs.length;
}

function stdSample(xs) {
  if (xs.length < 2) return null;
  const m = mean(xs);
  let acc = 0;
  for (const x of xs) acc += (x - m) * (x - m);
  return Math.sqrt(acc / (xs.length - 1));
}

function median(xs) {
  if (!xs.length) return null;
  const a = [...xs].sort((x, y) => x - y);
  const n = a.length;
  const mid = Math.floor(n / 2);
  if (n % 2 === 1) return a[mid];
  return (a[mid - 1] + a[mid]) / 2;
}

function pearson(xs, ys) {
  if (xs.length !== ys.length) throw new Error('pearson input length mismatch');
  const n = xs.length;
  if (n < 2) return { r: null, n };
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let denx = 0;
  let deny = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    num += dx * dy;
    denx += dx * dx;
    deny += dy * dy;
  }
  const den = Math.sqrt(denx * deny);
  if (!Number.isFinite(den) || den === 0) return { r: null, n };
  return { r: num / den, n };
}

function redundancyBand(r) {
  const ar = Math.abs(r);
  if (ar > 0.8) return 'HIGHLY REDUNDANT';
  if (ar >= 0.4) return 'MODERATELY RELATED';
  return 'MOSTLY INDEPENDENT';
}

function formatNum(v, digits = 6) {
  if (v === null || v === undefined || !Number.isFinite(v)) return 'null';
  return Number(v).toFixed(digits);
}

function main() {
  const successesPath = process.argv[2]
    ? path.resolve(process.argv[2])
    : path.resolve(__dirname, '..', 'outputs', 'musicstory_successes_only.json');

  const outJsonPath = process.argv[3]
    ? path.resolve(process.argv[3])
    : path.resolve(__dirname, '..', 'outputs', 'density_correlation_redundancy_analysis.json');

  const outMdPath = process.argv[4]
    ? path.resolve(process.argv[4])
    : path.resolve(__dirname, '..', 'reports', 'density_correlation_redundancy_analysis.md');

  const primary = ['event_density', 'complexity', 'flatness', 'zero_cross_rate', 'intensity', 'absolute_loudness'];
  const secondary = ['loudness', 'arousal', 'complexity_chroma'];

  const obj = readJson(successesPath);
  const rows = Array.isArray(obj.rows) ? obj.rows : [];

  // Extract arrays per key (univariate)
  const values = {};
  for (const k of [...primary, ...secondary]) values[k] = [];

  for (const r of rows) {
    const d = r && r.rawDescriptorData && typeof r.rawDescriptorData === 'object' ? r.rawDescriptorData : {};
    for (const k of Object.keys(values)) {
      const n = safeNumber(d[k]);
      if (n !== null) values[k].push(n);
    }
  }

  const distributions = {};
  for (const k of Object.keys(values)) {
    const xs = values[k];
    const m = mean(xs);
    const med = median(xs);
    const sd = stdSample(xs);
    const min = xs.length ? Math.min(...xs) : null;
    const max = xs.length ? Math.max(...xs) : null;
    distributions[k] = {
      n: xs.length,
      mean: m,
      median: med,
      std: sd,
      min,
      max
    };
  }

  // Pairwise complete-case correlations (primary only)
  const pairwise = {};
  for (let i = 0; i < primary.length; i++) {
    for (let j = 0; j < primary.length; j++) {
      const a = primary[i];
      const b = primary[j];
      if (j < i) continue;

      const xs = [];
      const ys = [];
      for (const r of rows) {
        const d = r && r.rawDescriptorData && typeof r.rawDescriptorData === 'object' ? r.rawDescriptorData : {};
        const va = safeNumber(d[a]);
        const vb = safeNumber(d[b]);
        if (va === null || vb === null) continue;
        xs.push(va);
        ys.push(vb);
      }

      const { r: corrR, n } = pearson(xs, ys);
      pairwise[`${a}|||${b}`] = {
        a,
        b,
        r: corrR,
        n,
        band: corrR === null ? null : redundancyBand(corrR)
      };
    }
  }

  const analysis = {
    generatedAt: new Date().toISOString(),
    meta: {
      successesPath: path.relative(process.cwd(), successesPath),
      successCount: rows.length,
      primary,
      secondary,
      correlation: { method: 'pearson', completeCase: true }
    },
    distributions,
    correlationPrimary: pairwise
  };

  writeJson(outJsonPath, analysis);

  // Build markdown report (interpretation text is in report; correlations provided numerically)
  const corrLookup = (a, b) => {
    const k1 = `${a}|||${b}`;
    const k2 = `${b}|||${a}`;
    const hit = analysis.correlationPrimary[k1] || analysis.correlationPrimary[k2];
    return hit || null;
  };

  const matrixLines = [];
  const header = [''].concat(primary).join('\t');
  matrixLines.push(header);
  for (const a of primary) {
    const row = [a];
    for (const b of primary) {
      const hit = a === b ? { r: 1, n: analysis.meta.successCount } : corrLookup(a, b);
      row.push(hit && hit.r !== null ? formatNum(hit.r, 6) : 'null');
    }
    matrixLines.push(row.join('\t'));
  }

  const md = [];
  md.push('# Density Candidate Correlation & Redundancy Analysis (Music Story cache)\n');
  md.push('## IMPORTANT\n');
  md.push('DO NOT IMPLEMENT.\n');
  md.push('DO NOT MODIFY CODE.\n');
  md.push('DO NOT MODIFY RUNTIME.\n');
  md.push('DO NOT CHANGE DENSITY.\n');
  md.push('DO NOT CHANGE THRESHOLDS.\n');
  md.push('This document is analysis/proposal only.\n');
  md.push('---\n');
  md.push('## Inputs\n');
  md.push(`- successes: \`${path.relative(path.resolve(__dirname, '..'), successesPath)}\`\n`);
  md.push(`- n (successful payloads): \`${rows.length}\`\n`);
  md.push('---\n');

  md.push('# SECTION 1 — Distribution Review (all successful songs)\n');
  md.push('| descriptor | n | mean | median | std | min | max |\n');
  md.push('|---|---:|---:|---:|---:|---:|---:|\n');
  for (const k of primary) {
    const d = distributions[k];
    md.push(`| ${k} | ${d.n} | ${formatNum(d.mean, 6)} | ${formatNum(d.median, 6)} | ${formatNum(d.std, 6)} | ${formatNum(d.min, 6)} | ${formatNum(d.max, 6)} |\n`);
  }

  // Secondary only if present (always present in this dataset historically, but keep conditional)
  const secondaryPresent = secondary.filter((k) => distributions[k] && distributions[k].n > 0);
  if (secondaryPresent.length) {
    md.push('\nOptional secondary candidates (for context):\n\n');
    md.push('| descriptor | n | mean | median | std | min | max |\n');
    md.push('|---|---:|---:|---:|---:|---:|---:|\n');
    for (const k of secondaryPresent) {
      const d = distributions[k];
      md.push(`| ${k} | ${d.n} | ${formatNum(d.mean, 6)} | ${formatNum(d.median, 6)} | ${formatNum(d.std, 6)} | ${formatNum(d.min, 6)} | ${formatNum(d.max, 6)} |\n`);
    }
  }

  md.push('\n---\n');
  md.push('# SECTION 2 — Correlation Matrix (Pearson; primary candidates)\n');
  md.push('Tab-separated matrix (copy/paste friendly):\n\n');
  md.push('```\n');
  md.push(matrixLines.join('\n') + '\n');
  md.push('```\n');

  md.push('\n---\n');
  md.push('# SECTION 3 — Redundancy Analysis (pairwise)\n');
  md.push('Thresholds: \n');
  md.push('- **HIGHLY REDUNDANT**: |r| > 0.80\n');
  md.push('- **MODERATELY RELATED**: 0.40 ≤ |r| ≤ 0.80\n');
  md.push('- **MOSTLY INDEPENDENT**: |r| < 0.40\n\n');

  // Sort pairs by |r| desc
  const pairs = Object.values(pairwise)
    .filter((p) => p.a !== p.b)
    .map((p) => ({ ...p, absR: p.r === null ? null : Math.abs(p.r) }))
    .filter((p) => p.absR !== null)
    .sort((x, y) => (y.absR - x.absR) || `${x.a}|||${x.b}`.localeCompare(`${y.a}|||${y.b}`));

  // Keep only unique pairs a<b based on index order
  const primaryIdx = Object.fromEntries(primary.map((k, i) => [k, i]));
  const uniquePairs = pairs.filter((p) => primaryIdx[p.a] < primaryIdx[p.b]);

  md.push('| A | B | r | band | n |\n');
  md.push('|---|---|---:|---|---:|\n');
  for (const p of uniquePairs) {
    md.push(`| ${p.a} | ${p.b} | ${formatNum(p.r, 6)} | ${p.band} | ${p.n} |\n`);
  }

  md.push('\n---\n');
  md.push('# SECTION 4 — Unique Information Analysis (qualitative, grounded in correlations)\n');
  md.push('This section is interpretive; the correlation table above indicates what is likely redundant vs additive.\n\n');

  md.push('## event_density\n');
  md.push('- Unique hypothesis: **event/onset activity rate** (how frequently events occur).\n');
  md.push('- Expectation: tends to be less tied to purely spectral/noise measures than flatness/ZCR, though it can correlate via percussiveness.\n\n');

  md.push('## complexity\n');
  md.push('- Unique hypothesis: **informational / structural complexity** beyond raw event rate.\n');
  md.push('- Potential redundancy: can correlate with textural features depending on genre/arrangement.\n\n');

  md.push('## flatness\n');
  md.push('- Unique hypothesis: **spectral noisiness / broadband texture** (crowding proxy).\n');
  md.push('- Risk: can conflate “noisy/distorted” with “dense.”\n\n');

  md.push('## zero_cross_rate\n');
  md.push('- Unique hypothesis: **high-frequency/transient/noise activity proxy**.\n');
  md.push('- Often overlaps with spectral brightness/roll-off family; may be partially redundant with flatness.\n\n');

  md.push('## intensity\n');
  md.push('- Unique hypothesis: **energetic drive / macro loudness-energy proxy** (often correlates with loudness).\n');
  md.push('- Risk: may measure “energy” more than “density.”\n\n');

  md.push('## absolute_loudness\n');
  md.push('- Unique hypothesis: **mastering level / overall level**; correlated with modern dense production, but heavily confounded.\n');
  md.push('- High redundancy expected vs `loudness` and partial redundancy vs `intensity`.\n\n');

  md.push('---\n');
  md.push('# SECTION 5 — Density Dimension Candidates (proposal-only)\n');
  md.push('These are *descriptor set* candidates only (no weights / no implementation).\n\n');

  md.push('## Candidate A — Minimal density model\n');
  md.push('- Include: `event_density`, `complexity`\n');
  md.push('- Exclude: `flatness`, `zero_cross_rate`, `intensity`, `absolute_loudness`\n');
  md.push('- Reason: aims to represent density as *activity + informational complexity* with minimal confounds.\n\n');

  md.push('## Candidate B — Balanced density model\n');
  md.push('- Include: `event_density`, `complexity`, `flatness`\n');
  md.push('- Exclude: `zero_cross_rate`, `intensity`, `absolute_loudness`\n');
  md.push('- Reason: adds a “sonic crowding” axis without pulling in loudness/energy.\n\n');

  md.push('## Candidate C — Maximum-information density model\n');
  md.push('- Include: `event_density`, `complexity`, `flatness`, `zero_cross_rate`\n');
  md.push('- Exclude: `intensity`, `absolute_loudness`\n');
  md.push('- Reason: keeps multiple textural cues but avoids the loudness/energy confound set.\n\n');

  md.push('---\n');
  md.push('# SECTION 6 — Recommended Density Foundation (if designing V1 today)\n');
  md.push('Proposed foundation ranking (subject to the redundancy results above):\n\n');
  md.push('1. `event_density`\n');
  md.push('2. `complexity`\n');
  md.push('3. `flatness`\n');
  md.push('4. `zero_cross_rate`\n');
  md.push('5. `intensity` (optional)\n\n');
  md.push('Rationale: prioritize activity + complexity; add textural crowding; treat energy/loudness as secondary/optional.\n\n');

  md.push('---\n');
  md.push('# SECTION 7 — Final Recommendation (what density should represent)\n');
  md.push('Tentative recommendation: **D. Hybrid** (Event Activity + Informational Complexity + Sonic Crowding)\n\n');
  md.push('Reason: the calibration separation suggests density in practice is not a single axis; however, correlations should be used to avoid duplicating the same phenomenon (especially loudness/intensity overlap).\n\n');

  md.push('---\n');
  md.push('## Output artifacts\n');
  md.push(`- JSON: \`${path.relative(process.cwd(), outJsonPath)}\`\n`);
  md.push(`- Report: \`${path.relative(process.cwd(), outMdPath)}\`\n`);

  writeText(outMdPath, md.join(''));

  console.log(
    JSON.stringify(
      {
        ok: true,
        successCount: rows.length,
        outJson: outJsonPath,
        outMd: outMdPath
      },
      null,
      2
    )
  );
}

main();
