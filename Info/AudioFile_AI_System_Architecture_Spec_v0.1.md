# AudioFile AI — System Architecture Spec

**Version:** v0.1
**Status:** Active — Working Draft
**Date:** May 2026
**Depends on:** AudioFile AI — Master Development Plan v0.1

---

## 1. System Overview

AudioFile AI is a dimension-first, descriptor-driven inference pipeline. It takes a song identity as input, retrieves precomputed audio descriptors from legal APIs, normalizes those descriptors into internal feature scores, and uses those features to produce probabilistic label candidates with associated confidence values.

The system is:
- Config-driven at the feature and label mapping layers
- Probabilistic — no hard binary label assignments
- Designed to degrade gracefully under missing or incomplete descriptor data
- Modular — each layer is independently replaceable

The LLM baseline is not part of the runtime inference path. It operates as an external comparison system during validation only.

---

## 2. High-Level Pipeline

```
Song Identity
     ↓
Descriptor Ingestion Layer
(fetch raw descriptors from API)
     ↓
Feature Normalization Layer
(transform descriptors → normalized feature scores)
     ↓
Label Scoring Layer
(map feature scores → probabilistic label candidates)
     ↓
Output Layer
(features + label scores + confidence + missing data indicators)
```

---

## 3. Core Components

### 3.1 Input Layer

**Inputs:**
- Song identity (internal song ID)
- Optional metadata (title, artist) — used for API lookup, not feature computation

**Responsibilities:**
- Provide a stable, consistent identifier for downstream API calls
- Pass metadata to descriptor ingestion only; metadata does not enter the feature or label layers directly

---

### 3.2 Descriptor Ingestion Layer

**Responsibilities:**
- Query one or more legal descriptor API providers using song identity or metadata
- Retrieve raw descriptor fields (e.g., arousal, pulse clarity, vocal presence, brightness)
- Normalize API response structure into a consistent internal schema
- Record which descriptors were returned and which were absent

**Missing data behavior:**
- Missing descriptors are logged explicitly
- They are NOT substituted with default values or fabricated
- Downstream layers receive explicit signals indicating which fields are absent

**V1 scope:**
- One descriptor API provider
- Exact provider TBD during Phase 1 implementation

---

### 3.3 Feature Normalization Layer

**Responsibilities:**
- Transform raw descriptor values into internal normalized feature scores
- Output continuous values on a consistent scale across all descriptor sources
- Apply config-driven mappings (descriptor field → feature score)

**Design:**
- Feature definitions and their descriptor sources are defined in a configuration file, not hardcoded
- Each feature draws from one or more descriptor fields with defined priority ordering
- If a primary descriptor is absent, fallback descriptors may be used where defined in configuration
- If no valid input exists for a feature, that feature score is marked undefined — not estimated

**Expected feature categories (working assumption — not finalized):**
- Energy
- Density / Texture
- Brightness / Timbre
- Pulse / Rhythmic Regularity
- Vocal Presence

**Output:** A set of named feature scores, each with a value or an explicit undefined marker.

---

### 3.4 Label Scoring Layer

**Responsibilities:**
- Consume normalized feature scores from the feature layer
- Apply defined mapping logic to produce label candidates with associated confidence
- Output is probabilistic — no binary on/off assignments

**Design:**
- Label-to-feature mappings are config-driven
- Each label references one or more feature scores as inputs
- Confidence is influenced by the strength of feature signals and the completeness of available inputs, as defined by mapping configuration
- If required features for a label are undefined, label handling (omission vs. low-confidence output) is defined in configuration — not assumed

**Conflict handling:**
- Opposing labels (e.g., bright vs. dark) are resolved by confidence weighting
- The system may output both if evidence is ambiguous, with corresponding low confidence values
- No label is forced

**V1 scope:**
- Limited label subset, defined during Phase 1
- Label set is not finalized

---

### 3.5 Output Layer

**Output per song:**

| Field | Description |
|---|---|
| `song_id` | Internal identifier |
| `features` | Named feature scores (value or `null` if undefined) |
| `label_scores` | Label name + confidence score pairs |
| `missing_descriptors` | List of descriptor fields that were absent |
| `missing_features` | List of features that could not be computed |
| `provider` | Descriptor API source used |
| `pipeline_version` | Version identifier for ontology + model behavior |

---

## 4. Data Flow

**Step-by-step:**

