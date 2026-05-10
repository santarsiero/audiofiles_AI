const fs = require('fs');
const path = require('path');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function readJsonFile(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJsonFile(filePath, obj) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n');
}

function escapeCsvValue(v) {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[\r\n",]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function writeCsvFile(filePath, headers, rows) {
  ensureDir(path.dirname(filePath));
  const lines = [];
  lines.push(headers.map(escapeCsvValue).join(','));
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsvValue(row[h])).join(','));
  }
  fs.writeFileSync(filePath, lines.join('\n') + '\n');
}

function safeNumber(x) {
  if (x === null || x === undefined) return null;
  if (typeof x === 'number' && Number.isFinite(x)) return x;
  if (typeof x === 'string' && x.trim() !== '') {
    const n = Number(x);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

function percentile(sortedValues, p) {
  if (!sortedValues.length) return null;
  if (p <= 0) return sortedValues[0];
  if (p >= 1) return sortedValues[sortedValues.length - 1];
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  const w = idx - lo;
  return sortedValues[lo] * (1 - w) + sortedValues[hi] * w;
}

module.exports = {
  ensureDir,
  readJsonFile,
  writeJsonFile,
  writeCsvFile,
  safeNumber,
  percentile
};
