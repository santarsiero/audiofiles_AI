# AudioFile AI Ontology Framework v0.1

**Version:** v0.1.3  
**Status:** FROZEN — Stable Foundational Reference  
**Date:** May 2026

---

## Overview

This document defines the **architecture, philosophy, layer system, and rules** that guide the AudioFile AI ontology going forward.

**Closure note (2026-05):** Music Story-only experimentation indicates the static descriptor representation space is intrinsically compressed/low-rank and partially coupled. This reinforces the framework’s emphasis on overlap tolerance, probabilistic interpretation, and confidence-aware abstention rather than attempting to force orthogonal semantics from limited evidence.

It is not a final label list, final formula set, or final model specification. It is the structural contract that all future ontology work should follow.

Anything that contradicts this document should be treated as a deviation and resolved before implementation proceeds.

**A note on scope:** This framework intentionally acknowledges future complexities and architectural concerns before they are implemented. Awareness of a future issue does not imply immediate implementation. V1 should prioritize interpretability, stability, detectability, and controlled scope over architectural completeness. The presence of a "future" label on a section means it is architecturally planned for — not that it should be built now.

---

## 1. Purpose

AudioFile AI exists to represent songs in a way that supports meaningful human music interaction. The system needs to power:

- filtering and retrieval
- DJ set building and vibe matching
- semantic search
- rediscovering songs
- AI-assisted music selection
- user-customizable labeling
- future recommendation and selector intelligence

The goal is **not merely to predict labels**. Labels are one output layer of a deeper system. The actual goal is to model songs through meaningful musical dimensions and allow those dimensions to combine into expressive, human-interpretable descriptions.

This ontology framework defines:

- how descriptors are collected and interpreted
- how foundational dimensions are constructed from descriptors
- how temporal and dynamic behavior is modeled
- how expressive vocabulary emerges from dimension combinations
- how labels are assigned, typed, and surfaced to users
- what is in scope for V1 versus what requires future work

---

## 2. Core Principles

These principles apply to every decision made within the ontology system. When in doubt, return to this list.

**Dimension-first.** The system models songs through continuous internal dimensions, not through direct label assignment. Labels are derived outputs, not primary inputs.

**Descriptors are evidence, not meaning.** Raw descriptor values (arousal, pulse_clarity, roll_off, etc.) are signals. They do not carry musical meaning on their own. Meaning is constructed through normalization, combination, and interpretation.

**Terminology guardrail:** In V1, “brightness” refers primarily to **spectral/timbral sharpness** (high-frequency emphasis), not emotional positivity or “uplifting” affect.

**Labels are derived interpretations.** No label should be assigned directly from a single raw descriptor. Labels should emerge from combinations of normalized dimensions, weighted by confidence.

**Specificity comes from combinations.** The system should not try to create one ultra-specific label per scenario. Instead, it should surface a set of simpler labels whose combination produces the specificity. `dark + driving + heavy + bass-dominant` is more useful and more flexible than `dark-driving-heavy-bass-club-track`.

**Continuous internal, discrete user-facing.** Internally, songs are represented as continuous scores across dimensions. The user-facing surface is discrete: labels, tags, and categories. The translation between these layers should be explicit and confidence-weighted.

**Missing data should reduce confidence, not be fabricated.** If a descriptor is unavailable, the system should lower its confidence in dependent dimensions and labels rather than filling in a value. Fabricated confidence is worse than acknowledged uncertainty.

**Human labels are useful evidence but not ground truth.** The organic label datasets reveal natural human behavior. They are useful for understanding how people think about music. They are not the final ontology and should not be preserved uncritically.

**Temporal identity matters.** A song is not its average. Two songs can have identical average scores and be perceptually completely different. The system must account for how a song behaves over time — its arc, its peaks, its variance.

**Dynamicity must be modeled.** The difference between a consistently medium-energy song and a song with quiet sections followed by enormous peaks is musically critical. Future architecture must represent this explicitly.

**Genre affects interpretation, not necessarily raw descriptors.** The same raw descriptor value can mean different things in different genre contexts. A high arousal score in ambient music means something different than in DnB. Genre should function as a modifier on interpretation, not as a label the system tries to predict directly.

**User semantics may personalize over time.** Labels that feel meaningful to one DJ may feel wrong to another. The architecture should support user-level calibration without breaking the shared underlying representation.

**Expressive labels are not required to be orthogonal.** Partial semantic overlap between labels is expected and desirable. Labels like `hypnotic`, `driving`, `repetitive`, and `steady` may naturally co-occur. Labels like `dark`, `heavy`, `gritty`, and `deep` may share semantic territory. The system should allow this overlap rather than trying to force labels into mutually exclusive categories. Attempting to orthogonalize labels would destroy the richness of natural musical description. Overlap is a feature, not a problem to be corrected.

**The ontology should fail gracefully.** When evidence is weak, contradictory, sparse, or ambiguous, the system should prefer uncertainty, reduced confidence, partial interpretation, or no label at all over fabricated precision. The goal is not maximal label output — it is trustworthy semantic representation. A song with three confident labels is more valuable than a song with ten uncertain ones.

---

## 3. Layered Architecture

The system is organized into six layers. Each layer has defined responsibilities and clear prohibitions. Layers interact only in specified directions.

---

### Layer 1 — Raw Descriptors

**What it contains:**  
Unprocessed values returned by external descriptor providers (currently Music Story). This includes fields like: `arousal`, `valence`, `vocal_instrumental`, `music_speech`, `electric_acoustic`, `danceability`, `studio_live`, `melodicity`, `dissonance`, `articulation`, `rhythmic_stability`, `event_density`, `pulse_clarity`, `bpm`, `complexity`, `brightness`, `centroid`, `roll_off`, `spread`, `flatness`, `loudness`, `loudness_range`, `intensity`, MFCCs, chroma values, moods, timbres, themes.

**What it is allowed to do:**  
Store raw values. Flag missing fields. Record source metadata (provider, version, coverage success/failure).

**What it should not do:**  
Assign meaning. Make label decisions. Substitute values when data is missing.

**Known issues at this layer:**  
`vocal_instrumental` appears inverted from naive interpretation. Experiments and correlation data indicate that low values correspond to vocal content and high values to instrumental content. This inversion must be corrected at the normalization stage and documented explicitly.

