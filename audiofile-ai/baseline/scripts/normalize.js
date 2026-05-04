const fs = require('fs');
const path = require('path');
const { config } = require('../config');

function isAllowedLabel(label) {
  return config.allowedLabels.includes(label);
}

function toConfidence(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function strengthFromCount(count) {
  if (count >= 4) return 'strong';
  if (count >= 2) return 'medium';
  if (count === 1) return 'weak';
  return 'weak';
}

function addSupportingOutput(accEntry, model, promptType) {
  if (!accEntry.supportingOutputs) accEntry.supportingOutputs = new Set();
  accEntry.supportingOutputs.add(`${model}||${promptType}`);
}

function normalizeSongRaw(raw) {
  const acc = {};
  const invalidLabels = [];

  const outputs = Array.isArray(raw.outputs) ? raw.outputs : [];
  const totalOutputs = outputs.length;

  for (const o of outputs) {
    const parsed = o && o.response && o.response.parsed ? o.response.parsed : null;
    const labels = parsed && Array.isArray(parsed.labels) ? parsed.labels : [];

    for (const l of labels) {
      const label = l && typeof l.label === 'string' ? l.label.trim() : null;
      const conf = toConfidence(l ? l.confidence : null);

      if (!label) continue;

      if (!isAllowedLabel(label)) {
        invalidLabels.push({ label, model: o.model, prompt_type: o.prompt_type });
        continue;
      }

      if (!acc[label]) {
        acc[label] = {
          count: 0,
          confidenceSum: 0,
          modelBreakdown: {},
          promptBreakdown: {},
          supportingOutputs: new Set()
        };
      }

      acc[label].count += 1;
      acc[label].confidenceSum += conf === null ? 0 : conf;

      const model = o && typeof o.model === 'string' ? o.model : 'unknown';
      const promptType = o && typeof o.prompt_type === 'string' ? o.prompt_type : 'unknown';

      acc[label].modelBreakdown[model] = (acc[label].modelBreakdown[model] || 0) + 1;
      acc[label].promptBreakdown[promptType] = (acc[label].promptBreakdown[promptType] || 0) + 1;
      addSupportingOutput(acc[label], model, promptType);
    }
  }

  const outLabels = {};
  for (const [label, v] of Object.entries(acc)) {
    const supporting_outputs = [...(v.supportingOutputs || new Set())]
      .map((k) => {
        const [model, prompt] = k.split('||');
        return { model, prompt };
      })
      .sort((a, b) => {
        if (a.model !== b.model) return a.model.localeCompare(b.model);
        return a.prompt.localeCompare(b.prompt);
      });

    outLabels[label] = {
      count: v.count,
      agreement_ratio: totalOutputs > 0 ? v.count / totalOutputs : 0,
      avg_confidence: v.count === 0 ? 0 : v.confidenceSum / v.count,
      strength: strengthFromCount(v.count),
      model_breakdown: v.modelBreakdown,
      prompt_breakdown: v.promptBreakdown,
      supporting_outputs
    };
  }

  return {
    song: raw.song,
    labels: outLabels,
    invalidLabels
  };
}

function normalizeFile(rawPath) {
  const raw = JSON.parse(fs.readFileSync(rawPath, 'utf8'));
  return normalizeSongRaw(raw);
}

function normalizeAllRawOutputs({ rawDir, normalizedDir, resultsPath }) {
  const files = fs
    .readdirSync(rawDir)
    .filter((f) => f.endsWith('.json'))
    .sort();

  const all = [];

  for (const f of files) {
    const rawPath = path.join(rawDir, f);
    const normalized = normalizeFile(rawPath);

    if (normalizedDir) {
      const outPath = path.join(normalizedDir, f);
      fs.writeFileSync(outPath, JSON.stringify({ song: normalized.song, labels: normalized.labels }, null, 2));
    }

    if (normalized.invalidLabels.length > 0) {
      console.log(`[normalize] invalid labels in ${f}:`, normalized.invalidLabels);
    }

    all.push({ song: normalized.song, labels: normalized.labels });
  }

  fs.writeFileSync(resultsPath, JSON.stringify(all, null, 2));

  return all;
}

module.exports = {
  normalizeAllRawOutputs
};