1. Song identity is passed to the Descriptor Ingestion Layer
2. The ingestion layer queries the descriptor API and receives a raw response
3. The raw response is parsed into a consistent internal descriptor schema; absent fields are recorded
4. The Feature Normalization Layer reads the descriptor schema and evaluates each feature definition against available inputs
5. For each feature: if inputs exist, compute a normalized score; if inputs are absent, mark the feature as undefined
6. The Label Scoring Layer reads normalized feature scores and evaluates each label definition
7. For each label: if required features are defined, compute a confidence-weighted score; if required features are undefined, omit or flag the label
8. The Output Layer assembles the full result object and passes it downstream

**At no point in this flow:**
- Are missing values fabricated
- Are raw descriptor values passed directly to the label layer
- Is raw audio accessed or processed

---

## 5. Observability & Experimentation Layer

This layer exists alongside the core pipeline to support testing, validation, and pattern discovery. It is not part of inference — it captures and stores data to enable analysis.

**What is logged per run:**
- Raw descriptor values returned by the API
- Which descriptors were missing
- Computed feature scores (including undefined markers)
- Label candidates and confidence scores
- Descriptor provider and pipeline version

**What this enables:**
- Identifying which descriptors are consistently absent for certain song types
- Detecting features that rarely produce meaningful scores
- Comparing pipeline outputs against LLM baseline outputs at the label level
- Identifying systematic disagreements between descriptor inference and LLM outputs
- Tracking label coverage rates across a test song set

**Comparison workflow (V1):**
- Run descriptor pipeline on a batch of songs → log outputs
- Run LLM baseline on same batch → log outputs
- Compare label assignments per song
- Manually inspect high-disagreement cases
- Use findings to refine feature definitions and label mappings

---

## 6. LLM Baseline Integration (Non-Runtime)

**Role:**
- External comparison system — not part of the inference pipeline
- Generates label outputs via structured prompts and LLM models
- Used to produce a comparison signal during Phase 2 validation

**What it is:**
- A separate pipeline that produces label candidates for the same song set
- A source of pseudo-ground-truth for ontology testing
- A fallback signal source when descriptor coverage is insufficient (future consideration)

**What it is not:**
- Part of the V1 runtime inference path
- Authoritative ground truth
- A replacement for descriptor-based inference

**Integration point:**
- LLM outputs are consumed by the Observability & Experimentation Layer
- They are stored alongside descriptor pipeline outputs for comparison
- They do not modify or override descriptor pipeline outputs in V1

---

## 7. Multi-API Future Integration

> **Status: FUTURE — not part of V1**

**Direction:**
- Add additional legal descriptor/API providers beyond the initial single source
- Map all provider-specific descriptor fields into the same unified internal feature schema
- Define provider priority when multiple sources return values for the same feature
- Use multiple sources to improve confidence and fill data gaps

**Design constraints (not yet defined):**
- Exact conflict resolution logic is undefined
- Merging strategy is undefined
- Provider weighting is undefined

These will be defined during Phase 4 based on empirical findings from Phases 1–3.

---

## 8. System Outputs

**Full output structure per song:**

```
{
  song_id:              string
  provider:             string
  pipeline_version:     string
  features: {
    [feature_name]:     float | null
  }
  label_scores: {
    [label_name]:       float  // 0.0–1.0 confidence
  }
  missing_descriptors:  string[]
  missing_features:     string[]
}
```

**Notes:**
- Feature values are `null` when inputs were insufficient to compute
- Label scores are omitted entirely or included at low confidence when required features are undefined — behavior defined in config
- `pipeline_version` enables traceability when ontology or mapping logic changes

---

## 9. Constraints

- **No raw audio** — V1 does not access, process, or analyze audio waveforms
- **No streaming platform audio analysis** — prohibited by platform policies and outside legal scope
- **No neural embeddings in V1** — no waveform-derived or deep-model-derived feature vectors
- **Legal descriptor APIs only** — all inputs must come from precomputed, legally accessible descriptor sources
- **Feature and label mappings must be externally configurable** — mapping logic must not be hardcoded in implementation
- **Missing data must not be fabricated** — the system abstains or reduces confidence; it does not invent signal
- **Labels are probabilistic** — no binary forced assignments
- **Ontology is versioned** — label definitions and feature mappings are tied to an explicit version identifier

---

## 10. Open Architecture Questions

- What percentage of songs in a real library will have sufficient descriptor coverage to produce any labels?
- Which normalized features are actually reliable under real API data vs. theoretically defined?
- How should multiple API providers be prioritized when they return conflicting descriptor values for the same song?
- At what confidence threshold should a label be surfaced to the user vs. suppressed?
- Under what conditions should LLM fallback outputs enter the runtime path (if ever)?
- How should the feature config be updated when empirical testing reveals a descriptor is unreliable?
- What is the minimum viable label coverage needed to power the selector system usefully?
