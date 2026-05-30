# Density Candidate Correlation & Redundancy Analysis (Music Story cache)
## IMPORTANT
DO NOT IMPLEMENT.
DO NOT MODIFY CODE.
DO NOT MODIFY RUNTIME.
DO NOT CHANGE DENSITY.
DO NOT CHANGE THRESHOLDS.
This document is analysis/proposal only.
---
## Inputs
- successes: `outputs/musicstory_successes_only.json`
- n (successful payloads): `357`
---
# SECTION 1 — Distribution Review (all successful songs)
| descriptor | n | mean | median | std | min | max |
|---|---:|---:|---:|---:|---:|---:|
| event_density | 357 | 0.053888 | 0.053428 | 0.006900 | 0.036057 | 0.077204 |
| complexity | 357 | 0.285130 | 0.240463 | 0.212791 | 0.000538 | 0.882731 |
| flatness | 357 | 0.270122 | 0.269162 | 0.057401 | 0.095821 | 0.427153 |
| zero_cross_rate | 357 | 0.064995 | 0.064259 | 0.017120 | 0.026740 | 0.126338 |
| intensity | 357 | 0.234032 | 0.231588 | 0.073665 | 0.035488 | 0.437576 |
| absolute_loudness | 357 | -13.247755 | -13.021048 | 2.545221 | -24.980436 | -7.016726 |

Optional secondary candidates (for context):

| descriptor | n | mean | median | std | min | max |
|---|---:|---:|---:|---:|---:|---:|
| loudness | 357 | -13.409524 | -13.067936 | 2.767172 | -26.392353 | -7.016726 |
| arousal | 357 | 0.695920 | 0.704640 | 0.160763 | 0.100470 | 1.000000 |
| complexity_chroma | 357 | 0.467787 | 0.272727 | 0.368281 | 0.000000 | 1.000000 |

---
# SECTION 2 — Correlation Matrix (Pearson; primary candidates)
Tab-separated matrix (copy/paste friendly):

```
	event_density	complexity	flatness	zero_cross_rate	intensity	absolute_loudness
event_density	1.000000	0.199765	0.035380	0.179013	0.345785	0.410934
complexity	0.199765	1.000000	-0.368866	-0.036972	-0.444261	-0.182973
flatness	0.035380	-0.368866	1.000000	0.641052	0.300998	0.217995
zero_cross_rate	0.179013	-0.036972	0.641052	1.000000	0.148478	0.293862
intensity	0.345785	-0.444261	0.300998	0.148478	1.000000	0.827819
absolute_loudness	0.410934	-0.182973	0.217995	0.293862	0.827819	1.000000
```

---
# SECTION 3 — Redundancy Analysis (pairwise)
Thresholds: 
- **HIGHLY REDUNDANT**: |r| > 0.80
- **MODERATELY RELATED**: 0.40 ≤ |r| ≤ 0.80
- **MOSTLY INDEPENDENT**: |r| < 0.40

| A | B | r | band | n |
|---|---|---:|---|---:|
| intensity | absolute_loudness | 0.827819 | HIGHLY REDUNDANT | 357 |
| flatness | zero_cross_rate | 0.641052 | MODERATELY RELATED | 357 |
| complexity | intensity | -0.444261 | MODERATELY RELATED | 357 |
| event_density | absolute_loudness | 0.410934 | MODERATELY RELATED | 357 |
| complexity | flatness | -0.368866 | MOSTLY INDEPENDENT | 357 |
| event_density | intensity | 0.345785 | MOSTLY INDEPENDENT | 357 |
| flatness | intensity | 0.300998 | MOSTLY INDEPENDENT | 357 |
| zero_cross_rate | absolute_loudness | 0.293862 | MOSTLY INDEPENDENT | 357 |
| flatness | absolute_loudness | 0.217995 | MOSTLY INDEPENDENT | 357 |
| event_density | complexity | 0.199765 | MOSTLY INDEPENDENT | 357 |
| complexity | absolute_loudness | -0.182973 | MOSTLY INDEPENDENT | 357 |
| event_density | zero_cross_rate | 0.179013 | MOSTLY INDEPENDENT | 357 |
| zero_cross_rate | intensity | 0.148478 | MOSTLY INDEPENDENT | 357 |
| complexity | zero_cross_rate | -0.036972 | MOSTLY INDEPENDENT | 357 |
| event_density | flatness | 0.035380 | MOSTLY INDEPENDENT | 357 |

