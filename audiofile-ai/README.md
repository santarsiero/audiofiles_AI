# AudioFile LLM Labeling Baseline

This repository contains a minimal, auditable LLM-based labeling baseline for AudioFile.

The baseline pipeline:

- Generates structured labels for each song using multiple LLMs and multiple prompt types.
- Stores full raw model responses (for auditability).
- Produces a normalized aggregation layer (signal-preserving; no filtering).
- Produces a cleaned layer (training-ready outputs with explicit ambiguity + conflicts).

## What gets produced

For an input batch file named `batch_N.json`, the pipeline writes:

- `baseline/data/raw_outputs/batch_N_raw.json`
- `baseline/data/normalized/batch_N_norm.json`
- `baseline/data/cleaned/batch_N_clean.json`

### File meanings

- **Raw (`*_raw.json`)**
  - Full per-output responses from each model + prompt type.
  - Includes parsed labels when available.

- **Normalized (`*_norm.json`)**
  - Pure aggregation of all labels across outputs.
  - Preserves disagreements.
  - Adds `agreement_ratio` per label.

- **Cleaned (`*_clean.json`)**
  - Training-ready output with:
    - `accepted_labels`: high-trust labels
    - `candidate_labels`: plausible fallback labels (not training targets)
    - `rejected_labels`: explicitly rejected labels
    - `resolved_labels`: identical to `accepted_labels`
    - `dimensions`: per-dimension resolution state (accepted/candidate/ambiguous/unknown)
    - `conflicts`: explicit conflict records
    - `debug.source_normalized_labels`: full normalized evidence preserved for audit

## Running a batch

1. Put your batch file in:

- `baseline/data/input/`

Example name:

- `batch_1.json`

2. Run:

```bash
node baseline/scripts/run_batch.js batch_1.json
```

## Re-running ONLY the cleaner

If you change cleaning logic and want to regenerate `*_clean.json` without re-calling models:

```bash
node baseline/scripts/clean.js baseline/data/input/batch_1.json
```

## Configuration

- Allowed labels and label sets live in `baseline/config.js`.
- Model credentials are expected via environment variables (do not commit API keys).

## Important note (for later)

`baseline/scripts/clean.js` currently assumes a fixed total of **6 model outputs per song** (2 models × 3 prompt types). If a song ever has fewer than 6 successful outputs (API error, parse error, partial resume), then `agreement`/`score` fields and some evidence-strength thresholds can be skewed.

Future improvement:

- Have normalization emit a per-song `total_outputs` field.
- Have `clean.js` use `total_outputs` as its denominator instead of a constant.
