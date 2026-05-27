# AudioFile AI — Semantic Composition Specification v0.1

**Version:** v0.1.1  
**Status:** Initial Operational Specification — Pending Review  
**Date:** May 2026  
**Depends On:** AudioFile_AI_Ontology_Framework_v0.1.3.md (frozen)

---

## 1. Purpose and Scope

This document defines how the AudioFile AI semantic inference system operationally generates expressive labels from Music Story descriptor data in V1.

**Alignment note (2026-05):** Closure experiments indicate several dimensions are partially coupled due to shared descriptor ancestry and compressed latent structure. This spec should be read as a conservative semantic projection contract over a bounded representation space, not as a claim of independent semantic axes.

It is the implementation contract for the semantic composition layer. It answers: *"Exactly how does the system translate descriptor data into semantic label suggestions?"*

**This document does not:**
- Redesign the ontology architecture (see Ontology Framework v0.1.3)
- Define dynamicity or temporal inference (deferred — see Dynamicity Modeling Plan)
- Define genre conditioning in detail (future work)
- Define recommendation, retrieval, or embedding systems
- Implement playback, streaming, or any AudioFile app feature

**V1 priorities, in order:**
1. Interpretability — outputs must be explainable
2. Reliability — outputs must be consistent for the same input
3. Semantic stability — label meanings must not drift across runs
4. Detectability — labels should only fire when evidence is strong
5. Trustworthiness — uncertainty is surfaced, not hidden

Maximum label coverage is not a goal. A song with three high-confidence labels is better than a song with ten uncertain ones.

---

## 2. V1 Operational Philosophy

### Dimensions First, Labels Second

The system does not predict labels from descriptors directly. It constructs dimension scores, then derives labels from dimension combinations. Implementations that shortcut this pipeline violate the architecture.

### Directional Weights, Not Final Formulas

Exact dimension weights are directional in this specification and should be treated as starting points for calibration, not hard-coded constants. Where this document says "higher weight," it means that descriptor should dominate the score. Final weights must be validated against the representative track set.

**Stabilization note (2026-05):** Major Music Story-only descriptor calibration and representation diagnostics are considered sufficient to proceed beyond calibration-heavy experimentation. Future emphasis is expected to shift toward semantic projection quality, retrieval usefulness, and explainability rather than repeated descriptor retuning loops.

### Prefer Conservative Firing

When in doubt, do not fire a label. V1 should err toward silence rather than noise. The system should be calibrated such that when a label fires, it is almost certainly correct, even if some valid labels are missed. Precision over recall in V1.

### Acknowledge Correlation in Descriptor Selection

Several descriptors are strongly correlated with each other and likely carry redundant information. Including both correlated descriptors in the same dimension formula inflates confidence artificially. This spec explicitly notes where redundancy is present and specifies which descriptor should take precedence to avoid double-counting.

### Missing Data Behavior

Missing descriptors reduce dimension confidence proportionally. They do not substitute a neutral score of 0.5. A song with missing primary descriptors should receive lower confidence on all labels that depend on those dimensions, potentially suppressing those labels entirely. See Section 5 for detail.

---

## 3. V1 Dimension Definitions

Seven dimensions are active in V1. Five are perceptual/measurable; two are pass-through or closely grounded. Latent semantic dimensions (tension, aggression, emotional intensity) are out of scope for V1 computation.

---

### 3.1 energy_score

**Semantic meaning:** Overall sonic activation, intensity, and kinetic force. Captures the degree to which a song feels loud, intense, and physically activating. Note: this captures kinetic energy primarily. Built/emergent energy requires temporal modeling and is not captured here.

**Primary descriptors:**
- `arousal` — strongest single predictor of energy; use as primary anchor
- `loudness` — highly correlated with arousal (r=0.74); strong secondary
- `intensity` — highly correlated with loudness (r=0.89); treat as partially redundant with loudness

**Descriptor redundancy note:** `loudness` and `absolute_loudness` correlate at r=0.97. Use `loudness` only; drop `absolute_loudness` to avoid double-counting. `intensity` and `loudness` correlate at r=0.89 — treat intensity as a secondary contributor, not a fully independent signal.

**Secondary descriptors:**
- `mfcc01` — correlated with arousal (r=0.85) and loudness (r=0.80); useful as a supplementary check when arousal is missing

**Directional weighting:** arousal (high) > loudness (medium) > intensity (low, partial redundancy penalty) > mfcc01 (backup only)

**Confidence behavior:**
- High confidence: arousal present + loudness present
- Medium confidence: arousal present, loudness missing (or vice versa)
- Low confidence: only mfcc01 available as proxy
- No energy label firing: all primary and secondary descriptors missing

