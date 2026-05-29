# AudioFile AI — Runtime Alignment Spec v0.1

**Version:** v0.1
**Status:** Implementation Bridge — Pending Runtime Alignment
**Date:** May 2026
**Purpose:** Translate the current AudioFile AI semantic authority documents into executable runtime requirements.

---

## 0. Authority Position

This document is not a replacement for the canonical ontology or semantic specifications. It sits between the authority documents and runtime code.

### Higher Authority

If this document conflicts with any of the following, the documents below win:

1. `AudioFile_AI_Ontology_Framework_v0.1.x`
2. `AudioFile_AI_Semantic_Composition_Spec_v0.1.x`
3. `AudioFile_AI_Representation_Limits_and_Closure_Findings_v0.1`

### Runtime Authority

After approval, runtime implementation should align to this document before representative validation begins.

Primary runtime files expected to be affected later:

- `audiofile-ai/src/pipeline/processSong.js`
- `audiofile-ai/src/features/normalize.js`
- `audiofile-ai/src/mapping/mappingConfig.js`
- `audiofile-ai/src/mapping/labelScorer.js`

---

## 0.1 Frozen Scope

The active V1 dimensions and labels defined in this document are frozen.

New dimensions, labels, semantic concepts, descriptor sources, or genre-conditioning behavior must not be added until:

1. Runtime alignment is complete.
2. Representative validation is complete.
3. Validation findings justify expansion.

The purpose of this freeze is to prevent ontology drift during implementation.

---

## 1. Core Runtime Philosophy

### 1.1 Dimension-First Runtime

The runtime must follow this pipeline:

```
Raw descriptors
→ Normalized dimensions
→ Dimension confidence
→ Semantic label projection
→ Label confidence
→ Output object
```

The system must not shortcut directly from raw descriptors to labels.

### 1.2 Primary Runtime Product

The primary runtime product is a trustworthy dimension layer. Labels are secondary semantic projections.

This matters because Music Story-only static descriptors contain real signal, but the representation is compressed, coupled, and limited. The system should therefore preserve useful continuous dimensions even when label confidence is too weak to fire.

### 1.3 Label Philosophy

Labels are not objective truth. Labels are confidence-scored suggestions derived from dimensions.

The runtime should prefer:

```
fewer labels with higher trust
```

over:

```
many labels with weak semantic support
```

When uncertain, the runtime should abstain.

---

## 2. Runtime Scope

### 2.1 Included In This Alignment

- Music Story descriptor normalization
- V1 dimension construction
- Dimension confidence
- Representation-limit enforcement
- Conservative V1 label projection
- Label confidence
- Output schema alignment

### 2.2 Excluded From This Alignment

- Genre conditioning
- Multi-provider descriptor fusion
- LLM runtime fallback
- Temporal modeling
- Section-aware analysis
- Raw audio analysis
- User personalization
- UI integration

Genre conditioning will be introduced only after the aligned Music Story-only runtime has been validated.

### 2.3 Representative Validation Gate

Representative validation is the first major evaluation phase following runtime alignment.

Genre conditioning, additional descriptor providers, temporal modeling, and new semantic labels must not be introduced until:

1. Runtime alignment is complete.
2. Representative validation has been executed.
3. Validation findings have been reviewed.

This ensures the Music Story-only runtime is evaluated independently before additional complexity is introduced.

---

## 3. V1 Runtime Dimensions

The aligned runtime should compute exactly these primary V1 dimensions:

1. `energy_score`
2. `pulse_score`
3. `brightness_score`
4. `density_score`
5. `vocal_presence_score`
6. `speech_score`
7. `valence_score`
8. `punch_score`

Each dimension must emit both score and confidence:

```json
{
  "score": 0.0,
  "confidence": 0.0
}
```

A dimension score without confidence is incomplete.

---

## 4. Descriptor Normalization Rules

### 4.1 Missing Values

Missing descriptors must not be replaced with neutral values.

Do not do this:
```
missing descriptor → 0.5
```

