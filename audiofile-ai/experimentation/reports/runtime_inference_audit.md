# Runtime Inference Audit (Calibration Set)

## IMPORTANT

DO NOT MODIFY ANY CODE.

DO NOT MODIFY FORMULAS.

DO NOT MODIFY THRESHOLDS.

DO NOT MODIFY SUPPRESSION RULES.

DO NOT MODIFY SURFACING RULES.

This document is diagnostic only.

---

## Files Modified

None.

## Files Created

- `experimentation/outputs/runtime_inference_audit_stats.json`
- `experimentation/reports/runtime_inference_audit.md`

## Data Sources Used (offline)

- `experimentation/outputs/calibration_analysis.json`
- `experimentation/outputs/calibration_set_1_with_descriptors.json`
- `src/mapping/labelScorer.js`
- `src/features/normalize.js`

---

# SECTION 1 — ENERGETIC AUDIT

## Energetic score distribution (n=38)

(From `activeLabelAnalysis` for label `energetic`.)

- min: `0.1024`
- p25: `0.4331`
- p50: `0.5652`
- p75: `0.6550`
- max: `0.7407`
- mean: `0.5381`

## Energetic confidence distribution (n=38)

- min: `0.0000`
- p25: `0.0000`
- p50: `0.0000`
- p75: `0.0000`
- max: `0.0000`
- mean: `0.0000`

**Interpretation (diagnostic):** confidence is `0` for all songs because the label is suppressed for all songs.

## Energetic threshold

From `src/mapping/labelScorer.js`:

- Threshold: `energy_score >= 0.75`

(`projectEnergetic` uses `const threshold = 0.75` and suppresses with `energy_not_high_enough` when below.)

## Energetic suppression rules

From `projectEnergetic(dimensionObjects)` in `src/mapping/labelScorer.js`:

- `low_confidence_dimension:energy_score` if `dimUsable(energy_score)` is false
  - `dimUsable` requires `confidence >= 0.4` and not `usable === false`
- `energy_not_high_enough` if `energy_score` is `null` or `< 0.75`

## Songs where `energy >= 0.65` AND energetic was NOT surfaced

Count: `13`

All 13 failures share the same root cause:

- Energy score is **below the energetic threshold** (`0.75`)
- Energy confidence is high (`0.95`) so this is **not** a low-confidence suppression

| artist | title | energy score | energy conf | energetic score | energetic conf | suppression reason |
|---|---|---:|---:|---:|---:|---|
| Darude | Sandstorm | 0.6516 | 0.95 | 0.6516 | 0.00 | energy_not_high_enough |
| FISHER | Losing It | 0.7166 | 0.95 | 0.7166 | 0.00 | energy_not_high_enough |
| Skrillex | Bangarang (feat. Sirah) | 0.7407 | 0.95 | 0.7407 | 0.00 | energy_not_high_enough |
| Skrillex | Scary Monsters and Nice Sprites | 0.7370 | 0.95 | 0.7370 | 0.00 | energy_not_high_enough |
| Sub Focus | Push The Tempo | 0.7018 | 0.95 | 0.7018 | 0.00 | energy_not_high_enough |
| Sub Focus & Dimension | Desire | 0.7092 | 0.95 | 0.7092 | 0.00 | energy_not_high_enough |
| Denzel Curry | STILL IN THE PAINT | 0.6562 | 0.95 | 0.6562 | 0.00 | energy_not_high_enough |
| The Game | Hate It Or Love It | 0.6517 | 0.95 | 0.6517 | 0.00 | energy_not_high_enough |
| Nirvana | Smells Like Teen Spirit | 0.6566 | 0.95 | 0.6566 | 0.00 | energy_not_high_enough |
| Mötley Crüe | Kickstart My Heart | 0.6774 | 0.95 | 0.6774 | 0.00 | energy_not_high_enough |
| Franz Ferdinand | Take Me Out | 0.6603 | 0.95 | 0.6603 | 0.00 | energy_not_high_enough |
| Wild Cherry | Play That Funky Music | 0.6784 | 0.95 | 0.6784 | 0.00 | energy_not_high_enough |
| The Jacksons | Blame It on the Boogie | 0.6514 | 0.95 | 0.6514 | 0.00 | energy_not_high_enough |

**Energetic root cause (diagnostic):** the `energetic` label is effectively unreachable for this calibration set because the observed `energy_score` maxes at `0.7407`, below the hard threshold of `0.75`.

