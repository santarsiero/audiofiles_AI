# CONTROL_2_DIMENSION_INDEPENDENCE_ANALYSIS

## Run metadata

- Generated at: 2026-05-27T18:10:11.332Z
- Source: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_1_semantic_validation.json
- Tracks (found only): 56
- Features: 19
- Inputs: 24

## Part 1 — Unique variance contribution (regress each feature on all others)

### Most independent (highest uniqueVariance = 1 - R²)


### Most redundant (highest R² when predicted by others)


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

- PCA rows used: 0 (features: 19)
- Note: insufficient_complete_cases_for_pca

## Part 5 — Feature health matrix (top)

- acoustic_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- brightness_score: class=Useful but Entangled uniqueVar=null max|r|=0.681 std=0.065 norm=ok
- calm_score: class=Useful but Entangled uniqueVar=null max|r|=0.971 std=0.066 norm=ok
- darkness_score: class=Useful but Entangled uniqueVar=null max|r|=0.957 std=0.112 norm=ok
- density_score: class=Artificially Collapsed uniqueVar=null max|r|=0.802 std=0.018 norm=compressed
- driving_score: class=Useful but Entangled uniqueVar=null max|r|=0.963 std=0.092 norm=ok
- energy_score: class=Useful but Entangled uniqueVar=null max|r|=0.971 std=0.107 norm=ok
- harshness_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- instrumental_score: class=Useful but Entangled uniqueVar=null max|r|=1.000 std=0.209 norm=ok
- layered_score: class=Useful but Entangled uniqueVar=null max|r|=0.774 std=0.096 norm=ok
- low_end_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- offbeat_score: class=Underdeveloped / Descriptor-Starved uniqueVar=null max|r|=null std=null norm=missing
- pulse_score: class=Useful but Entangled uniqueVar=null max|r|=0.963 std=0.148 norm=ok
- punch_score: class=Useful but Entangled uniqueVar=null max|r|=0.919 std=0.071 norm=ok
- rhythm_stability_score: class=Useful but Entangled uniqueVar=null max|r|=0.816 std=0.066 norm=ok
- speech_score: class=Useful but Entangled uniqueVar=null max|r|=0.317 std=0.047 norm=ok
- syncopation_score: class=Useful but Entangled uniqueVar=null max|r|=0.905 std=0.057 norm=ok
- valence_score: class=Useful but Entangled uniqueVar=null max|r|=0.957 std=0.206 norm=ok

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

- JSON: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_2_dimension_independence_analysis.json