**Known weakness:** Averaging across song sections means a song with one enormous drop and quiet verses may score identically to a consistently medium-energy song. This is a V1 limitation, not a bug to be fixed here.

---

### 3.2 pulse_score

**Semantic meaning:** Strength and clarity of the rhythmic anchor — the degree to which a song has a clear, persistent, driving beat that carries the listener. High pulse = the rhythmic engine is running strong and obvious. Low pulse = rhythmically loose, complex, or arrhythmic.

**Primary descriptors:**
- `pulse_clarity` — the most direct available signal; use as primary anchor
- `rhythmic_stability` — correlated with pulse_clarity (r=0.59); secondary contributor

**Secondary descriptors:**
- `danceability` — moderately correlated with pulse_clarity (r=0.45) and rhythmic_stability (r=0.66); useful contributor but partially redundant with rhythmic_stability
- `articulation` — correlated with rhythmic_stability (r=0.79); treat as partially redundant

**Redundancy note:** `pulse_clarity`, `rhythmic_stability`, `danceability`, and `articulation` all share rhythmic ancestry. Including all four at equal weight would substantially inflate pulse confidence. Recommended approach: weight pulse_clarity heavily, let rhythmic_stability serve as a secondary check, and use danceability and articulation as minor modifiers only.

**Complexity as inverse signal:** `pulse_clarity` and `complexity` are strongly negatively correlated (r=-0.84). High complexity is consistent with low pulse. Complexity can serve as a soft confidence reducer — when complexity is very high and pulse_clarity is missing, this provides weak evidence against high pulse labels. Do not use this as a hard inversion; treat it as a mild supplementary signal.

**Directional weighting:** pulse_clarity (high) > rhythmic_stability (medium) > danceability (low) ≈ articulation (low)

**Confidence behavior:**
- High confidence: pulse_clarity present
- Medium confidence: pulse_clarity missing, rhythmic_stability + danceability present
- Low confidence: only articulation available
- No pulse label firing: all primary descriptors missing

---

### 3.3 brightness_score

**Semantic meaning:** Spectral brightness — degree of treble energy, spectral sharpness, and high-frequency content. Used internally to support label generation (e.g., `heavy` requires low brightness; `airy` requires high brightness). Not surfaced directly as a user-facing label in V1 due to semantic ambiguity of "bright" as a descriptor.

**Primary descriptors:**
- `brightness` — direct field; primary
- `roll_off` — correlates with brightness at r=0.90; treat as co-primary

**Redundancy note:** `centroid`, `spread`, `flatness`, and `zero_cross_rate` form a tightly correlated spectral cluster (centroid/flatness r=0.95; spread/flatness r=0.95; centroid/spread r=0.88; brightness/zero_cross_rate r=0.84). Do not include all of these — massive redundancy. Use `brightness` and `roll_off` as the two primary inputs. `centroid` as a single backup if both are missing.

**Directional weighting:** brightness (high) ≈ roll_off (high) > centroid (backup)

**Confidence behavior:**
- High confidence: brightness + roll_off both present
- Medium confidence: one of the two present
- Low confidence: only centroid available
- Internal use only — does not directly fire user labels but gates `heavy` and `airy`

---

### 3.4 density_score

**Semantic meaning:** Perceptual fullness — the degree to which the sonic space feels occupied. Dense songs leave few gaps; sparse songs have room and air. This is explicitly about fullness, not about complexity alone.

**Primary descriptors:**
- `event_density` — directly measures event count; primary

**Secondary descriptors:**
- `intensity` — moderately correlated with event_density (r=0.40); reflects energy weight of the content
- `complexity` — weakly correlated with event_density (r=0.19); some relationship but they capture different things

**Acknowledged limitation:** The current descriptor set does not cleanly capture the "fullness" concept. `event_density` captures event rate; `complexity` captures rhythmic complexity; `intensity` captures loudness weight. A song can be rhythmically simple but sonically full (e.g., a heavy sine bass tone with nothing else). Treat density_score results with medium confidence and avoid over-relying on this dimension for label generation in V1.

**Directional weighting:** event_density (high) > intensity (medium) > complexity (low)

**Confidence behavior:**
- Medium confidence maximum (even with all descriptors present) due to known conceptual limitations
- High-density label firing requires additional corroboration from other dimensions (e.g., energy or brightness)

---

### 3.5 vocal_presence_score

**Semantic meaning:** Degree to which vocals are present and prominent in the mix. High score = strong vocal content. Low score = instrumental.

