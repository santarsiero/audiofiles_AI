# CONTROL_2_DIMENSION_INDEPENDENCE_ANALYSIS

## Run metadata

- Generated at: 2026-05-27T18:11:46.253Z
- Source: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_1_semantic_validation.json
- Tracks (found only): 56
- Features: 19
- Inputs: 24
- Core features used for independence/PCA: 15

## Part 1 — Unique variance contribution (regress each feature on all others)

### Most independent (highest uniqueVariance = 1 - R²)

- speech_score: uniqueVariance=0.524 R²=0.476 VIF=1.91 n=56
- layered_score: uniqueVariance=0.237 R²=0.763 VIF=4.22 n=56
- density_score: uniqueVariance=0.213 R²=0.787 VIF=4.69 n=56
- energy_score: uniqueVariance=0.000 R²=1.000 VIF=11292.15 n=56
- driving_score: uniqueVariance=0.000 R²=1.000 VIF=30045.92 n=56
- punch_score: uniqueVariance=0.000 R²=1.000 VIF=268125.66 n=56
- pulse_score: uniqueVariance=0.000 R²=1.000 VIF=514125.52 n=56
- calm_score: uniqueVariance=0.000 R²=1.000 VIF=854680.08 n=56
- brightness_score: uniqueVariance=0.000 R²=1.000 VIF=null n=56
- rhythm_stability_score: uniqueVariance=0.000 R²=1.000 VIF=null n=56
- valence_score: uniqueVariance=0.000 R²=1.000 VIF=null n=56
- syncopation_score: uniqueVariance=0.000 R²=1.000 VIF=null n=56

### Most redundant (highest R² when predicted by others)

- vocal_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- instrumental_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- darkness_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- syncopation_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- valence_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- rhythm_stability_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- brightness_score: R²=1.000 uniqueVariance=0.000 VIF=null n=56
- calm_score: R²=1.000 uniqueVariance=0.000 VIF=854680.08 n=56
- pulse_score: R²=1.000 uniqueVariance=0.000 VIF=514125.52 n=56
- punch_score: R²=1.000 uniqueVariance=0.000 VIF=268125.66 n=56
- driving_score: R²=1.000 uniqueVariance=0.000 VIF=30045.92 n=56
- energy_score: R²=1.000 uniqueVariance=0.000 VIF=11292.15 n=56

### Partial correlations (core features only)

- Note: singular_matrix

## Shared-variance clusters (|r| >= 0.85)

- size=6: calm_score, driving_score, energy_score, pulse_score, punch_score, syncopation_score
- size=2: darkness_score, valence_score
- size=2: instrumental_score, vocal_score
- size=1: acoustic_score
- size=1: brightness_score
- size=1: density_score
- size=1: harshness_score
- size=1: layered_score
- size=1: low_end_score
- size=1: offbeat_score

## Shared-variance clusters (core features only)

- size=6: calm_score, driving_score, energy_score, pulse_score, punch_score, syncopation_score
- size=2: darkness_score, valence_score
- size=2: instrumental_score, vocal_score
- size=1: brightness_score
- size=1: density_score
- size=1: layered_score
- size=1: rhythm_stability_score
- size=1: speech_score

## Part 2 — Normalization stability (range/spread/saturation)

### density_score

- mean=0.238 std=0.018 min=0.195 max=0.280
- p10/p50/p90=0.217 / 0.235 / 0.262 spread(p90-p10)=0.045
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - intensity: r=0.976 n=56
  - loudness_score: r=0.858 n=56
  - dissonance: r=0.641 n=56
  - arousal: r=0.624 n=56
  - pulse_clarity: r=0.545 n=56
  - articulation: r=0.480 n=56

### brightness_score

- mean=0.212 std=0.065 min=0.093 max=0.424
- p10/p50/p90=0.130 / 0.203 / 0.296 spread(p90-p10)=0.166
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - spectral_centroid_or_brightness: r=0.933 n=56
  - spectral_rolloff: r=0.918 n=56
  - arousal: r=0.505 n=56
  - low_valence_score: r=-0.441 n=56
  - valence: r=0.441 n=56
  - flatness: r=0.377 n=56

### syncopation_score

- mean=0.486 std=0.057 min=0.371 max=0.583
- p10/p50/p90=0.401 / 0.493 / 0.556 spread(p90-p10)=0.155
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - pulse_clarity: r=0.952 n=56
  - spectral_complexity: r=-0.752 n=56
  - flatness: r=0.523 n=56
  - intensity: r=0.485 n=56
  - dissonance: r=0.423 n=56
  - articulation: r=0.359 n=56

### calm_score

