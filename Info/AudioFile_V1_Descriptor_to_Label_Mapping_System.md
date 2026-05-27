# AudioFile V1 Descriptor-to-Label Mapping System
## Initial Baseline Spec for Testing

> **DEPRECATION / HISTORICAL NOTE (2026-05):** This document is a historical baseline mapping reference and is **superseded operationally** by:
>
> - AudioFile AI Ontology Framework v0.1.3 (frozen)
> - AudioFile AI Semantic Composition Spec v0.1.1
> - Music Story-only phase closure findings (representation ceilings and coupled dimensions)
>
> This document should be treated as calibration context and historical intent, not implementation authority. Many mappings here were intentionally over-ambitious prior to representation ceiling analysis.
>
> Known downgrades from closure evidence:
> - Dimensions are partially coupled / low-rank under static descriptors; do not assume independence.
> - `offbeat`, `harshness`, `low_end`, and `acoustic` signals were descriptor-starved in experimentation and should not be presented as reliably inferable from Music Story-only V1.
> - “syncopation” behavior is not reliably separable from pulse clarity under static averaged descriptors.

Version: v0.1  
Status: Experimental baseline, not final production mapping  
Purpose: Create the first runnable system that converts legally available song descriptors into AudioFile V1 labels, while recording metadata and other contextual signals for later analysis.

---

## 0. Executive Summary

AudioFile has now moved from label research into system calibration. The V1 goal is no longer to keep researching what labels might exist. The V1 goal is to build a first working label-generation pipeline:

```text
song identity → descriptor lookup → feature normalization → label scoring → confidence assignment → stored AI labels
```

This system should be descriptor-first. Descriptor data should drive the initial labels. Metadata, provider tags, user labels, genre/style information, and LLM outputs should still be stored, but they should not be treated as equal truth sources in the first test version.

The purpose of this document is to define the best baseline that can be responsibly built before seeing real dataset distributions. The mapping rules below are deliberately conservative. They are good enough to run the first test set, but they must be calibrated against real songs before being locked.

---

## 1. Source-of-Truth Principles

### 1.1 AI output is probabilistic, not authoritative

AudioFile AI should output label IDs and probabilities. It should not mutate the database schema, silently redefine labels, or override user-defined semantics. Human labels and user corrections must remain separate from AI-inferred labels.

### 1.2 Labels are built from normalized features

Do not map vendor fields directly into product behavior. Vendor outputs should be converted into a stable internal feature layer first.

Correct:

```text
Music Story arousal → normalized energy_score → high_energy label
```

Incorrect:

```text
Music Story arousal → direct product label with no normalization
```

### 1.3 V1 is descriptor-first, not descriptor-only

Descriptor data should drive label assignment in the first version. However, all other legally available information should be stored for analysis:

- MusicBrainz identity
- Music Story descriptors
- AcousticBrainz descriptors
- genre/style/tags
- provider metadata
- user labels
- LLM fallback labels
- source provenance

The key distinction is:

```text
Descriptors assign labels.
Metadata explains, audits, and later improves labels.
```

### 1.4 This is a baseline, not a final model

Exact weights and thresholds cannot be known from research alone. They depend on the actual value distribution returned by Music Story, AcousticBrainz, and any future providers. The values below are starting points only.

---

## 2. V1 Label Set

### 2.1 Core primitive labels

These are the labels this system should attempt to assign in V1:

#### Energy
- `low_energy`
- `high_energy`
- `very_high_energy`

#### Texture
- `sparse`
- `dense`
- `layered`

#### Tone
- `bright`
- `dark`

#### Rhythm
- `steady`
- `driving`
- `bouncy`
- `syncopated`

#### Content
- `vocal`
- `instrumental`
- `speech`

#### Force / Articulation
- `calm`
- `aggressive`
- `punchy`

Total core labels: 18

### 2.2 Internal-only midpoint states

These should exist internally but should not necessarily be stored as visible labels:

- `medium_energy`
- `balanced_density`

Reason: midpoint states are useful for scoring, but weak as semantic labels. They usually mean “not strongly one side or the other.”

### 2.3 Derived labels for later

These should not be V1 truth labels. They can be computed later from core labels and continuous scores:

