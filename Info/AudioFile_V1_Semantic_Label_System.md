# AudioFile V1 Semantic Label System
## Consolidated Review + Final Design

> **Status / Alignment Note (2026-05):** This document represents a conceptual semantic simplification layer and is partially superseded by:
>
> - AudioFile AI Ontology Framework v0.1.3 (frozen)
> - AudioFile AI Semantic Composition Spec v0.1.1
>
> Closure findings from Music Story-only experimentation indicate the V1 representation space is low-rank with partially coupled dimensions. As a result, not all primitives are equally inferable from static averaged descriptors.
>
> Reliability tiers (Music Story-only):
> - **Most trusted:** `speech_score`, `rhythm_stability_score`
> - **Moderately trusted (proxy-based / conceptually compressed):** `layered_score`
> - **Partially trusted / coupled:** energy/pulse/driving/calm/darkness/valence/punch/syncopation/brightness/vocal/instrumental
> - **Descriptor-starved / low confidence:** acoustic/harshness/low_end/offbeat

---

## 0. Purpose

This document consolidates and refines five research documents:

- Energy & Dynamics
- Density & Texture
- Motion & Rhythm
- Tone & Emotion
- Content & Instrumentation

Goal:
Create a **small, consistent, inferable label system** that:

- Works without raw audio
- Maps primarily to descriptor APIs (Music Story). AcousticBrainz may be considered as a future experimental provider, but is not assumed as part of the stabilized V1 Music Story-only phase.
- Powers filtering + AI selection
- Is scalable for future expansion

---

## 1. Key System Principles (Derived from All Docs)

### 1.1 Labels are NOT equal
There are 3 fundamentally different types:

| Type | Description | Use |
|------|-------------|-----|
| Primitive | Directly inferable from signals | Core V1 labels |
| Derived | Combination of primitives | Computed (not stored as truth) |
| Temporal | Require structure over time | Future only |

---

### 1.2 V1 must prioritize inferability
A label is valid ONLY if:

- It maps to available signals (descriptors, metadata)
- It is consistent across songs
- It does not rely on temporal structure

---

### 1.3 Small > Complete
- Fewer, stronger labels → better system
- Overlapping labels → worse AI performance
- Midpoints (e.g., "balanced") are NOT real labels

---

## 2. Final Label Architecture

---

# LAYER 1 — CORE PRIMITIVE LABELS (V1)

These are the ONLY labels stored as ground truth.

---

## 2.1 Energy / Activation Axis

**Implementation: ONE continuous score → bucketed**

### Labels
- `low_energy`
- `high_energy`
- `very_high_energy`

### Notes
- `medium_energy` = optional internal bucket (not needed as label)

### Signals
- arousal
- intensity
- loudness
- event_density
- pulse_clarity

---

## 2.2 Texture / Density

### Labels
- `sparse`
- `dense`
- `layered`

### Definitions
- sparse → low event count, exposed elements
- dense → high event count or full occupancy
- layered → multiple distinct simultaneous roles

### Signals
- onset_rate
- spectral_complexity
- timbral_complexity
- layer estimation (if available)

---

## 2.3 Tone (Timbral Axis)

### Labels
- `bright`
- `dark`

### Definitions
- bright → high-frequency emphasis
- dark → low-frequency emphasis

### Signals
- spectral centroid
- brightness
- rolloff
- valence (weak support)

---

## 2.4 Rhythm / Motion

### Labels
- `steady`
- `driving`
- `bouncy`
- `syncopated`

### Definitions
- steady → predictable pulse
- driving → strong forward momentum (operationally useful, but partially coupled to pulse and rhythmic stability under static descriptors)
- bouncy → off-beat emphasis
- syncopated → displaced accents

### Signals
- pulse_clarity
- rhythmic_stability
- event_density
- danceability

---

## 2.5 Content / Source

### Labels
- `vocal`
- `instrumental`
- `speech`

### Signals
- vocal_instrumental
- music_speech
- metadata

---

## 2.6 Force / Articulation Modifiers

### Labels
- `aggressive`
- `punchy`
- `calm`

### Definitions
- aggressive → high energy + harshness
- punchy → strong transient impact
- calm → low urgency + low attack

### Signals
- dissonance
- flatness
- articulation
- transient strength

---

## Final Core Label Count: ~16–18

---

# LAYER 2 — DERIVED LABELS (NOT STORED)

These are computed from primitives.

---

## Examples

### uplifting
```
high_energy + bright + high_valence
```

### melancholic
```
low_energy + dark + low_valence
```

### tense
```
high_energy + high_dissonance + low_valence
```

### atmospheric
```
low_density + high_sustain + low_attack
```

---

## Important Rule
Derived labels:
- NEVER overwrite primitives
- ALWAYS computed dynamically
- Lower confidence than primitives

---

# LAYER 3 — FUTURE (NOT V1)

These require temporal/audio analysis.

### Deferred labels
- explosive
- evolving
- repetitive
- dynamic_rhythm
- chaotic

---

## Why excluded
- Require time-based structure
- Not inferable from lookup data
- Will introduce noise

---

## Future implementation
- section-level analysis
- waveform modeling
- DJ-focused expansion

---

## 3. Label Decisions Summary

---

### KEEP (Core)
- energy axis (3 levels)
- sparse / dense / layered
- bright / dark
- steady / driving / bouncy / syncopated
- vocal / instrumental / speech
- aggressive / punchy / calm

---

### REMOVE
- neutral
- balanced (use as internal midpoint only)
- chaotic
- dynamic_rhythm
- repetitive
- evolving
- explosive (track-level)

---

### CONDITIONAL
- soft → merge into calm OR define strictly as low-force
- instrument labels (guitar, piano, etc.)
  - keep as secondary
  - low confidence

---

## 4. Mapping Framework (Implementation)

---

### 4.1 Signal Priority

1. Descriptor APIs (strongest)
2. Metadata / tags
3. LLM inference (fallback)

---

### 4.2 Confidence Rules

| Source | Confidence |
|--------|-----------|
| Descriptor | High |
| Metadata | Medium |
| LLM | Low |

---

### 4.3 Conflict Handling

- Strong descriptor overrides metadata
- Metadata overrides LLM
- Conflicts → reduce confidence, not force label

---

## 5. Key Insight (Most Important)

### The system is NOT:
A list of labels

### The system IS:
A mapping:

```
signals → primitives → derived semantics
```

---

## 6. Final Recommendation

### Do this next:

1. Implement core labels ONLY
2. Build mapping from:
   - Music Story
   - AcousticBrainz (optional future experiment only; not assumed as near-term dependency)
3. Run on small dataset (100–500 songs)
4. Evaluate:
   - consistency
   - separation
   - usefulness in filtering

---

### Do NOT:

- Expand label list yet
- Add subjective labels
- Add temporal labels
- Overfit to edge cases

---

## 7. Outcome

If implemented correctly, this system will support a first constrained semantic runtime:

- Auto-label songs reliably
- Enable strong filtering immediately
- Support AI selection layer
- Scale cleanly into future audio-based models