**Critical inversion notice:** The Music Story `vocal_instrumental` field is **inverted** relative to naive interpretation. Empirical validation against representative tracks confirms:
- `vocal_instrumental` near 0 = vocal content present (e.g., Backstreet Boys, Billy Joel → scores ~0.002–0.018)
- `vocal_instrumental` near 1 = instrumental content (e.g., Daft Punk Veridis Quo, classical → scores ~0.58–0.61)

**Correction required:** `vocal_presence_score = 1 - vocal_instrumental_raw`

This inversion must be applied before any downstream use of this dimension.

**Primary descriptor:**
- `vocal_instrumental` (inverted) — primary, after correction

**Secondary descriptor:**
- `music_speech` — weakly negatively correlated with vocal_instrumental (r=-0.11); near-independent signal. High music_speech = song is primarily speech/spoken content, not musical vocals. Can serve as a supplementary signal to distinguish "vocal music" from "speech track" when combined with corrected vocal score.

**Directional weighting:** corrected vocal_instrumental (high) > music_speech (low, secondary role)

**Confidence behavior:**
- Medium confidence: inversion correction introduces uncertainty; treat as partial until further validation
- If vocal_presence_score_corrected > 0.65: high vocal evidence
- If vocal_presence_score_corrected < 0.35: high instrumental evidence
- Middle range (0.35–0.65): low confidence, suppress vocal/instrumental labels

---

### 3.6 valence

**Semantic meaning:** Emotional positivity — the degree to which the song sounds positive, happy, or upbeat versus negative, sad, or somber.

**Source:** Direct pass-through from Music Story `valence` field. No composite construction needed.

**Note:** `dissonance` and `valence` are nearly uncorrelated (r=0.07), confirming these are separate dimensions. A dissonant song is not necessarily negative in valence, and vice versa. Do not attempt to derive valence from dissonance.

**Confidence behavior:**
- High confidence when `valence` field is present
- Missing: label firing that depends on valence is suppressed

---

### 3.7 punch_score

**Semantic meaning:** Transient sharpness — the degree to which individual hits, beats, or events feel sharp, impactful, and clearly articulated. High punch = events hit hard and cleanly. Low punch = events are soft, blended, or blurred.

**Primary descriptors:**
- `articulation` — most directly relevant; high articulation = clean, separated events
- `loudness_range` — captures dynamic contrast between loud events and surrounding space

**Descriptor note:** `articulation` correlates with `rhythmic_stability` (r=0.79), meaning highly articulated tracks are often rhythmically stable. This creates overlap with pulse_score. Punch is distinct from pulse — a track can have high pulse without extremely punchy transients (e.g., a steady groovy track). Keep these dimensions separate.

**Confidence behavior:**
- Lower confidence overall; V1 treats punch_score as a supporting dimension rather than a primary label driver
- Missing loudness_range reduces confidence substantially

---

## 4. Descriptor Normalization Rules

### 4.1 Scaling

All Music Story descriptor values should be normalized to a 0–1 range before dimension construction. Most Music Story numeric fields already return values in this range; verify this assumption and apply min-max normalization if needed.

`loudness` and `loudness_range` may be returned in dBFS or similar log-scaled format. These require separate handling — apply logarithmic normalization appropriate to the field before combining with linear descriptors.

### 4.2 Known Inversions

Apply before any dimension construction:

| Raw Field | Correction | Reason |
|---|---|---|
| `vocal_instrumental` | `1 - value` | Empirically confirmed: raw high = instrumental, raw low = vocal |

No other inversions are confirmed in V1. Do not apply speculative inversions.

### 4.3 Missing Data Handling

**Do not substitute 0.5 for missing values.** Missing data is not neutral data.

When a descriptor is missing:
- Mark it as absent in the dimension confidence computation
- Reduce dimension confidence proportionally to the weight of the missing descriptor
- If the primary descriptor for a dimension is missing, dimension confidence should not exceed 0.50 regardless of secondary descriptors

If a dimension's confidence falls below 0.40 due to missing data, that dimension should not contribute to label generation.

### 4.4 Correlated Descriptor Policy

Where descriptors are highly correlated (r > 0.85) and one is nominated as primary, the secondary should receive a substantially reduced weight (roughly 20–30% of primary weight) to avoid double-counting. The goal is not to exclude correlated descriptors entirely — they provide useful confirmation — but to prevent correlated signals from additively inflating confidence as if they were independent evidence.

---

## 5. Dimension Confidence Logic

Each dimension produces a score (0–1) and a confidence value (0–1). These are separate quantities.

