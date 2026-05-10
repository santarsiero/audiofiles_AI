# 007 Feature Correlation Analysis (Composite features)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Method

- Correlation: Pearson
- Minimum pair sample size (n): 10
- Limitation: Spearman correlation not implemented (Phase 2).

## Strongest Feature vs Feature Correlations (Observed, cautious)

| Feature A | Feature B | r | n |
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

## Strongest Feature vs Descriptor Correlations (Observed, cautious)

| Feature | Descriptor | r | n |
| --- | --- | --- | --- |
| brightness_score_v1 | centroid | 0.919824 | 140 |
| brightness_score_v1 | roll_off | 0.897303 | 140 |
| pulse_score_v1 | complexity | -0.895271 | 140 |
| pulse_score_v1 | pulse_clarity | 0.890599 | 140 |
| energy_score_v1 | intensity | 0.886621 | 140 |
| energy_score_v1 | arousal | 0.870739 | 140 |
| energy_score_v1 | loudness | 0.861565 | 140 |
| brightness_score_v1 | flatness | 0.840768 | 140 |
| vocal_presence_score_v1 | vocal_instrumental | 0.829445 | 140 |
| pulse_score_v1 | rhythmic_stability | 0.822196 | 140 |
| brightness_score_v1 | brightness | 0.818939 | 140 |
| density_score_v1 | complexity | 0.792624 | 140 |
| energy_score_v1 | pulse_clarity | 0.746454 | 140 |
| pulse_score_v1 | danceability | 0.740899 | 140 |
| brightness_score_v1 | spread | 0.6895 | 140 |

## Interpretation Notes (Cautious)

- Observed: some composite features may correlate strongly with each other, which suggests redundancy.
- Possible: a feature could be dominated by a single descriptor; check contributor metadata and correlations.
- Needs validation: correlation structure may change as more batches are added.

## Output Artifacts

- outputs/features/feature_correlations.json
- outputs/features/feature_correlations.csv
