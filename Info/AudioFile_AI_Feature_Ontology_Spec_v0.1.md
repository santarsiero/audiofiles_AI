# AudioFile AI — Feature / Ontology Spec

**Version:** v0.1
**Status:** Active — Working Draft
**Date:** May 2026
**Depends on:** Master Development Plan v0.1, System Architecture Spec v0.1

> **Status / Authority Note (2026-05):** This document is a **lower-level implementation reference** and is **not** the primary ontology authority.
>
> Source of truth hierarchy:
> - AudioFile AI Ontology Framework v0.1.3 (frozen)
> - AudioFile AI Semantic Composition Spec v0.1.1
> - Music Story-only closure findings (representation ceiling, coupling, descriptor-starved dimensions)
>
> Several V1 dimensions are now known to be **partially coupled / low-rank** under static descriptor evidence. This spec must be interpreted accordingly: dimensions are useful projections, not guaranteed independent semantic axes.

---

## 1. Ontology Overview

**System design principle:**
The system is dimension-first. Normalized features are the truth layer. Labels are derived, human-facing interpretations of those features.

**Global rule:**
A feature or label must not be produced if its required descriptor inputs are insufficient to produce a reliable signal.

**Features:**
- Internal continuous scores computed from raw descriptor data
- The core unit of musical understanding in the system
- Independent of any label definition

**Labels:**
- Human-readable tags produced by mapping feature scores through defined logic
- Probabilistic — expressed as confidence values, not binary assignments
- Dependent on feature availability and signal strength

**V1 vs. future separation:**
- V1 includes only features and labels that are grounded in descriptor-based inference from a single API source
- Future features and labels require either expanded API coverage, validated empirical findings, or LLM/hybrid support
- All items are explicitly status-tagged throughout this document

---

## 2. Feature Definitions

---

### Energy

- **Status:** V1_ACTIVE
- **Description:** Represents the overall intensity and activation level of a song. Captures how forceful, loud, or active the music feels at a perceptual level.
- **Descriptor inputs:** Arousal, intensity, loudness, loudness range, event density
- **Expected behavior:**
  - High → energetic, loud, active music
  - Low → calm, subdued, minimal music
- **Missing data behavior:** If arousal and intensity are both absent, energy score may be computed using available inputs with reduced confidence if sufficient supporting descriptors exist; otherwise marked undefined. If no inputs are available, energy score is marked undefined and energy-dependent labels are omitted or flagged.

**Reliability tier (Music Story-only):** PARTIALLY TRUSTED / COUPLED

Observed: strongly coupled with Calm and highly entangled with Pulse/Driving/Punch family under static descriptors.

---

### Density / Texture

- **Status:** V1_ACTIVE
- **Description:** Represents how full or busy the musical texture is. Captures the number of simultaneous musical events and layers.
- **Descriptor inputs:** Event density, rhythmic stability (weak proxy — reliability not yet validated)
- **Expected behavior:**
  - High → thick, layered, busy texture
  - Low → sparse, minimal, open texture
- **Missing data behavior:** If event density is absent, rhythmic stability may serve as a weak proxy at reduced confidence. If no inputs are available, density score is marked undefined.

**Reliability tier (Music Story-only):** PARTIALLY TRUSTED / COUPLED

Observed: distribution compression and coupling with Energy in static descriptor space; treat as partially unstable conceptually under current descriptor set.

---

### Brightness / Timbre

- **Status:** V1_ACTIVE
- **Description:** Represents the spectral character of the music. Captures whether the sound emphasizes high frequencies (bright) or low frequencies (dark/warm).
- **Descriptor inputs:** Brightness descriptor, spectral centroid
- **Expected behavior:**
  - High → treble-forward, clear, sharp sound
  - Low → bass-forward, muffled, warm, or heavy sound
- **Missing data behavior:** If brightness is absent, spectral centroid may be used as a fallback. If both are absent, brightness score is marked undefined and timbre-dependent labels are omitted or flagged.

**Reliability tier (Music Story-only):** PARTIALLY TRUSTED / COUPLED

Observed: best treated as an **internal support dimension** (spectral evidence) rather than a clean user-facing semantic axis. Coupling with Valence/Darkness semantics is expected under static descriptors.

Guardrail: Brightness in V1 refers to spectral/timbral sharpness (high-frequency emphasis), not emotional positivity.

---

### Pulse / Rhythmic Regularity