**Dimension confidence** reflects how well the descriptor evidence supports the score, not the score value itself. A song can have a reliable low energy score (high confidence in a low value) just as it can have a reliable high energy score.

### Confidence Levels

| Level | Value Range | Meaning |
|---|---|---|
| High | 0.80–1.00 | Primary descriptors present, evidence strong |
| Medium | 0.50–0.79 | Primary or key secondary descriptors present |
| Low | 0.30–0.49 | Only minor/backup descriptors available |
| Insufficient | < 0.30 | Dimension should not contribute to label generation |

### Confidence Deductions

Apply these deductions cumulatively:

- Primary descriptor missing: −0.35
- Secondary descriptor missing (each): −0.10 to −0.15 depending on weight
- Using a backup-only descriptor: −0.25
- Dimension is latent semantic type (not applicable to V1 dimensions, but rule for future): −0.20 on top of above

### Dimension-Specific Floors

- `density_score` maximum confidence: 0.70 (acknowledged conceptual limitations)
- `vocal_presence_score` maximum confidence: 0.75 (limited validation coverage after inversion correction)
- `punch_score` maximum confidence: 0.70 (supporting dimension only)

---

## 6. Composition Rule Structure

Each expressive label has a composition profile consisting of:

- **Required dimensions:** dimension(s) that must meet a minimum score for the label to fire
- **Boosters:** dimensions that increase composition confidence when elevated
- **Contradictions:** dimensions that apply a confidence penalty when elevated
- **Hard suppressions:** dimension conditions that prevent the label from firing entirely
- **Minimum composition confidence:** threshold below which the label does not surface

Composition confidence is assembled as follows:

1. Start with the base confidence derived from required dimensions being met
2. Apply booster bonuses (+0.05 to +0.15 per booster, depending on strength)
3. Apply contradiction penalties (−0.10 to −0.30 depending on severity)
4. Multiply by the average dimension confidence across required dimensions
5. Result is the composition confidence; if below threshold, label does not fire

This is a directional formula. Final implementation may use different math as long as the signal directionality is preserved and confidence propagation is honest.

---

## 7. Expressive Label Specifications

These are the V1 labels with operational composition rules. Labels marked **(lower confidence)** should be surfaced more conservatively and may benefit from additional human review in early deployment.

---

### 7.1 driving

**Semantic definition:** The song has a strong, clear rhythmic engine that propels forward motion. The listener is pulled along. Rhythmically grounded and energetically sustained.

**Required dimensions:**
- `pulse_score` ≥ 0.65
- `energy_score` ≥ 0.55

**Boosters:**
- `rhythmic_stability` high: +0.10
- Positive/neutral `valence` (≥ 0.40): +0.05
- High `articulation`: +0.05

**Contradictions:**
- `pulse_score` < 0.35: **hard suppress** (label cannot fire)
- `energy_score` < 0.35: −0.20

**Overlap tolerance:** Can co-occur with `bouncy`, `steady`, `energetic`. Avoid forcing mutual exclusion.

**Validation expectation:** Should fire on FISHER - It's A Killa, Dom Dolla - Take It, MK - Rhyme Dust, Kylie Minogue - Can't Get You Out of My Head. Should not fire on Camille Saint-Saëns, Tchaikovsky.

**Genre sensitivity note:** Driving in house vs. driving in hip-hop feel different. V1 will not distinguish these — accept this limitation and note it in outputs.

---

### 7.2 bouncy

**Semantic definition:** Light, rhythmically playful quality. The song feels springy and upbeat, with a pulse that has lift rather than weight.

**Required dimensions:**
- `pulse_score` ≥ 0.60
- `energy_score` ≥ 0.40

**Boosters:**
- Positive `valence` (≥ 0.55): +0.10
- Moderate-to-high `brightness_score` (≥ 0.45): +0.08
- High `articulation`: +0.05

**Contradictions:**
- Low `valence` (< 0.30): −0.15
- Low `brightness_score` (< 0.30): −0.10 (low brightness reduces lightness quality)
- `pulse_score` < 0.35: **hard suppress**

**Distinguishing from driving:** Bouncy does not require high energy (threshold is lower). Bouncy is weighted toward positivity and brightness. A song can be both driving and bouncy if it has high pulse and moderate-to-high energy with brightness.

**Validation expectation:** Should fire on Gorillaz - Clint Eastwood Remix, Dom Dolla - Take It, FISHER tracks. Should not fire on dark/low-valence tracks.

---

### 7.3 steady (rhythmically steady)

**Semantic definition:** The song has a consistent and stable rhythmic foundation. The beat holds its pattern without significant rhythmic disruption. This label describes *rhythm-level steadiness only* — it does not claim the song has no structural changes in energy or arrangement over time. That would require temporal modeling not available in V1.

