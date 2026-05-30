# Targeted Runtime Adjustments Proposal (NO IMPLEMENTATION)

## IMPORTANT

DO NOT MODIFY CODE.

DO NOT MODIFY FORMULAS.

DO NOT MODIFY THRESHOLDS.

DO NOT MODIFY SUPPRESSION RULES.

DO NOT IMPLEMENT ANY CHANGES.

This document is proposal-only.

---

## Files Modified

None.

## Files Created

- `experimentation/reports/targeted_runtime_adjustments_proposal.md`

## Inputs Used (offline)

- `experimentation/reports/runtime_inference_audit.md`
- `experimentation/outputs/runtime_inference_audit_stats.json`
- `experimentation/outputs/calibration_analysis.json`
- `experimentation/outputs/calibration_set_1_with_descriptors.json`
- `src/features/normalize.js`
- `src/mapping/labelScorer.js`

---

# SECTION 1 — ENERGETIC PROPOSAL

## 1) Why energetic surfaced 0

Observed (from `runtime_inference_audit_stats.json`):

- max `energy_score` in calibration set: `0.7407`
- `energetic` threshold: `energy_score >= 0.75` (from `projectEnergetic` in `src/mapping/labelScorer.js`)
- Result: `energetic` suppressed for every song with `energy_not_high_enough`, forcing `confidence = 0`.

Mechanism:

- `projectEnergetic` suppression is binary:
  - If `energy_score < 0.75` => suppressed => confidence set to `0`
- `surfaceAlignedLabels` requires `confidence >= 0.6` and not suppressed
- Therefore even near-misses (e.g. `0.7407`) cannot surface.

This is not a low-confidence dimension issue:

- Energy confidence in the calibration set is consistently `0.95`, well above the `dimUsable` cutoff (`0.4`).

## 2) Three candidate solutions

### Option A — Lower the energetic threshold (label-level)

Concept:

- Reduce the `energetic` threshold in `projectEnergetic` from `0.75` to something closer to observed distribution.

Benefits:

- Directly addresses the immediate failure mode (hard unreachable threshold).
- Minimal blast radius; does not change other labels/dimensions.

Risks:

- If `energy_score` is already “semantically correct”, lowering the threshold may cause overfiring in production.
- Threshold tuning can become calibration-set-specific if the distribution shifts by genre/catalog.

Implementation complexity:

- Low (single constant change).

Expected calibration impact:

- High immediate impact: energetic would begin surfacing for songs with `energy_score` above the new threshold.
- Given max is `0.7407`, any threshold <= `~0.70–0.74` would materially raise surfaced count.


### Option B — Rescale / re-normalize energy dimension (dimension-level)

Concept:

- Keep the label threshold semantics, but adjust `energy_score` computation or post-processing so the dimension better spans the 0–1 range for realistic music.
- Current formula (from `normalize.js`):
  - `energy_score = 0.5*arousal + 0.3*loudnessScore + 0.2*intensity` (weighted average over available inputs)

Benefits:

- If energy is “compressed” (rarely approaching 1.0), rescaling can restore meaningful dynamic range.
- Keeps label threshold semantics stable across catalog once the dimension is calibrated.

Risks:

- Changes to a primary dimension can cascade into multiple labels that consume `energy_score`:
  - driving, bouncy, heavy, punchy, energetic
- May require broader retuning than just energetic.

Implementation complexity:

- Medium to high:
  - Requires choosing a rescaling method (e.g., affine transform, non-linear curve)
  - Requires careful regression across labels.

Expected calibration impact:

- Potentially very high but less predictable:
  - energetic may start surfacing
  - other energy-dependent labels might shift substantially


### Option C — Percentile/relative approach (dataset-anchored) for energetic

Concept:

- Instead of an absolute threshold (`>= 0.75`), define energetic relative to the observed energy distribution (e.g., “top X% energy” within a window / cohort).

Benefits:

- Adapts to differences in mastering and descriptor scaling.
- More stable surfaced rate across catalogs with different global loudness/energy baselines.

Risks:

- Requires defining the comparison cohort:
  - per playlist/session?
  - per library?
  - per genre bucket?
- Harder to interpret and debug.
- Can behave oddly on small cohorts.

Implementation complexity:

- High:
  - Requires runtime access to distribution context and a decision about windowing.

Expected calibration impact:

- Likely increases energetic surfaced rate (by construction) but may reduce semantic precision.

## Recommended energetic option

Recommendation: **Option A (Lower threshold)** as the first targeted adjustment.

Why:

- The current failure is a clear, single-point issue: threshold is slightly above observed max.
- Lowest-risk and easiest to validate.
- Provides immediate signal on whether the rest of the pipeline (confidence ceilings, surfacing caps) behaves as expected once energetic becomes eligible.

