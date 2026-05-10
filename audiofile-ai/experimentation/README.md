# AudioFile AI Experimentation (V1)

This folder contains **isolated research tooling** for analyzing cached descriptor datasets (e.g., Music Story batch JSON exports).

## Isolation & Safety Rules

- This subsystem **reads saved descriptor cache files only**.
- It **must not call external APIs**.
- It **must not modify** cached descriptor files.
- It **must not alter runtime pipeline code**.
- Outputs generated here are **observations**, not architecture truth.
- Any validated findings should later be **manually promoted** into official specs/logs.

## Current Experiment Goals

1. Coverage analysis
2. Descriptor schema audit
3. Numeric distribution analysis
4. Correlation / redundancy analysis
5. Small human sanity-review support (later)

## Data Sources

By default, scripts read cached Music Story batch files from:

- `baseline/data/musicstory/batch_*_musicstory.json`

## Running

Run all experiments:

- `npm run experiment:musicstory`

Or run a single script with Node:

- `node experimentation/scripts/001_coverage_analysis.js`

Outputs:

- Human-readable markdown reports: `experimentation/reports/`
- Machine-readable JSON/CSV artifacts: `experimentation/outputs/`