**Required dimensions:**
- `pulse_score` ≥ 0.55
- `rhythmic_stability` ≥ 0.60 (where available)
- `energy_score` in range 0.30–0.75 (proxy guard — very high energy reduces likelihood of perceived steadiness)

**Boosters:**
- Low `complexity`: +0.08
- High `rhythmic_stability`: +0.10

**Contradictions:**
- Very high energy (> 0.80): −0.15 (very high energy songs tend to feel more explosive than steady)
- `pulse_score` < 0.40: −0.20

**Overlap tolerance:** Can co-occur with `driving`, `bouncy`, `hypnotic`.

---

### 7.4 hypnotic

**Semantic definition:** The song induces a loop-like, absorbed listening state. Rhythmically anchored and repetitive, with moderate energy that avoids overwhelming the listener. The pattern draws you in rather than pushing you forward.

**Required dimensions:**
- `pulse_score` ≥ 0.65
- `energy_score` in range 0.30–0.72 (not too low, not overwhelming)
- Low `complexity` (proxy via low event_density or high rhythmic_stability)

**Boosters:**
- Very high `pulse_score` (> 0.80): +0.10
- Very high `rhythmic_stability`: +0.10
- Low `density_score` (< 0.40): +0.05 (spacious repetition feels more hypnotic)

**Contradictions:**
- `energy_score` > 0.80: −0.20 (very high energy breaks the trance quality)
- High `complexity`: −0.15
- `pulse_score` < 0.40: **hard suppress**

**Distinguishing from driving:** Hypnotic has a lower energy ceiling and is associated with repetition and loop-quality. Driving is more energetically forward-moving. A track can be both driving and hypnotic if it has high pulse, moderate energy, and low complexity.

**Validation expectation:** Should fire on Kylie Minogue - Can't Get You Out of My Head, Bob Sinclar - The Beat Goes On, some FISHER tracks. Should not fire on high-complexity or very high energy tracks.

---

### 7.5 energetic

**Semantic definition:** The song has high overall activation and intensity. A broad, high-confidence label for strongly energetic tracks.

**Required dimensions:**
- `energy_score` ≥ 0.75

**This label is intentionally broad and threshold-based.** It exists as a reliable, high-confidence label. No complex composition required.

**Boosters:**
- Very high `energy_score` (> 0.85): increases confidence
- High `pulse_score`: +0.05

**Contradictions:**
- `energy_score` < 0.65: **hard suppress**

**Validation expectation:** Should fire on Dimension - DJ Turn It Up (energy 0.92), Chase & Status - Liquor & Cigarettes (0.92), Diffrent - Back To The Sound (0.89). Should not fire on Camille Saint-Saëns (0.04), Tchaikovsky (0.08), Luther Vandross (0.15).

---

### 7.6 heavy

**Semantic definition:** Sonically weighty. The track has low spectral brightness and significant intensity or density, producing a physically pressing sensation. Not the same as dark (which requires low valence). Heavy is about sonic texture and mass.

**Required dimensions:**
- `brightness_score` ≤ 0.40
- `energy_score` ≥ 0.55

**Boosters:**
- High `density_score` (> 0.50): +0.10
- Low `valence` (< 0.40): +0.05 (often co-occurs but not required)
- Very low brightness (< 0.25): +0.10

**Contradictions:**
- `brightness_score` > 0.55: **hard suppress**
- `energy_score` < 0.40: −0.20 (heavy requires some energy; low energy + low brightness is just dark/somber)

**Genre sensitivity flag:** This label is highly genre-relative. A "heavy" electronic track and a "heavy" metal track are different experiences. V1 cannot distinguish these — the label should be treated as a directional signal and reviewed by users in ambiguous genre contexts.

**Confidence ceiling:** Maximum 0.75. Apply this cap. Heavy is meaningful but not stable across genres.

**Validation expectation:** Should fire on dark DnB tracks with low brightness. Should not fire on tracks like Daft Punk - One More Time (brightness 0.75, energy high — this is energetic and bright, not heavy).

---

### 7.7 punchy **(lower confidence)**

**Semantic definition:** Individual events — kicks, hits, notes — land with sharp, clean impact. The song feels crisp and hard-hitting on a transient level.

**Required dimensions:**
- `punch_score` ≥ 0.55 (driven by articulation and loudness_range)
- `energy_score` ≥ 0.45

**Boosters:**
- High `articulation`: +0.10
- High `loudness_range`: +0.08
- High `pulse_score`: +0.05

