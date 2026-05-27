# AudioFile AI — Experiment & Findings Log

**Purpose:**
This document is the running operational memory for empirical findings during AudioFile AI development.

It exists to record:
- implementation discoveries
- descriptor API behavior
- feature behavior
- label behavior
- pipeline failures
- mismatch patterns
- experimental observations
- unresolved anomalies

This is NOT a finalized truth document.

Entries in this log are:
- observations
- hypotheses
- implementation findings
- experimental notes

Nothing in this log should automatically become architecture or ontology truth without validation and promotion into official specs.

---

# Logging Rules

## 1. Preserve uncertainty
Do not rewrite findings into certainty unless validated.

Use:
- “appears”
- “observed”
- “possible”
- “suspected”
- “inconsistent”

Avoid:
- “proves”
- “confirms”
- “always”

unless empirically validated.

---

## 2. Record failures explicitly
Failed experiments are valuable.

Do not remove:
- failed mappings
- weak relationships
- unstable labels
- unusable descriptors

---

## 3. Prefer observations over interpretation
Good:
- “Pulse feature undefined in 42% of songs due to missing pulse clarity descriptor”

Bad:
- “Pulse feature does not work”

---

## 4. Preserve implementation context
Whenever possible, include:
- pipeline version
- provider used
- batch used
- configuration version

---

## 5. Do not silently rewrite history
If understanding changes:
- append a new entry
- do not overwrite old findings

This document should preserve the evolution of understanding over time.

---

# Entry Template

---

## [DATE] — [SHORT TITLE]

### Context
- Pipeline version:
- Descriptor provider:
- Batch:
- Config version:
- Related feature(s):
- Related label(s):

### Observation
Clear description of what was observed.

### Evidence
- Quantitative findings
- Example songs
- Missing descriptor counts
- Comparison mismatches
- Confidence patterns
- Failure rates

### Interpretation
Possible meaning or hypothesis.

Must remain tentative unless validated.

### Impact
Describe possible implications for:
- ontology
- feature mappings
- label scoring
- API strategy
- implementation priorities

### Status
One of:
- OPEN
- MONITORING
- VALIDATED
- REJECTED

---

# Suggested Observation Categories

## Descriptor Coverage
Examples:
- missing descriptor frequency
- provider inconsistency
- genre-dependent gaps

---

## Feature Stability
Examples:
- unstable feature scores
- feature collapse
- weak proxy behavior

---

## Label Reliability
Examples:
- labels rarely produced
- opposing labels frequently tied
- confidence collapse

---

## LLM Comparison
Examples:
- systematic disagreement
- agreement clusters
- label drift between systems

---

## API Behavior
Examples:
- rate limits
- malformed responses
- inconsistent descriptor naming

---

## Ontology Findings
Examples:
- labels collapsing together
- features behaving redundantly
- missing conceptual dimensions

---

# Interpretation Rules

The purpose of this document is to:
- support iterative refinement
- discover patterns
- guide future experimentation

This document must NOT:
- silently redefine architecture
- redefine ontology without validation
- become a source of unquestioned truth

Validated findings should eventually be promoted into:
- ontology revisions
- architecture revisions
- implementation changes
- future versioned specifications

---

## 2026-05-14 — Music Story Integration + Ontology / Semantic Composition Handoff (Current State)

### Context
- Pipeline version: AudioFile AI descriptor-first pipeline (Music Story v2 integrated; batch runner with caching + resume-on-rate-limit)
- Descriptor provider: Music Story v2 (`audiodescriptions`)
- Batch: Cached batches exist (initial batches analyzed); batch 9 input created and batch 9 processing started (stops on daily quota)
- Config version: Ontology + composition specs referenced below
- Related feature(s): Energy / Pulse / Brightness / Density / Vocal Presence (plus related composite research)
- Related label(s): Driving / Hypnotic / Heavy / Energetic / Dense / Vocal / Instrumental (plus related research)

### Observation
- Music Story v2 API integration appears operational (token auth, endpoint access, batch retrieval).
- Descriptor payloads appear usable as **evidence signals** (not labels) and support a dimension-first inference architecture.
- Descriptor coverage is incomplete; failures cluster into a small set of recurring failure modes.
- Descriptor responses are stable per song and can be cached; experimentation can proceed indefinitely using cached payloads without additional API calls.
- Retrieval strategy effectiveness varies significantly depending on the identifier used.

### Evidence
- Trial constraints observed:
  - 200 calls/day trial quota
  - Trial duration constraint (approximate upper bound ~3000 calls total)
- Observed major failure modes:
  - `no_recording_hit`
  - `audiodescriptions_404`
  - `rate_limited_429`
- Observed batch-level coverage snapshot (as of prior experiment runs):
  - Total processed songs: 282
  - Successful descriptor payloads: 191
  - Approximate coverage: ~67.7%
