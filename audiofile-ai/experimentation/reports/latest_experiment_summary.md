# Latest Experiment Summary (Music Story cache analysis)

## Status (2026-05)

This summary is a historical snapshot from an earlier Music Story cache analysis run. The Music Story-only experimentation phase has since been closed; use these final reports as the canonical status:

- `experimentation/reports/final_feature_stability_report.md`
- `experimentation/reports/final_descriptor_dependency_report.md`
- `experimentation/reports/final_latent_structure_summary.md`
- `experimentation/reports/musicstory_phase_closure_summary.md`

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69
- Success rate: 66.99%

## Failure Types (Observed)

```json
{
  "no_recording_hit": 50,
  "audiodescriptions_404": 14,
  "rate_limited_429": 5,
  "other": 0
}
```

## Descriptor Schema (Observed)

- Numeric descriptors analyzed: 52
- Fields present in all successful payloads: 54

## Most Common Moods (Observed)

| Mood | Count |
| --- | --- |
| Energic | 103 |
| Happy | 65 |
| Convinced | 42 |
| Impatient | 41 |
| Astonished/Aroused | 39 |
| Sad | 37 |
| Tense/Alarmed/Afraid | 32 |
| Frustrated | 31 |
| Delighted | 26 |
| Excited | 21 |
| Angry | 20 |
| Interested | 17 |
| Distrustful | 12 |
| Neutral | 12 |
| Discontented | 8 |

## Most Common Timbres (Observed)

| Timbre | Count |
| --- | --- |
| Electric | 125 |
| Vocal | 96 |
| Instrumental | 13 |
| Acoustic | 6 |
| Piano | 5 |
| Guitar | 3 |

## Most Common Themes (Observed)

| Theme | Count |
| --- | --- |
| Party | 42 |
| VideoGame | 25 |
| Diner | 23 |
| Roadtrip | 17 |
| Teen | 15 |
| Work | 11 |
| Morning | 9 |
| Concentration | 1 |

## Top 10 Strongest Correlations (Pearson, observed)

| A | B | r | n |
| --- | --- | --- | --- |
| loudness | absolute_loudness | 0.971643 | 140 |
| centroid | flatness | 0.95355 | 140 |
| spread | flatness | 0.947541 | 140 |
| roll_off | zero_cross_rate | 0.925847 | 140 |
| roll_off | brightness | 0.895989 | 140 |
| intensity | loudness | 0.893036 | 140 |
| centroid | spread | 0.883262 | 140 |
| intensity | absolute_loudness | 0.859229 | 140 |
| arousal | mfcc01 | 0.849683 | 140 |
| brightness | zero_cross_rate | 0.844638 | 140 |

## Top 10 V1-relevant Correlations (Pearson, observed)

| A | B | r | n |
| --- | --- | --- | --- |
| intensity | loudness | 0.893036 | 140 |
| arousal | loudness | 0.736039 | 140 |
| arousal | intensity | 0.665963 | 140 |
| danceability | rhythmic_stability | 0.659374 | 140 |
| rhythmic_stability | loudness_range | -0.589822 | 140 |
| rhythmic_stability | pulse_clarity | 0.588676 | 140 |
| pulse_clarity | intensity | 0.560778 | 140 |
| brightness | centroid | 0.548363 | 140 |
| arousal | rhythmic_stability | 0.52413 | 140 |
| arousal | centroid | 0.504725 | 140 |

## Composite Feature Research (Observed, exploratory)

### Dataset Context (Feature generation)

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

### Summary (Cautious)

- Feature count (defined): 5
- Possible collapsed features (heuristic): (none flagged)

### Feature Coverage (Observed counts)

| Feature | Count |
| --- | --- |
| energy_score_v1 | 140 |
| brightness_score_v1 | 140 |
| pulse_score_v1 | 140 |
| vocal_presence_score_v1 | 140 |
| density_score_v1 | 140 |

### Strongest Feature vs Feature Correlations (Pearson, observed)

| A | B | r | n |
| --- | --- | --- | --- |
| pulse_score_v1 | density_score_v1 | -0.769657 | 140 |
| energy_score_v1 | pulse_score_v1 | 0.702706 | 140 |
| energy_score_v1 | brightness_score_v1 | 0.466635 | 140 |
| energy_score_v1 | density_score_v1 | -0.347334 | 140 |
| brightness_score_v1 | pulse_score_v1 | 0.244262 | 140 |
| brightness_score_v1 | vocal_presence_score_v1 | -0.09623 | 140 |
| pulse_score_v1 | vocal_presence_score_v1 | 0.095077 | 140 |
| brightness_score_v1 | density_score_v1 | 0.066338 | 140 |
| vocal_presence_score_v1 | density_score_v1 | -0.043044 | 140 |
| energy_score_v1 | vocal_presence_score_v1 | 0.019333 | 140 |

### Notes (Cautious)

- Observed: composite features may show partial redundancy depending on shared descriptors.
- Possible: some features may be dominated by a single descriptor; check feature-vs-descriptor correlations.
- Needs validation: feature orientation (e.g., vocal presence) may be ambiguous without listening review.

## Warnings

These warnings suggest possible dataset or parsing issues. They do not necessarily indicate incorrect provider behavior.

```json
[]
```

## Known Limitations

- Spearman correlation is not implemented yet (Phase 1). Pearson correlations only.
- Correlations appear dataset-dependent; additional batches may change these values.
- This summary is exploratory and does not represent validated mapping or ground truth.

## Next Recommended Analysis Step (Cautious)

- Possible: manually review a small set of high-correlation pairs and representative tracks to see if the relationship appears meaningful.
- Possible: extend datasets incrementally (more batches) and compare whether distributions/correlations remain stable.