## Pairwise meaning (what each relationship likely indicates)

Below, each pair is interpreted **as a signal-design question**: are we measuring the same phenomenon twice, or capturing complementary facets of “density”?

### intensity vs absolute_loudness (r = 0.827819, HIGHLY REDUNDANT)

- **Likely meaning**: `intensity` is strongly tracking overall level/energy that also appears in `absolute_loudness`.
- **Redundancy implication**: including both risks overweighting “how loud/forward the mix is” rather than “how many events/layers exist.”
- **Practical action**: keep **one** as the “level/energy correlate” (or exclude both if density should avoid loudness confounds).

### flatness vs zero_cross_rate (r = 0.641052, MODERATELY RELATED)

- **Likely meaning**: both are **spectral texture / noisiness** proxies.
  - `flatness` increases with broadband/noise-like spectra.
  - `zero_cross_rate` increases with high-frequency/transient/noise activity.
- **Redundancy implication**: they partially overlap; using both can be justified if you want “sonic crowding” to have multiple cues, but it is not fully independent information.

### complexity vs intensity (r = -0.444261, MODERATELY RELATED)

- **Likely meaning**: in this cache, higher `intensity` tends to coincide with **lower** `complexity`.
- **Interpretation risk**: this suggests `complexity` here is *not* “energy/busyness,” but something closer to “structural/harmonic/arrangement complexity” (which can be high in quieter orchestral/jazz, etc.).
- **Design implication**: `complexity` and `intensity` are not redundant; they may encode competing notions of “dense.” A density dimension must choose whether to treat those as distinct components or pick one definition.

### event_density vs absolute_loudness (r = 0.410934, MODERATELY RELATED)

- **Likely meaning**: more event activity often correlates with louder productions, but only moderately.
- **Design implication**: you can include `event_density` without necessarily importing loudness; however, adding `absolute_loudness` on top will bias density toward modern loud mixes.

### complexity vs flatness (r = -0.368866, MOSTLY INDEPENDENT)

- **Likely meaning**: noisier/more broadband mixes (`flatness` high) are *slightly* associated with lower `complexity` in this dataset.
- **Design implication**: they are largely independent; `flatness` is a “texture” signal while `complexity` is capturing something orthogonal.

### event_density vs intensity (r = 0.345785, MOSTLY INDEPENDENT)

- **Likely meaning**: more events can be somewhat more intense, but there’s lots of variance.
- **Design implication**: `event_density` is not just “energy.” Treat `intensity` as optional secondary support rather than a core density axis.

### flatness vs intensity (r = 0.300998, MOSTLY INDEPENDENT)

- **Likely meaning**: intense tracks can be more noise-like/broadband, but this is not a tight coupling.
- **Design implication**: `flatness` can be included as a crowding proxy without necessarily duplicating `intensity`.

### zero_cross_rate vs absolute_loudness (r = 0.293862, MOSTLY INDEPENDENT)

- **Likely meaning**: louder tracks can have more HF/transient/noisy content, but it’s weak-to-moderate.
- **Design implication**: `zero_cross_rate` is not “just loudness,” so it can add texture information if you want it.

### flatness vs absolute_loudness (r = 0.217995, MOSTLY INDEPENDENT)

- **Likely meaning**: weak association; loud mixes aren’t always noise-like and vice versa.
- **Design implication**: including `flatness` does not automatically replicate loudness.

### event_density vs complexity (r = 0.199765, MOSTLY INDEPENDENT)

- **Likely meaning**: event activity and complexity are largely distinct.
- **Design implication**: these are good candidates to pair in a density definition because they are **not redundant**.