---

# SECTION 2 — DENSITY PROPOSAL

## 1) Root cause summary

Observed (from `runtime_inference_audit_stats.json`):

- density scores roughly `0.067–0.200` (mean `0.128`)
- `dense` label requirements (from `projectDense` in `labelScorer.js`):
  - hard suppress if `density_score < 0.4`
  - required threshold `density_score >= 0.5`
- Result: `dense` is suppressed for every song.

Density computation (from `normalize.js`):

- `density_score = 0.6*event_density + 0.25*intensity + 0.15*complexity`

Observed raw inputs for expected-dense songs:

- `event_density` is extremely small (~`0.036–0.064`)
- `intensity` ranges moderate (~`0.19–0.38`)
- `complexity` can be high (~`0.23–0.80`)

Given weight 0.6 on `event_density`, the density score is mathematically forced low even when other terms are moderate/high.

## 2) Is it formula, descriptor interpretation, thresholds, or multiple?

- A) density formula is wrong
  - **Possibly, but no direct evidence of a bug** (it is a straightforward weighted average).
  - The issue is that the resulting scale is incompatible with thresholds.
- B) event_density interpretation is wrong
  - **Likely.** The raw `event_density` values are near ~0.05 even for tracks expected to be dense. Either:
    - the descriptor is on a different scale than assumed, or
    - the descriptor is not measuring “density” as intended.
- C) thresholds are wrong
  - **Also likely.** Even if event_density is low, thresholds at 0.4/0.5 imply an expectation that density_score will commonly exceed those values, which it does not in calibration.
- D) multiple issues exist
  - **Most likely.** The observed dimension scale and the label thresholds are not aligned; resolving may require changing either representation (dimension) or decision boundary (label), or both.

## 3) Three candidate solutions

### Option A — Lower dense thresholds (label-level)

Concept:

- Adjust `dense` hard-suppress and required thresholds downward to match observed scale.

Benefits:

- Fastest path to making dense eligible.
- Minimal code surface (confined to `projectDense`).

Risks:

- If density_score scale varies across catalog, a low threshold might cause widespread dense overfiring.
- Does not address potential semantic mismatch of `event_density`.

Implementation complexity:

- Low.

Expected calibration impact:

- Very high immediate increase in dense surfaced rate (since current values are far below 0.4).


### Option B — Reinterpret / rescale `event_density` (dimension-level)

Concept:

- Treat the raw `event_density` value as needing transformation before use in `density_score`.
- Example transforms (illustrative categories, not prescriptions):
  - non-linear expansion (e.g., sqrt/logit-like curve)
  - affine scaling (multiply + clamp)
  - rank-based mapping to [0,1]

Benefits:

- Addresses the core mismatch: expected-dense songs have tiny `event_density` values.
- More semantically grounded if `event_density` is reliable but compressed.

Risks:

- Changes to density_score will affect:
  - `dense` label
  - any other logic consuming density_score (e.g., heavy uses density as optional boost)
- Harder to validate without a larger benchmark set.

Implementation complexity:

- Medium.

Expected calibration impact:

- Potentially high and more stable than threshold-only changes, if the transform improves semantic mapping.


### Option C — Redefine density dimension composition (feature-level)

Concept:

- Reduce the dominance of `event_density` and/or include additional correlates of “density” that are already present (e.g., instrumentation diversity / spectral complexity if available), or shift weights toward `intensity`/`complexity`.

Benefits:

- If `event_density` is not tracking the intended concept, this fixes representation.
- May align better with human “dense” expectations.

Risks:

- Highest risk to semantics because it redefines what density means in the model.
- Requires careful review of descriptor availability and confidence handling.

Implementation complexity:

- Medium to high.

Expected calibration impact:

- High but uncertain; could fix dense, but could also cause regressions in other labels.

## Recommended density option

Recommendation: **Option B (Rescale / reinterpret `event_density` into a usable density scale)**.

Why:

- The current density_score scale is far from thresholds, suggesting a representation issue.
- Simply lowering thresholds (Option A) may “paper over” a mis-scaled signal and risk broad overfiring.
- A transform-based approach is more likely to preserve semantics across songs while making the dimension usable.

---

# SECTION 3 — HEAVY PROPOSAL

## 1) Why heavy is overfiring

Observed (from audit stats):

- Expected heavy: `7`
- Surfaced heavy: `13`

Heavy logic (from `projectHeavy` in `src/mapping/labelScorer.js`):

- Requires:
  - `brightness_score` must be low enough (implemented as `b <= 0.40` by suppression rule `brightness_not_low_enough` when `b > 0.40`)
  - `energy_score >= 0.55`
