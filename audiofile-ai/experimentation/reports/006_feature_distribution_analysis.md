# 006 Feature Distribution Analysis (Composite features)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53

## Summary (Observed, cautious)

This analysis summarizes distribution statistics for experimental composite features. It appears useful for detecting collapse risk and outliers, but requires validation.

## Strongest Spread Features (Observed)

| Feature | Std | Unique |
| --- | --- | --- |
| pulse_score_v1 | 0.200464 | 88 |
| brightness_score_v1 | 0.17921 | 88 |
| energy_score_v1 | 0.169399 | 88 |
| vocal_presence_score_v1 | 0.157069 | 88 |
| density_score_v1 | 0.106693 | 88 |

## Possible Collapse Flags (Observed)

| Feature | Std | Unique |
| --- | --- | --- |
| (none flagged) |  |  |

## Output Artifacts

- outputs/features/feature_distribution_summary.json
- outputs/features/feature_distribution_summary.csv