### complexity vs absolute_loudness (r = -0.182973, MOSTLY INDEPENDENT)

- **Likely meaning**: slightly quieter tracks can be more complex, but weak.
- **Design implication**: loudness is not a proxy for complexity; including both introduces different information (but also introduces loudness confounds).

### event_density vs zero_cross_rate (r = 0.179013, MOSTLY INDEPENDENT)

- **Likely meaning**: event activity is only weakly tied to HF/transient activity.
- **Design implication**: treating “activity” and “texture” as separate components is supported.

### zero_cross_rate vs intensity (r = 0.148478, MOSTLY INDEPENDENT)

- **Likely meaning**: weak link between HF/transient proxy and intensity.
- **Design implication**: `zero_cross_rate` is not redundant with `intensity`.

### complexity vs zero_cross_rate (r = -0.036972, MOSTLY INDEPENDENT)

- **Likely meaning**: essentially no linear relationship.
- **Design implication**: strongest evidence in this table that “complexity” and “spectral texture” are independent axes.

### event_density vs flatness (r = 0.035380, MOSTLY INDEPENDENT)

- **Likely meaning**: essentially no relationship.
- **Design implication**: `event_density` (activity) and `flatness` (crowding/noise-like texture) are complementary.

---
# SECTION 4 — Unique Information Analysis (qualitative, grounded in correlations)
This section is interpretive; the correlation table above indicates what is likely redundant vs additive.

## event_density
- Unique hypothesis: **event/onset activity rate** (how frequently events occur).
- Expectation: tends to be less tied to purely spectral/noise measures than flatness/ZCR, though it can correlate via percussiveness.

Data evidence:

- Correlates weakly with:
  - `flatness` (r = 0.035)
  - `zero_cross_rate` (r = 0.179)
  - `complexity` (r = 0.200)
- Only moderate relationship to `absolute_loudness` (r = 0.411)

Implication:

- `event_density` is one of the cleanest “activity” signals available and is not just a proxy for “loud/noisy.”

## complexity
- Unique hypothesis: **informational / structural complexity** beyond raw event rate.
- Potential redundancy: can correlate with textural features depending on genre/arrangement.

Data evidence:

- Near-zero relationship to `zero_cross_rate` (r = -0.037)
- Moderate negative relationship to `intensity` (r = -0.444)

Implication:

- `complexity` is capturing a different axis than “energy” and “spectral brightness/noise.” It is a strong candidate if density is meant to include “how much information is present,” not just how loud/busy it feels.

## flatness
- Unique hypothesis: **spectral noisiness / broadband texture** (crowding proxy).
- Risk: can conflate “noisy/distorted” with “dense.”

Data evidence:

- Moderate relationship to `zero_cross_rate` (r = 0.641)
- Weak relationship to `event_density` (r = 0.035)

Implication:

- `flatness` is a good “sonic crowding” channel. It does overlap with `zero_cross_rate`, so it may be sufficient alone if you want a single texture proxy.

## zero_cross_rate
- Unique hypothesis: **high-frequency/transient/noise activity proxy**.
- Often overlaps with spectral brightness/roll-off family; may be partially redundant with flatness.

Data evidence:

- Moderate relationship to `flatness` (r = 0.641)
- Weak relationship to `event_density` (r = 0.179)

Implication:

- `zero_cross_rate` adds a distinct “HF/transient texture” cue that is not the same as event activity, but it partially duplicates `flatness`.

## intensity
- Unique hypothesis: **energetic drive / macro loudness-energy proxy** (often correlates with loudness).
- Risk: may measure “energy” more than “density.”

Data evidence:

- Highly redundant with `absolute_loudness` (r = 0.828)
- Moderately opposed to `complexity` (r = -0.444)

Implication:

- `intensity` should be treated as optional or excluded if density must be independent from energy/loudness.

## absolute_loudness
- Unique hypothesis: **mastering level / overall level**; correlated with modern dense production, but heavily confounded.
- High redundancy expected vs `loudness` and partial redundancy vs `intensity`.