- mean=0.635 std=0.066 min=0.510 max=0.837
- p10/p50/p90=0.575 / 0.614 / 0.737 spread(p90-p10)=0.162
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - arousal: r=-0.930 n=56
  - articulation: r=-0.858 n=56
  - dissonance: r=-0.777 n=56
  - intensity: r=-0.748 n=56
  - rhythmic_stability: r=-0.735 n=56
  - loudness_score: r=-0.735 n=56

### driving_score

- mean=0.415 std=0.092 min=0.162 max=0.571
- p10/p50/p90=0.275 / 0.434 / 0.508 spread(p90-p10)=0.233
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - pulse_clarity: r=0.945 n=56
  - arousal: r=0.727 n=56
  - spectral_complexity: r=-0.726 n=56
  - rhythmic_stability: r=0.715 n=56
  - intensity: r=0.703 n=56
  - articulation: r=0.702 n=56

### darkness_score

- mean=0.679 std=0.112 min=0.433 max=0.849
- p10/p50/p90=0.518 / 0.695 / 0.804 spread(p90-p10)=0.286
- saturation low/high=0.000 / 0.000
- top raw input correlations:
  - valence: r=-0.957 n=56
  - low_valence_score: r=0.957 n=56
  - articulation: r=-0.428 n=56
  - spectral_centroid_or_brightness: r=-0.424 n=56
  - spectral_rolloff: r=-0.383 n=56
  - rhythmic_stability: r=-0.341 n=56

## Part 3 — Formula sensitivity proxy (descriptor dominance)

Top dominated features (dominanceTop1 close to 1 means basically one descriptor):

- instrumental_score: dominanceTop1=1.000 regR²=1.000 n=56
  - corr vocal_instrumental: r=1.000 n=56
  - corr spectral_complexity: r=-0.317 n=56
  - corr pulse_clarity: r=0.306 n=56
- vocal_score: dominanceTop1=1.000 regR²=1.000 n=56
  - corr vocal_instrumental: r=-1.000 n=56
  - corr spectral_complexity: r=0.317 n=56
  - corr pulse_clarity: r=-0.306 n=56
- speech_score: dominanceTop1=1.000 regR²=1.000 n=56
  - corr music_speech: r=1.000 n=56
  - corr dissonance: r=0.437 n=56
  - corr articulation: r=0.360 n=56
- rhythm_stability_score: dominanceTop1=1.000 regR²=1.000 n=56
  - corr rhythmic_stability: r=1.000 n=56
  - corr articulation: r=0.786 n=56
  - corr arousal: r=0.591 n=56
- layered_score: dominanceTop1=0.893 regR²=1.000 n=56
  - corr spectral_complexity: r=0.996 n=56
  - corr pulse_clarity: r=-0.777 n=56
  - corr articulation: r=-0.532 n=56
- pulse_score: dominanceTop1=0.853 regR²=1.000 n=56
  - corr pulse_clarity: r=0.992 n=56
  - corr spectral_complexity: r=-0.801 n=56
  - corr rhythmic_stability: r=0.678 n=56
- density_score: dominanceTop1=0.753 regR²=0.965 n=56
  - corr intensity: r=0.976 n=56
  - corr loudness_score: r=0.858 n=56
  - corr dissonance: r=0.641 n=56
- driving_score: dominanceTop1=0.571 regR²=0.999 n=56
  - corr pulse_clarity: r=0.945 n=56
  - corr arousal: r=0.727 n=56
  - corr spectral_complexity: r=-0.726 n=56
- energy_score: dominanceTop1=0.566 regR²=1.000 n=56
  - corr arousal: r=0.949 n=56
  - corr loudness_score: r=0.814 n=56
  - corr intensity: r=0.784 n=56
- syncopation_score: dominanceTop1=0.537 regR²=0.970 n=56
  - corr pulse_clarity: r=0.952 n=56
  - corr spectral_complexity: r=-0.752 n=56
  - corr flatness: r=0.523 n=56
- valence_score: dominanceTop1=0.500 regR²=1.000 n=56
  - corr low_valence_score: r=-1.000 n=56
  - corr valence: r=1.000 n=56
  - corr articulation: r=0.418 n=56
- punch_score: dominanceTop1=0.487 regR²=0.999 n=56
  - corr articulation: r=0.911 n=56
  - corr pulse_clarity: r=0.848 n=56
  - corr rhythmic_stability: r=0.816 n=56

## Part 4 — Latent semantic axis discovery (PCA on standardized features, complete-case rows)

- PCA rows used: 56 (features: 15)

### PC1 explainedVarianceRatio=0.456 eigenvalue=6.968
Top loadings:
- driving_score: loading=-0.375
- punch_score: loading=-0.365
- pulse_score: loading=-0.356
- calm_score: loading=0.347
- energy_score: loading=-0.335
- syncopation_score: loading=-0.295
- rhythm_stability_score: loading=-0.288
- layered_score: loading=0.272

