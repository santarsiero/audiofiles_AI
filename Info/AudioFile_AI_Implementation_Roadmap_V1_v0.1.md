# AudioFile AI — Implementation Roadmap (V1)

**Version:** v0.1
**Status:** Active — Working Draft
**Date:** May 2026
**Depends on:** Master Development Plan v0.1, System Architecture Spec v0.1, Feature / Ontology Spec v0.1

---

## 1. Objective

Build the first working end-to-end AudioFile AI pipeline.

- Integrate a single descriptor API provider
- Compute all V1_ACTIVE normalized features
- Generate V1_ACTIVE label scores with confidence values
- Log all inputs, outputs, and missing data for analysis
- Run on a batch of songs and compare outputs against existing LLM baseline

This is a validation build. The goal is to confirm the pipeline is viable in practice — not to maximize coverage.

---

## 2. Scope

### Included

- Descriptor ingestion from a single API provider
- Feature computation for V1_ACTIVE features only
- Label scoring for V1_ACTIVE labels only
- Structured observability logging
- Batch processing against a defined song set
- Comparison output against LLM baseline (batch 1)

### Excluded

- Multi-API descriptor integration
- LLM runtime inference
- EXPERIMENTAL features (Aggression)
- FUTURE features (Groove Complexity, Harmonic Tension, Spatial Width)
- EXPERIMENTAL or FUTURE labels (calm, aggressive, drops, builds, etc.)
- UI or frontend integration
- Selector system integration
- Production deployment

---

## 3. System Modules to Implement

---

### Module 1 — Input Processor

- **Purpose:** Accept song identity and prepare it for downstream processing
- **Inputs:** Song title, artist name, internal song ID
- **Outputs:** Validated request object containing song identity fields
- **Dependencies:** None

---

### Module 2 — Descriptor Provider Interface

- **Purpose:** Query the selected descriptor API and return a normalized descriptor schema
- **Inputs:** Validated request object from Input Processor
- **Outputs:** Normalized descriptor object (present fields populated, absent fields explicitly marked as `null`)
- **Dependencies:** Module 1, selected descriptor API credentials

---

### Module 3 — Feature Normalization Engine

- **Purpose:** Transform normalized descriptor values into internal feature scores
- **Inputs:** Normalized descriptor object from Module 2, feature configuration file
- **Outputs:** Feature score object (each V1_ACTIVE feature either has a value or is marked `undefined`)
- **Dependencies:** Module 2, feature configuration file

---

### Module 4 — Label Scoring Engine

- **Purpose:** Convert feature scores into probabilistic label candidates with confidence values
- **Inputs:** Feature score object from Module 3, label configuration file
- **Outputs:** Label score object (each V1_ACTIVE label either has a confidence score or is omitted per config rules)
- **Dependencies:** Module 3, label configuration file

---

### Module 5 — Output Formatter

- **Purpose:** Assemble the final structured output object for a single song
- **Inputs:** Song identity, feature score object, label score object, missing data records
- **Outputs:** Structured output object per the schema defined in System Architecture Spec §8
- **Dependencies:** Modules 2, 3, 4

---

### Module 6 — Observability Logger

- **Purpose:** Record all intermediate and final values for later analysis
- **Inputs:** Raw descriptor response, feature scores, label scores, missing descriptor list, missing feature list
- **Outputs:** Structured log entry per song (format TBD — see Open Questions)
- **Dependencies:** Modules 2, 3, 4

---

### Module 7 — Batch Runner

- **Purpose:** Execute the full pipeline across a defined batch of songs and collect outputs
- **Inputs:** List of songs (batch 1), all upstream modules
- **Outputs:** Batch output collection, batch log collection
- **Dependencies:** All modules (1–6)

---

## 4. Implementation Steps

Steps must be completed in order. Do not proceed to a later step before the prior step is validated.

---

### Step 1 — Input Handling

- Define the input format: song title, artist name, internal song ID
- Implement input validation (required fields, format checks)
- Produce a validated request object
- Handle invalid or incomplete inputs with explicit errors — do not silently proceed

---

### Step 2 — Descriptor Integration

- Select and confirm the descriptor API provider to use for V1
- Implement the Descriptor Provider Interface (Module 2)
- Query the API using song identity fields
- Parse the raw API response into the internal normalized descriptor schema
- For every expected descriptor field: record value if present, record `null` if absent
- Do not substitute absent fields with default values
- Handle API failures (timeouts, no results, rate limits) with explicit error states — do not silently continue

---

### Step 3 — Feature Computation

- Define the feature configuration file structure (descriptor field → feature score mapping, fallback priority, undefined conditions)
- Implement the Feature Normalization Engine (Module 3)
- Compute the following V1_ACTIVE features from available descriptor inputs:
  - **Energy** — primary: arousal, intensity; supporting: loudness, loudness range, event density
  - **Density / Texture** — primary: event density; weak proxy: rhythmic stability (not to be used as sole input)
  - **Brightness / Timbre** — primary: brightness descriptor; fallback: spectral centroid
  - **Pulse / Rhythmic Regularity** — primary: pulse clarity, rhythmic stability; weak proxy: danceability (must not be used as primary input)
  - **Vocal Presence** — primary: vocal/instrumental descriptor, music/speech descriptor
- For each feature: if required inputs exist, compute score; if inputs are insufficient, mark feature as `undefined`
- A feature must not be produced if its required descriptor inputs are insufficient to produce a reliable signal
- Log undefined features explicitly

---

### Step 4 — Label Scoring