- **Status:** V1_ACTIVE
- **Description:** Represents the clarity and consistency of the rhythmic pulse. Captures whether the beat is strong, regular, and easy to follow.
- **Descriptor inputs:** Pulse clarity, rhythmic stability, danceability (weak proxy only — should not be relied on as a primary input)
- **Expected behavior:**
  - High → clear, steady, consistent beat
  - Low → irregular, ambiguous, or arrhythmic feel
- **Missing data behavior:** If pulse clarity is absent, rhythmic stability may be used. Danceability is a weak proxy only and should not be the sole input. If no inputs are available, pulse score is marked undefined.

**Reliability tier (Music Story-only):** PARTIALLY TRUSTED / COUPLED

Observed: strongly coupled with Driving and Punch family under static descriptors; do not treat as an independent axis.

---

### Vocal Presence

- **Status:** V1_ACTIVE
- **Description:** Represents whether the track contains singing vocals, spoken content, or is purely instrumental.
- **Descriptor inputs:** Vocal/instrumental descriptor, music/speech descriptor
- **Expected behavior:**
  - High vocal → track is predominantly vocal (singing or speech)
  - High instrumental → track has little or no vocal content
  - High speech → track contains spoken rather than sung content
- **Missing data behavior:** If both vocal/instrumental and music/speech descriptors are absent, vocal presence score is marked undefined and all vocal-dependent labels are omitted.

**Reliability tier (Music Story-only):**

- Vocal/Instrumental: PARTIALLY TRUSTED / COUPLED (complementary pair)
- Speech: TRUSTED CORE (direct, stable, strong unique variance)

---

### Aggression

- **Status:** EXPERIMENTAL
- **Description:** Represents the harshness, forcefulness, and dynamic impact of the music beyond raw energy. Captures timbral edge and dynamic contrast.
- **Descriptor inputs:** Loudness, loudness range, intensity, dissonance (if available)
- **Expected behavior:**
  - High → harsh, loud, high-contrast dynamics
  - Low → smooth, soft, controlled dynamics
- **Missing data behavior:** Depends on loudness and dynamic range descriptors. Reliability under real API data is not yet validated.
- **Note:** Relationship to Energy is significant — overlap must be managed carefully during testing.

**Reliability tier (Music Story-only):** LOW CONFIDENCE

Observed: high coupling risk with Energy/Motion axes and limited descriptor support for distinct “aggression” semantics under static averaged descriptors. Treat as conceptually valid but not reliably inferable in V1 without richer representations.

---

### Groove Complexity

- **Status:** FUTURE
- **Description:** Represents rhythmic complexity and off-beat emphasis beyond simple pulse regularity. Captures syncopation, swing, and danceable groove.
- **Descriptor inputs:** Danceability (partial proxy), rhythmic complexity (if available)
- **Expected behavior:** High → rhythmically complex, groovy, off-beat emphasis
- **Missing data behavior:** Undefined — not validated against real descriptor data.
- **Note:** May require LLM fallback or additional API coverage to be reliably inferred.

---

### Harmonic Tension

- **Status:** FUTURE
- **Description:** Represents dissonance, harmonic complexity, and tonal instability.
- **Descriptor inputs:** Dissonance descriptor (if available), mode/key information (if available)
- **Expected behavior:** High → dissonant, tonally complex or unstable
- **Missing data behavior:** Undefined — descriptor availability unconfirmed.

---

### Spatial Width

- **Status:** FUTURE
- **Description:** Represents perceived stereo width and space in the mix.
- **Descriptor inputs:** No confirmed descriptor source identified
- **Expected behavior:** High → wide, expansive stereo image
- **Missing data behavior:** Undefined — no confirmed legal descriptor source.

---

## 3. Label Definitions

---

### high_energy

- **Status:** V1_ACTIVE
- **Description:** Music with strong intensity, high activation, and forceful sound.
- **Feature dependencies:** Energy (primary), Density (supporting)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when both energy and density scores are elevated and based on multiple descriptor inputs.
- **Conflict relationships:** Opposes `low_energy` — both should not be output at high confidence simultaneously.

---

### low_energy

