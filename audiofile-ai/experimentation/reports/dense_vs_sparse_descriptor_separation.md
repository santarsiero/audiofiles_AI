# Dense vs Sparse — Descriptor Separation (Calibration Set)

## IMPORTANT

DO NOT IMPLEMENT.

DO NOT CHANGE CODE.

DO NOT CHANGE DENSITY.

This document is analysis/proposal only.

---

## Files Modified

None.

## Files Created

- `experimentation/outputs/descriptor_separation_dense_sparse.json`
- `experimentation/reports/dense_vs_sparse_descriptor_separation.md`

## Data Sources Used (offline)

- Calibration join: `experimentation/outputs/calibration_set_1_with_descriptors.json`
- Raw descriptors: `cache.rawDescriptorData` (Music Story)

---

# Group Definitions

Using **expected labels** from the calibration set:

- **Dense Group**: songs whose `expectedLabels` include `dense`
- **Sparse Group**: songs whose `expectedLabels` include `sparse`

Group sizes:

- Dense: `9`
- Sparse: `7`

Dense songs:

- Skrillex — Bangarang (feat. Sirah)
- Skrillex — Scary Monsters and Nice Sprites
- Sub Focus — Push The Tempo
- Sub Focus & Dimension — Desire
- Lil Jon & The East Side Boyz — Get Low
- Denzel Curry — STILL IN THE PAINT
- Nirvana — Smells Like Teen Spirit
- Camille Saint-Saëns — Danse macabre, Op. 40
- Antonín Dvořák — Symphony No. 9 … IV. Allegro con fuoco

Sparse songs:

- Daft Punk — Veridis Quo
- Rob $tone — Chill Bill (feat. J. Davi$ & Spooks)
- Bill Withers — Ain't No Sunshine
- Daft Punk — Something About Us
- Massive Attack — Angel
- Moby — Flower
- Suzanne Vega — Tom's Diner

---

# Method

For each numeric descriptor key present in at least one song in each group:

- Compute **Dense mean** and **Sparse mean**.
- Compute **absolute difference**: `|denseMean - sparseMean|`.
- Compute **normalized effect size**: **Cohen’s d** using pooled standard deviation.
- Rank descriptors by **separation strength** = `|d|` (descending).

Notes:

- This is a small-N analysis (9 vs 7). Effect sizes can be noisy.
- Some descriptors (e.g., `chroma*`, `mfcc*`) have very different numeric scales and are harder to interpret semantically; they still appear in the ranking because they separate the groups.

---

# 1) Descriptor ranking (Top 15 separators)

From `experimentation/outputs/descriptor_separation_dense_sparse.json`.

`effectSize` is Cohen’s d; `|d|` is separation strength.

| rank | descriptor | dense mean | sparse mean | abs diff | effectSize (d) | |d| |
|---:|---|---:|---:|---:|---:|---:|
| 1 | chroma11 | 5448.0000 | 2173.5714 | 3274.4286 | 1.9231 | 1.9231 |
| 2 | chroma04 | 2624.2222 | 944.1429 | 1680.0794 | 1.5395 | 1.5395 |
| 3 | chroma10 | 8639.4444 | 12501.0000 | 3861.5556 | -1.3485 | 1.3485 |
| 4 | mfcc13 | -0.2682 | -0.4252 | 0.1570 | 1.2601 | 1.2601 |
| 5 | mfcc06 | -0.1712 | 0.1400 | 0.3112 | -1.1073 | 1.1073 |
| 6 | event_density | 0.0538 | 0.0460 | 0.0078 | 1.0818 | 1.0818 |
| 7 | mfcc01 | -7.2447 | -9.9327 | 2.6880 | 1.0203 | 1.0203 |
| 8 | danceability | 0.5145 | 0.6896 | 0.1751 | -0.9585 | 0.9585 |
| 9 | flatness | 0.2673 | 0.2047 | 0.0626 | 0.9478 | 0.9478 |
| 10 | mfcc03 | -0.8323 | -0.2923 | 0.5400 | -0.9146 | 0.9146 |
| 11 | absolute_loudness | -13.7080 | -17.0409 | 3.3329 | 0.8783 | 0.8783 |
| 12 | complexity | 0.3928 | 0.2132 | 0.1796 | 0.8619 | 0.8619 |
| 13 | chroma07 | 4588.3333 | 2395.0000 | 2193.3333 | 0.8430 | 0.8430 |
| 14 | zero_cross_rate | 0.0610 | 0.0448 | 0.0162 | 0.8194 | 0.8194 |
| 15 | mfcc09 | -0.3795 | -0.5516 | 0.1722 | 0.8185 | 0.8185 |

---

# 2) Interpretation of each top-15 descriptor

This section interprets descriptors at two levels:

- **Directly interpretable (semantic)**: can plausibly map to density perception.
- **Latent timbral/harmonic features** (`mfcc*`, `chroma*`): separate groups but are not directly “density” concepts; they may proxy for instrumentation, spectral shape, or mix texture.

## chroma11 / chroma04 / chroma10 / chroma07