- Additional suppressions:
  - `brightness_too_high` if `b > 0.55`
  - `energy_too_low` if `e < 0.4`
- Supporting boosts (do not suppress):
  - if `density_score > 0.5`
  - if `punch_score > 0.55`
  - if `brightness_score < 0.25`

Given calibration energy distribution (p50 ~0.565), many songs clear `energy >= 0.55`.

Therefore heavy will overfire if either:

- `brightness_score` tends to fall below 0.40 for a large portion of songs (possible if brightness normalization is conservative or if many tracks are mixed/mastered dark)
- OR calibration expectations under-label heavy relative to the current operational definition (dark + energetic).

## 2) Dimensions driving heavy

Direct gating dimensions:

- `brightness_score` (must be low)
- `energy_score` (must be high)

Secondary supporting evidence (confidence-only boosts):

- `density_score`
- `punch_score`

Note: In the current calibration set, `density_score` is always low (<< 0.5), so density is unlikely to be the cause of heavy surfacing; the driver is almost certainly brightness+energy gating.

## 3) Candidate fixes (2–3)

### Option A — Tighten the brightness requirement (label-level)

Concept:

- Make heavy require a darker timbre than it currently does (lower the brightness cutoff).

Benefits:

- Addresses likely driver directly.
- Minimal blast radius.

Risks:

- If brightness_score is already underestimating brightness, tightening could eliminate legitimate heavy detections.

Implementation complexity:

- Low.


### Option B — Add an additional corroboration requirement (label-level)

Concept:

- Require an additional dimension to corroborate heaviness (e.g., punch or low-end).

Benefits:

- Reduces false positives where “dark + energetic” is not perceived as heavy.
- More semantically aligned if heavy should imply weight/impact, not just dark energy.

Risks:

- Risk of suppressing legitimate heavy where corroborating dimensions are missing/low-confidence.

Implementation complexity:

- Medium (adds rule interactions and must consider confidence/usability).


### Option C — Calibrate brightness_score normalization (dimension-level)

Concept:

- If brightness_score distribution is biased low, adjust how brightness is computed/normalized.

Benefits:

- Fixes upstream representation; improves all labels that use brightness.

Risks:

- Larger blast radius (any brightness-dependent label could shift).

Implementation complexity:

- Medium to high.

## Recommended heavy option

Recommendation: **Option B (Add corroboration requirement)**.

Why:

- Overfiring suggests the current definition is too permissive.
- A corroboration requirement reduces false positives without depending entirely on the scaling of brightness.
- It is more robust than tuning a single cutoff if brightness is miscalibrated.

---

# SECTION 4 — PULSE OBSERVATION (NO CHANGES PROPOSED)

Assessment: **B. likely biased**

Evidence:

- Electronic (`genreBucket == electronic_dance`) avg pulse score: `0.6563` (n=10)
- Non-electronic avg pulse score: `0.4410` (n=28)
- Confidence is `1.0` for both groups, so the difference is not from confidence suppression.

Additionally, pulse formula emphasizes:

- `pulse_clarity` (weight 0.55) and `rhythmic_stability` (0.25)
- then penalizes by `complexity` (`-0.15 * complexity`)

This combination is consistent with pulse tracking rhythmic regularity/pulse clarity, which can systematically favor electronic productions.

---

# SECTION 5 — EXPECTED IMPACT TABLE

| Issue | Confidence | Difficulty | Expected Impact |
| ----- | ---------- | ---------- | --------------- |
| energetic | High | Low | High |
| density | High | Medium | High |
| heavy | Medium | Medium | Medium |

Definitions:

- Confidence: confidence the diagnosis (root cause) is correct based on audit evidence.
- Difficulty: relative implementation effort and regression risk.
- Expected Impact: expected improvement in surfaced-label behavior on calibration set and likely production.

---

# SECTION 6 — RECOMMENDED IMPLEMENTATION ORDER

Recommended order:

1. **energetic**
2. **heavy**
3. **density**

Rationale:

- Energetic is a clear single-threshold reachability problem with minimal blast radius.
- Heavy is overfiring and likely requires modest rule tightening; it is easier to validate once energetic behaves.
- Density appears to be a representation-scale problem; changing it has higher regression risk and should be done after quick wins clarify the rest of the system’s behavior.

---

# Final Recommendation (proposal-only)

- **Energetic:** start with a label-level threshold adjustment (Option A) to restore reachability; re-evaluate energy distribution after.
- **Heavy:** add corroboration requirement (Option B) to reduce false positives driven by “dark + energetic” alone.
- **Density:** prioritize representation alignment (Option B) by rescaling/reinterpreting `event_density` into a density scale that can reasonably interact with label thresholds.

---

# STOP CONDITION

Proposal report complete. No runtime changes were made.
