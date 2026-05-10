# 006 Feature Distribution Analysis (Composite features)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Summary (Observed, cautious)

This analysis summarizes distribution statistics for experimental composite features. It appears useful for detecting collapse risk and outliers, but requires validation.

## Strongest Spread Features (Observed)

| Feature | Std | Unique |
| --- | --- | --- |
| pulse_score_v1 | 0.182337 | 140 |
| brightness_score_v1 | 0.163572 | 140 |
| energy_score_v1 | 0.162686 | 140 |
| vocal_presence_score_v1 | 0.154702 | 140 |
| density_score_v1 | 0.096816 | 140 |

## Possible Collapse Flags (Observed)

| Feature | Std | Unique |
| --- | --- | --- |
| (none flagged) |  |  |

## Output Artifacts

- outputs/features/feature_distribution_summary.json
- outputs/features/feature_distribution_summary.csv