**How it connects to the next layer:**  
Raw values are passed to Layer 2 for normalization and dimension construction.

---

### Layer 2 — Normalized Continuous Dimensions

**What it contains:**  
Composite scores built from combinations of raw descriptors. These are the foundational internal representation of a song. Layer 2 dimensions fall into two distinct sub-types, which must not be conflated:

**A. Perceptual / Measurable Dimensions**  
Directly grounded in signal evidence. These represent observable acoustic properties with a clear path from raw descriptor to score. Examples: `brightness_score`, `pulse_score`, `energy_score`, `density_score`, `vocal_presence_score`, `loudness`, `rhythmic_stability`, `articulation`, `repetition`, `dynamic_range`.

**B. Latent Semantic Dimensions**  
Partially interpretive. These combine perceptual signals in ways that require some semantic inference. They are still internal dimensions — not labels — but their construction involves more assumptions. Examples: `tension`, `aggression`, `emotional_intensity`. These should be treated with lower confidence and higher caution, and should not be used as primary inputs to expressive label generation until validated.

This distinction matters for confidence propagation and explainability: a perceptual dimension failure is a measurement problem; a latent semantic dimension failure may be a conceptual problem.

**What it is allowed to do:**  
Combine and weight multiple raw descriptors into a single normalized score (0–1 range). Apply known corrections (e.g., vocal inversion). Assign a confidence value based on which raw fields were available.

**What it should not do:**  
Assign labels. Make semantic judgments. Treat latent semantic dimensions with the same confidence as perceptual dimensions.

**Connection notes from empirical data:**  
Correlation analysis confirms that several raw descriptor pairs are highly redundant. `loudness` and `absolute_loudness` correlate at r=0.97 — likely redundant for dimension construction. `centroid`, `flatness`, and `spread` are tightly clustered (r=0.88–0.95), indicating they represent a shared brightness/spectral-texture dimension. These redundancies should inform which descriptors get included in composite formulas rather than treated as independent evidence.

`pulse_clarity` shows a strong negative correlation with `complexity` (r=-0.84), confirming that pulse and complexity are likely opposing forces within the same rhythmic dimension. This should be modeled explicitly.

**How it connects to the next layer:**  
Dimension scores are passed to Layer 3 for temporal and dynamic analysis.

---

### Layer 3 — Dynamic and Temporal Modifiers

**What it contains:**  
Representations of how songs change over time. This layer does not yet exist in V1 but must be architected for. Candidate features include: `contrast`, `variance`, `escalation`, `climax_strength`, `peak_salience`, `stability`, `volatility`, `transition_count`, `structural_arc`.

**What it is allowed to do:**  
Analyze segment-level descriptor data to produce song-level dynamic profiles. Identify memorable peak moments. Characterize whether a song builds, holds steady, or decays.

**What it should not do:**  
Produce user-facing labels directly. Ignore whole-song averages entirely (averages are still useful as one signal).

**V1 status:**  
Out of scope for V1 inference. However, the architecture should not be designed in a way that prevents it from being added later. Dimension scores in Layer 2 should be stored in a way that allows temporal extensions.

**How it connects to the next layer:**  
Dynamic profiles are passed to Layer 4 as modifiers on the base dimension scores.

---

### Layer 4 — Genre-Conditioned Expressive Semantic Vocabulary

**What it contains:**  
Derived descriptors that are richer and more human-facing than raw dimensions but more grounded than final user labels. These should emerge from combinations of Layer 2 dimension scores and Layer 3 dynamic profiles. Examples: `driving`, `hypnotic`, `heavy`, `bouncy`, `stepping`, `groove`, `floating`, `atmospheric`, `rolling`, `bass-driven`, `gritty`, `cinematic`, `explosive`.

**Layer 4 is the system's internal semantic interpretation space, not a direct label output.** Multiple expressive descriptors may activate simultaneously at varying confidence levels, including overlapping or partially contradictory interpretations. These activations are not necessarily surfaced directly to the user — that filtering happens in Layer 5. Expressive semantic activations may eventually become persistent internal semantic state used for retrieval, recommendation, clustering, and explainability, though this behavior is not required for V1.

**Critical: Genre conditioning occurs at this layer.**  
Genre conditioning must happen *after* foundational dimensions are computed and *before* expressive labels are generated. The same dimension scores carry different semantic meaning in different genre contexts:

- `heavy` in techno ≠ `heavy` in metal ≠ `heavy` in orchestral music
- `driving` in house ≠ `driving` in hip-hop
- `hypnotic` in minimal techno ≠ `hypnotic` in ambient

Genre should not be predicted as a label. It should function as a context modifier applied at this layer to adjust which expressive labels are appropriate and at what thresholds. A principled genre-conditioning specification is future work, but the architecture must reserve this position for it.

**Genre Representation (ontology status):**  
Genre must be treated as probabilistic contextual metadata, not as a categorical ground truth. Songs may belong to multiple genre regions simultaneously. Genre conditioning should operate probabilistically — a song that is 60% techno and 40% ambient should receive blended interpretation, not a hard switch. Genre information may arrive from multiple sources with different reliability:

- *Imported metadata* (Spotify, Apple Music genre tags) — present but often imprecise or single-category
- *User assignment* — high trust, often more nuanced than metadata
- *Future inference* — not yet available; should not be assumed

The system must not treat any single genre source as authoritative. Genre is a contextual prior, not a fixed property. This matters because rigid genre assignment produces brittle label behavior — a misclassified genre silently propagates wrong interpretations through all downstream expressive labels.

**What it is allowed to do:**  
Combine dimensions into expressive descriptors using probabilistic rules. Apply genre-context modifiers to interpretation. Assign confidence scores. Surface multiple overlapping descriptors when they are plausible.

**What it should not do:**  
Hardcode single-feature-to-label mappings. Assume universal semantics across genres. Claim certainty. Produce labels that are not backed by dimensional evidence.

**How it connects to the next layer:**  
Expressive descriptors are used to generate semantic labels in Layer 5.

---

### Layer 5 — Semantic Labels

