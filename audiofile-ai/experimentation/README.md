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

## Music Story Phase Closure (2026-05)

The Music Story-only experimentation phase has been closed with finalized diagnostic reports:

- `experimentation/reports/final_feature_stability_report.md`
- `experimentation/reports/final_descriptor_dependency_report.md`
- `experimentation/reports/final_latent_structure_summary.md`
- `experimentation/reports/musicstory_phase_closure_summary.md`

Primary experimental runs that produced the core evidence:

- CONTROL_1: join + semantic validation + feature calibration
- CONTROL_2: dimension independence analysis
- CONTROL_3: manifold stress test (coverage-maximizing sampling from cache)

## Data Sources

By default, scripts read cached Music Story batch files from:

- `baseline/data/musicstory/batch_*_musicstory.json`

## Running

Run all experiments:

- `npm run experiment:musicstory`

Or run a single script with Node:

- `node experimentation/scripts/001_coverage_analysis.js`

Regenerate the final closure reports (will refuse to overwrite unless `--overwrite` is passed):

- `node experimentation/scripts/finalize_musicstory_experimentation_phase.js`
- `node experimentation/scripts/finalize_musicstory_experimentation_phase.js --overwrite`

Outputs:

- Human-readable markdown reports: `experimentation/reports/`
- Machine-readable JSON/CSV artifacts: `experimentation/outputs/`
