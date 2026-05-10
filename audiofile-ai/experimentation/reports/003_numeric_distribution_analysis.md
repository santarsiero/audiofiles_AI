# 003 Numeric Distribution Analysis (Music Story numeric fields)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53

## Notes (Cautious)

This analysis summarizes numeric descriptor distributions across successful payloads. It appears useful for identifying: (a) descriptors with strong spread, (b) descriptors with weak spread (possible collapse), and (c) descriptors that may require normalization review.

No feature formulas or label mappings are defined here.

## Descriptors with Strong Spread (Observed)

| Key | Category | Count | Std | Unique | V1 relevant |
| --- | --- | --- | --- | --- | --- |
| chroma01 | chroma_numeric | 88 | 2465.401166 | 87 | false |
| chroma10 | chroma_numeric | 88 | 2447.285773 | 88 | false |
| chroma03 | chroma_numeric | 88 | 2412.437468 | 88 | false |
| chroma06 | chroma_numeric | 88 | 2408.506032 | 87 | false |
| chroma08 | chroma_numeric | 88 | 2334.13765 | 87 | false |
| chroma02 | chroma_numeric | 88 | 2318.708948 | 88 | false |
| chroma11 | chroma_numeric | 88 | 2177.289882 | 88 | false |
| chroma05 | chroma_numeric | 88 | 1776.659421 | 87 | false |
| chroma12 | chroma_numeric | 88 | 1724.228385 | 88 | false |
| chroma09 | chroma_numeric | 88 | 1508.457027 | 86 | false |
| chroma04 | chroma_numeric | 88 | 1291.043941 | 88 | false |
| centroid | spectral_numeric | 88 | 776.695289 | 88 | true |
| roll_off | spectral_numeric | 88 | 672.376557 | 88 | false |
| spread | spectral_numeric | 88 | 547.10795 | 88 | false |
| bpm | core_semantic_numeric | 88 | 41.742349 | 55 | false |
| loudness | core_semantic_numeric | 88 | 2.773819 | 88 | true |
| loudness_range | core_semantic_numeric | 88 | 2.76115 | 88 | true |
| absolute_loudness | core_semantic_numeric | 88 | 2.603939 | 88 | false |
| mfcc01 | mfcc_numeric | 88 | 1.615833 | 88 | false |
| mfcc03 | mfcc_numeric | 88 | 0.479478 | 88 | false |

## Descriptors with Weak Spread (Observed)

| Key | Category | Count | Std | Unique | V1 relevant |
| --- | --- | --- | --- | --- | --- |
| event_density | core_semantic_numeric | 88 | 0.007288 | 88 | true |
| zero_cross_rate | spectral_numeric | 88 | 0.019812 | 88 | false |

## V1 Active / Relevant Keys (Observed coverage + variability)

| Key | Count | Coverage | Std | Possible collapse |
| --- | --- | --- | --- | --- |
| arousal | 88 | 100% | 0.153953 | false |
| danceability | 88 | 100% | 0.114344 | false |
| event_density | 88 | 100% | 0.007288 | true |
| intensity | 88 | 100% | 0.066539 | false |
| loudness | 88 | 100% | 2.773819 | false |
| loudness_range | 88 | 100% | 2.76115 | false |
| music_speech | 88 | 100% | 0.05833 | false |
| pulse_clarity | 88 | 100% | 0.219647 | false |
| rhythmic_stability | 88 | 100% | 0.065227 | false |
| vocal_instrumental | 88 | 100% | 0.228459 | false |
| brightness | 88 | 100% | 0.071064 | false |
| centroid | 88 | 100% | 776.695289 | false |

## Output Artifacts

- outputs/descriptors/numeric_distribution_summary.json
- outputs/descriptors/numeric_distribution_summary.csv

## Warnings

```json
[]
```