**What it contains:**  
The set of labels that the system surfaces to users. These are discrete, human-readable, and confidence-scored. They are derived from Layer 4 expressive descriptors and represent the AI's interpretation of the song as presented.

**Layer 5 is not the same as Layer 4.** Not all Layer 4 activations should become user-facing labels. Thresholding, confidence filtering, UX constraints, and future personalization rules determine which semantic interpretations get surfaced. A label may be active at Layer 4 with low confidence without ever appearing in Layer 5. This separation is what allows the internal semantic space to be rich and overlapping while the user-facing output remains clean and trustworthy.

**What it is allowed to do:**  
Suggest labels with confidence scores. Support multiple label types (see Section 4). Allow threshold-based assignment for different use cases (high confidence only vs. broader suggestions).

**What it should not do:**  
Assign labels without traceable dimensional backing. Auto-apply labels without user review unless explicitly configured. Override user-defined labels.

---

### Layer 6 — User and Domain Labels

**What it contains:**  
Labels created, modified, or confirmed by the user. Also includes contextual and workflow labels that depend on user-specific or DJ-context knowledge (e.g., `peak`, `warmup`, `aux safe`).

**What it is allowed to do:**  
Override or supplement AI suggestions. Exist independently of AI inference (user can create labels the AI cannot infer). Feed back into future learning if cross-user aggregation is enabled.

**What it should not do:**  
Automatically modify Layer 2–5 representations. Silently alter underlying dimension scores.

---

## 4. Label Type Taxonomy

Not all labels are the same type. The system should treat label types differently in terms of how they are generated, stored, and surfaced. Mixing label types in a single flat list produces a confused ontology.

---

**Foundational Dimensions**  
Internal continuous scores. Not directly surfaced to users as labels. These are the engine beneath everything else. Examples: `energy_score`, `pulse_score`, `density_score`, `brightness_score`, `vocality_score`.

---

**Expressive Semantic Descriptors**  
Richer human-facing descriptions derived from dimension combinations. These are the primary AI-suggested label surface. Examples: `driving`, `heavy`, `bouncy`, `stepping`, `floating`, `gritty`, `smooth`, `hypnotic`, `punchy`, `airy`.

---

**Temporal / Event Labels**  
Describe structural behavior over time. Examples: `builds`, `drops`, `breakdown`, `switches`, `progression`, `climax`, `earned drop`, `intro`, `outro`. Many of these require Layer 3 (dynamic modeling) and are out of scope for V1 inference, but they should be supported as manually assignable labels from day one.

---

**Movement / Body-Response Labels**  
Describe physical and rhythmic listener response. Examples: `danceable`, `head nodder`, `stepping`, `bouncy`, `groove`. Some overlap with expressive semantic descriptors but are anchored in body-level response rather than sonic quality.

`groove` is an explicitly recognized ontology concept. It is distinct from:
- `danceable` (can you move to it?)
- `steady` (is the rhythmic foundation stable?)
- `bouncy` (does the rhythm feel springy/light?)

Groove refers to a locked-in rhythmic feel / pocket that produces a strong body-response pull.

---

**Emotional / Affective Labels**  
Describe emotional character or listener affect. Examples: `dark`, `uplifting`, `tense`, `peaceful`, `somber`, `euphoric`. These emerge from combinations of valence, darkness, tension, and dynamicity dimensions.

`uplifting` is a valid ontology concept but should not be treated as a synonym for spectral brightness. It may be supported by brightness in some genres, but is more fundamentally about affective lift (typically involving valence, energy, and compositional context).

`euphoric` is a valid future-facing ontology concept. It is compatible with Layer 3 planning and is expected to benefit substantially from temporal context, but the concept itself is still ontology-valid even before Layer 3 is implemented.

---

**Instrument / Driver Labels**  
Describe what is sonically dominant or structurally driving the song. Examples: `bass line`, `bass-driven`, `vocals`, `guitar-led`, `synth-driven`. Partially detectable from descriptor data (vocality dimension, electric_acoustic) but require care.

`bass-driven` is distinct from:
- `heavy` (overall weight / power)
- `dense` (fullness / occupancy)

A song may be heavy without being bass-driven, and bass-driven without being maximally heavy.

---

**Contextual / Workflow Labels**  
Depend on user or DJ context. Cannot be inferred from audio alone. Examples: `peak`, `warmup`, `afterhours`, `aux safe`, `deep listen`, `set opener`, `transition tool`, `crowd-safe`. These belong entirely to Layer 6 and should not be attempted by the AI inference pipeline.

---

**Evaluative / Personal Labels**  
Subjective assessments. Examples: `cool`, `beautiful`, `unique`, `complete`, `interesting`. Meaningful to the person who assigned them but should not drive the shared ontology. They may exist as personal overlays.

---

**Super-Labels / Compositions**  
Combinations of simpler labels applied as a macro. Defined by the user or system as a named grouping of constituent labels. The AudioFile data model already supports this. AI super-labels should emerge from recurring combinations of semantic labels, not be designed top-down.

---

## 5. Foundational Continuous Dimensions

These are the core internal dimensions the system should model. Each is a continuous score (likely 0–1 normalized). Each carries a V1 status: **ready** (buildable from current descriptor data), **partial** (buildable with caveats), or **future** (requires temporal modeling or additional data).

Dimensions are divided into two sub-types (see Layer 2): **perceptual** (directly signal-grounded) and **latent semantic** (partially interpretive). This distinction affects confidence propagation and how aggressively dimensions should be used in label generation.

---

### 5A — Perceptual / Measurable Dimensions

These are directly grounded in signal evidence. Confidence is primarily determined by descriptor availability.

**Energy / Activation** — `energy_score` — *V1 Status: Ready*  
Overall activation and intensity. Supported by: arousal, loudness, intensity, mfcc01. Correlation analysis confirms arousal and loudness are tightly related (r=0.74) and intensity tracks with both. Note: energy has at least two perceptual subtypes (kinetic and emergent) that cannot be distinguished from average scores alone. V1 should represent total energy; subtype separation is future work.

**Kinetic Energy** — sub-dimension of energy — *V1 Status: Partial*  
Immediate, given energy — drops, impact, punch. Supported by arousal, intensity, loudness. Distinguishing kinetic from emergent requires temporal analysis.

