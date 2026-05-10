# 003 Numeric Distribution Analysis (Music Story numeric fields)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Notes (Cautious)

This analysis summarizes numeric descriptor distributions across successful payloads. It appears useful for identifying: (a) descriptors with strong spread, (b) descriptors with weak spread (possible collapse), and (c) descriptors that may require normalization review.

No feature formulas or label mappings are defined here.

## Descriptors with Strong Spread (Observed)

| Key | Category | Count | Std | Unique | V1 relevant |
| --- | --- | --- | --- | --- | --- |
| chroma10 | chroma_numeric | 140 | 2681.305471 | 140 | false |
| chroma01 | chroma_numeric | 140 | 2441.495494 | 139 | false |
| chroma06 | chroma_numeric | 140 | 2345.920249 | 138 | false |
| chroma03 | chroma_numeric | 140 | 2335.961458 | 140 | false |
| chroma02 | chroma_numeric | 140 | 2218.710948 | 140 | false |
| chroma08 | chroma_numeric | 140 | 2164.507432 | 139 | false |
| chroma11 | chroma_numeric | 140 | 2085.702592 | 139 | false |
| chroma05 | chroma_numeric | 140 | 1759.922422 | 139 | false |
| chroma12 | chroma_numeric | 140 | 1712.142696 | 138 | false |
| chroma09 | chroma_numeric | 140 | 1510.368075 | 137 | false |
| chroma04 | chroma_numeric | 140 | 1247.496205 | 139 | false |
| centroid | spectral_numeric | 140 | 765.168477 | 140 | true |
| roll_off | spectral_numeric | 140 | 668.27417 | 140 | false |
| spread | spectral_numeric | 140 | 521.676024 | 140 | false |
| bpm | core_semantic_numeric | 140 | 39.358966 | 72 | false |
| loudness | core_semantic_numeric | 140 | 3.224476 | 140 | true |
| loudness_range | core_semantic_numeric | 140 | 3.183835 | 140 | true |
| absolute_loudness | core_semantic_numeric | 140 | 2.874409 | 140 | false |
| mfcc01 | mfcc_numeric | 140 | 1.743278 | 140 | false |
| mfcc03 | mfcc_numeric | 140 | 0.482744 | 140 | false |

## Descriptors with Weak Spread (Observed)

| Key | Category | Count | Std | Unique | V1 relevant |
| --- | --- | --- | --- | --- | --- |
| event_density | core_semantic_numeric | 140 | 0.007261 | 140 | true |
| zero_cross_rate | spectral_numeric | 140 | 0.019023 | 140 | false |

## V1 Active / Relevant Keys (Observed coverage + variability)

| Key | Count | Coverage | Std | Possible collapse |
| --- | --- | --- | --- | --- |
| arousal | 140 | 100% | 0.17488 | false |
| danceability | 140 | 100% | 0.125922 | false |
| event_density | 140 | 100% | 0.007261 | true |
| intensity | 140 | 100% | 0.074428 | false |
| loudness | 140 | 100% | 3.224476 | false |
| loudness_range | 140 | 100% | 3.183835 | false |
| music_speech | 140 | 100% | 0.066261 | false |
| pulse_clarity | 140 | 100% | 0.222206 | false |
| rhythmic_stability | 140 | 100% | 0.068233 | false |
| vocal_instrumental | 140 | 100% | 0.236292 | false |
| brightness | 140 | 100% | 0.066505 | false |
| centroid | 140 | 100% | 765.168477 | false |

## Output Artifacts

- outputs/descriptors/numeric_distribution_summary.json
- outputs/descriptors/numeric_distribution_summary.csv

## Warnings

```json
[]
```