- `uplifting`
- `melancholic`
- `tense`
- `atmospheric`

### 2.4 Deferred temporal labels

These should not be V1 track-level labels:

- `explosive`
- `evolving`
- `repetitive`
- `dynamic_rhythm`
- `chaotic`

Reason: these require time-based analysis or section-level evidence. Track-level lookup descriptors are not enough.

---

## 3. Normalized Feature Layer

The system should normalize all provider data into a common internal feature object.

### 3.1 Core normalized features

Each song should have these normalized feature fields when available:

```json
{
  "energy_score": 0.0,
  "density_score": 0.0,
  "layered_score": 0.0,
  "brightness_score": 0.0,
  "darkness_score": 0.0,
  "pulse_score": 0.0,
  "rhythm_stability_score": 0.0,
  "offbeat_score": null,
  "syncopation_score": null,
  "vocal_score": 0.0,
  "speech_score": 0.0,
  "instrumental_score": 0.0,
  "harshness_score": 0.0,
  "punch_score": 0.0,
  "calm_score": 0.0,
  "low_end_score": 0.0,
  "acoustic_score": null,
  "valence_score": null
}
```

### 3.2 Why normalize first

Different providers expose different field names, scales, and meanings. A normalized internal layer lets AudioFile avoid being locked to one provider’s schema.

Example:

```text
Music Story arousal
AcousticBrainz high-level intensity
future provider energy/activity

all map into:

energy_score
```

---

## 4. Source Reliability Model

### 4.1 Source classes

| Source Type | Role | Starting Trust |
|---|---|---|
| Descriptor API | Primary label source | High |
| Open MIR descriptor source | Primary/secondary label source | Medium-high |
| Metadata / tags | Correlation and fallback support | Medium |
| LLM inference | Weak fallback only | Low |
| User labels | Separate authority channel | High for that user, not global truth |

### 4.2 Source priority

When evidence conflicts:

```text
descriptor evidence > metadata evidence > LLM inference
```

User labels should not be mixed into the global descriptor score as ordinary metadata. They should be stored separately and later used for personalization, correction analysis, or optional user-specific model tuning.

---

## 5. Feature Normalization Rules

These rules assume provider values can be transformed into 0–1 scores. If a provider already returns 0–1, keep the value but still store provider provenance.

### 5.1 Direct 0–1 values

Use directly after validating direction:

```text
normalized_value = provider_value
```

Examples:
- arousal
- intensity
- valence
- pulse_clarity
- rhythmic_stability
- vocal_instrumental
- music_speech
- electric_acoustic

### 5.2 Inverted values

Some provider fields may run opposite to the desired AudioFile score.

Example:

```text
Music Story vocal_instrumental:
high = instrumental
low = vocal
```

So:

```text
vocal_score = 1 - vocal_instrumental
instrumental_score = vocal_instrumental
```

### 5.3 Loudness normalization

If loudness is in LUFS or dB, do not use raw values directly. Use clipping and scaling.

Suggested starting transform:

```text
loudness_score = clamp((LUFS + 30) / 24, 0, 1)
```

Interpretation:
- -30 LUFS or lower → 0
- -6 LUFS or louder → 1

This is not final. It must be calibrated against real provider outputs.

### 5.4 Tempo normalization

Tempo should not be treated as “energy” by itself. Use tempo only as a weak rhythm/activation support.

Suggested transform:

```text
tempo_activation = clamp((BPM - 70) / 90, 0, 1)
```

Interpretation:
- below 70 BPM → low activation support
- 160 BPM or above → high activation support

Tempo should never dominate `energy_score`.

### 5.5 Missing values

If a feature is missing:

```text
do not impute silently
```

Instead store:

```json
{
  "value": null,
  "available": false,
  "source": null
}
```

The confidence system should reduce confidence when important signals are missing.

---

## 6. Normalized Score Formulas

These are initial formulas for the first test run. They should be treated as heuristic baselines.

### 6.1 Energy score

Purpose: General activation, not a primitive musical truth.

Initial formula:

```text
energy_score =
  0.40 * arousal
+ 0.25 * intensity
+ 0.15 * loudness_score
+ 0.10 * event_density
+ 0.10 * pulse_clarity
```