**Emergent / Built Energy** — sub-dimension of energy — *V1 Status: Future*  
Tension, escalation, earned intensity. Requires Layer 3 dynamic modeling.

**Pulse / Rhythmic Anchor** — `pulse_score` — *V1 Status: Ready*  
The rhythmic driver — bassline anchor, heartbeat, steadiness. Supported by: pulse_clarity, rhythmic_stability, danceability, articulation. The strong negative correlation between pulse_clarity and complexity (r=-0.84) confirms these are meaningful opposing forces. High pulse = rhythmically anchored and driven. Low pulse = complex, free, or arrhythmic.

**Density / Fullness** — `density_score` — *V1 Status: Partial*  
Perceptual fullness — absence of empty space. Supported by: event_density, complexity, intensity. Note: density should mean *fullness* (occupied sonic space), not complexity alone. event_density and complexity have only a moderate correlation (r=0.19), suggesting they capture somewhat different things. Density formulation needs further refinement.

**Brightness / Spectral Sharpness** — `brightness_score` — *V1 Status: Ready (internal use)*  
Spectral character — treble presence, sharpness, airiness. Strongly supported by: roll_off (r=0.90 with brightness), centroid, flatness, zero_cross_rate. Brightness is likely better kept as an internal dimension for V1 rather than surfaced directly as a user label, because the human perception of "bright" is ambiguous (spectral vs. emotional vs. colorfulness).

**Vocality / Instrumentalness** — `vocal_presence_score` — *V1 Status: Partial (inversion required)*  
Presence and prominence of vocals. Supported by: `vocal_instrumental` (inverted), `music_speech`. The current vocal_presence_score_v1 is likely inverted — high scores are appearing on known instrumental tracks (e.g., Daft Punk Veridis Quo, classical pieces). This must be corrected before V1 label generation uses this dimension. The fix is to invert the `vocal_instrumental` input during normalization.

**Speech Presence** — candidate dimension — *V1 Status: Partial*  
Proportion of speech vs. music. Supported by: `music_speech`. Low correlation with `vocal_instrumental` (r=-0.11) suggests these are genuinely separate dimensions — one measures vocal music, the other measures speech content.

**Punch / Attack** — candidate dimension — *V1 Status: Partial*  
Transient sharpness, hit strength. Likely derivable from articulation, loudness_range, and intensity variance. Articulation correlates with rhythmic_stability (r=0.79) and negatively with complexity (r=-0.58), suggesting articulated tracks are rhythmically cleaner.

**Softness / Smoothness** — candidate dimension — *V1 Status: Future*  
Opposite of punch. Requires inverse punch modeling or explicit construction from low-articulation, low-intensity features.

**Valence / Positivity** — candidate dimension — *V1 Status: Partial*  
Emotional positivity vs. negativity. Directly available from Music Story as `valence`. Note: dissonance and valence show very low correlation (r=0.07), suggesting valence is not simply the inverse of dissonance — they are measuring different things.

**Dynamicity / Contrast** — candidate dimension — *V1 Status: Future*  
How much a song changes over time. Cannot be constructed from song-level average descriptors. Requires segment-level analysis (Layer 3).

**Progression / Evolution** — candidate dimension — *V1 Status: Future*  
Whether a song has a directional arc (builds toward something). Requires temporal modeling.

**Complexity** — candidate dimension — *V1 Status: Partial (internal use)*  
Rhythmic and structural complexity. Directly available from Music Story. Strongly negatively correlated with pulse_clarity (r=-0.84). Complexity should likely remain internal — it does not map cleanly to a user-facing label.

**Repetition / Stability** — candidate dimension — *V1 Status: Partial*  
How repetitive and stable a song is. Supported by: rhythmic_stability, articulation. Distinct from complexity.

---

### 5B — Latent Semantic Dimensions

These are partially interpretive. They combine perceptual signals in ways that require semantic assumptions and are more sensitive to genre context. They should be constructed and used with greater caution than perceptual dimensions. Confidence in these should account for both descriptor availability and semantic validity.

Note: labels like `dark`, `heavy`, `uplifting`, and `deep` are **not** foundational dimensions. They are expressive semantic constructs that belong in Layer 4. These latent dimensions are the building blocks those constructs draw on.

**Aggression / Harshness** — candidate dimension — *V1 Status: Future*  
Sonic harshness, distortion, abrasiveness. Partially supported by dissonance field. Requires more signal. Highly genre-relative — what sounds aggressive in one genre sounds normal in another.

**Tension** — candidate dimension — *V1 Status: Future*  
Unresolved harmonic or rhythmic tension. Partially supported by dissonance, valence, and potentially chroma structure. Difficult to extract from average descriptors alone. Likely requires temporal context (tension builds toward resolution).

**Emotional Intensity** — candidate dimension — *V1 Status: Future*  
The degree to which a song is emotionally activating, regardless of whether that emotion is positive or negative. Distinct from arousal (which is more purely energetic). Likely constructed from a combination of valence magnitude, dynamicity, and emergent energy.

---

## 6. Expressive Semantic Vocabulary

Expressive labels should not be directly mapped from single dimensions. They should emerge from combinations of normalized dimension scores, weighted by confidence.

The following illustrate the intended mapping logic. These are **conceptual**, not final formulas. Thresholds and weights require experimental validation.

---

**driving**  
High pulse + high energy + stable rhythm. The rhythmic anchor is prominent and consistent. The song pulls you forward. Confidence increases when danceability and rhythmic_stability are both high.

**hypnotic**  
High pulse + moderate-to-high repetition + moderate energy + low complexity. The rhythmic anchor is steady and looping. Not overwhelming, but hard to escape.

**heavy**  
Low brightness + high density + high energy + low valence (optional). Sonically weighty. The opposite of airy or light. May correlate with high loudness and low spectral brightness.

**dark / deep**  
Low brightness + low valence + low-to-moderate energy. Tonal weight without necessarily being heavy or loud. Often appears in slower or more somber tracks.

**bouncy**  
High pulse + moderate energy + positive valence + high articulation. Rhythmically driven with a light, playful quality. Distinct from driving because it does not require high energy.