Correct behavior:
```
missing descriptor → absent evidence → lower confidence
```

### 4.2 Known Inversions

Apply confirmed inversions before dimension construction.

| Raw Descriptor | Runtime Correction | Reason |
|---|---|---|
| `vocal_instrumental` | `1 - vocal_instrumental` | raw high = instrumental, raw low = vocal |

No speculative inversions should be added.

### 4.3 Correlated Descriptor Policy

Highly correlated descriptors must not be treated as independent evidence. If two descriptors are known to share ancestry, the secondary descriptor may support the score but should not inflate confidence as if it were independent confirmation.

This is especially important for:

- `loudness` / `intensity`
- Brightness-related spectral descriptors
- Pulse/rhythm descriptors
- Pulse/driving/punch-related projections

---

## 5. Dimension Confidence Rules

### 5.1 Required Confidence Behavior

Each dimension confidence should reflect:

- Whether primary descriptors are present
- Whether only fallback descriptors were used
- Whether the dimension is known to be partially coupled
- Whether the dimension is conceptually limited under Music Story-only static descriptors

### 5.2 Confidence Bands

| Confidence | Meaning |
|---|---|
| `0.80–1.00` | Strong evidence |
| `0.50–0.79` | Usable evidence |
| `0.30–0.49` | Weak evidence |
| `< 0.30` | Insufficient evidence |

### 5.3 Label Gating Rule

If a required dimension has `confidence < 0.40`, that dimension must not contribute to label firing. It may still be returned in the output object as a weak dimension.

### 5.4 Required Confidence Caps

| Dimension | Max Confidence | Reason |
|---|---|---|
| `density_score` | `0.70` | Density/fullness is only partially captured by static descriptors |
| `vocal_presence_score` | `0.75` | Inversion is validated but still needs cautious handling |
| `punch_score` | `0.70` | Punch is proxy-based and partially coupled with rhythm/articulation |

---

## 6. Dimension Definitions

### 6.1 `energy_score`

**Meaning:** Overall sonic activation and kinetic force. Captures immediate energy, not built or emergent energy.

**Primary Inputs:** `arousal`, `loudness`, `intensity`

**Fallback Descriptors:** No fallback descriptors are currently approved.

**Excluded From Energy:** `event_density`, `pulse_clarity`, `absolute_loudness` — these may correlate with energy but should not define it.

```json
"energy": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.2 `pulse_score`

**Meaning:** Strength and clarity of rhythmic anchor.

**Primary Inputs:** `pulse_clarity`, `rhythmic_stability`

**Minor Support Inputs:** `danceability`, `articulation`

**Soft Inverse Signal:** `complexity` — may reduce pulse confidence when high, but must not be used as a hard inverse.

```json
"pulse": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.3 `brightness_score`

**Meaning:** Spectral/timbral sharpness and high-frequency emphasis. Brightness does not mean emotional positivity.

**Primary Inputs:** `brightness`, `roll_off`

**Fallback:** `centroid`, only if primary inputs are missing

**Excluded From Brightness:** `valence`, emotional positivity, mood descriptors, large correlated spectral clusters at equal weight

```json
"brightness": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.4 `density_score`

**Meaning:** Perceived sonic fullness or occupied musical space. Density is not the same as complexity.

**Primary Input:** `event_density`

**Secondary Inputs:** `intensity`, `complexity`

**Confidence Rule:** Even with all inputs present, density confidence must not exceed `0.70`.

```json
"density": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.5 `vocal_presence_score`

**Meaning:** Degree of musical vocal presence.

**Primary Input:** corrected `vocal_instrumental`

**Correction:**
```
vocal_presence_score = 1 - vocal_instrumental
```

**Secondary Input:** `music_speech`, used only to distinguish speech-heavy content from musical vocals

**Uncertainty Band:** If `0.35 <= vocal_presence_score <= 0.65`, suppress `vocal`, suppress `instrumental`, and return dimension with reduced confidence.

