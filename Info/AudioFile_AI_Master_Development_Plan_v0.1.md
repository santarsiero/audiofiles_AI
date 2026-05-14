# AudioFile AI — Master Development Plan

**Version:** v0.1
**Status:** Active — Working Draft
**Date:** May 2026

---

## 1. System Overview

AudioFile AI is a structured music-understanding and auto-labeling layer built on top of the AudioFile platform.

**What it is:**
- A probabilistic inference system that derives descriptive labels from normalized musical feature dimensions
- A dimension-first pipeline: song → descriptors → normalized features → labels
- A suggestion layer — AI outputs are not authoritative, they are inputs to the user's workflow

**What it is not:**
- A recommendation engine
- A music generation system
- A perfect music understanding system
- An autonomous labeling authority

**High-level purpose:**
Produce consistent, scalable, useful labels that allow general users to engage with AudioFile without manually labeling every song — and that are structured enough to power an AI selector/discovery system.

---

## 2. Product Purpose

| User Type | Labeling Behavior | AI Role |
|---|---|---|
| General users | Need labels immediately, no manual work | AI labels the library automatically |
| DJs / expert users | May label manually, care about precision | AI assists, user overrides freely |

**Why the system exists:**
- AudioFile without auto-labeling requires significant manual effort — blocking general users entirely
- Expanding to general users requires a labeling layer that works without human input
- A structured label layer is also the prerequisite for the AI selector/discovery engine
- The selector enables users to search and surface music by musical feel, function, behavior, and meaning — not just title or artist

---

## 3. Core Architecture

**Pipeline:**

```
song → descriptor APIs → normalized features/dimensions → labels
```

**Dimension-first principle:**
- Normalized features/dimensions are the core truth layer
- Labels are derived, human-facing interpretations of those features
- Labels must not be treated as the system's primitive truth

**Descriptor pipeline (primary system):**
- Fetches precomputed audio descriptors from legal APIs
- Normalizes raw descriptor fields into internal feature scores
- Applies defined mapping logic to produce label candidates with associated confidence

**LLM fallback/comparison layer (auxiliary system):**
- Generates label outputs via LLM using structured prompts
- Used for: pseudo-ground-truth comparison, ontology testing, fallback when descriptor data is weak or absent
- Not ground truth — functions as a comparison signal and weak auxiliary layer

**Long-term direction:**
The system will likely combine descriptor inference, LLM fallback, and future validated expansion layers. The immediate direction is descriptor-first.

---

## 4. Current System State

| System | Status | Role |
|---|---|---|
| LLM Baseline / Fallback Pipeline | **Exists** | Comparison, ontology testing, auxiliary signal, fallback |
| Descriptor-Based Pipeline | **Entering initial implementation** | Primary long-term system |
| YAMNet / Audio ML System | **Historical only — excluded** | Prior experimentation, not part of current architecture |

**LLM pipeline notes:**
- Uses multiple prompt styles and models to generate structured label outputs
- Output is used to test whether label definitions make sense across real songs
- Output is compared against descriptor-based outputs during validation phases
- Not treated as authoritative in any case

**Descriptor pipeline notes:**
- Real system foundation
- Has not yet produced validated outputs against real descriptor data
- Initial implementation begins with a minimal vertical slice (see Phase 1)

---

## 5. Core Principles and Constraints

**System behavior:**
- AI outputs are suggestions only — never silent overrides of user-defined labels
- Outputs are probabilistic — each label carries a confidence score, not a binary assignment
- Missing data is a first-class condition — the system must degrade gracefully, abstain, or lower confidence rather than invent certainty
- User semantics are never overridden by cross-user learning or model updates

**Architecture:**
- Modular — the pipeline separates descriptor fetching, feature normalization, and label inference into distinct layers
- Versioned — both the ontology and model behavior must be versioned explicitly
- No raw audio assumption — V1 relies entirely on legal, precomputed descriptor data
- No streaming-platform audio analysis
- No waveform processing or neural embeddings for V1

**Temporal/structural labels (e.g. drops, builds, repetitive):**
- Out of scope for descriptor-only V1 inference
- Not out of scope for the long-term product
- May be supported in future via LLM fallback, hybrid systems, or richer licensed data sources

---

## 6. Development Phases

### Phase 1 — Minimal Descriptor Pipeline
- Integrate one descriptor API source
- Normalize a limited set of features from that source
- Produce label outputs for a limited label subset
- Goal: establish the real pipeline end-to-end, not coverage

### Phase 2 — Validation & Truth Discovery
- Compare Phase 1 descriptor-derived labels against LLM baseline outputs
- Manually inspect failures and disagreements
- Determine which labels and features hold under real descriptor data

### Phase 3 — Feature Expansion
- Expand normalized feature coverage based on validated descriptor behavior from Phase 2
- Only add features with demonstrated descriptor support

### Phase 4 — Multi-API Integration
- Integrate additional legal descriptor/API sources
- Define provider priority and conflict-handling strategy for overlapping or contradictory descriptors

### Phase 5 — Label Expansion
- Expand the label ontology only after feature and descriptor coverage can support additional labels
- Label additions must be grounded in available normalized features, not assumed

### Phase 6 — LLM Integration Refinement
- Formalize when and how LLM fallback and auxiliary signals are used
- Define weighting, priority, and conditions under which LLM outputs are trusted

### Phase 7 — Selector Enablement
- Use validated labels and features to power AI selector and discovery behavior
- Define how structured label coverage maps to user-facing discovery queries

---

## 7. Confirmed Truths

- The system is dimension-first: features are the truth layer, labels are derived
- AI output is suggestion-only — never authoritative
- Labels are probabilistic, not binary
- Missing descriptor data must cause abstention or confidence reduction, not fabrication
- V1 uses legal, precomputed descriptor APIs only — no raw audio, no waveform, no embeddings
- The LLM baseline pipeline already exists
- The YAMNet/audio ML system is historical only — excluded from current architecture
- The ontology is evolving — no label set is permanent or finalized
- Both the ontology and model behavior must be versioned
- User-defined label semantics are never silently overridden

---

## 8. Working Assumptions

- Descriptor APIs will provide enough useful coverage to support meaningful label inference for a meaningful portion of songs
- A minimal set of core normalized features (e.g., energy, density, brightness, pulse, vocal presence) is expected to be derivable from initial descriptor data
- LLM baseline outputs are useful as a comparison signal even if not authoritative
- Label inference confidence can be usefully estimated from descriptor completeness and signal agreement
- A small, clean label set is more useful in V1 than a large, noisy one

---

## 9. Open Questions

- What percentage of songs will have sufficient descriptor coverage to produce meaningful labels?
- Which labels actually survive when tested against real descriptor data?
- How should multiple API sources be merged or prioritized when descriptors conflict?
- How should LLM fallback outputs be weighted relative to descriptor-derived outputs in the long term?
- How far can selector intelligence go given the label coverage this system can realistically produce?
- What is the minimum viable label set required to power a useful selector?

---

## 10. Immediate Next Step

**Calibrate and refine the descriptor → dimension → label inference pipeline.**

- Continue expanding cached descriptor coverage via batch runs (rate-limit-aware, resume-capable)
- Validate and tune dimension formulas against representative tracks
- Tune conservative label firing thresholds (precision over recall)
- Validate confidence propagation behavior under missing descriptor coverage
- Compare descriptor-derived outputs against the LLM baseline where useful, and log systematic mismatches

This is still validation work (controlled refinement), not coverage chasing. The goal is to produce stable, explainable V1 behavior from cached descriptor evidence.

**Do NOT expand into new APIs or large new label sets until calibration behavior is stable.**