**stepping**  
High pulse + moderate complexity + distinct rhythmic identity. Associated with tracks where the rhythmic pattern has a characteristic gait. Often appears in grime, UKG, hip-hop contexts.

**floating / airy**  
Low density + high brightness + low punch + low complexity. Perceptually light and open. Opposite of heavy. Can appear at low or moderate energy levels.

This concept is intended to capture weightless / suspended motion ("floaty"), not just low density.

**gritty / grimy**  
Moderate-to-high energy + low-to-moderate brightness + moderate aggression + moderate density. Textured, rough, often urban-feeling. Not the same as dark.

**uplifting / colorful**  
High brightness + high energy + positive valence. Emotionally positive and spectrally bright. Often correlates with high danceability.

Note: `uplifting` is a valid affective concept but should not be reduced to brightness alone. Brightness may support uplifting in some contexts, but uplifting is fundamentally an affective lift signal and may be strengthened by future temporal evidence.

`euphoric` is a valid future-facing affective concept. It is expected to benefit heavily from temporal context (build, release, peak-state), but it remains compatible with the existing ontology architecture.

**atmospheric**
An explicitly recognized expressive vocabulary concept. Immersive environment / spatial mood / enveloping texture. Derived and interpreted (not primitive).

**cinematic / powerful**  
High dynamicity + emergent energy + high tension + emotional intensity. Requires temporal modeling. Not achievable with static descriptors alone in V1.

Examples of additional future-facing expressive concepts that are expected to become substantially more reliable once Layer 3 temporal modifiers exist: `dramatic`.

Examples of future expressive vocabulary considerations that are expected to be genre-conditioned rather than universal surfaced labels: `rolling`.

Examples of future exploratory expressive vocabulary considerations: `playful`.

**builds / progression**  
Requires Layer 3. Structural escalation toward a climax or drop. Not inferrable from song-level average scores.

**explosive / earned drop**  
Requires Layer 3. A high-salience peak preceded by tension or buildup. Not inferrable from average scores.

All expressive labels should be treated as probabilistic and confidence-scored, not as binary on/off assignments.

### Descriptive vs. Functional Semantics

Some expressive labels primarily describe sonic character — `airy`, `gritty`, `dense`, `heavy`. Others describe perceived functional or behavioral effect — `driving`, `hypnotic`, `head nodder`. These categories overlap, but the distinction matters. Functional labels are often more context-sensitive and listener-dependent than purely descriptive labels: whether a song feels `driving` depends partly on who is listening and what they are doing with it. Descriptive labels like `airy` or `gritty` are more stable across listeners and contexts. Future retrieval and recommendation logic may need to handle these two types differently — descriptive labels as objective sonic filters, functional labels as context-relative behavioral predictors.

---

## 7. Dynamicity and Temporal Modeling

This is a critical area that is currently out of scope for V1 inference but must be architecturally planned for.

### Why Average Scores Are Insufficient

A song-level average collapses all temporal variation into a single number. Two songs with identical average energy scores can be perceptually completely different:

- **Song A:** Consistently medium energy throughout.
- **Song B:** Quiet for two minutes, then an enormous drop that dominates the listener's memory.

Song B should carry `builds` and likely `explosive` or `earned drop`. Song A should not. Average scores cannot distinguish these cases. This is not a minor limitation — it affects some of the most important labels in the DJ context.

### True Middle vs. Averaged Middle

When a song appears at the median of a dimension score distribution, the system should not assume it is genuinely "medium" on that dimension. It may be a highly dynamic song whose highs and lows cancel out in the average. This is the **averaged middle problem**. Future architecture must track variance alongside mean.

### Kinetic vs. Built Energy

The human evaluation finding that energy has two distinct subtypes maps directly onto this problem:

- **Kinetic energy** is felt immediately — in the drop, the punch, the impact. It is given, not earned.
- **Built/emergent energy** escalates over time through layering, tension, and progression. It is earned.

These two types of energy feel completely different to a listener and a DJ. They require different labels, different use cases, and different descriptor approaches. A single `energy_score` should be understood as capturing predominantly kinetic energy in V1. Built energy requires temporal modeling.

### Memorable Peak Behavior

Humans often remember a song by its peak moment — the drop, the chorus, the riff, the climax — not by its average state. Future label generation should incorporate peak salience: what is the magnitude and duration of the song's most memorable section?

### Candidate Dynamic Features for Layer 3

| Feature | Description |
|---|---|
| `contrast` | Difference between high and low sections |
| `variance` | Statistical variance of dimension scores across segments |
| `escalation` | Whether scores trend upward over time |
| `climax_strength` | Magnitude of the highest-energy moment |
| `peak_salience` | How distinct the peak is relative to the baseline |
| `stability` | How consistent the song is across its duration |
| `volatility` | How rapidly dimension values change |
| `transition_count` | Number of significant structural changes |
| `structural_arc` | Overall shape (builds, flat, decays, plateau, wave) |

Section-aware analysis will eventually require segment-level descriptor extraction, which is a significant future infrastructure investment.

### Structural vs. Textural Dynamicity

Dynamicity is not a single concept. There are at least two meaningfully different types of temporal change, and they should not be collapsed:

**Structural dynamicity** — changes in the song's overall arc, energy level, or intensity over time. Includes: builds toward a drop, escalation to a climax, energy decay after a peak, distinct sections with different energy states. These are the changes that produce labels like `builds`, `drops`, `breakdown`, `earned drop`, `progression`.

**Textural dynamicity** — changes in sonic character, density, layering, or instrumentation without necessarily changing overall energy or intensity. A song can maintain consistent energy while continuously evolving which instruments are present, how dense the arrangement is, or what sonic texture is foregrounded. Ambient and progressive music often exhibit high textural dynamicity with low structural dynamicity.

These two types require different modeling approaches and may produce different labels. A song with high structural dynamicity earns `builds` and `drops`. A song with high textural dynamicity might earn `layered`, `evolving`, or `progressive` labels that do not yet exist in the V1 vocabulary. The architecture should not assume these two types are the same thing.

---

## 8. Semantic Composition

Labels emerge from combinations of dimensions. This section describes how that composition should work in principle.

### Composition Rules

