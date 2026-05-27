# FINAL_DESCRIPTOR_DEPENDENCY_REPORT (Music Story-only phase)

## Purpose

Empirical descriptor → feature dependency summary: which upstream descriptors drive each feature, which features are descriptor wrappers, and which descriptors are high-leverage.

## Evidence sources used

- CONTROL_1: experimentation/outputs/control_1_feature_calibration.json
- CONTROL_2: experimentation/outputs/control_2_dimension_independence_analysis_v2.json
- CONTROL_3: experimentation/outputs/control_3_manifold_stress_test.json

## Descriptor availability (CONTROL_3 sampled set)

- arousal: availability=100.0% present=260/260 p10/p50/p90=0.481 / 0.693 / 0.898
- articulation: availability=100.0% present=260/260 p10/p50/p90=0.431 / 0.546 / 0.661
- dissonance: availability=100.0% present=260/260 p10/p50/p90=0.413 / 0.508 / 0.610
- event_density: availability=100.0% present=260/260 p10/p50/p90=0.045 / 0.053 / 0.064
- flatness: availability=100.0% present=260/260 p10/p50/p90=0.197 / 0.269 / 0.344
- intensity: availability=100.0% present=260/260 p10/p50/p90=0.134 / 0.229 / 0.329
- loudness_range: availability=100.0% present=260/260 p10/p50/p90=1.000 / 1.000 / 1.000
- loudness_score: availability=100.0% present=260/260 p10/p50/p90=0.514 / 0.693 / 0.830
- low_valence_score: availability=100.0% present=260/260 p10/p50/p90=0.236 / 0.557 / 0.857
- music_speech: availability=100.0% present=260/260 p10/p50/p90=0.023 / 0.061 / 0.156
- pulse_clarity: availability=100.0% present=260/260 p10/p50/p90=0.219 / 0.609 / 0.818
- rhythmic_stability: availability=100.0% present=260/260 p10/p50/p90=0.523 / 0.609 / 0.684
- spectral_centroid_or_brightness: availability=100.0% present=260/260 p10/p50/p90=0.074 / 0.146 / 0.236
- spectral_complexity: availability=100.0% present=260/260 p10/p50/p90=0.028 / 0.243 / 0.606
- spectral_rolloff: availability=100.0% present=260/260 p10/p50/p90=0.103 / 0.191 / 0.303
- valence: availability=100.0% present=260/260 p10/p50/p90=0.143 / 0.443 / 0.764
- vocal_instrumental: availability=100.0% present=260/260 p10/p50/p90=0.000 / 0.116 / 0.659

## Most “single-descriptor wrapper” features (dominanceTop1 ≥ 0.90)

- instrumental_score: dominanceTop1=1.000 regR²=1.000 n=56 top=vocal_instrumental (|w|=0.209)
- vocal_score: dominanceTop1=1.000 regR²=1.000 n=56 top=vocal_instrumental (|w|=0.209)
- speech_score: dominanceTop1=1.000 regR²=1.000 n=56 top=music_speech (|w|=0.047)
- rhythm_stability_score: dominanceTop1=1.000 regR²=1.000 n=56 top=rhythmic_stability (|w|=0.066)

## Dominant descriptor weights per feature (top 3 |weights|)

### instrumental_score

- regression: n=56 R²=1.000 dominanceTop1=1.000
- vocal_instrumental: weight=0.209 |w|=0.209
- spectral_complexity: weight=-0.000 |w|=0.000
- dissonance: weight=0.000 |w|=0.000

### vocal_score

- regression: n=56 R²=1.000 dominanceTop1=1.000
- vocal_instrumental: weight=-0.209 |w|=0.209
- spectral_complexity: weight=0.000 |w|=0.000
- dissonance: weight=-0.000 |w|=0.000

### speech_score

- regression: n=56 R²=1.000 dominanceTop1=1.000
- music_speech: weight=0.047 |w|=0.047
- dissonance: weight=0.000 |w|=0.000
- articulation: weight=-0.000 |w|=0.000

### rhythm_stability_score

- regression: n=56 R²=1.000 dominanceTop1=1.000
- rhythmic_stability: weight=0.066 |w|=0.066
- articulation: weight=0.000 |w|=0.000
- pulse_clarity: weight=0.000 |w|=0.000

### layered_score

- regression: n=56 R²=1.000 dominanceTop1=0.893
- spectral_complexity: weight=0.101 |w|=0.101
- intensity: weight=0.009 |w|=0.009
- pulse_clarity: weight=0.001 |w|=0.001