Fallback if arousal is missing:

```text
energy_score =
  0.35 * intensity
+ 0.25 * loudness_score
+ 0.20 * event_density
+ 0.20 * pulse_clarity
```

Justification:
Energy is composite. It should be derived from activation, loudness, density, and rhythm support rather than treated as one atomic field.

### 6.2 Density score

Purpose: How occupied or full the arrangement is.

Initial formula:

```text
density_score =
  0.40 * event_density
+ 0.25 * spectral_complexity
+ 0.20 * timbral_complexity
+ 0.15 * loudness_range
```

Fallback if complexity features are missing:

```text
density_score =
  0.60 * event_density
+ 0.25 * intensity
+ 0.15 * loudness_range
```

Justification:
Density should not mean loudness. A track can be loud and sparse, or quiet and dense.

### 6.3 Layered score

Purpose: Multiple distinct simultaneous musical roles.

Initial formula:

```text
layered_score =
  0.35 * timbral_complexity
+ 0.25 * instrumentation_diversity
+ 0.20 * spectral_complexity
+ 0.20 * density_score
```

If explicit layer/source data exists:

```text
layered_score =
  0.50 * explicit_layer_count_score
+ 0.20 * timbral_complexity
+ 0.15 * instrumentation_diversity
+ 0.15 * density_score
```

Justification:
Layered is not the same as dense. Dense means high occupancy. Layered means distinguishable roles.

### 6.4 Brightness score

Purpose: High-frequency / treble-forward sonic color.

Initial formula:

```text
brightness_score =
  0.55 * spectral_centroid_or_brightness
+ 0.20 * spectral_rolloff
+ 0.15 * flatness
+ 0.10 * valence
```

If no timbral descriptors exist, do not infer high-confidence brightness from valence alone.

Justification:
Bright is primarily timbral. Valence may correlate, but it is weak support only.

### 6.5 Darkness score

Purpose: Low-frequency / low-register / subdued sonic color.

Initial formula:

```text
darkness_score =
  0.40 * low_end_score
+ 0.25 * (1 - brightness_score)
+ 0.20 * low_valence_score
+ 0.15 * acoustic_or_warmth_proxy
```

Where:

```text
low_valence_score = 1 - valence
```

Justification:
Dark should not merely mean sad. It should be anchored to low-frequency emphasis and lower brightness.

### 6.6 Pulse score

Purpose: How clearly the track supports beat-tracking or tapping along.

Initial formula:

```text
pulse_score =
  0.65 * pulse_clarity
+ 0.35 * rhythmic_stability
```

Fallback if one is missing:

```text
pulse_score = available value
```

### 6.7 Driving score

Purpose: Forward rhythmic momentum.

Initial formula:

```text
driving_score =
  0.35 * pulse_score
+ 0.25 * energy_score
+ 0.20 * event_density
+ 0.20 * low_end_score
```

Justification:
Driving requires pulse + energy. A high-energy but rhythmically unstable track should not automatically be driving.

### 6.8 Bouncy score

Purpose: Buoyant, off-beat or springy rhythmic movement.

Initial formula:

```text
bouncy_score =
  0.35 * offbeat_score
+ 0.25 * pulse_score
+ 0.20 * valence
+ 0.20 * moderate_energy_score
```

Where:

```text
moderate_energy_score = 1 - abs(energy_score - 0.55) / 0.55
```

Fallback if no offbeat/syncopation proxy exists:

```text
bouncy_score = low-confidence estimate from danceability + valence + pulse_score
```

Justification:
Bouncy is difficult without rhythmic accent data. It should be confidence-gated.

### 6.9 Syncopation score

Purpose: Accents displaced from expected strong beats.

Initial formula:

```text
syncopation_score =
  0.60 * provider_syncopation_or_rhythm_complexity
+ 0.20 * (1 - rhythmic_stability)
+ 0.20 * pulse_score
```

Important gate:

```text
if pulse_score < 0.45:
  syncopation_score confidence should be low
```

Justification:
Syncopation requires a pulse. If there is no clear beat, the system cannot confidently call something syncopated.

### 6.10 Vocal / instrumental / speech scores

Initial formulas:

