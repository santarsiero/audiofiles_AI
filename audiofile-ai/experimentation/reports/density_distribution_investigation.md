# Density Distribution Investigation (Cached Music Story Successes)

## IMPORTANT

DO NOT CHANGE DENSITY.

DO NOT CHANGE DENSE.

DO NOT CHANGE EVENT_DENSITY.

Investigation only.

---

## Files Modified

None.

## Files Created

- `experimentation/outputs/density_distribution_investigation.json`
- `experimentation/reports/density_distribution_investigation.md`

## Data Sources Used (offline)

- `experimentation/outputs/musicstory_successes_only.json` (successful cached Music Story payloads)
- `experimentation/outputs/calibration_set_1_with_descriptors.json` (expected-dense subset)
- Density formula reference: `src/features/normalize.js` (`computeDensityScore`)

---

## Dataset

- Successful cached payloads analyzed: `357`

Notes:

- The analysis uses `rawDescriptorData.event_density`, `rawDescriptorData.intensity`, `rawDescriptorData.complexity`.
- `density_score` in this report is computed with the same weighted-average structure as `computeDensityScore` in `normalize.js`:

```
0.6 * event_density
0.25 * intensity
0.15 * complexity
```

If any term is missing, the computation renormalizes over the available terms (matching `weightedAverage()` behavior).

---

# Distributions (all 357 successful songs)

All values are reported as:

- min, max, mean, median
- p10, p25, p50, p75, p90, p95, p99

## event_density

| metric | value |
|---|---:|
| min | 0.036057 |
| p10 | 0.045735 |
| p25 | 0.048894 |
| p50 (median) | 0.053428 |
| p75 | 0.058066 |
| p90 | 0.062351 |
| p95 | 0.066560 |
| p99 | 0.071948 |
| max | 0.077204 |
| mean | 0.053888 |

## intensity

| metric | value |
|---|---:|
| min | 0.035488 |
| p10 | 0.134823 |
| p25 | 0.189360 |
| p50 (median) | 0.231588 |
| p75 | 0.279069 |
| p90 | 0.330086 |
| p95 | 0.356542 |
| p99 | 0.408763 |
| max | 0.437576 |
| mean | 0.234032 |

## complexity

| metric | value |
|---|---:|
| min | 0.000538 |
| p10 | 0.040991 |
| p25 | 0.124251 |
| p50 (median) | 0.240463 |
| p75 | 0.416704 |
| p90 | 0.620979 |
| p95 | 0.699922 |
| p99 | 0.806663 |
| max | 0.882731 |
| mean | 0.285130 |

## density_score (computed from the above)

| metric | value |
|---|---:|
| min | 0.067381 |
| p10 | 0.097117 |
| p25 | 0.110332 |
| p50 (median) | 0.131169 |
| p75 | 0.153463 |
| p90 | 0.176063 |
| p95 | 0.185865 |
| p99 | 0.219684 |
| max | 0.256951 |
| mean | 0.133610 |

---

# Expected-dense subset (calibration songs expected to be dense)

These are the calibration songs where the calibration set expects label `dense`.

| artist | title | event_density | intensity | complexity | density_score |
|---|---|---:|---:|---:|---:|
| Skrillex | Bangarang | 0.064182 | 0.268558 | 0.280465 | 0.147718 |
| Skrillex | Scary Monsters and Nice Sprites | 0.063091 | 0.277954 | 0.233326 | 0.142342 |
| Sub Focus | Push The Tempo | 0.053428 | 0.318802 | 0.126332 | 0.130707 |
| Sub Focus & Dimension | Desire | 0.059984 | 0.264084 | 0.232604 | 0.136902 |
| Lil Jon & The East Side Boyz | Get Low | 0.047409 | 0.243228 | 0.374375 | 0.145409 |
| Denzel Curry | STILL IN THE PAINT | 0.058553 | 0.378881 | 0.259967 | 0.168847 |
| Nirvana | Smells Like Teen Spirit | 0.052977 | 0.192415 | 0.695004 | 0.184141 |
| Camille Saint-Saëns | Danse macabre | 0.036057 | 0.035488 | 0.529304 | 0.109902 |
| Antonín Dvořák | Symphony No. 9 'From the New World' - IV | 0.048490 | 0.066080 | 0.803420 | 0.166127 |

---

# Root-cause assessment (evidence-based)

## Key observation

Across **all** 357 successful cached songs, `event_density` is both:

- **Very small in absolute value**
- **Very tightly ranged**

Range:

- min `0.0361`
- max `0.0772`

This narrow band strongly constrains `density_score` because `event_density` has weight `0.6` in the density formula.

## Answer to the “IMPORTANT QUESTION”

Most likely: **E) multiple issues**.

Supporting evidence:

- **B) event_density itself is intrinsically very small**
  - The full-success dataset shows `event_density` never exceeds `0.0772`.
  - Even at p99 it is only `0.0719`.
- **C) density formula compresses scores excessively (given observed inputs)**
  - Because `event_density` dominates (0.6 weight) and is always ~0.05, the density_score distribution is forced into ~0.07–0.26.
  - This is not “compression” in arithmetic terms; it is a mismatch between input scale and downstream expectations.
- **D) thresholds are disconnected from observed scale**
  - With `density_score` max `0.2570`, a `dense` hard-suppress at `0.4` and required threshold `0.5` are unreachable for the entire success dataset.

## Why dense fails for the expected-dense subset

Even the expected-dense calibration songs have `density_score` in a narrow low range (~0.11–0.18) because:

- `event_density` is still around ~0.05–0.06 for most of them
- The 0.6 weight ensures `density_score` stays low even when `intensity` or `complexity` are moderate/high

## Final recommendation (investigation conclusion only)

Density appears to be **both**:

- a **representation/scale problem** (event_density scale is very small), and
- a **threshold alignment problem** (dense thresholds are far above the observed density_score distribution).

No fixes are proposed or implemented in this report.