```json
"vocal_presence": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.6 `speech_score`

**Meaning:** Presence of spoken-word or speech-like content.

**Primary Input:** `music_speech`

**Rule:** Speech should be treated separately from musical vocal presence. A song may contain vocals without being speech-heavy.

```json
"speech": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.7 `valence_score`

**Meaning:** Emotional positivity.

**Primary Input:** `valence`

**Rule:** Valence is pass-through evidence. Do not infer valence from brightness, dissonance, density, or energy. Do not use valence inside brightness construction.

```json
"valence": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

### 6.8 `punch_score`

**Meaning:** Perceived transient impact and articulation.

**Primary Inputs:** `articulation`, `loudness_range`

**Excluded As Primary Inputs:** `low_end`, `offbeat`, `harshness`, speculative `transient_strength` unless validated and documented

**Confidence Rule:** Punch confidence must not exceed `0.70`. Missing `loudness_range` should substantially reduce confidence.

```json
"punch": {
  "score": 0.0,
  "confidence": 0.0,
  "evidence": [],
  "missing": []
}
```

---

## 7. Descriptor-Starved Signal Policy

The following are descriptor-starved or low-confidence under Music Story-only static descriptors:

- `offbeat`
- `low_end`
- `harshness`
- `acoustic`

These signals may be logged. They may be used as weak supporting evidence only if already available. They must not be primary inputs for active V1 labels. They must not cause high-confidence label firing.

---

## 8. Active V1 Label Set

### 8.1 Active Labels

| Label | Status | Notes |
|---|---|---|
| `energetic` | Active | Derived primarily from `energy_score` |
| `driving` | Active | Requires pulse + energy agreement |
| `steady` | Active | Rhythm-level steadiness only |
| `bouncy` | Experimental Active | Should not rely on offbeat as primary evidence |
| `heavy` | Experimental Active | Requires low brightness + density/energy/punch support |
| `punchy` | Active, lower confidence | Depends on `punch_score` |
| `dense` | Active, lower confidence | Depends on `density_score` plus corroboration |
| `hypnotic` | Active, Experimental | Repetition/stability-derived semantic label with conservative confidence handling |
| `vocal` | Active | Obeys vocal uncertainty band |
| `instrumental` | Active | Obeys vocal uncertainty band |
| `speech` | Active | Direct from `speech_score` |

### 8.2 Deferred Labels

Do not actively infer these in Runtime Alignment v0.1:

| Label | Reason |
|---|---|
| `floating` / `airy` | Explicitly deferred pending calibration set |
| `calm` | Currently collapses too easily into inverse energy |
| `aggressive` | Harshness support is descriptor-starved |
| `syncopated` | Not reliably separable from pulse/offbeat under static descriptors |
| `bright` | Brightness remains internal due to semantic ambiguity |
| `dark` | Current evidence overlaps brightness/valence too strongly |
| `sparse` | Defer as user-facing label until density validation improves |
| `layered` | Proxy-based; keep internal or analysis-only for now |
| `low_energy` | Internal bucket only unless product later needs it |
| `very_high_energy` | Internal bucket only unless product later needs it |
| `builds` | Unsupported by static descriptors |
| `drops` | Unsupported by static descriptors |
| `breakdowns` | Unsupported by static descriptors |
| `climaxes` | Unsupported by static descriptors |
| `transitions` | Unsupported by static descriptors |
| `emotional_arcs` | Unsupported by static descriptors |
| `structural_evolution` | Unsupported by static descriptors |

---

## 9. Label Projection Rules

Each label should be computed from dimensions, not raw descriptors. Each label output must include:

```json
{
  "labelId": "driving",
  "score": 0.0,
  "confidence": 0.0,
  "dimensionsUsed": [],
  "evidence": [],
  "suppressed": false,
  "suppressionReasons": []
}
```

### 9.1 `energetic`

**Required Dimension:** `energy_score`

**Rule:** Fires when energy is high and energy confidence is sufficient.

**Supporting Dimension:** `pulse_score`, minor confidence support only

**Suppression:** Suppress if `energy_confidence < 0.40`.

---

### 9.2 `driving`

**Required Dimensions:** `pulse_score`, `energy_score`

**Supporting Dimension:** `density_score`

**Rule:** Driving requires agreement between pulse and energy. A high pulse score alone is not enough. A high energy score alone is not enough.

**Suppression:** Suppress if `pulse_score < 0.35`, `energy_score < 0.35`, or either required dimension confidence `< 0.40`.

**Confidence Note:** Because driving is coupled with pulse under static descriptors, its confidence should be capped or reduced when supported mostly by pulse evidence.

---

### 9.3 `steady`

**Required Dimension:** `pulse_score`

**Supporting Evidence:** `rhythmic_stability`, low-to-moderate complexity

**Rule:** Steady describes rhythm-level regularity only. It does not mean the whole song lacks structural change.

**Suppression:** Suppress if `pulse_confidence < 0.40`.

---

### 9.4 `bouncy`

**Required Dimensions:** `pulse_score`, `energy_score`

**Supporting Dimensions:** `valence_score`, `brightness_score`, `punch_score`

**Rule:** Bouncy should represent light rhythmic lift. Do not use `offbeat` as primary evidence.

**Suppression:** Suppress if pulse is weak, required dimensions have low confidence, or bouncy evidence depends primarily on descriptor-starved offbeat data.

---

### 9.5 `heavy`

**Required Dimensions:** `brightness_score`, `energy_score`

**Supporting Dimensions:** `density_score`, `punch_score`

**Rule:** Heavy requires low brightness plus sonic force or fullness. Heavy should not fire from low brightness alone. Heavy should not fire from high density alone.

**Suppression:** Suppress if brightness is high, energy is very low, or required dimensions have low confidence.

**Confidence Note:** Heavy is genre-sensitive and should remain conservative until genre conditioning exists.

---

### 9.6 `punchy`

**Required Dimension:** `punch_score`

**Supporting Dimensions:** `energy_score`, `pulse_score`

**Rule:** Punchy should require sufficient punch confidence.

**Confidence Cap:** Maximum label confidence: `0.70`.

---

### 9.7 `dense`

**Required Dimension:** `density_score`

**Supporting Dimensions:** `energy_score`, `brightness_score` (contextual only), `punch_score` (optional)

**Rule:** Dense requires density plus corroboration. Density alone should not produce high confidence.

**Confidence Cap:** Maximum label confidence: `0.65`.

---

### 9.8 `vocal`

**Required Dimension:** `vocal_presence_score`

**Rule:** Fire only when vocal presence is clearly high.

**Suppression:** Suppress if `0.35 <= vocal_presence_score <= 0.65` or `vocal_presence_confidence < 0.40`.

---

### 9.9 `instrumental`

**Required Dimension:** `vocal_presence_score`

**Rule:** Fire only when vocal presence is clearly low.

**Suppression:** Suppress if `0.35 <= vocal_presence_score <= 0.65` or `vocal_presence_confidence < 0.40`.

---

### 9.10 `speech`

**Required Dimension:** `speech_score`

**Rule:** Speech is direct and should remain one of the most trusted labels when `music_speech` is present and high.

**Suppression:** Suppress if `speech_confidence < 0.40`.

---

### 9.11 `hypnotic`

**Required Dimension:** `pulse_score`

**Supporting Evidence:** `rhythmic_stability`, low-to-moderate `complexity` / low-to-moderate `event_density`, `density_score`

**Rule:** Hypnotic represents sustained rhythmic consistency and repetition.

Hypnotic should not fire from pulse alone.

Hypnotic requires corroboration from rhythmic stability and supporting evidence.

**Confidence Note:** Because static descriptors cannot directly observe repetition across time, hypnotic should remain lower-confidence than pulse and driving.

**Confidence Cap:** Maximum label confidence: `0.75`.

---

## 10. Label Confidence Ceilings

| Label Type | Maximum Confidence |
|---|---|
| `driving` | `0.95` |
| `bouncy` | `0.95` |
| `energetic` | `0.95` |
| `steady` | `0.95` |
| `hypnotic` | `0.95` |
| `speech` | `0.95` |
| `vocal` | `0.75` |
| `instrumental` | `0.75` |
| `heavy` | `0.75` |
| `punchy` | `0.70` |
| `dense` | `0.65` |

---

## 11. Label Surfacing Rules

The runtime may compute labels that are not surfaced.

### Minimum Surfacing Confidence

Labels with:

`confidence < 0.60`

must not be surfaced.

They may remain in analysis output.

### Maximum Surfaced Labels

No more than 5 labels should be surfaced for a song.

When more than 5 labels qualify:

 - sort by confidence
 - return highest-confidence labels first

### Low Coverage Rule

If fewer than 4 primary dimensions are computable:

 - surface no more than 2 labels
 - emit warning:
   `low_dimension_coverage`

### Abstention Rule

If evidence is insufficient:

 - return dimensions
 - return confidence
 - return no surfaced labels

---

## 12. Suppression vs. Contradiction

The runtime must distinguish between missing evidence and contradictory evidence.

- Missing evidence lowers confidence.
- Contradictory evidence applies penalties or hard suppression.

**Example:**
- Missing brightness should not count against `heavy`.
- High brightness should count against `heavy`.

---

## 13. Output Schema

```json
{
  "songIdentity": {},
  "provider": "music_story",
  "pipelineVersion": "audiofile-ai-runtime-alignment-v0.1",
  "dimensions": {
    "energy": {
      "score": 0.0,
      "confidence": 0.0,
      "evidence": [],
      "missing": []
    }
  },
  "labels": [
    {
      "labelId": "driving",
      "score": 0.0,
      "confidence": 0.0,
      "dimensionsUsed": [],
      "evidence": [],
      "suppressed": false,
      "suppressionReasons": []
    }
  ],
  "analysis": {
    "missingDescriptors": [],
    "missingDimensions": [],
    "suppressedLabels": [],
    "warnings": []
  },
  "versions": {
    "ontologyVersion": "audiofile-ai-ontology-v0.1.3",
    "semanticCompositionVersion": "audiofile-ai-semantic-composition-v0.1.1",
    "runtimeAlignmentVersion": "audiofile-ai-runtime-alignment-v0.1"
  }
}
```

---

## 14. Genre Integration Point

Genre is not part of Runtime Alignment v0.1.

Future flow:

```
Dimensions
→ Genre-conditioned semantic interpretation
→ Labels
```

Genre must never assign labels directly. Genre may only modify thresholds, confidence, and interpretation rules — and only after the base dimension layer is stable.

---

## 15. Migration Requirements From Current Runtime

Required migration areas:

1. Add dimension confidence outputs.
2. Add missing-descriptor confidence penalties.
3. Add primary-missing confidence caps.
4. Remove valence from brightness construction.
5. Correct brightness input path to use `roll_off`.
6. Align density to event-density-first construction.
7. Add density confidence cap.
8. Implement vocal uncertainty suppression.
9. Align punch to `articulation` + `loudness_range`.
10. Remove descriptor-starved signals as primary label drivers.
11. Replace old direct label thresholds with dimension-based composition logic.
12. Add suppression reasons to label outputs.
13. Align output schema.

---

## 16. Validation Readiness Criteria

Representative validation should not begin until:

- All active dimensions exist
- All active dimensions emit confidence
- Missing descriptors lower confidence
- Low-confidence dimensions cannot fire labels
- Active labels are derived from dimensions
- Descriptor-starved signals are not primary label evidence
- Temporal labels remain excluded
- Output schema includes dimensions, labels, analysis, and versions
- Runtime can be run on cached Music Story payloads without API calls

---

## 17. Success Definition

Runtime alignment is successful when the system can process cached Music Story descriptors and return:

- Stable dimension scores
- Honest dimension confidence
- Conservative label suggestions
- Explicit suppression behavior
- Clear missing-data reporting
- No unsupported temporal claims
- No direct genre-conditioned behavior yet

The next phase after this is representative semantic validation.