```text
vocal_score = 1 - vocal_instrumental
instrumental_score = vocal_instrumental
speech_score = music_speech
```

Conflict rule:

```text
if speech_score >= 0.70:
  vocal label may still exist, but musical vocal confidence should be reduced
```

Justification:
Speech is a special type of vocal content, but for product filtering it deserves a separate label.

### 6.11 Aggressive score

Purpose: High activation plus harshness/roughness/force.

Initial formula:

```text
aggressive_score =
  0.35 * energy_score
+ 0.25 * harshness_score
+ 0.15 * dissonance
+ 0.15 * flatness
+ 0.10 * low_valence_score
```

Contradiction suppression:

```text
if calm_score > 0.70:
  reduce aggressive confidence
```

Justification:
Aggressive should not mean merely energetic. It needs harshness, roughness, dissonance, low-valence force, or similar evidence.

### 6.12 Punch score

Purpose: Repeated transient impact.

Initial formula:

```text
punch_score =
  0.45 * transient_strength
+ 0.25 * articulation
+ 0.15 * event_density
+ 0.15 * low_end_score
```

Fallback if transient_strength is missing:

```text
punch_score =
  0.35 * articulation
+ 0.25 * event_density
+ 0.20 * pulse_score
+ 0.20 * low_end_score
```

But confidence must be reduced.

Justification:
Punch requires onset/transient evidence. Without it, the score is speculative.

### 6.13 Calm score

Purpose: Low urgency, low activation, low harshness.

Initial formula:

```text
calm_score =
  0.35 * (1 - energy_score)
+ 0.25 * (1 - event_density)
+ 0.20 * (1 - articulation)
+ 0.20 * (1 - harshness_score)
```

Contradiction suppression:

```text
if aggressive_score > 0.65 or punch_score > 0.75:
  reduce calm confidence
```

Justification:
Calm is not just low energy. A low-energy track can still be tense, harsh, or dark. Calm requires low urgency and low attack/harshness.

---

## 7. Label Thresholds

These thresholds are intentionally conservative.

### 7.1 Ordered energy labels

```text
if energy_score < 0.35:
  low_energy

if energy_score >= 0.65 and energy_score < 0.82:
  high_energy

if energy_score >= 0.82:
  very_high_energy
```

Internal only:

```text
0.35 <= energy_score < 0.65:
  medium_energy_internal
```

### 7.2 Binary / multi-label thresholds

Starting threshold:

```text
label applies if label_score >= 0.68 and confidence >= 0.55
```

For weaker labels:

```text
bouncy, syncopated, layered, punchy:
  label applies if score >= 0.72 and confidence >= 0.60
```

For direct content labels:

```text
vocal: vocal_score >= 0.65
instrumental: instrumental_score >= 0.70
speech: speech_score >= 0.70
```

### 7.3 Mutual exclusion and coexistence

Not all labels are mutually exclusive.

Allowed combinations:
- `high_energy` + `bright`
- `dense` + `layered`
- `vocal` + `punchy`
- `dark` + `calm`
- `high_energy` + `aggressive`

Potential conflict pairs:
- `low_energy` vs `very_high_energy`
- `vocal` vs `instrumental`
- `calm` vs `aggressive`
- `bright` vs `dark`

Conflict pairs should not always hard-exclude each other. They should reduce confidence when both are strongly predicted.

Example:

```text
if bright_score >= 0.70 and dark_score >= 0.70:
  emit neither at high confidence
  mark conflict = "tone_conflict"
```

---

## 8. Confidence System

### 8.1 Label confidence formula

Each label should have:

```json
{
  "labelId": "high_energy",
  "score": 0.82,
  "confidence": 0.76,
  "sources": ["music_story"],
  "evidence": ["arousal", "intensity", "event_density"],
  "conflicts": []
}
```

Suggested confidence formula:

```text
confidence =
  0.45 * source_reliability
+ 0.25 * feature_coverage
+ 0.20 * evidence_strength
+ 0.10 * agreement_score
```

### 8.2 Source reliability

```text
Music Story descriptor = 0.90
AcousticBrainz descriptor = 0.75
metadata / tags = 0.45
LLM fallback = 0.30
user label = separate authority, not merged globally
```