**Contradictions:**
- Low `articulation` (< 0.35): −0.20
- Low `energy_score` (< 0.30): −0.15

**V1 note:** This label is lower confidence. `punch_score` is built from weaker descriptor support than other dimensions. Surface with appropriate confidence representation and treat as supporting context rather than a primary label.

**Maximum composition confidence:** 0.70

---

### 7.8 floating / airy — DEFERRED FROM ACTIVE V1 INFERENCE

**Reason for deferral:**  
The current representative track set does not provide strong enough high-brightness / low-density validation examples for reliable calibration. Earlier candidate examples such as Daft Punk - Veridis Quo and AYYBO - RIZZ were found to be very low-brightness, not airy. Because this label depends on brightness, density, and energy behaving together correctly, it should not be actively surfaced until a better calibration set exists.

**Future candidate rule:**
- `brightness_score` ≥ 0.55
- `density_score` ≤ 0.45
- `energy_score` ≤ 0.60

**Status:** Supported conceptually. Not active in V1 surfacing.

---

### 7.9 vocal

**Semantic definition:** The song features prominent vocals as a central sonic element.

**Required dimensions:**
- `vocal_presence_score_corrected` ≥ 0.65
- (i.e., `vocal_instrumental_raw` ≤ 0.35)

**Boosters:**
- Low `music_speech` score (confirms musical vocal content vs. speech): +0.08
- `vocal_presence_score_corrected` > 0.80: +0.10

**Contradictions:**
- `vocal_presence_score_corrected` < 0.50: **hard suppress**

**Confidence note:** Apply the medium confidence ceiling (0.75) due to limited validation coverage after inversion correction. Monitor early outputs against known vocal tracks.

**Validation expectation:** Should fire on Backstreet Boys (raw vocal_instrumental 0.003 → corrected ~0.997), Billy Joel (raw 0.018 → corrected ~0.982), Four Tops (raw 0.028). Should NOT fire on Daft Punk - Veridis Quo (raw 0.607 → corrected ~0.393), classical tracks.

---

### 7.10 instrumental

**Semantic definition:** The song is primarily or entirely instrumental — no significant vocal content.

**Required dimensions:**
- `vocal_presence_score_corrected` ≤ 0.40
- (i.e., `vocal_instrumental_raw` ≥ 0.60)

**Boosters:**
- Very low corrected score (< 0.20): +0.10

**Contradictions:**
- `vocal_presence_score_corrected` > 0.50: **hard suppress**

**Relative confidence:** `instrumental` is slightly more reliable than `vocal` in V1 because the inversion means high raw values (what the system actually measures well) map to instrumental content.

**Validation expectation:** Should fire on Daft Punk - Veridis Quo (raw 0.607), AYYBO - RIZZ (raw 0.625), Camille Saint-Saëns, Tchaikovsky. Should NOT fire on Backstreet Boys, Billy Joel.

---

### 7.11 dense **(lower confidence)**

**Semantic definition:** The sonic space is full and occupied. Few gaps or empty moments. The mix is busy or heavy in arrangement.

**Required dimensions:**
- `density_score` ≥ 0.50

**Boosters:**
- Very high `density_score` (> 0.60): +0.10
- High `energy_score`: +0.05 (energetic tracks often feel denser)

**Contradictions:**
- `density_score` < 0.40: **hard suppress**
- Very low `event_density`: −0.15

**V1 note:** Density_score has acknowledged conceptual limitations. Surface with appropriate lower-confidence representation. Maximum composition confidence: 0.65.

**Validation expectation:** Should fire on Derrick May - Strings of Life (density 0.65), The Offspring - Self Esteem (0.65), Stevie Wonder - Superstition (0.60). Should not fire on MK - Rhyme Dust (0.17), Kylie Minogue - Can't Get You Out of My Head (0.23).

---

## 8. Contradiction and Penalty Logic

### Hard Suppressions

Hard suppressions prevent a label from firing regardless of other signals. These are listed per-label above. Implement as a gate: if hard suppression condition is met, label confidence = 0.

### Soft Penalties

Soft penalties reduce composition confidence but do not prevent firing. Apply cumulatively but cap total penalty impact at −0.40 (a composition that starts at 0.80 cannot be penalized below 0.40 by soft penalties alone — hard suppression handles extreme cases).

### Absence vs. Contradiction

This distinction is critical and must be implemented correctly:

- **Missing descriptor** → reduce dimension confidence (per Section 5 rules). Do NOT apply this as a contradiction penalty to the label.
- **Contradictory dimension score** (e.g., high brightness when `heavy` requires low brightness) → apply contradiction penalty.

