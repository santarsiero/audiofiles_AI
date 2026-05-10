# 005 Generate Feature Scores (Composite Feature Research)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Feature Formulas (Exploratory)

These formulas are experimental composites built from Music Story descriptors. They appear useful for research, but they do not represent validated semantics or final mapping.

| Feature | Descriptor contributors |
| --- | --- |
| energy_score_v1 | arousal, intensity, loudness, articulation, pulse_clarity |
| brightness_score_v1 | brightness, roll_off, centroid, flatness |
| pulse_score_v1 | pulse_clarity, rhythmic_stability, danceability, complexity |
| vocal_presence_score_v1 | vocal_instrumental, music_speech |
| density_score_v1 | event_density, complexity, loudness_range, spread |

## Normalization Assumptions

- Method: dataset min-max scaling per descriptor (computed from successful payloads only).
- Scores are clamped to [0, 1].
- Missing descriptors are handled gracefully; contributor metadata records what was used.

## Feature Coverage (Observed)

| Feature | Count | Coverage among successes |
| --- | --- | --- |
| energy_score_v1 | 140 | 100% |
| brightness_score_v1 | 140 | 100% |
| pulse_score_v1 | 140 | 100% |
| vocal_presence_score_v1 | 140 | 100% |
| density_score_v1 | 140 | 100% |

## Extremes (Observed, for later human sanity-review)

This section lists the highest/lowest scoring songs per feature. These extremes may help manual validation, but do not imply semantic truth.

## Warnings

```json
[]
```

## Output Artifacts

- outputs/features/generated_feature_scores.json
- outputs/features/generated_feature_scores.csv