---

# SECTION 2 — DENSITY AUDIT

## Density dimension distribution (n=38)

(From `dimensions.density.score`.)

- min: `0.0674`
- p25: `0.1054`
- p50: `0.1327`
- p75: `0.1471`
- max: `0.1999`
- mean: `0.1282`

## Density label thresholding + suppression (dense label)

From `projectDense(dimensionObjects)` in `src/mapping/labelScorer.js`:

- Low-confidence suppression:
  - `low_confidence_dimension:density_score` if `density_score` not usable (`confidence < 0.4` or `usable === false`)
- Hard suppression:
  - `density_hard_suppress` if `density_score` is `null` or `< 0.4`
- Required threshold:
  - `density_below_required` if `density_score` is `null` or `< 0.5`

Given the observed distribution (max density score `0.1999`), every song will be below `0.4`, so `dense` is suppressed for the entire calibration set.

## For every song expected to be dense

Count: `9`

Raw descriptor inputs shown are the raw values in the joined cache payload (`rawDescriptorData`):

| artist | title | density score | density conf | event_density | intensity | complexity |
|---|---|---:|---:|---:|---:|---:|
| Skrillex | Bangarang (feat. Sirah) | 0.1477 | 0.70 | 0.0642 | 0.2686 | 0.2805 |
| Skrillex | Scary Monsters and Nice Sprites | 0.1423 | 0.70 | 0.0631 | 0.2780 | 0.2333 |
| Sub Focus | Push The Tempo | 0.1307 | 0.70 | 0.0534 | 0.3188 | 0.1263 |
| Sub Focus & Dimension | Desire | 0.1369 | 0.70 | 0.0600 | 0.2641 | 0.2326 |
| Lil Jon & The East Side Boyz | Get Low | 0.1454 | 0.70 | 0.0474 | 0.2432 | 0.3744 |
| Denzel Curry | STILL IN THE PAINT | 0.1688 | 0.70 | 0.0586 | 0.3789 | 0.2600 |
| Nirvana | Smells Like Teen Spirit | 0.1841 | 0.70 | 0.0530 | 0.1924 | 0.6950 |
| Camille Saint-Saëns | Danse macabre, Op. 40 | 0.1099 | 0.70 | 0.0361 | 0.0355 | 0.5293 |
| Antonín Dvořák | Symphony No. 9 ... IV. Allegro con fuoco | 0.1661 | 0.70 | 0.0485 | 0.0661 | 0.8034 |

## Root cause analysis: why is density low?

Density formula (from `src/features/normalize.js`):

- `density_score = weightedAverage([
  - 0.6 * event_density,
  - 0.25 * intensity,
  - 0.15 * complexity
])`

**Observed pattern:**

- The `event_density` raw input is extremely low for all expected-dense songs (roughly `0.036` to `0.064`).
- Even when `intensity` or `complexity` is moderate/high, the 0.6 weight on `event_density` dominates.

### Is density low because:

- A) formula implementation
  - The implementation matches the documented weighted average; no evidence of a bug in the arithmetic based on the code path shown.
- B) descriptor values
  - **Yes.** `event_density` values are consistently near ~`0.05`, which mathematically forces `density_score` to be low.
- C) thresholding
  - Thresholding makes the label unreachable (req `0.5`, hard-suppress `< 0.4`), but the underlying problem is that the computed density scores never get close to those thresholds.
- D) suppression
  - The label is suppressed, but the suppression is a direct consequence of the computed `density_score` being far below the hard-suppress threshold.

**Density root cause (diagnostic):** the `density_score` values produced from the current descriptor normalization (especially very low `event_density`) are orders of magnitude below the thresholds required for `dense`.

---

# SECTION 3 — PULSE AUDIT

## Electronic vs non-electronic comparison

Grouping rule used:

- Electronic: `genreBucket == electronic_dance`
- Non-electronic: all other genreBuckets

Results:

- Electronic songs
  - count: `10`
  - avg pulse score: `0.6563`
  - avg pulse confidence: `1.0000`
- Non-electronic songs
  - count: `28`
  - avg pulse score: `0.4410`
  - avg pulse confidence: `1.0000`

## Evidence from pulse formula

From `src/features/normalize.js`:

- `pulse_score` is a weighted average of:
  - 0.55 * `pulse_clarity`
  - 0.25 * `rhythmic_stability`
  - 0.10 * `danceability`
  - 0.10 * `articulation`