### pulse_score

- regression: n=56 R²=1.000 dominanceTop1=0.853
- pulse_clarity: weight=0.134 |w|=0.134
- rhythmic_stability: weight=0.023 |w|=0.023
- spectral_complexity: weight=-0.000 |w|=0.000

### density_score

- regression: n=56 R²=0.965 dominanceTop1=0.753
- intensity: weight=0.017 |w|=0.017
- arousal: weight=0.002 |w|=0.002
- articulation: weight=-0.002 |w|=0.002

### driving_score

- regression: n=56 R²=0.999 dominanceTop1=0.571
- pulse_clarity: weight=0.066 |w|=0.066
- arousal: weight=0.025 |w|=0.025
- rhythmic_stability: weight=0.011 |w|=0.011

### energy_score

- regression: n=56 R²=1.000 dominanceTop1=0.566
- arousal: weight=0.071 |w|=0.071
- pulse_clarity: weight=0.021 |w|=0.021
- intensity: weight=0.017 |w|=0.017

### syncopation_score

- regression: n=56 R²=0.970 dominanceTop1=0.537
- pulse_clarity: weight=0.057 |w|=0.057
- articulation: weight=-0.022 |w|=0.022
- dissonance: weight=0.011 |w|=0.011

### valence_score

- regression: n=56 R²=1.000 dominanceTop1=0.500
- low_valence_score: weight=-0.103 |w|=0.103
- valence: weight=0.103 |w|=0.103
- rhythmic_stability: weight=0.000 |w|=0.000

### punch_score

- regression: n=56 R²=0.999 dominanceTop1=0.487
- articulation: weight=0.041 |w|=0.041
- pulse_clarity: weight=0.034 |w|=0.034
- rhythmic_stability: weight=0.006 |w|=0.006

### brightness_score

- regression: n=56 R²=1.000 dominanceTop1=0.447
- spectral_centroid_or_brightness: weight=0.039 |w|=0.039
- spectral_rolloff: weight=0.018 |w|=0.018
- low_valence_score: weight=-0.010 |w|=0.010

### calm_score

- regression: n=56 R²=0.990 dominanceTop1=0.438
- arousal: weight=-0.034 |w|=0.034
- articulation: weight=-0.020 |w|=0.020
- intensity: weight=-0.013 |w|=0.013

### darkness_score

- regression: n=56 R²=0.999 dominanceTop1=0.363
- low_valence_score: weight=0.051 |w|=0.051
- valence: weight=-0.051 |w|=0.051
- spectral_rolloff: weight=-0.018 |w|=0.018

## Descriptor redundancy (CONTROL_3 global descriptor correlations, top absolute)

- low_valence_score vs valence: r=-1.000 n=260
- spectral_centroid_or_brightness vs spectral_rolloff: r=0.900 n=260
- intensity vs loudness_score: r=0.867 n=260
- pulse_clarity vs spectral_complexity: r=-0.816 n=260
- articulation vs rhythmic_stability: r=0.778 n=260
- arousal vs loudness_score: r=0.707 n=260
- arousal vs articulation: r=0.673 n=260
- articulation vs dissonance: r=0.671 n=260
- arousal vs dissonance: r=0.668 n=260
- arousal vs intensity: r=0.630 n=260
- articulation vs spectral_complexity: r=-0.627 n=260
- dissonance vs intensity: r=0.617 n=260
- rhythmic_stability vs spectral_complexity: r=-0.613 n=260
- articulation vs pulse_clarity: r=0.604 n=260
- intensity vs pulse_clarity: r=0.578 n=260
- pulse_clarity vs rhythmic_stability: r=0.568 n=260
- flatness vs spectral_rolloff: r=0.532 n=260
- dissonance vs loudness_score: r=0.519 n=260
- arousal vs rhythmic_stability: r=0.493 n=260
- dissonance vs pulse_clarity: r=0.488 n=260
- dissonance vs spectral_rolloff: r=0.469 n=260
- arousal vs flatness: r=0.460 n=260
- arousal vs pulse_clarity: r=0.458 n=260
- arousal vs spectral_centroid_or_brightness: r=0.449 n=260
- dissonance vs spectral_centroid_or_brightness: r=0.444 n=260

## Carry-forward guidance (representation-quality only)

- Carry-forward feature count: 15
- Descriptor-starved feature count: 4

If a feature is a near-single-descriptor wrapper, it can still be useful, but downstream systems must treat it as direct measurement of that descriptor (not an independent semantic estimate).