- **Status:** V1_ACTIVE
- **Description:** Music with subdued intensity, minimal activation, and quiet or restrained character.
- **Feature dependencies:** Energy (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when energy score is low and supported by multiple descriptor inputs.
- **Conflict relationships:** Opposes `high_energy`.

---

### dense

- **Status:** V1_ACTIVE
- **Description:** Music with a thick, full, or layered texture and high event activity.
- **Feature dependencies:** Density / Texture (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when event density descriptor is available and elevated.
- **Conflict relationships:** Opposes `sparse`.

---

### sparse

- **Status:** V1_ACTIVE
- **Description:** Music with a thin, open, or minimal texture and low event activity.
- **Feature dependencies:** Density / Texture (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when event density descriptor is available and low.
- **Conflict relationships:** Opposes `dense`.

---

### bright

- **Status:** V1_ACTIVE
- **Description:** Music with dominant high-frequency content; treble-forward tonal character.
- **Feature dependencies:** Brightness / Timbre (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when brightness or spectral centroid descriptor is available and elevated.
- **Conflict relationships:** Opposes `dark`.

---

### dark

- **Status:** V1_ACTIVE
- **Description:** Music with dominant low-frequency content; bass-forward or warm tonal character.
- **Feature dependencies:** Brightness / Timbre (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when brightness or spectral centroid descriptor is available and low.
- **Conflict relationships:** Opposes `bright`.

---

### steady

- **Status:** V1_ACTIVE
- **Description:** Music with a clear, consistent, regular rhythmic pulse.
- **Feature dependencies:** Pulse / Rhythmic Regularity (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when pulse clarity and rhythmic stability descriptors are available and indicate regularity.
- **Conflict relationships:** Related to `driving` — both require high pulse regularity, but `driving` additionally requires elevated energy and density.

---

### driving

- **Status:** V1_ACTIVE
- **Description:** Music with a strong, forward-moving pulse combined with high intensity and textural density.
- **Feature dependencies:** Pulse / Rhythmic Regularity (primary), Energy (required), Density / Texture (supporting, strengthens confidence)
- **Relationship type:** Composite
- **Confidence basis:** Confidence requires agreement across pulse, energy, and density scores. Single-feature support yields low confidence.
- **Conflict relationships:** Related to `steady` — `driving` is a stronger, higher-energy form. A track that qualifies as `driving` may not separately need `steady`.

---

### vocal

- **Status:** V1_ACTIVE
- **Description:** Music that contains prominent singing vocals.
- **Feature dependencies:** Vocal Presence (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when the vocal/instrumental descriptor clearly indicates vocal content and music/speech descriptor is low (confirming singing rather than speech).
- **Conflict relationships:** Opposes `instrumental`. Related to `speech` — both involve vocal content but are distinct categories.

---

### instrumental

- **Status:** V1_ACTIVE
- **Description:** Music with no or minimal vocal content; predominantly instrument-only.
- **Feature dependencies:** Vocal Presence (primary)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when vocal/instrumental descriptor clearly indicates absence of vocals.
- **Conflict relationships:** Opposes `vocal` and `speech`.

---

### speech

- **Status:** V1_ACTIVE
- **Description:** Music or audio containing spoken vocal content (e.g., rap, spoken word, narration).
- **Feature dependencies:** Vocal Presence (primary — music/speech descriptor specifically)
- **Relationship type:** Direct
- **Confidence basis:** Confidence is higher when music/speech descriptor is elevated, distinguishing spoken from sung content.
- **Conflict relationships:** Distinct from `vocal` (singing) and `instrumental`. May co-occur with other labels.

---

### calm

- **Status:** EXPERIMENTAL
- **Description:** Music that feels gentle, soothing, and non-forceful — low energy with smooth dynamics.
- **Feature dependencies:** Energy (primary), Aggression (supporting)
- **Relationship type:** Composite
- **Confidence basis:** Requires low energy score; Aggression feature is experimental and may not be available in V1.
- **Conflict relationships:** Opposes `aggressive`. Overlaps with `low_energy` — distinction depends on Aggression feature availability.
- **Note:** If Aggression feature is unavailable, `calm` collapses into `low_energy` and should not be separately output.

---

### aggressive

- **Status:** EXPERIMENTAL
- **Description:** Music with harsh, forceful, and high-contrast dynamic character beyond raw energy level.
- **Feature dependencies:** Aggression (primary), Energy (supporting)
- **Relationship type:** Composite
- **Confidence basis:** Requires Aggression feature, which is not yet validated against real descriptor data.
- **Conflict relationships:** Opposes `calm`.

---

### drops / builds / breakdown / repetitive / evolving

- **Status:** FUTURE
- **Description:** Temporal and structural labels describing how a song changes or behaves over time.
- **Feature dependencies:** None currently available — requires time-based analysis not supported in V1 descriptor pipeline
- **Relationship type:** N/A for V1
- **Note:** May be supported via LLM fallback, future hybrid models, or richer licensed data in later phases. Not permanently excluded from product scope.

---

## 4. Feature → Label Relationships

| Feature | Label | Importance | Relationship |
|---|---|---|---|
| Energy | high_energy | Strong | Direct |
| Energy | low_energy | Strong | Direct |
| Energy | driving | Strong | Composite |
| Energy | calm | Moderate | Composite (requires Aggression) |
| Energy | aggressive | Moderate | Composite |
| Density / Texture | dense | Strong | Direct |
| Density / Texture | sparse | Strong | Direct |
| Density / Texture | driving | Moderate | Composite |
| Brightness / Timbre | bright | Strong | Direct |
| Brightness / Timbre | dark | Strong | Direct |
| Pulse / Rhythmic Regularity | steady | Strong | Direct |
| Pulse / Rhythmic Regularity | driving | Strong | Composite |
| Vocal Presence | vocal | Strong | Direct |
| Vocal Presence | instrumental | Strong | Direct |
| Vocal Presence | speech | Strong | Direct |
| Aggression (EXPERIMENTAL) | aggressive | Strong | Direct |
| Aggression (EXPERIMENTAL) | calm | Moderate | Composite |

---

## 5. V1 Active Subset

This section defines exactly what is safe for Phase 1 implementation.

### Active Features (V1)

| Feature | Status |
|---|---|
| Energy | V1_ACTIVE |
| Density / Texture | V1_ACTIVE |
| Brightness / Timbre | V1_ACTIVE |
| Pulse / Rhythmic Regularity | V1_ACTIVE |
| Vocal Presence | V1_ACTIVE |

All other features are EXPERIMENTAL or FUTURE and must not be included in Phase 1.

### Active Labels (V1)

| Label | Status |
|---|---|
| high_energy | V1_ACTIVE |
| low_energy | V1_ACTIVE |
| dense | V1_ACTIVE |
| sparse | V1_ACTIVE |
| bright | V1_ACTIVE |
| dark | V1_ACTIVE |
| steady | V1_ACTIVE |
| driving | V1_ACTIVE |
| vocal | V1_ACTIVE |
| instrumental | V1_ACTIVE |
| speech | V1_ACTIVE |

All other labels are EXPERIMENTAL or FUTURE and must not be included in Phase 1 output.

---

## 6. Future Ontology Expansion

**Future feature categories:**
- Rhythmic complexity and groove (requires additional descriptor coverage or LLM support)
- Harmonic character and tension (requires dissonance/mode descriptors not yet confirmed)
- Dynamic articulation and aggression (requires validation against real descriptor data)
- Spatial and production characteristics (requires descriptor sources not yet identified)

**Future label categories:**
- Articulation and force labels (calm, aggressive, punchy) — dependent on Aggression feature validation
- Groove and rhythm complexity labels (bouncy, syncopated) — dependent on groove feature development
- Temporal and structural labels (drops, builds, breakdown, repetitive) — require non-descriptor inference methods
- Mood and emotional character labels — require valence or equivalent descriptor availability

**Requirements before activation:**
- Feature must be validated against real descriptor API data
- Descriptor availability must be confirmed across a meaningful sample of songs
- Feature-label relationship must be empirically tested, not only theoretically defined
- Items must be promoted through confirmed findings, not assumed

---

## 7. Open Ontology Questions

- Which of the V1_ACTIVE features are actually inferable with adequate coverage from real descriptor API data?
- Does the Pulse / Rhythmic Regularity feature produce stable, meaningful scores across diverse song types?
- Does the Energy feature behave as expected when arousal descriptors are absent and loudness is the primary input?
- Which V1 labels collapse or become unreliable when tested against real songs with partial descriptor data?
- Can `driving` be reliably distinguished from `steady` given available descriptor inputs?
- Does `speech` separate cleanly from `vocal` given available music/speech descriptors?
- Which labels will require LLM fallback to be usable in practice?
- At what point does label confidence become too low to surface to a user?
- Should `calm` and `aggressive` be deferred entirely to avoid dependence on the unvalidated Aggression feature?
