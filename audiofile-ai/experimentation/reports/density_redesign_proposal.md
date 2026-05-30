# Density Redesign Proposal (NO IMPLEMENTATION)

## IMPORTANT

DO NOT MODIFY CODE.

DO NOT MODIFY RUNTIME.

DO NOT CHANGE THRESHOLDS.

DO NOT IMPLEMENT ANY FIXES.

This document is proposal-only.

---

## Files Modified

None.

## Files Created

- `experimentation/reports/density_redesign_proposal.md`

## Inputs Used (offline)

- `experimentation/reports/density_distribution_investigation.md`
- `experimentation/outputs/density_distribution_investigation.json`
- `experimentation/reports/runtime_inference_audit.md`
- `experimentation/reports/targeted_runtime_adjustments_proposal.md`
- `src/features/normalize.js`
- Calibration analysis outputs (`experimentation/outputs/calibration_analysis.json`)

---

# SECTION 1 — CURRENT DENSITY ANALYSIS

## Current density definition (as implemented)

From `src/features/normalize.js` (`computeDensityScore`):

- `density_score` is a weighted average of:
  - `event_density` (weight `0.60`)
  - `intensity` (weight `0.25`)
  - `complexity` (weight `0.15`)

If a descriptor is missing, the weighted-average implementation renormalizes over the available terms.

## What the current implementation is actually measuring

Given the formula and the observed distributions from the full successful cache:

- `event_density` is both:
  - very small in absolute value
  - tightly ranged (~`0.036–0.077`)

With a `0.60` weight, the resulting `density_score` is dominated by a signal that has very low variance. Therefore, in practice the dimension behaves like:

- a lightly modulated proxy for `event_density`, plus
- secondary shaping from `intensity` and `complexity`

But because `event_density` lives in a narrow band for *all* songs, density_score ends up living in a narrow band too (max ~`0.257`).

## Alignment to human perception of density

On its face, the **semantic intent** (event density + intensity + complexity) resembles a reasonable human concept: “how much is happening.”

However, the **operational behavior** appears misaligned with human perception for two reasons:

- **Scale mismatch:** even dense, high-energy tracks produce density scores that are numerically far from any plausible “high density” region.
- **Signal mismatch / low dynamic range:** the primary input (`event_density`) does not differentiate dense vs. non-dense in a way that matches expected songs.

Conclusion:

- The current implementation is conceptually aligned but **practically miscalibrated**. It is not currently a good proxy for perceived density in the system because the dominant descriptor is small and tightly distributed.

---

# SECTION 2 — PROPOSED DENSITY INTERPRETATIONS

The redesign question is: what should “density” mean in AudioFile AI?

Below are three candidate interpretations that are implementable with existing Music Story descriptors.

## Interpretation A — Temporal Event Activity

Density means:

- “How frequently audible sonic events occur over time.”

Human analog:

- fast note rate, busy percussion, lots of onsets.

## Interpretation B — Perceived Mix Crowding

Density means:

- “How crowded the mix feels,” including layering and overlapping sources.

Human analog:

- wall-of-sound, many concurrent elements, continuous texture.

## Interpretation C — Information/Novelty Load

Density means:

- “How much information the listener must process,” driven by complexity and change rather than just loudness or speed.

Human analog:

- intricate arrangement, high variation, challenging to parse.

---

# SECTION 3 — REPRESENTATION OPTIONS (descriptor compositions)

Constraints:

- Use only descriptors that already exist in Music Story payloads.
- No implementation here; these are candidate compositions.

## Option A — Temporal Event Activity representation

Inputs (candidate):

- `event_density` (primary)
- `rhythmic_stability` (to distinguish busy-but-steady vs. busy-and-chaotic)
- `pulse_clarity` (optional; busy but not necessarily pulsed)

Pros:

- Closest to a strict, measurable definition.
- Should correlate well with high-onset genres (DnB, breakbeat, fast punk).

Cons:

- Does not capture “crowded but slow” (e.g., sustained drones with many layers).
- If `event_density` is intrinsically low-range, representation is fragile.

Implementation complexity:

- Low to medium (mostly weighting and validation).

## Option B — Perceived Mix Crowding representation

Inputs (candidate):

- `spectral_complexity`
- `timbral_complexity`
- `instrumentation_diversity`
- `intensity`

Pros:

- More directly tied to “crowded mix” perception.
- Less dependent on onset counting.

Cons:

- Depends on availability/quality of these descriptors in cached payloads.
- Risk of conflating “bright/harsh” with “dense” if spectral complexity correlates with brightness.

Implementation complexity:

- Medium (requires careful normalization, missing-data handling, and confidence logic).

## Option C — Information/Novelty Load representation

Inputs (candidate):

- `complexity` (primary)
- `event_density` (secondary)
- `spectral_complexity` (secondary)

Pros:

- Captures the sense of “a lot going on” even when not loud.
- More robust to genres like complex classical passages.

Cons:

- Might over-score sparse-but-complex music (e.g., solo piano with high harmonic movement).
- Harder to explain to users vs. a simpler “busy” definition.

Implementation complexity:

- Medium.

---

# SECTION 4 — SCALE OPTIONS