### 8.3 Feature coverage

```text
feature_coverage = available_required_features / total_required_features
```

Example:

For `high_energy`, required features:
- arousal
- intensity
- loudness
- event_density
- pulse_clarity

If 4/5 exist:

```text
feature_coverage = 0.80
```

### 8.4 Evidence strength

```text
evidence_strength = abs(score - threshold) scaled to 0–1
```

Labels barely above threshold should be lower confidence than labels far above threshold.

### 8.5 Agreement score

Agreement measures whether multiple sources point in the same direction.

```text
agreement_score = 1.0 when descriptor + metadata + fallback agree
agreement_score = 0.5 when only one source exists
agreement_score = 0.0 when sources directly conflict
```

### 8.6 Confidence bands

```text
0.80–1.00 = high confidence
0.60–0.79 = medium confidence
0.40–0.59 = low confidence
< 0.40 = do not emit unless needed for fallback analysis
```

---

## 9. Data Object Design

### 9.1 Song intelligence object

Each processed song should produce this object:

```json
{
  "songIdentity": {
    "title": "...",
    "artist": "...",
    "mbid": "...",
    "isrc": "...",
    "providerIds": {
      "spotify": "...",
      "apple_music": "..."
    }
  },
  "rawSources": {
    "musicStory": {},
    "acousticBrainz": {},
    "musicBrainz": {},
    "metadata": {},
    "llm": {}
  },
  "normalizedFeatures": {},
  "aiLabels": [],
  "derivedLabels": [],
  "humanLabels": [],
  "analysis": {
    "missingFeatures": [],
    "conflicts": [],
    "sourceCoverage": {},
    "modelVersion": "audiofile-label-mapper-v0.1",
    "ontologyVersion": "audiofile-ontology-v0.1"
  }
}
```

### 9.2 Store raw and normalized data separately

Raw source data should be preserved for audit and future remapping.

```text
raw vendor fields ≠ normalized feature fields ≠ final labels
```

This is important because the ontology and mapping will change.

---

## 10. First Test Plan

### 10.1 Do not start with 2,000 songs

Start with 200–500 songs first.

Reason:
If the mapping logic is broken, 2,000 bad outputs create analysis noise. A smaller batch lets you inspect patterns quickly.

Recommended phases:

```text
Phase A: 100 songs, manual inspection
Phase B: 500 songs, distribution analysis
Phase C: 2,000+ songs, large-scale correlation and calibration
```

### 10.2 Song selection for first run

Choose songs with:
- strong identity match
- Music Story descriptor coverage
- AcousticBrainz descriptor coverage if available
- genre/metadata available
- diverse styles

Avoid first:
- live recordings
- remasters with unclear identity
- podcasts/spoken-word
- extremely experimental music
- tracks with poor metadata

### 10.3 What to inspect manually

For each label:
- Are scores distributed normally or clustered?
- Are too many songs getting the label?
- Are too few songs getting the label?
- Are obvious songs missed?
- Are contradictory labels emitted together?
- Are descriptor-backed labels more coherent than metadata-backed labels?

### 10.4 Minimum useful metrics

For the first dataset, calculate:

```text
label_frequency
average_label_confidence
missing_feature_rate_by_label
conflict_rate_by_label
source_coverage_by_song
descriptor_vs_metadata_agreement
label_cooccurrence_matrix
```

### 10.5 Calibration questions

For each label, answer:

```text
What features are strongest among songs that receive this label?
What features are weak or missing?
Which labels overlap too often?
Which labels almost never appear?
Which labels appear on obviously wrong songs?
Which features need new weights?
```

---

## 11. Label-by-Label Baseline Mapping Table

