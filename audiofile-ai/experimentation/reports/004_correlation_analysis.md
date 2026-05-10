# 004 Correlation Analysis (Pearson, numeric descriptors)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Method

- Correlation: Pearson
- Minimum pair sample size (n): 10
- Limitation: Spearman correlation is not implemented yet (Phase 1).

## Strongest Observed Positive Correlations (Cautious)

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
| absolute_loudness | mfcc01 | 0.827296 | 140 |
| zero_cross_rate | centroid | 0.825851 | 140 |
| loudness | mfcc01 | 0.79635 | 140 |
| articulation | rhythmic_stability | 0.78946 | 140 |
| arousal | loudness | 0.736039 | 140 |

## Strongest Observed Negative Correlations (Cautious)

| A | B | r | n |
| --- | --- | --- | --- |
| pulse_clarity | complexity | -0.838399 | 140 |
| melodicity | dissonance | -0.74943 | 140 |
| rhythmic_stability | loudness_range | -0.589822 | 140 |
| articulation | complexity | -0.583659 | 140 |
| chroma04 | chroma10 | -0.583638 | 140 |
| rhythmic_stability | complexity | -0.582278 | 140 |
| electric_acoustic | articulation | -0.581481 | 140 |
| mfcc02 | mfcc04 | -0.56394 | 140 |
| electric_acoustic | flatness | -0.557037 | 140 |
| arousal | electric_acoustic | -0.551909 | 140 |
| electric_acoustic | centroid | -0.538483 | 140 |
| music_speech | melodicity | -0.535656 | 140 |
| electric_acoustic | rhythmic_stability | -0.533726 | 140 |
| electric_acoustic | spread | -0.530775 | 140 |
| electric_acoustic | mfcc01 | -0.527613 | 140 |

## V1-relevant Pairs (Requested inspection)

| A | B | r (Pearson) | n |
| --- | --- | --- | --- |
| arousal | intensity | 0.665963 | 140 |
| arousal | loudness | 0.736039 | 140 |
| arousal | danceability | 0.122769 | 140 |
| arousal | pulse_clarity | 0.484641 | 140 |
| danceability | pulse_clarity | 0.447798 | 140 |
| danceability | rhythmic_stability | 0.659374 | 140 |
| pulse_clarity | rhythmic_stability | 0.588676 | 140 |
| brightness | centroid | 0.548363 | 140 |
| brightness | roll_off | 0.895989 | 140 |
| brightness | flatness | 0.414028 | 140 |
| music_speech | vocal_instrumental | -0.10816 | 140 |
| event_density | complexity | 0.193391 | 140 |
| event_density | intensity | 0.399865 | 140 |
| dissonance | valence | 0.070598 | 140 |
| articulation | danceability | 0.544937 | 140 |

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