Compositions are probabilistic. No combination is a hard rule. Each should produce a confidence score that reflects how strongly the input dimensions support the output label.

Compositions should be:
- **Additive** — multiple supporting signals increase confidence.
- **Contradictory** — opposing signals reduce confidence.
- **Hierarchical** — some labels require other labels to be present (e.g., `earned drop` requires `builds` to have fired).
- **Modifiable by genre context** — the same dimension score may warrant a different label in different genre contexts.

**Caution: dimension correlations and shared descriptor ancestry can cause evidence double-counting.** Dimensions that derive from similar underlying descriptors — for example, `pulse_score`, `danceability`, and `rhythmic_stability` all drawing from overlapping rhythmic signal fields — may co-vary strongly. If a composition treats these as three independent confirming signals, confidence can become artificially inflated. Before finalizing composition rules, the correlation structure between dimensions should be reviewed. Dimensions with high shared ancestry should be weighted accordingly rather than treated as independent evidence.

### Illustrative Compositions

**high pulse + high energy + stable rhythm → driving**  
Confidence increases with rhythmic_stability and articulation. Decreases if complexity is very high (complex rhythms undercut the driven quality).

**low brightness + high density + weight → dark / heavy / deep**  
These three labels are related but distinct: dark requires low valence; heavy requires high density and loudness; deep is more about tonal weight and may appear at lower energy. They can co-occur.

**high dynamicity + progression + emotional intensity → cinematic / powerful**  
Requires Layer 3. Not available in V1.

**high pulse + lightness + bounce → stepping / bouncy**  
Lightness here means low density and moderate-to-high brightness. Stepping adds a specific rhythmic gait quality that may require genre context to distinguish from bouncy.

**vocal presence + singable structure + repetition → singable / catchy**  
Requires corrected vocal_presence_score. Singable structure is not currently extractable from Music Story descriptors — this may require future feature work.

**low complexity + high repetition + high pulse → hypnotic / steady**  
These are related labels. Hypnotic adds a trance-like quality that may depend on energy level (moderate, not overwhelming).

### Confidence Propagation

When a dimension score is uncertain (because its input descriptors were missing or had coverage failures), confidence should propagate down to any composition that depends on that dimension. A label built on four strong dimensions and one missing dimension should reflect reduced confidence, not fabricated confidence.

---

## 9. Internal vs. User-Facing Representation

The distinction between the internal representation and the user-facing surface is critical. These must not be conflated.

### Internal System Representation

The system stores continuous scores per dimension, with confidence values:

```
energy_score: 0.82 (confidence: 0.91)
pulse_score: 0.74 (confidence: 0.87)
brightness_score: 0.61 (confidence: 0.94)
density_score: 0.39 (confidence: 0.82)
vocal_presence_score: 0.12 (confidence: 0.76)
dynamicity_score: [not available in V1]
```

These values are not shown to users. They drive label generation and distance-based retrieval.

### User-Facing Surface

The user sees discrete labels, grouped by type, with optional confidence indicators:

```
high energy
driving
dense
bass-driven
instrumental
builds [manually assigned — AI cannot infer yet]
```

The translation from internal to user-facing must be explicit, versioned, and auditable. A label should not appear without a traceable path from dimensions to composition to label.

### Separation Benefits

This separation enables:
- The internal representation to evolve without breaking user-visible labels.
- User-defined labels to exist independently of what the AI can infer.
- Confidence thresholds to be tuned per use case (conservative for auto-apply, permissive for suggestions).
- Future personalization where users can have different mapping preferences on the same underlying scores.

---

## 10. V1 Scope vs. Future Scope

### V1 — Ready or Near-Term

The following are likely achievable with current Music Story descriptor data and the existing feature pipeline.

**Dimensions:**
- energy_score (kinetic bias — built energy is future)
- pulse_score (rhythmic anchor)
- brightness_score (internal use; careful about direct surfacing)
- density_score (with acknowledged limitations)
- vocal_presence_score (after inversion correction)
- valence (direct from Music Story)
- danceability-adjacent (from rhythmic_stability + articulation + pulse_clarity)

**Expressive labels (inference candidates):**
- driving
- heavy / dark / deep (partially)
- bouncy
- hypnotic / steady
- punchy (partially)
- floating / airy (partially)
- uplifting / colorful (partially)
- gritty / grimy (partially)
- vocal / instrumental

**V1 label selection principle:** V1 should bias toward labels that are strongly detectable, consistently interpretable, and commonly understood. Labels like `deep`, `powerful`, `colorful`, `cinematic`, and `smooth` are too semantically ambiguous or genre-relative for reliable V1 inference and should be deferred. Prefer labels where the dimensional backing is clear and the user interpretation is stable. The safer V1 candidates are: `driving`, `bouncy`, `hypnotic`, `heavy`, `punchy`, `airy`, `vocal`, `instrumental`, `dense`, `steady`. Richer vocabulary can expand as confidence in the composition rules grows.

**Confidence-scored label suggestions:**  
V1 should output labels with confidence scores and allow users to accept, reject, or modify them. This is the foundation of the human-assist model.

---

### Future — Requires More Data or Temporal Modeling

The following should not be attempted in V1 inference.

**Dimensions:**
- dynamicity / contrast (requires segment-level analysis)
- emergent / built energy (requires temporal modeling)
- tension (requires richer harmonic analysis)
- progression / evolution (requires structural arc modeling)

**Expressive labels (inference):**
- builds / drops / breakdown (temporal — cannot infer from averages)
- earned drop (temporal + hierarchical)
- climax / explosive (requires peak salience)
- catchy / infectious (requires combination + possibly listener data)
- singable (requires vocal + structural analysis)
- cinematic / powerful (requires dynamicity + temporal)
- story / journey (requires structural arc)

**Contextual / workflow labels** (e.g., `peak`, `aux safe`, `warmup`) — these should never be inferred by AI. They are always user-assigned.

**Important:** Labels that the AI cannot infer should still be supported as manually assignable from day one. The inability to infer a label is not a reason to exclude it from the system.

---

## 11. How to Treat the Old 147 Labels

The organically developed label system (and the labeled datasets derived from it) is **not the final ontology**. It should not be blindly preserved or treated as the target output vocabulary.

### What the Old Labels Are Useful For