### PC2 explainedVarianceRatio=0.206 eigenvalue=3.153
Top loadings:
- darkness_score: loading=-0.525
- valence_score: loading=0.494
- brightness_score: loading=0.380
- vocal_score: loading=0.285
- instrumental_score: loading=-0.285
- speech_score: loading=0.224
- syncopation_score: loading=-0.202
- rhythm_stability_score: loading=0.163

### PC3 explainedVarianceRatio=0.108 eigenvalue=1.649
Top loadings:
- vocal_score: loading=0.603
- instrumental_score: loading=-0.603
- density_score: loading=0.238
- speech_score: loading=-0.236
- darkness_score: loading=0.216
- brightness_score: loading=-0.193
- valence_score: loading=-0.188
- energy_score: loading=0.108

### PC4 explainedVarianceRatio=0.078 eigenvalue=1.188
Top loadings:
- layered_score: loading=0.476
- density_score: loading=0.417
- energy_score: loading=0.343
- speech_score: loading=0.339
- valence_score: loading=-0.287
- calm_score: loading=-0.253
- brightness_score: loading=0.252
- pulse_score: loading=-0.214

### PC5 explainedVarianceRatio=0.061 eigenvalue=0.924
Top loadings:
- speech_score: loading=0.688
- rhythm_stability_score: loading=-0.394
- syncopation_score: loading=0.387
- layered_score: loading=-0.255
- vocal_score: loading=0.165
- instrumental_score: loading=-0.165
- density_score: loading=-0.160
- energy_score: loading=-0.132

### PC6 explainedVarianceRatio=0.048 eigenvalue=0.735
Top loadings:
- brightness_score: loading=0.672
- speech_score: loading=-0.483
- syncopation_score: loading=0.306
- rhythm_stability_score: loading=-0.272
- density_score: loading=-0.205
- valence_score: loading=-0.172
- punch_score: loading=-0.157
- driving_score: loading=0.115

## Part 5 — Feature health matrix (top)

- speech_score: class=Useful but Entangled uniqueVar=0.524 max|r|=0.317 std=0.047 norm=ok
- layered_score: class=Useful but Entangled uniqueVar=0.237 max|r|=0.774 std=0.096 norm=ok
- density_score: class=Artificially Collapsed uniqueVar=0.213 max|r|=0.802 std=0.018 norm=compressed
- energy_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.971 std=0.107 norm=ok
- driving_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.963 std=0.092 norm=ok
- punch_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.919 std=0.071 norm=ok
- pulse_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.963 std=0.148 norm=ok
- calm_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.971 std=0.066 norm=ok
- brightness_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.681 std=0.065 norm=ok
- rhythm_stability_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.816 std=0.066 norm=ok
- valence_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.957 std=0.206 norm=ok
- syncopation_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.905 std=0.057 norm=ok
- darkness_score: class=Likely Redundant uniqueVar=0.000 max|r|=0.957 std=0.112 norm=ok
- instrumental_score: class=Likely Redundant uniqueVar=0.000 max|r|=1.000 std=0.209 norm=ok
- vocal_score: class=Likely Redundant uniqueVar=0.000 max|r|=1.000 std=0.209 norm=ok
- acoustic_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- harshness_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- low_end_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing

## Correlation highlights (top absolute)

- instrumental_score vs vocal_score: r=-1.000 n=56
- calm_score vs energy_score: r=-0.971 n=56
- driving_score vs pulse_score: r=0.963 n=56
- darkness_score vs valence_score: r=-0.957 n=56
- driving_score vs punch_score: r=0.919 n=56
- pulse_score vs syncopation_score: r=0.905 n=56
- pulse_score vs punch_score: r=0.891 n=56
- calm_score vs punch_score: r=-0.884 n=56
- calm_score vs driving_score: r=-0.867 n=56
- driving_score vs energy_score: r=0.863 n=56
- driving_score vs syncopation_score: r=0.836 n=56
- punch_score vs rhythm_stability_score: r=0.816 n=56
- density_score vs energy_score: r=0.802 n=56
- energy_score vs punch_score: r=0.789 n=56
- layered_score vs pulse_score: r=-0.774 n=56
- calm_score vs density_score: r=-0.750 n=56
- calm_score vs rhythm_stability_score: r=-0.735 n=56
- layered_score vs syncopation_score: r=-0.732 n=56
- calm_score vs pulse_score: r=-0.718 n=56
- driving_score vs rhythm_stability_score: r=0.715 n=56

## Full outputs

- JSON: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_2_dimension_independence_analysis_v2.json