A song with missing `brightness` data should not be penalized for `heavy` as if it has high brightness. It should simply have lower-confidence support for `heavy`, not an active contradiction.

### Bidirectional Suppression

Some label pairs are semantically incompatible at extreme values:

| Label A | Label B | Condition |
|---|---|---|
| `energetic` | `heavy` | Cannot co-occur when energy > 0.85 and brightness < 0.25 (edge case only — usually can co-occur) |
| `vocal` | `instrumental` | Cannot co-occur (near-mutual exclusion — edge cases acceptable) |

These are the only explicit mutual exclusions in V1. `floating / airy` mutual exclusions are deferred along with the label. Do not add more exclusions without empirical justification. Semantic overlap is generally allowed and expected.

---

## 9. Label Confidence Propagation

### Final Label Confidence Formula (Directional)

```
label_confidence = composition_confidence × avg_dimension_confidence

where:
  composition_confidence = (base score from required dims met)
                           + (sum of applicable boosters)
                           - (sum of applicable penalties)
  avg_dimension_confidence = average of confidence values for
                             all required dimensions
```

This is not a final implementation formula — it is the directional intent. Implementation may vary as long as:
- Dimension confidence gates label confidence
- Missing data reduces, not ignores, label confidence
- Contradiction penalties are applied before the final product

### Confidence Ceiling by Label Type

| Label | Max Confidence |
|---|---|
| driving, bouncy, energetic, steady, hypnotic | 0.95 |
| vocal, instrumental | 0.75 |
| heavy | 0.75 |
| dense, punchy | 0.65 |

*Note: floating / airy is deferred from V1 active inference and has no active ceiling.*

These ceilings are not arbitrary — they reflect the acknowledged reliability of the underlying dimensions.

---

## 10. Label Surfacing Rules

### Minimum Firing Threshold

- Labels with final confidence < 0.60 do not surface in V1.
- This is a conservative threshold. It may be loosened after validation, but should not be loosened before.

### Maximum Surfaced Labels Per Song

- Soft cap: 5 labels surfaced per song in V1.
- If more than 5 labels exceed threshold, surface the 5 with highest confidence.
- If fewer than 5 labels exceed threshold, surface only those that do. Do not lower threshold to hit 5.

### Label Tiers (for UX purposes)

The implementation layer may choose to display labels with visual confidence tiers:

| Confidence | Tier |
|---|---|
| ≥ 0.80 | Strong suggestion |
| 0.70–0.79 | Moderate suggestion |
| 0.60–0.69 | Tentative suggestion |
| < 0.60 | Not surfaced |

### Low-Data Song Handling

If a song has fewer than 4 of the 7 defined V1 dimensions computable (due to missing descriptors), the song should be flagged as low-coverage and output no more than 2 labels. Surfacing many labels on poor data creates false certainty.

### No Fabrication Rule

If insufficient evidence exists to fire any label above threshold, the system outputs zero labels and a low-coverage flag. This is a valid and expected output. It is not a failure state.

---

## 11. Representative Track Validation Strategy

Before treating the composition rules as stable, validate against the existing representative track set from `008_select_representative_tracks.md`.

### Validation Method

For each representative track with known dimension scores, manually check whether the expected semantic label would fire under the rules defined in Section 7.

Expected outputs are listed below. These are reference expectations — discrepancies should trigger rule investigation, not automatic rule override.

### Expected Label Outputs: Key Reference Tracks

| Track | Known Scores | Expected Labels | Notes |
|---|---|---|---|
| FISHER - It's A Killa | pulse=0.864, density=0.251 | driving, bouncy, instrumental | Low density suggests not dense; high pulse strong |
| FISHER - Crowd Control | pulse=0.862, vocal_raw=0.506 | driving, bouncy | Vocal ambiguous — suppress vocal/instrumental |
| Dom Dolla - Take It | pulse=0.891, density=0.236 | driving, bouncy | Very high pulse, low density |
| MK - Rhyme Dust | pulse=0.880, density=0.174 | driving, instrumental | Very low density — not dense |
| Gorillaz - Clint Eastwood Remix | pulse=0.900 | driving, bouncy, hypnotic | Highest pulse in set; check energy |
| Kylie Minogue - Can't GYOOMH | pulse=0.855 | driving, hypnotic, vocal | High pulse; check energy range for hypnotic |
| Daft Punk - One More Time | brightness=0.751, density=0.569 | energetic (if energy high), dense, vocal? | Brightness very high — not heavy |
| Daft Punk - Veridis Quo | brightness=0.091, vocal_raw=0.607, pulse=low | instrumental | Very low brightness; low pulse; confirmed instrumental |
| Dimension - DJ Turn It Up | energy=0.923, brightness=0.935 | energetic, (check driving) | Highest energy and brightness — not heavy |
| Camille Saint-Saëns | energy=0.036, pulse=0.085 | (no V1 labels should fire) | No labels expected — low data or no threshold met |
| Stevie Wonder - Superstition | pulse=0.289, density=0.597 | dense | Low pulse suppresses driving; density high |
| Backstreet Boys - I Want It That Way | vocal_raw=0.003 | vocal | Lowest raw vocal score = strongest vocal signal |