- Then applies a complexity penalty:
  - `pulse_score = clamp(base - 0.15 * complexity, 0, 1)`

**Pulse bias diagnostic conclusion:** pulse scores are substantially higher in `electronic_dance` than non-electronic (difference ~`+0.215`). Given the feature weighting and penalty structure, this is consistent with pulse emphasizing **rhythmic regularity / pulse clarity** traits that are more prevalent (or more reliably detected) in electronic productions.

---

# SECTION 4 — LABEL SURFACE RATES

Using active labels list from `calibration_analysis.json` and expected labels from the calibration set.

Surfacing rules are global (see Section 5), so “surfaced count” here means it survived suppression, exceeded confidence threshold, and survived any caps.

| label | expected count | surfaced count | surface rate (surfaced/expected) |
|---|---:|---:|---:|
| energetic | 16 | 0 | 0.000 |
| driving | 14 | 1 | 0.071 |
| steady | 10 | 14 | 1.400 |
| bouncy | 10 | 7 | 0.700 |
| heavy | 7 | 13 | 1.857 |
| punchy | 5 | 5 | 1.000 |
| dense | 9 | 0 | 0.000 |
| vocal | 26 | 22 | 0.846 |
| instrumental | 8 | 4 | 0.500 |
| speech | 0 | 0 | n/a |
| hypnotic | 6 | 3 | 0.500 |

**Diagnostic note:** surface rate values > 1.0 indicate the label is surfacing for songs where it was not expected in the calibration set.

---

# SECTION 5 — THRESHOLD INVENTORY

This section is **verbatim** inventory of what exists in code.

## Global dimension usability rule

From `dimUsable(d)` in `src/mapping/labelScorer.js`:

- Dimension is usable iff:
  - `d` exists
  - `d.usable !== false`
  - `d.confidence >= 0.4`

## Global surfacing rules (aligned labels)

From `surfaceAlignedLabels` in `src/mapping/labelScorer.js`:

- Confidence ceiling (per-label): `applyLabelConfidenceCeiling` using:
  - energetic: 0.95
  - driving: 0.95
  - steady: 0.95
  - bouncy: 0.95
  - hypnotic: 0.95
  - speech: 0.95
  - vocal: 0.75
  - instrumental: 0.75
  - heavy: 0.75
  - punchy: 0.70
  - dense: 0.65
- Candidate surfacing criteria:
  - label must not be suppressed
  - label must have `confidence >= 0.6`
- Coverage cap:
  - `usableDimCount < 4` => `low_dimension_coverage` warning and max surfaced labels = 2
  - otherwise max surfaced labels = 5
- If no labels kept: warning `no_labels_surfaced`

## Per-label thresholds and suppression rules (aligned labels)

All of the following are from `src/mapping/labelScorer.js`.