The investigation shows a current numerical scale that does not match label thresholds:

- `event_density` max ~`0.077`
- derived `density_score` max ~`0.257`
- dense hard suppress `0.40`, threshold `0.50`

## Option A — Threshold adjustment only

Pros:

- Fastest path to reachability.
- Minimal code change.

Cons:

- Risks cementing a mis-scaled/mis-semantic representation.
- If the primary descriptor is not discriminative, lowering thresholds may overfire.

Expected behavior:

- Dense becomes reachable, but the “meaning” of dense may drift (it would mean “top of a low-range signal”).

## Option B — Rescaling current density

Pros:

- Preserves conceptual meaning while fixing numeric scale.
- Can be made monotonic (rank order preserved).

Cons:

- Still depends on `event_density` being semantically correct.

Expected behavior:

- Density spans more of 0–1; dense thresholds become meaningful without redefining representation.

## Option C — Percentile normalization

Pros:

- Ensures consistent distribution across catalogs.
- Robust to global shifts in descriptor scaling.

Cons:

- Requires a cohort/window definition.
- Can produce unintuitive results on small sets.

Expected behavior:

- Always yields “some dense songs” by construction; may reduce semantic stability.

## Option D — Formula redesign

Pros:

- Lets AudioFile AI define density in a way aligned to perception (e.g., crowding vs. activity).

Cons:

- Highest regression risk; affects downstream labels and any inverse label (sparse).
- Requires the most validation.

Expected behavior:

- Best long-term semantic alignment if designed and validated well.

---

# SECTION 5 — EXPECTED-DENSE SONG REVIEW

These are calibration tracks expected to be dense. The investigation shows they all have low `event_density` and low derived `density_score`.

## Why humans perceive these as dense (qualitative)

- **Bangarang / Scary Monsters:** aggressive electronic production, lots of transient activity, layered synths/drums.
- **STILL IN THE PAINT:** dense hip-hop mix with heavy percussion, rapid vocal delivery, layered instrumentation.
- **Smells Like Teen Spirit:** thick guitar distortion, continuous energy, dense midrange.
- **Danse macabre / New World Symphony IV:** orchestral texture with many simultaneous instruments and fast passages.

## Descriptor patterns observed (from expected-dense subset)

Across the expected-dense subset:

- `event_density` is not “high” by scale (typically ~0.05–0.06)
- `intensity` varies and can be moderate/high (e.g., 0.27–0.38)
- `complexity` can be very high for orchestral/classical (e.g., ~0.80)

This suggests that at least for these examples, the **perceived density** that humans report is not being captured by `event_density` as currently used.

Two plausible explanations:

- `event_density` is not measuring onset density in the expected way (or is strongly normalized globally).
- perceived density for some tracks is driven more by **layering / spectral crowding** than by discrete event rate.

---

# SECTION 6 — RECOMMENDATION

## Preferred density interpretation

Recommendation: **Interpretation B — Perceived Mix Crowding**.

Why:

- It better matches the human notion that “dense” can be true for:
  - distorted guitars (continuous texture)
  - orchestral layering
  - heavily layered electronic productions
- These cases are not purely “many events per second.”

## Preferred representation strategy

Recommendation: **Option B representation (crowding-focused):**

- prioritize `spectral_complexity`, `timbral_complexity`, `instrumentation_diversity`, with `intensity` as a supporting term.

Why:

- The full-cache evidence suggests `event_density` is not discriminating enough to be the dominant driver.
- Crowding descriptors are more likely to align with mix texture.

## Preferred scaling strategy

Recommendation: **Option D — Formula redesign** (paired with re-scaling within the new formulation).

Why:

- Investigation indicates both representation and threshold alignment are broken.
- A redesign that matches the intended semantics should come first; thresholds can then be calibrated to that representation.

---

# SECTION 7 — DOWNSTREAM IMPACT

## Impact on labels

- **dense:** direct dependence; any density redesign will change dense eligibility.
- **heavy:** heavy currently uses density only as a supporting confidence boost (not gating). If density becomes meaningful, heavy may shift modestly via confidence changes.
- **punchy:** not directly dependent on density; punchy depends on punch with small boosts.
- **energetic:** not dependent on density.
- **future inverse label sparse:** redefining density requires redefining sparse (should be the semantic inverse of the chosen density meaning).

## Would fixing density likely improve heavy calibration?

Likely: **somewhat, but not guaranteed**.

Why:

- Heavy’s gating is primarily brightness + energy; density is currently only a small confidence boost.
- If density becomes more accurate, it could:
  - increase confidence on genuinely heavy/dense tracks
  - slightly reduce confidence for tracks that are dark+energetic but not crowded

But heavy overfiring may still persist if brightness/energy gating is too permissive.

---

# Final Conclusion

- The current density implementation is conceptually reasonable but operationally miscalibrated.
- The data strongly suggests `event_density` is not suitable as the dominant driver of perceived density.
- The best long-term strategy is to define density as **perceived mix crowding** using crowding-related descriptors, then calibrate scaling and thresholds against that representation.

---

# STOP CONDITION

Density redesign proposal complete. No code changes were made.