### What Counts as a Validation Pass

- A label fires on a track where a human would clearly expect it: pass
- A label fires on a track where it is borderline but defensible: acceptable
- A label fires on a track where a human would clearly reject it: investigate rule
- A label fails to fire on a track where it is clearly expected: check threshold

The goal is semantic usefulness, not statistical coverage metrics alone.

### Validation Output

Run representative tracks through the composition rules. Produce a table of:
- Track name
- Computed dimension scores with confidence values
- Labels that fired and at what confidence
- Labels that were expected but did not fire (false negatives)
- Labels that fired unexpectedly (false positives)
- Notes on which rules to adjust

Do not adjust rules to maximize label count. Adjust rules only when outputs are semantically wrong.

---

## 12. Known V1 Limitations

These are acknowledged limitations of the V1 implementation. They are not bugs to be fixed in V1 unless they produce consistently wrong outputs.

**No full dynamics labels:** `builds`, `drops`, `breakdown`, `progression`, and full structural steadiness are not inferrable in V1. The V1 `steady` label means *rhythmically steady* only — that the rhythmic foundation is consistent. It does not mean the song is flat in energy or arrangement across its full duration. That would require temporal modeling.

**Temporal averaging problem:** All dimension scores are song-level averages. A track with a dramatic drop will score similarly to a consistently medium track. This is a known structural limitation of the current descriptor pipeline.

**Kinetic energy only:** `energy_score` captures kinetic energy. Built/emergent energy requires temporal modeling not present in V1.

**Genre blindness:** V1 composition rules are genre-agnostic. Heavy in techno and heavy in orchestral are not distinguished. Users should be aware that some labels carry genre-relative meaning.

**Density conceptual gap:** `density_score` approximates fullness but does not fully capture the perceptual concept. It will misclassify some high-density sparse tracks (e.g., a single heavy sustained tone) and underestimate some rhythmically complex but sonically sparse tracks.

**Vocal inversion propagation:** The vocal_instrumental inversion correction introduces a layer of interpretation uncertainty. Treat vocal and instrumental labels as medium-confidence suggestions pending further calibration.

**Maximum 5 labels:** Many songs have richer semantic character than 5 labels can capture. This is by design in V1 — quality over completeness.

---

## 13. Deferred Future Work

Items explicitly out of scope for V1 but architected for:

- **Layer 3 temporal modeling** — enables builds, drops, climax, earned drop, structural arc
- **Genre conditioning** — probabilistic genre priors modifying threshold behavior in Layer 4
- **Latent semantic dimensions** — tension, aggression, emotional intensity (require more validation)
- **Textural dynamicity** — evolving arrangement without energy change (requires segment-level data)
- **Semantic calibration reviews** — periodic drift detection against human reference sets
- **Geometric representation** — normalized dimension vectors for retrieval and recommendation
- **Personalization overlays** — user-level threshold calibration
- **Confidence UX specification** — how confidence tiers are shown to users in the AudioFile interface
- **Additional expressive labels** — dark/deep (valence + brightness combinations), gritty, uplifting (post-calibration)

None of these should be attempted in V1. They are listed here to confirm they have been considered and deferred intentionally.

---

## Document History

| Version | Date | Notes |
|---|---|---|
| v0.1 | May 2026 | Initial operational specification. Defines 7 V1 dimensions, 10 active expressive labels, 1 deferred candidate label (floating/airy). Includes normalization rules, confidence architecture, contradiction logic, surfacing rules, and validation strategy. Builds on Ontology Framework v0.1.3. |
| v0.1.1 | May 2026 | Defers floating/airy from active V1 inference. Clarifies steady as rhythm-level only (not structural). Fixes instrumental threshold to raw ≥ 0.60. Updates vocal confidence cap wording. Removes floating/airy from mutual exclusion and confidence ceiling tables. |

---

*This document defines V1 operational behavior. It should be stable enough for implementation to begin after review. Changes should be driven by validation results, not philosophical iteration. Ontology questions should be resolved in the Ontology Framework, not here.*