- Define the label configuration file structure (feature dependencies, confidence logic, conflict rules, omission vs. low-confidence behavior)
- Implement the Label Scoring Engine (Module 4)
- Generate confidence scores for the following V1_ACTIVE labels:
  - `high_energy` / `low_energy`
  - `dense` / `sparse`
  - `bright` / `dark`
  - `steady` / `driving`
  - `vocal` / `instrumental` / `speech`
- Do not assign binary labels — output continuous confidence values only
- Apply conflict rules: opposing labels (e.g., bright vs. dark) must not both be output at high confidence
- `driving` requires agreement across Pulse, Energy, and Density — single-feature support yields low confidence
- Handle missing features per config (omit label or output low confidence) — do not infer from absent data

---

### Step 5 — Output Construction

- Implement the Output Formatter (Module 5)
- Assemble final output object per song:
  - `song_id`
  - `provider`
  - `pipeline_version`
  - `features` (value or `null` per feature)
  - `label_scores` (confidence per label, or omitted)
  - `missing_descriptors` (list)
  - `missing_features` (list)
- Validate output object structure before passing to logger and batch runner

---

### Step 6 — Observability Logging

- Implement the Observability Logger (Module 6)
- For each song processed, log:
  - Raw descriptor response from API
  - Which descriptor fields were present and which were absent
  - Computed feature scores (including `undefined` markers)
  - Label scores and confidence values
  - Any labels omitted due to missing features
  - Pipeline version identifier
- Logs must be structured and machine-readable (format TBD — see Open Questions)
- Logs must support later batch-level analysis and LLM comparison

---

### Step 7 — Batch Processing

- Implement the Batch Runner (Module 7)
- Define batch 1 song set (source TBD — see Open Questions)
- Run the full pipeline across all songs in batch 1
- Store output objects and log entries per song in a consistent format
- Track and surface batch-level statistics:
  - Number of songs with complete feature sets
  - Number of songs with one or more undefined features
  - Number of songs with no label output
  - Most frequently missing descriptors

---

### Step 8 — LLM Comparison

- Load existing LLM baseline outputs for the same batch 1 song set
- For each song, compare:
  - Which labels the descriptor pipeline assigned (at what confidence)
  - Which labels the LLM baseline assigned
  - Where they agree
  - Where they disagree
- Record mismatches in a structured format
- Do not resolve disagreements — record them for analysis
- Flag high-disagreement songs for manual inspection

---

## 5. Data Recording Requirements

The following must be stored per song after a full pipeline run:

| Field | Description |
|---|---|
| `song_id` | Internal identifier |
| `provider` | Descriptor API source used |
| `pipeline_version` | Version of feature and label config in use |
| `raw_descriptors` | Full raw API response |
| `missing_descriptors` | List of descriptor fields not returned |
| `feature_scores` | All V1 feature values or `null` |
| `missing_features` | List of features marked undefined |
| `label_scores` | All V1 label confidence values or omission markers |
| `llm_baseline_labels` | Labels assigned by LLM baseline for same song |
| `comparison_flags` | Agreement / disagreement markers per label |

---

## 6. Validation Goals

After batch 1 processing, the following questions must be answerable from recorded data:

- Are all V1_ACTIVE features computable from real descriptor API data?
- Which features are most frequently undefined due to missing inputs?
- Which descriptor fields are most frequently absent across the batch?
- Which V1 labels align with LLM baseline outputs?
- Which V1 labels diverge from LLM baseline outputs?
- Which feature-to-label mappings appear weak, inconsistent, or unreliable?
- Are any labels systematically never produced due to feature gaps?

---

## 7. Success Criteria

V1 is considered minimally successful when:

- The pipeline completes processing attempts for all songs in batch 1 without undefined system behavior or silent failures
- V1_ACTIVE features are computed for the majority of songs with valid descriptor retrieval
- Label scores are generated consistently and reflect the defined confidence logic
- Observability logs are complete and structured for batch-level analysis
- LLM comparison output is produced and mismatches are recorded
- No undefined behavior, silent failures, or fabricated values occur

---

## 8. Known Risks

- **Descriptor coverage gaps** — The selected API may not return sufficient descriptors for a meaningful portion of songs, causing feature collapse
- **Weak proxy mappings** — Features relying on proxies (e.g., rhythmic stability for density, danceability for pulse) may produce unreliable scores
- **Feature collapse under missing data** — Multiple missing descriptors may cause a cascade of undefined features, leaving many songs with no label output
- **Label ambiguity at boundaries** — Opposing labels (e.g., steady vs. driving) may produce similar confidence values for many songs, making distinctions unclear
- **LLM baseline misalignment** — LLM baseline may have been generated with different label definitions, reducing the usefulness of direct comparison

---

## 9. Open Implementation Questions

- Which descriptor API will be used for V1? (Must be confirmed before Step 2)
- How will songs in batch 1 be selected and how many will be included?
- How will API authentication and credentials be managed?
- How will API rate limits or failures be handled at batch scale?
- What format will observability logs be stored in — structured files (JSON/CSV) or a database?
- How will LLM baseline outputs be loaded and matched to batch 1 songs by identity?
- What is the pipeline version identifier format?

---

## 10. Immediate Next Action

- Continue expanding cached descriptor coverage via batch runs (rate-limit-aware, resume-capable)
- Calibrate and validate descriptor → dimension formulas against representative tracks
- Tune conservative label firing thresholds and confidence propagation rules
- Record systematic mismatches and failure patterns into the Experiment & Findings Log
- Avoid expanding into new APIs or large new label sets until calibration behavior is stable