- What it is: chroma bins summarize energy distribution across pitch classes.
- Why it might separate: dense group spans orchestral + distorted rock + aggressive electronic, which may produce different harmonic occupancy patterns than the sparse group (downtempo, vocal-forward, simpler arrangements).
- Caution: chroma separation may reflect **genre/harmony** more than density itself.

## mfcc13 / mfcc06 / mfcc01 / mfcc03 / mfcc09

- What it is: MFCC coefficients summarize spectral envelope/timbre.
- Why it might separate: dense mixes often have broader/rougher spectral envelopes (distortion, layered synths, many instruments), while sparse mixes may have cleaner envelopes and more silence/space.
- Caution: MFCCs are hard to explain and can encode many confounds (recording era, production style, genre).

## event_density

- What it is: descriptor intended to reflect event/onset frequency.
- Separation direction: higher in Dense than Sparse (small absolute diff, but relatively consistent).
- Key finding: it does separate the calibration groups, but its global scale is very small (as established in the density distribution investigation).

## danceability

- What it is: suitability for dancing / rhythmic drive.
- Separation direction: higher in Sparse group here.
- Interpretation: in this calibration set, the sparse group includes rhythmic downtempo/steady tracks that can be danceable without being “dense.” This suggests danceability is **not a good primary density signal**.

## flatness

- What it is: spectral flatness (noise-like vs tonal).
- Separation direction: higher in Dense.
- Interpretation: dense mixes often contain more broadband/noise-like content (distortion, cymbals, layered textures), increasing flatness.

## absolute_loudness

- What it is: overall loudness level.
- Separation direction: louder in Dense (less negative dB).
- Interpretation: louder masters correlate with dense genres, but loudness is not density; it’s a **confounded but useful secondary correlate**.

## complexity

- What it is: a global complexity descriptor.
- Separation direction: higher in Dense.
- Interpretation: aligns with “more information / more going on,” a plausible contributor to perceived density.

## zero_cross_rate

- What it is: rate of sign changes in waveform; correlates with noisiness/brightness/transient density.
- Separation direction: higher in Dense.
- Interpretation: a plausible proxy for “busy/noisy” texture that can feel dense.

---

# 3) Candidate density formulas using only separating descriptors

Constraints for this section:

- Use only descriptors that actually separate the Dense vs Sparse groups (from ranking).
- Do **not** implement.

Because MFCC/chroma features are less interpretable, I’m providing two categories:

- **Interpretable formulas** (preferred for explainability)
- **Latent-feature formulas** (higher predictive power possible, lower explainability)

## A) Interpretable candidate formulas

### Formula A1 — “Activity + complexity” density

Inputs (all separate Dense vs Sparse here):

- `event_density`
- `complexity`
- `zero_cross_rate`

Rationale:

- event rate + macro complexity + transient/noise proxy.

Example form:

- `density = w1*event_density + w2*complexity + w3*zero_cross_rate`

Pros:

- Interpretable.
- Uses descriptors that align with intuitive density.

Cons:

- event_density range is tiny; without rescaling it may contribute little numerically.
- zero_cross_rate may proxy brightness/noise more than layering.

### Formula A2 — “Crowding proxy” density (textural)

Inputs:

- `flatness`
- `complexity`
- `zero_cross_rate`

Rationale:

- Dense mixes often have more broadband content + complex texture.

Example form:

- `density = w1*flatness + w2*complexity + w3*zero_cross_rate`

Pros:

- Avoids reliance on tiny event_density scale.
- Maps to “crowding/texture” more than rhythmic activity.

Cons:

- Could label distorted-but-sparse arrangements as dense.

### Formula A3 — “Perceived intensity load” density (confounded)

Inputs:

- `absolute_loudness`
- `flatness`
- `complexity`

Rationale:

- Uses loudness as a secondary correlate of dense production, plus spectral and complexity cues.

Pros:

- Might match perceived density in modern production.

Cons:

- Loudness is a strong confound (mastering/genre).
- Risk: equates “loud” with “dense.”

## B) Latent-feature candidate formulas (less explainable)

### Formula B1 — “Spectral envelope separator” density

Inputs:

- `mfcc01`, `mfcc03`, `mfcc06`, `mfcc09`, `mfcc13`

Example form:

- `density = Σ wi * mfcci`

Pros:

- These features show strong separation in this calibration set.

Cons:

- Hard to explain and validate semantically.
- Likely to encode genre/production confounds.

### Formula B2 — “Harmonic occupancy separator” density

Inputs:

- `chroma04`, `chroma07`, `chroma10`, `chroma11`

Pros:

- Strong separation in this calibration set.

Cons:

- Very likely to measure harmony/genre rather than density.

---

# Additional notes / cautions

- The calibration split (dense=9, sparse=7) is small and covers diverse genres; separation can reflect genre differences.
- Any “density meaning” decision should prioritize:
  - interpretable descriptors
  - stability across genre
  - avoiding mastering/era confounds (loudness)

---

# Stop condition

This task is complete as analysis only. No code changes were made.
