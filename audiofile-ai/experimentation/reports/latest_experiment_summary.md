# Latest Experiment Summary (Music Story cache analysis)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53
- Success rate: 62.41%

## Failure Types (Observed)

```json
{
  "no_recording_hit": 34,
  "audiodescriptions_404": 9,
  "rate_limited_429": 10,
  "other": 0
}
```

## Descriptor Schema (Observed)

- Numeric descriptors analyzed: 52
- Fields present in all successful payloads: 54

## Most Common Moods (Observed)

| Mood | Count |
| --- | --- |
| Energic | 66 |
| Happy | 44 |
| Astonished/Aroused | 28 |
| Convinced | 26 |
| Sad | 25 |
| Impatient | 23 |
| Frustrated | 22 |
| Delighted | 19 |
| Tense/Alarmed/Afraid | 18 |
| Excited | 17 |
| Angry | 10 |
| Interested | 10 |
| Distrustful | 9 |
| Discontented | 7 |
| Neutral | 6 |

## Most Common Timbres (Observed)

| Timbre | Count |
| --- | --- |
| Electric | 78 |
| Vocal | 59 |
| Instrumental | 8 |
| Acoustic | 3 |
| Piano | 3 |
| Guitar | 2 |

## Most Common Themes (Observed)

| Theme | Count |
| --- | --- |
| Party | 26 |
| VideoGame | 18 |
| Diner | 12 |
| Teen | 8 |
| Work | 7 |
| Roadtrip | 7 |
| Morning | 5 |

## Top 10 Strongest Correlations (Pearson, observed)

| A | B | r | n |
| --- | --- | --- | --- |
| loudness | absolute_loudness | 0.979394 | 88 |
| centroid | flatness | 0.953619 | 88 |
| spread | flatness | 0.950265 | 88 |
| roll_off | zero_cross_rate | 0.932708 | 88 |
| roll_off | brightness | 0.92063 | 88 |
| centroid | spread | 0.888 | 88 |
| intensity | loudness | 0.883559 | 88 |
| brightness | zero_cross_rate | 0.850833 | 88 |
| intensity | absolute_loudness | 0.842913 | 88 |
| zero_cross_rate | centroid | 0.832428 | 88 |

## Top 10 V1-relevant Correlations (Pearson, observed)

| A | B | r | n |
| --- | --- | --- | --- |
| intensity | loudness | 0.883559 | 88 |
| danceability | rhythmic_stability | 0.68684 | 88 |
| arousal | loudness | 0.65909 | 88 |
| arousal | intensity | 0.621082 | 88 |
| rhythmic_stability | pulse_clarity | 0.576525 | 88 |
| brightness | centroid | 0.549184 | 88 |
| arousal | centroid | 0.537639 | 88 |
| pulse_clarity | intensity | 0.523043 | 88 |
| arousal | rhythmic_stability | 0.50898 | 88 |
| arousal | brightness | 0.508165 | 88 |

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
