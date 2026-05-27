# AudioFile AI — Representation Limits and Closure Findings (Music Story-only)

**Version:** v0.1
**Status:** FROZEN — Closure Reference
**Date:** May 2026
**Authority:** Secondary (conforms to Ontology Framework v0.1.3 and Semantic Composition Spec v0.1.1)

---

## 1. Purpose

This document freezes the empirically observed conclusions from the Music Story-only static descriptor experimentation phase.

It exists to prevent documentation drift and to make the current architectural identity explicit:

- The V1 system is a **constrained semantic projection layer**.
- It operates over **static averaged legal descriptors**.
- The representation space exhibits **known ceilings** and **partial coupling**.

This document does not redesign formulas, expand ontology, or propose speculative future architecture.

---

## 2. Canonical evidence outputs (experiment artifacts)

The phase closure is documented in the following canonical experimentation reports:

- `audiofile-ai/experimentation/reports/final_feature_stability_report.md`
- `audiofile-ai/experimentation/reports/final_descriptor_dependency_report.md`
- `audiofile-ai/experimentation/reports/final_latent_structure_summary.md`
- `audiofile-ai/experimentation/reports/musicstory_phase_closure_summary.md`

Supporting phase outputs:

- CONTROL_1: join + semantic validation + feature calibration
- CONTROL_2: dimension independence analysis
- CONTROL_3: manifold stress test (coverage-maximizing sampling from cache)

---

## 3. Core representation realities (observed)

### 3.1 Low-rank latent structure

Observed:

- Feature space behaves as **low-rank**: a small number of principal components explain most variance.
- Descriptor space also shows compression: a small number of axes explain a large fraction of variance.

Implication:

- Adding more named dimensions without increasing representation capacity will tend to create **semantic aliases** rather than new independent axes.

### 3.2 Partial dimensional coupling is expected

Observed:

- Several normalized dimensions are **strongly coupled** (high correlations persist under dataset expansion).
- Coupling reflects both:
  - upstream descriptor redundancy/correlation
  - downstream composite construction over shared descriptor ancestry

Implication:

- Dimensions must not be treated as orthogonal semantic axes.
- Confidence must avoid double-counting coupled dimensions as “agreement.”

### 3.3 Descriptor-starved dimensions exist

Observed:

- Some dimensions have insufficient descriptor support and behave as missing/nonfunctional under current cache coverage.

Implication:

- These dimensions should be treated as untrusted in Music Story-only V1 and should not be relied upon for downstream decisions.

---

## 4. What static averaged descriptors cannot support (limits)

Static averaged descriptor APIs are intrinsically limited. In V1, do not claim support for:

- temporal evolution / dynamic arc
- section-aware semantics (builds, drops, breakdowns)
- contrast/change metrics (verse vs chorus lift)
- groove/microtiming nuance
- true structural understanding

These are limitations of the representation channel, not “bugs” to be tuned away with thresholds.

---

## 5. Proxy dimension warnings (how to interpret V1 outputs)

### 5.1 “Brightness” terminology guardrail

- Brightness in V1 refers primarily to **spectral/timbral sharpness** (high-frequency emphasis).
- It does **not** mean emotional positivity.

### 5.2 “Driving” is operationally useful but coupled

- “Driving” projections are useful for filtering/retrieval.
- But they are partially coupled to pulse-related evidence under static descriptors; do not treat as independently validated semantics.

### 5.3 “Layered” is proxy-based

- Layering vs density separation is conceptually limited under current static descriptors.
- Treat layered signals as moderate-confidence, proxy-based projection.

---

## 6. Reliability tiers (carry-forward guidance)

This is representation-quality judgment (not ontology judgment). Canonical lists live in the final feature stability report; summarized here:

- Most trusted anchors:
  - `speech_score`
  - `rhythm_stability_score`
- Moderately trusted (proxy-based / conceptually compressed):
  - `layered_score`
- Partially trusted / coupled projections:
  - energy/pulse/driving/calm/darkness/valence/punch/syncopation/brightness/vocal/instrumental
- Descriptor-starved / low confidence:
  - acoustic/harshness/low_end/offbeat

---

## 7. What is considered “solved enough” for this phase

- The existence of real semantic signal in Music Story descriptors (useful for projection).
- The representation ceilings and coupling behavior (under static descriptors).
- The set of trusted vs coupled vs descriptor-starved dimensions.

---

## 8. What remains uncertain (explicitly not resolved here)

- How much additional semantic capacity is gained by adding another descriptor provider.
- How much additional semantic capacity requires raw audio or temporal modeling.
- How to best organize user-facing semantics for retrieval under coupled dimensions.

---