**Evidence of natural human behavior.** These labels emerged from real listening and labeling sessions. They reveal what concepts naturally matter — what dimensions of music feel worth naming.

**Co-occurrence patterns.** Labels like `builds`, `bouncy`, `bass line`, `danceable` appear repeatedly in combinations. This co-occurrence signals which dimensions are salient and how they interact.

**Inspiration for expressive vocabulary.** Many terms are genuinely useful expressive descriptors: `stepping`, `flowy`, `floating`, `gritty`, `grimy`, `punchy`, `in your face`, `colorful`, `head nodder`. These should inform Layer 4 vocabulary.

**Evidence of label type mixing.** The old label set mixes foundational dimensions, expressive descriptors, temporal events, body-response labels, contextual labels, and evaluative labels without distinguishing between them. This is expected from organic labeling. The framework's job is to separate these into their correct layers.

**Evidence of super-label behavior.** Some labels were applied as shorthand for clusters of other labels — a natural super-label pattern emerging from use.

### What the Old Labels Are Not

- Not a taxonomy
- Not a complete vocabulary
- Not balanced or normalized across types
- Not a training target for V1 models
- Not something to preserve for its own sake

---

## 12. How to Treat Deep Research Reports

The deep research reports (covering density/texture, rhythm/movement, brightness/darkness/affect, vocal/instrumental/structural, and energy/dynamics) should be treated as **stronger design references** than the organic label set, but still not as final truth.

### Use These Reports For

- Understanding how labels in a given category are defined and distinguished from each other
- Identifying which signals support or contradict a given label
- Making principled decisions about which labels to include, defer, or redefine
- Understanding detectability — which labels can realistically be inferred from descriptor data

### Do Not Use These Reports As

- A final label list (they are research inputs, not decisions)
- An override of the framework principles in this document
- A substitute for empirical validation on the actual dataset

When a deep research report conflicts with empirical findings from the descriptor experiments, the empirical findings should take precedence for V1 decisions, with the discrepancy noted for investigation.

---

## 13. Confidence Architecture

Confidence is not a single number. It exists at multiple levels of the system, and those levels are not interchangeable. This section defines how confidence should be understood and propagated across layers.

### The Four Levels of Confidence

**Descriptor confidence**  
How reliably a raw descriptor value was measured. Affected by: whether the field was present in the provider response, provider-specific reliability notes, and known systematic issues (e.g., the vocal_instrumental inversion). Descriptor confidence is primarily a data quality question.

**Dimension confidence**  
How well a dimension score is supported by its input descriptors. A dimension built from five correlated descriptors carries higher confidence than one built from a single field with known issues. Dimension confidence is a function of both descriptor availability and the strength of the evidence model.

**Composition confidence**  
How strongly a set of dimension scores supports a given expressive label. A composition that requires high pulse, high energy, and stable rhythm to fire `driving` carries high composition confidence when all three are clearly elevated. It carries lower confidence when only one of three is strong. Composition confidence is affected by: number of supporting dimensions, strength of each signal, and presence of contradicting signals.

**Label confidence**  
The final output confidence attached to a label suggestion. This is a combination of dimension confidence and composition confidence, propagated through the chain. A label suggestion backed by high-confidence dimensions and a strong composition fires with high label confidence. A label suggestion backed by weak or missing dimensions and ambiguous composition fires with low label confidence — or should not fire at all.

### Propagation Rules

These are approximate principles, not final formulas.

**Confidence decays across layers.** Each layer introduces additional assumptions. A V1 implementation should not claim label confidence equal to raw descriptor confidence. The confidence floor should lower at each layer.

**Missing data reduces confidence multiplicatively.** If a dimension required to fire a label is missing, the label confidence should be substantially reduced — not treated as neutral.

**Contradicting signals apply confidence penalties.** If a dimension score is inconsistent with the expected composition (e.g., high complexity when `driving` requires low complexity), this should reduce confidence rather than be ignored.

**Absence of evidence is not evidence of absence.** This distinction is critical. Missing `pulse_clarity` data is not evidence against `driving`. Low `pulse_score` is evidence against `driving`. These must be handled differently. Missing signals should reduce confidence — because less evidence is available — but should not be treated as contradictory evidence unless the absence itself carries semantic meaning. Conflating these two cases will produce systematically wrong label suppression on partially described songs.

**Perceptual dimensions carry higher confidence than latent semantic dimensions.** Labels that depend primarily on perceptual dimensions (pulse, energy, brightness) should be treated as higher-confidence suggestions than labels that depend on latent semantic dimensions (tension, aggression, emotional intensity).

### What This Means in Practice

A complete confidence architecture specification is future work and belongs in `AudioFile_AI_Semantic_Composition_Spec_v0.1.md`. However, any V1 implementation should at minimum:
- Store dimension scores with confidence values
- Propagate those confidences into composition scores
- Surface only labels that exceed a minimum confidence threshold
- Never fabricate confidence when descriptors are missing

---

## 14. Ontology Stability

The ontology must evolve over time, but not all parts of it should evolve at the same rate. Uncontrolled change creates a system where label meanings shift, user expectations are violated, and prior labeled data becomes inconsistent.

### What Should Remain Stable

**Foundational dimensions and their meanings.** Once `pulse_score` is defined as rhythmic anchor, it should not be silently redefined to mean something else. If the definition must change, it requires a versioned update and documentation.

**The layer architecture.** The six-layer model defines where things live. Adding a new layer or collapsing two layers is a major architectural change that requires explicit decision-making, not organic drift.

**Confidence semantics.** What constitutes "high confidence" vs. "low confidence" should not shift between versions without explicit recalibration. If thresholds change, the change should be documented and labeled data should be reviewed.

**Label type taxonomy.** The distinction between perceptual dimensions, expressive labels, temporal labels, and workflow labels should not collapse. These categories exist to prevent ontology confusion.

### What Should Remain Flexible

**Label mappings and composition thresholds.** As the system learns more, the specific weights and thresholds that map dimension scores to labels should be tunable without breaking the architecture.

**Expressive vocabulary surface.** New labels can be added, and rarely-used labels can be deprecated, without structural impact, as long as the underlying dimensions remain stable.