| Label | Primary Score | Main Signals | Starting Threshold | Confidence Risk |
|---|---:|---|---:|---|
| low_energy | energy_score inverted | arousal, intensity, event_density, loudness | energy < 0.35 | Low |
| high_energy | energy_score | arousal, intensity, loudness, event_density | 0.65 | Low |
| very_high_energy | energy_score | arousal, intensity, event_density, pulse | 0.82 | Medium |
| sparse | inverse density_score | event_density, spectral complexity, timbral complexity | density < 0.35 | Low |
| dense | density_score | event_density, spectral complexity, timbral complexity | 0.68 | Low |
| layered | layered_score | timbral complexity, instrumentation diversity, layer count | 0.72 | Medium-high |
| bright | brightness_score | spectral centroid, rolloff, brightness | 0.68 | Medium |
| dark | darkness_score | low end, inverse brightness, low valence | 0.68 | Medium |
| steady | pulse_score | pulse clarity, rhythmic stability | 0.70 | Low |
| driving | driving_score | pulse, energy, event density, low end | 0.70 | Medium |
| bouncy | bouncy_score | offbeat, pulse, valence, moderate energy | 0.72 | High |
| syncopated | syncopation_score | syncopation/rhythm complexity, pulse, stability | 0.72 | High |
| vocal | vocal_score | vocal_instrumental inverted | 0.65 | Low |
| instrumental | instrumental_score | vocal_instrumental | 0.70 | Low |
| speech | speech_score | music_speech | 0.70 | Medium |
| calm | calm_score | low energy, low event density, low harshness | 0.68 | Medium |
| aggressive | aggressive_score | energy, harshness, dissonance, flatness | 0.70 | Medium |
| punchy | punch_score | transient strength, articulation, low end | 0.72 | High |

---

## 12. What This System Cannot Know Yet

This system cannot reliably infer:

- structural events like drops, build-ups, explosive moments
- evolving vs repetitive structure
- user-specific meaning
- quality or taste
- cultural role of a song
- whether a song is “good”
- exact instrumentation unless provider or metadata supports it

These should be explicitly excluded from V1 truth labels.

---

## 13. Implementation Guidance

### 13.1 Build as config, not hard-coded logic

The mapping should live in a config file:

```text
labelMappingConfig.v0.1.json
```

or:

```text
labelMappingConfig.v0.1.ts
```

Reason:
Weights and thresholds will change after calibration.

### 13.2 Keep versioning explicit

Every label result should store:

```json
{
  "ontologyVersion": "audiofile-ontology-v0.1",
  "mappingVersion": "descriptor-mapper-v0.1",
  "providerSnapshotDate": "YYYY-MM-DD"
}
```

### 13.3 No silent label changes

If a threshold changes, bump the mapping version.

### 13.4 Human labels stay separate

Do not overwrite user labels with AI labels. Suggested structure:

```json
{
  "visibleUserLabels": [],
  "hiddenAiLabels": [],
  "userAcceptedAiLabels": [],
  "userRejectedAiLabels": []
}
```

---

## 14. Recommended Immediate Next Step

Build a small offline prototype that:

1. Accepts one song descriptor object
2. Normalizes features
3. Computes label scores
4. Emits labels + confidence
5. Writes full debug output
6. Runs over 100–500 songs
7. Produces summary statistics

Do not integrate directly into the product UI until the mapper has been tested offline.

---

## 15. Open Questions for Calibration

These cannot be answered responsibly without real descriptor distributions:

1. What is the actual value range of Music Story arousal, intensity, and event_density for common tracks?
2. Does Music Story brightness or timbral data separate `bright` and `dark` well enough?
3. Does AcousticBrainz coverage add enough value to justify V1 integration effort?
4. Are `bouncy` and `syncopated` too hard to infer without explicit rhythm features?
5. Is `layered` reliable enough, or should it become a derived/secondary label?
6. Should `medium_energy` remain internal only?
7. Does `calm` overlap too much with `low_energy`?
8. Does `aggressive` require a genre/metadata fallback in sparse descriptor cases?
9. Should `punchy` be withheld unless transient/articulation features exist?
10. What confidence threshold feels safe for automatic hidden AI labels vs visible suggestions?

---

## 16. Final Recommendation

The system is ready for a first test version, but not a production lock.

The safest path is:

```text
Descriptor-first baseline
→ small test set
→ inspect distributions
→ adjust weights and thresholds
→ larger 2,000+ song run
→ refine label list and confidence model
```

Do not attempt to perfect the mapping before running data. The correct next milestone is not “final ontology.” It is:

```text
first runnable descriptor-to-label mapper with full debug trace
```

That is the point where AudioFile AI becomes measurable.