- Batch 9 run behavior:
  - Processing stops on 429 and writes stop metadata (stopped index + stopped song) so the next run can resume.

### Interpretation
- Music Story descriptors appear sufficient for V1 experimentation, but missingness/coverage must be treated as a first-class input into confidence.
- The descriptor layer supports a controlled semantic inference system, but should not be conflated with direct label truth.
- Because identifier resolution dominates retrieval success, an explicit lookup hierarchy is necessary.

### Impact
- Official retrieval policy (V1):
  - Preferred: Music Story `recordingId` (lowest ambiguity; typically 1 call/song)
  - Secondary: ISRC lookup (generally reliable when present; often 2 calls/song)
  - Avoid when possible: title/artist search (ambiguous; failure-prone; quota-inefficient)
- Experimentation architecture:
  - An isolated, read-only experimentation framework exists under `audiofile-ai/experimentation/`.
  - Experiments operate only on cached Music Story JSON outputs.
- Ontology / inference architecture direction:
  - The system is treated as a **probabilistic semantic inference system** with continuous internal dimensions and derived labels.
  - Dynamicity (builds/drops/peaks) is recognized as a future Layer 3 requirement; averages alone are insufficient.

### Status
MONITORING

---

## 2026-05-27 — Music Story-only Experimentation Phase Closure (CONTROL_1–3)

### Context
- Pipeline version: AudioFile AI semantic inference (Music Story-only)
- Descriptor provider: Music Story v2 (`audiodescriptions`, cached)
- Evidence source: CONTROL_1–3 experimentation outputs + closure reports

Canonical closure reports:
- `audiofile-ai/experimentation/reports/final_feature_stability_report.md`
- `audiofile-ai/experimentation/reports/final_descriptor_dependency_report.md`
- `audiofile-ai/experimentation/reports/final_latent_structure_summary.md`
- `audiofile-ai/experimentation/reports/musicstory_phase_closure_summary.md`

### Observation
- The Music Story-only static descriptor representation appears intrinsically compressed/low-rank.
- Several normalized dimensions are strongly coupled and behave as multiple projections of shared latent axes.
- Several dimensions are descriptor-starved under current cache coverage and should be treated as untrusted in Music Story-only V1.

### Evidence
- CONTROL_3 feature PCA: PC1–3 explain the majority of variance (low-rank behavior).
- CONTROL_3 descriptor PCA: PC1–3 explain a large fraction of variance (upstream compression).
- CONTROL_2/3 redundancy analysis: multiple high |r| pairs persist under dataset expansion.
- CONTROL_1 coverage: several features are 100% missing (descriptor-starved).

### Interpretation
- Static averaged descriptors support a constrained semantic projection layer useful for filtering/retrieval, but cannot support full temporal/structural semantics.
- Overlap and entanglement are expected and should be handled via confidence-aware abstention rather than forced orthogonality.

### Impact
- Documentation should explicitly represent V1 as bounded and partially coupled.
- Do not treat coupled dimensions as independent evidence for confidence agreement.

### Status
VALIDATED

---

## 2026-05-14 — Key Descriptor / Semantics Findings (Handoff Snapshot)

### Context
- Descriptor provider: Music Story v2
- Evidence source: Cached batch descriptor payloads + representative track manual review artifacts

### Observation
- `pulse_clarity` appears to be a particularly strong descriptor for rhythmic anchor / drivenness / groove-related semantics.
- `vocal_instrumental` orientation appears inverted versus naive expectation:
  - Lower values often correspond to **more vocal presence**
  - Higher values often correspond to **more instrumental**
- “Brightness” as a human-facing label appears semantically overloaded; it is better treated as an internal spectral dimension rather than a direct label.
- “Density” is conceptually distinct from “complexity” (simple-but-dense vs complex-but-sparse).
- “Energy” appears to separate into at least two conceptual modes:
  - Kinetic / impact energy (drops, punch, activation)
  - Emergent / built energy (progression, escalation, earned climax)
  - Current V1 energy work primarily targets kinetic energy.

### Evidence
- Experimentation outputs include coverage analysis, schema audit, distributions, correlations, representative track selection, and human validation templates.
- Manual review process emphasized category assignment plausibility rather than descriptor existence.

### Interpretation
- Many descriptor semantics behave continuously (lean/blend) rather than fitting discrete buckets.
- Genre conditioning appears necessary: similar descriptor values can imply different semantics across genres.
- Human memory salience (peak moments vs average state) implies future need for temporal modeling.

### Impact
- Normalize / interpret descriptors carefully (including orientation fixes like `vocal_instrumental`).
- Keep label firing conservative (precision over recall; abstain when uncertain).
- Prioritize calibration against representative tracks rather than metric chasing.

### Status
MONITORING