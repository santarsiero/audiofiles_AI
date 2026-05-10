# 004 Correlation Analysis (Pearson, numeric descriptors)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53

## Method

- Correlation: Pearson
- Minimum pair sample size (n): 10
- Limitation: Spearman correlation is not implemented yet (Phase 1).

## Strongest Observed Positive Correlations (Cautious)

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
| articulation | rhythmic_stability | 0.826946 | 88 |
| arousal | mfcc01 | 0.824636 | 88 |
| absolute_loudness | mfcc01 | 0.752428 | 88 |
| chroma05 | chroma12 | 0.745639 | 88 |
| loudness | mfcc01 | 0.722499 | 88 |

## Strongest Observed Negative Correlations (Cautious)

| A | B | r | n |
| --- | --- | --- | --- |
| pulse_clarity | complexity | -0.829915 | 88 |
| melodicity | dissonance | -0.720765 | 88 |
| mfcc02 | mfcc04 | -0.630128 | 88 |
| rhythmic_stability | complexity | -0.604768 | 88 |
| electric_acoustic | spread | -0.577943 | 88 |
| electric_acoustic | flatness | -0.573256 | 88 |
| chroma02 | chroma08 | -0.566437 | 88 |
| articulation | complexity | -0.564359 | 88 |
| music_speech | melodicity | -0.556674 | 88 |
| chroma04 | chroma10 | -0.556039 | 88 |
| electric_acoustic | articulation | -0.545725 | 88 |
| electric_acoustic | centroid | -0.541892 | 88 |
| chroma03 | chroma09 | -0.500181 | 88 |
| danceability | complexity | -0.495176 | 88 |
| electric_acoustic | pulse_clarity | -0.479153 | 88 |

## V1-relevant Pairs (Requested inspection)

| A | B | r (Pearson) | n |
| --- | --- | --- | --- |
| arousal | intensity | 0.621082 | 88 |
| arousal | loudness | 0.65909 | 88 |
| arousal | danceability | 0.085509 | 88 |
| arousal | pulse_clarity | 0.409874 | 88 |
| danceability | pulse_clarity | 0.428703 | 88 |
| danceability | rhythmic_stability | 0.68684 | 88 |
| pulse_clarity | rhythmic_stability | 0.576525 | 88 |
| brightness | centroid | 0.549184 | 88 |
| brightness | roll_off | 0.92063 | 88 |
| brightness | flatness | 0.40316 | 88 |
| music_speech | vocal_instrumental | -0.001862 | 88 |
| event_density | complexity | 0.308709 | 88 |
| event_density | intensity | 0.269546 | 88 |
| dissonance | valence | 0.220459 | 88 |
| articulation | danceability | 0.592597 | 88 |

## Interpretation Notes (Cautious)

- Observed: some descriptor pairs may show strong linear relationships, which suggests potential redundancy.
- Possible: correlations may be dataset-dependent; additional batches may change these relationships.
- Needs validation: correlations do not imply causal meaning and should not be treated as ground truth mapping.

## Output Artifacts

- outputs/correlations/correlation_matrix.json
- outputs/correlations/top_correlations.csv
- outputs/correlations/v1_relevant_correlations.csv

## Warnings

```json
[]
```
