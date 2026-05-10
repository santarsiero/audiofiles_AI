# 007 Feature Correlation Analysis (Composite features)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53

## Method

- Correlation: Pearson
- Minimum pair sample size (n): 10
- Limitation: Spearman correlation not implemented (Phase 2).

## Strongest Feature vs Feature Correlations (Observed, cautious)

| Feature A | Feature B | r | n |
| --- | --- | --- | --- |
| pulse_score_v1 | density_score_v1 | -0.77565 | 88 |
| energy_score_v1 | pulse_score_v1 | 0.628978 | 88 |
| energy_score_v1 | brightness_score_v1 | 0.433539 | 88 |
| energy_score_v1 | density_score_v1 | -0.381114 | 88 |
| brightness_score_v1 | vocal_presence_score_v1 | -0.173674 | 88 |
| brightness_score_v1 | pulse_score_v1 | 0.127905 | 88 |
| brightness_score_v1 | density_score_v1 | 0.121347 | 88 |
| pulse_score_v1 | vocal_presence_score_v1 | 0.06701 | 88 |
| energy_score_v1 | vocal_presence_score_v1 | 0.027262 | 88 |
| vocal_presence_score_v1 | density_score_v1 | 0.022496 | 88 |

## Strongest Feature vs Descriptor Correlations (Observed, cautious)

| Feature | Descriptor | r | n |
| --- | --- | --- | --- |
| brightness_score_v1 | centroid | 0.914761 | 88 |
| brightness_score_v1 | roll_off | 0.900204 | 88 |
| energy_score_v1 | intensity | 0.898431 | 88 |
| pulse_score_v1 | complexity | -0.878625 | 88 |
| pulse_score_v1 | pulse_clarity | 0.867438 | 88 |
| vocal_presence_score_v1 | vocal_instrumental | 0.846749 | 88 |
| pulse_score_v1 | rhythmic_stability | 0.837378 | 88 |
| energy_score_v1 | arousal | 0.835189 | 88 |
| energy_score_v1 | loudness | 0.833816 | 88 |
| brightness_score_v1 | flatness | 0.830045 | 88 |
| brightness_score_v1 | brightness | 0.827104 | 88 |
| density_score_v1 | complexity | 0.773799 | 88 |
| pulse_score_v1 | danceability | 0.766254 | 88 |
| energy_score_v1 | pulse_clarity | 0.698035 | 88 |
| brightness_score_v1 | spread | 0.681719 | 88 |

## Interpretation Notes (Cautious)

- Observed: some composite features may correlate strongly with each other, which suggests redundancy.
- Possible: a feature could be dominated by a single descriptor; check contributor metadata and correlations.
- Needs validation: correlation structure may change as more batches are added.

## Output Artifacts

- outputs/features/feature_correlations.json
- outputs/features/feature_correlations.csv