**Personalization overlays.** User-specific calibrations should be entirely flexible and should not affect the shared foundational representation.

**Genre conditioning rules.** As genre conditioning matures, the specific rules for how genre modifies interpretation should be tunable without affecting the dimension layer.

### Versioning Principle

Any change to a stable component requires a version bump and documentation. Any change to a flexible component should be logged but does not require a version bump. This distinction should be enforced explicitly in future specification documents.

### Semantic Calibration Drift

Even with a stable architecture, the meaning of labels can shift gradually over time through accumulated changes to user behavior, dataset composition, descriptor provider updates, and composition tuning. A label called `heavy` calibrated against a 2026 dataset may carry different empirical meaning against a 2030 dataset if the genre distribution or labeling patterns have shifted.

This is not an urgent V1 concern. But it should be acknowledged as a future maintenance issue. The system should eventually include periodic semantic calibration reviews — comparing label distributions and composition outputs against human-labeled reference sets to detect drift before it becomes significant.

---

## 15. Open Questions

These are genuine unresolved questions. They should not be closed prematurely.

**Which expressive labels are valuable enough for V1 user-facing output?**  
The full expressive vocabulary is large. A principled selection based on detectability, usefulness, and coverage is needed before V1 label generation is built.

**How much dynamicity can be inferred without raw audio or segment-level descriptors?**  
The current Music Story pipeline returns song-level averages. It is not yet clear how much temporal structure can be recovered from these, if at all.

**Should dynamicity labels exist in V1 as manual-only?**  
Even if dynamicity cannot be inferred, `builds` or `steady` could be manually assigned. Should the system surface dynamicity-type labels in V1 as manual-only with no AI inference, or wait until inference is possible?

**How should genre modify interpretation?**  
Genre is a strong contextual modifier. The same pulse_score in a classical piece means something different than in house music. A principled genre-conditioning approach needs to be designed.

**Which subjective labels should exist only as personal overlays?**  
Labels like `beautiful`, `cool`, `unique`, `complete` carry real meaning for individual users but should not drive a shared ontology. The boundary between shared vocabulary and personal overlay needs to be defined.

**How should user feedback update dimension-to-label mappings?**  
If a user consistently rejects a label the AI suggests, should this update the threshold? The global model? A personal model? This personalization architecture does not yet exist.

**How should confidence be communicated to users?**  
The right UX for surfacing confidence (percentage, visual weight, icon, badge) is not yet defined.

**What is the right V1 label vocabulary size?**  
Too few labels reduces usefulness. Too many produces noise. A principled target vocabulary size for V1 AI suggestions needs to be established.

**How reliable are descriptors across genres?**  
Some descriptors may work much better in certain genre contexts than others. For example, `pulse_clarity` may be highly reliable in techno but less reliable in ambient jazz, where rhythmic structure is more fluid. Descriptor reliability itself may need genre-contextual weighting in future architecture. This is likely future work but should be monitored in early experiments.

**When will the internal dimension layer need geometric representation?**  
The current architecture describes dimensions semantically. For recommendation, similarity retrieval, clustering, and AI selection agents to operate on the internal representation, the dimension layer will eventually need a normalized vector representation with defined weighting, similarity metrics, and dimensional balancing. This is not needed for V1 label generation but should be considered in how dimensions are stored and exposed.

---

## 16. Recommended Next Steps

After this document is reviewed and accepted:

1. **Manual review of this framework.** Read it critically against the reference materials. Identify anything that feels wrong or underspecified before any implementation proceeds.

2. **Correct the vocal_presence_score inversion.** This is a known bug that should be fixed before V1 label generation uses the vocal dimension.

3. **Create `AudioFile_AI_Semantic_Composition_Spec_v0.1.md`.** Define the specific composition rules, dimension combinations, and confidence logic for the V1 expressive vocabulary. This document defines the actual label generation logic.

4. **Create `AudioFile_AI_Dynamicity_Modeling_Plan_v0.1.md`.** Define the architecture and data requirements for Layer 3. Identify whether any dynamicity signal can be extracted from current data as a near-term approximation.

5. **Run targeted experiments for semantic composition.** Validate the proposed composition rules against known tracks. Use the representative track set from `008_select_representative_tracks.md` as a sanity-check dataset — the existing dimension scores for those tracks provide a useful starting point.

6. **Define V1 label vocabulary.** Select the specific expressive labels to include in V1 AI suggestions, based on detectability evidence and composition rules.

7. **Update mapping code only after framework and composition spec are reviewed.** Do not implement label generation before the semantic composition rules are explicitly defined and reviewed.

---

## Document History

| Version | Date | Notes |
|---|---|---|
| v0.1 | May 2026 | Initial framework — architecture and principles only. Not final ontology. |
| v0.1.1 | May 2026 | Splits Layer 2 into perceptual vs. latent semantic dimensions. Adds genre conditioning as explicit pipeline stage in Layer 4. Restructures Section 5 accordingly (5A/5B). Adds Confidence Architecture section. Adds Ontology Stability section. Adds V1 label selection principle. Adds open questions on descriptor reliability by genre and distance representation. |
| v0.1.2 | May 2026 | Adds semantic overlap tolerance as core principle. Adds Genre Representation ontology status to Layer 4 (probabilistic, multi-genre, source-agnostic). Adds absence-vs-contradiction distinction to Confidence Architecture. Adds dimension double-counting caution to Semantic Composition. Adds structural vs. textural dynamicity distinction to Section 7. Adds semantic calibration drift to Ontology Stability. |
| v0.1.3 | May 2026 | **FROZEN.** Adds fail gracefully principle to Core Principles. Adds scope protection note to Overview. Clarifies Layer 4 as internal semantic activation space (not direct output) with persistent state note. Clarifies Layer 5 as filtered surfaced outputs distinct from Layer 4. Adds descriptive vs. functional semantics note to Section 6. No further additions unless implementation exposes a real contradiction. |

---

*This document is frozen at v0.1.3. It governs the AudioFile AI ontology architecture. Do not add to or modify this document unless implementation exposes a real contradiction, experiments invalidate core assumptions, or the architecture fundamentally breaks. Philosophical iteration on this document is complete. Execution is now the bottleneck.*
