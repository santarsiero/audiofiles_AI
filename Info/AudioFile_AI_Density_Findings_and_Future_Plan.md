# AudioFile AI — Density Findings and Future Plan

## Summary of density problem

- The current surfaced `dense` / `sparse` semantics should not be shipped in V1.
- The current `density_score` is not yet a valid primitive signal for user-facing density labeling.
- Density behaves like an emergent concept that should be derived from multiple underlying dimensions.

## Why current density_score is invalid

- Observed `density_score` values in real cached Music Story payloads do not match the current dense thresholding regime.
- `event_density` is a useful descriptor but is tightly ranged and very small in scale in the available dataset.
- As currently composed, `density_score` has a low maximum value and therefore cannot reliably support surfaced dense/sparse semantics.

## Evidence from investigations

- **Distribution evidence** (success cache: 357 payloads)
  - `event_density` is tightly ranged and very small in scale (max ~0.077).
  - This yields `density_score` max ~0.257 while dense suppression/required thresholds are 0.4/0.5.
- **Correlation / redundancy evidence**
  - `event_density`, `complexity`, and `flatness` provide mostly distinct information.
  - `flatness` and `zero_cross_rate` overlap (so `zero_cross_rate` should remain optional support).
  - `intensity` / `absolute_loudness` primarily capture loudness/energy and should not be primary density signals.

## Final architectural decision

- **Dense/Sparse should be preserved as future semantic labels, but deferred from surfacing in V1.**
- Runtime behavior should ensure:
  - `dense` does not appear in final surfaced `labels`.
  - `sparse` is not added to surfaced labels.
  - Internal aligned label computation may still compute `dense` for analysis/debugging, but it must be clearly marked as deferred.

## Future implementation plan (do not implement now)

Dense/Sparse should later be rebuilt as emergent semantic labels from lower-level dimensions:

### activity_score

- **Primary descriptor**: `event_density`
- **Represents**: event/activity rate

### complexity_score

- **Primary descriptor**: `complexity`
- **Represents**: informational/structural complexity

### spectral_crowding_score

- **Primary descriptor**: `flatness`
- **Optional support**: `zero_cross_rate`
- **Represents**: broadband/noisy/crowded texture

### Future dense label derivation

Future `dense` should be derived from some combination of:

- high `activity_score`
- high `complexity_score`
- high `spectral_crowding_score`

### Future sparse label derivation

Future `sparse` should be derived from:

- low `activity_score`
- low `complexity_score`
- low `spectral_crowding_score`