Data evidence:

- Highly redundant with `intensity` (r = 0.828)
- Moderately related to `event_density` (r = 0.411)

Implication:

- `absolute_loudness` is not necessary for density unless you explicitly want density to reflect production loudness.

---
# SECTION 5 — Density Dimension Candidates (proposal-only)
These are *descriptor set* candidates only (no weights / no implementation).

## Candidate A — Minimal density model
- Include: `event_density`, `complexity`
- Exclude: `flatness`, `zero_cross_rate`, `intensity`, `absolute_loudness`
- Reason: aims to represent density as *activity + informational complexity* with minimal confounds.

Why this is “minimal”:

- `event_density` and `complexity` are **mostly independent** (r = 0.200), so you aren’t double-measuring the same thing.
- Avoids the **highly redundant** level/energy pair (`intensity` vs `absolute_loudness`, r = 0.828).

## Candidate B — Balanced density model
- Include: `event_density`, `complexity`, `flatness`
- Exclude: `zero_cross_rate`, `intensity`, `absolute_loudness`
- Reason: adds a “sonic crowding” axis without pulling in loudness/energy.

Why this is “balanced”:

- Adds one explicit texture/crowding signal (`flatness`) that is near-independent of activity (`event_density` vs `flatness`, r = 0.035).
- Excludes `zero_cross_rate` because it is **moderately overlapping** with `flatness` (r = 0.641).

## Candidate C — Maximum-information density model
- Include: `event_density`, `complexity`, `flatness`, `zero_cross_rate`
- Exclude: `intensity`, `absolute_loudness`
- Reason: keeps multiple textural cues but avoids the loudness/energy confound set.

Why this is “maximum information”:

- Keeps both texture proxies despite overlap to reduce single-descriptor failure modes.
- Still avoids the most redundant/confounded axis (overall level/energy).

---
# SECTION 6 — Recommended Density Foundation (if designing V1 today)
Proposed foundation ranking (subject to the redundancy results above):

1. `event_density`
2. `complexity`
3. `flatness`
4. `zero_cross_rate`
5. `intensity` (optional)

Rationale: prioritize activity + complexity; add textural crowding; treat energy/loudness as secondary/optional.

More detailed rationale:

- **`event_density`**: the cleanest “how much is happening” signal and largely independent from spectral texture proxies.
- **`complexity`**: provides an orthogonal axis that does not collapse into loudness/brightness; captures “informational load.”
- **`flatness`**: a strong “sonic crowding/noise-like texture” cue with weak coupling to `event_density`.
- **`zero_cross_rate`**: useful additional texture cue, but partially redundant with `flatness`.
- **`intensity`**: de-prioritized due to strong redundancy with `absolute_loudness` (and conceptual overlap with “energy”).

---
# SECTION 7 — Final Recommendation (what density should represent)
Tentative recommendation: **D. Hybrid** (Event Activity + Informational Complexity + Sonic Crowding)

Reason: the calibration separation suggests density in practice is not a single axis; however, correlations should be used to avoid duplicating the same phenomenon (especially loudness/intensity overlap).

Why not a single axis:

- `event_density` and `flatness` are essentially unrelated (r = 0.035), yet both plausibly map to “dense” perception depending on genre:
  - fast rhythmic material can be dense by activity
  - slow but noisy/distorted material can be dense by crowding

Why loudness/energy should not be primary:

- `intensity` and `absolute_loudness` are highly redundant (r = 0.828). If density depends heavily on either, it will drift toward “loud = dense.”

Operational takeaway (for future design, still no implementation here):

- Treat density as a **3-component hybrid**:
  - **Activity**: `event_density`
  - **Informational complexity**: `complexity`
  - **Crowding/texture**: `flatness` (optionally `zero_cross_rate`)

---
## Output artifacts
- JSON: `experimentation/outputs/density_correlation_redundancy_analysis.json`
- Report: `experimentation/reports/density_correlation_redundancy_analysis.md`