| Label | Threshold(s) | Suppression Rules | Confidence Requirements | Surfacing Requirements |
|---|---|---|---|---|
| energetic | energy_score >= 0.75 | suppress if low_confidence_dimension:energy_score; suppress if energy_not_high_enough | if suppressed => confidence=0; else base*(0.6+0.4*strength) | not suppressed AND confidence>=0.6 AND within caps AND after ceilings |
| driving | pulse_score >= 0.65 AND energy_score >= 0.55 (also suppress if either < 0.35) | low_confidence_dimension:pulse_score/energy_score; pulse_too_low (<0.35); energy_too_low (<0.35); pulse_below_required (<0.65); energy_below_required (<0.55) | if suppressed => 0; else base*(0.55+0.45*strength)*couplingPenalty | global surfacing rules + ceiling |
| steady | pulse_score >= 0.55 | low_confidence_dimension:pulse_score; pulse_not_high_enough (<0.55) | if suppressed => 0; else base*(0.55+0.45*strength)*stabilityBoost | global surfacing rules + ceiling |
| bouncy | pulse_score >= 0.60 AND energy_score >= 0.40 (also suppress if either < 0.35) | low_confidence_dimension:pulse_score/energy_score; pulse_too_low (<0.35); energy_too_low (<0.35); pulse_below_required (<0.60); energy_below_required (<0.40) | if suppressed => 0; else base*(0.5+0.5*strength) + optional boosts from valence/brightness/punch | global surfacing rules + ceiling |
| heavy | brightness_score <= 0.40 AND energy_score >= 0.55 (also suppress if brightness>0.55; energy<0.4) | low_confidence_dimension:brightness_score/energy_score; brightness_too_high (>0.55); energy_too_low (<0.4); brightness_not_low_enough (b>null or b>0.40); energy_below_required (e<0.55) | if suppressed => 0; else base*(0.5+0.5*strength) + optional boosts from density/punch/low brightness | global surfacing rules + ceiling |
| punchy | punch_score >= 0.55 | low_confidence_dimension:punch_score; punch_not_high_enough (<0.55) | if suppressed => 0; else base*(0.55+0.45*strength) + optional boosts from energy/pulse | global surfacing rules + ceiling |
| dense | density_score >= 0.50, hard-suppress if < 0.40 | low_confidence_dimension:density_score; density_hard_suppress (<0.40); density_below_required (<0.50) | if suppressed => 0; else base*(0.45+0.55*strength) + optional boosts, capped at 0.8 | global surfacing rules + ceiling |
| vocal | vocal_presence_score >= 0.65, suppress in uncertainty band 0.35..0.65 | low_confidence_dimension:vocal_presence_score; missing_vocal_presence; vocal_uncertainty_band; vocal_not_high_enough (<0.65) | if suppressed => 0; else base*(0.6+0.4*strength) | global surfacing rules + ceiling |
| instrumental | requires vocal_presence_score <= 0.40, suppress in uncertainty band 0.35..0.65 | low_confidence_dimension:vocal_presence_score; missing_vocal_presence; vocal_uncertainty_band; instrumental_not_low_enough (v>0.4) | if suppressed => 0; else base*(0.6+0.4*strength) | global surfacing rules + ceiling |
| speech | speech_score >= 0.60 | low_confidence_dimension:speech_score; speech_not_high_enough (<0.6) | if suppressed => 0; else base*(0.6+0.4*strength) | global surfacing rules + ceiling |
| hypnotic | pulse_score >= 0.65, plus support rule | low_confidence_dimension:pulse_score; pulse_too_low (<0.4); pulse_below_required (<0.65); insufficient_supporting_evidence; complexity_too_high (>=0.85) | if suppressed => 0; else base*(0.45+0.55*strength)*supportBoost | global surfacing rules + ceiling |

---

# SECTION 6 — TOP 10 MOST IMPORTANT FINDINGS (diagnostic)

1. **Energetic is fully suppressed for the calibration set** because the max observed `energy_score` (`0.7407`) never reaches the hard threshold `0.75`.
2. **Energetic confidence is 0 for every song** because `projectEnergetic` sets confidence to 0 whenever suppressed; the suppression is consistently `energy_not_high_enough`.
3. **Density scores are extremely low across the entire calibration set** (mean `0.1282`, max `0.1999`), far below even the hard-suppress cutoff `0.4`.
4. **Dense is fully suppressed for the calibration set** due to `density_hard_suppress` (<0.4) for every song.
5. **Density low values appear driven primarily by descriptor values**, especially very low `event_density` (~0.036–0.064) combined with the 0.6 weight in `computeDensityScore`.
6. **Pulse score is materially higher for electronic_dance** (avg `0.6563`) than non-electronic (avg `0.4410`), consistent with pulse tracking rhythmic regularity/pulse clarity traits.
7. **Surfacing requires confidence >= 0.6**, which means any suppressed label (confidence forced to 0) is categorically prevented from surfacing.
8. **Dense label confidence is additionally capped at 0.65** (even if it were unsuppressed), making it harder to win top slots under max-label caps.
9. **Several labels surface more often than expected** in the calibration set (e.g., `heavy`, `steady`), indicating potential semantic mismatch between calibration expectations and runtime thresholds/rules.
10. **Global label caps can exclude otherwise-eligible labels** (max 5, or 2 under low dimension coverage), which can create “suppressed despite reasonable dimensions” symptoms when many labels clear the confidence threshold.

---

# Recommended Next Step (NO IMPLEMENTATION)

Targeted Runtime Adjustments Proposal:

- Propose adjustments (without applying them) focused on:
  - energetic threshold relative to observed energy distribution
  - density formula inputs / scaling (especially event_density) relative to intended semantic meaning
  - pulse bias characterization and whether electronic-specific regularity is desired
  - review of labels that surface substantially above expected rates (heavy/steady) to align semantics

---

# STOP CONDITION

Audit report complete. No runtime changes were made.
