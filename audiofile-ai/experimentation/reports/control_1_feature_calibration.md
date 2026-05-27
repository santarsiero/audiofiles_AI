# Feature Calibration + Separability Analysis

## Run metadata

- Generated at: 2026-05-27T18:00:56.990Z
- Source: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_1_semantic_validation.json
- Tracks processed (found only): 56
- Groups: aggressive, bouncy, calm, driving, emotional_reflective, euphoric, steady

## Dead / broken feature detection (prioritized)

- acoustic_score: missingRate>1.00 | mean=null std=null missing=1.000
- harshness_score: missingRate>1.00 | mean=null std=null missing=1.000
- low_end_score: missingRate>1.00 | mean=null std=null missing=1.000
- offbeat_score: missingRate>1.00 | mean=null std=null missing=1.000
- density_score: stdVeryLow(0.018) | mean=0.238 std=0.018 missing=0.000

## Feature distribution highlights

### Highest variance (potentially most informative)

- instrumental_score: std=0.209 mean=0.166 missing=0.000
- vocal_score: std=0.209 mean=0.834 missing=0.000
- valence_score: std=0.206 mean=0.457 missing=0.000
- pulse_score: std=0.148 mean=0.570 missing=0.000
- darkness_score: std=0.112 mean=0.679 missing=0.000
- energy_score: std=0.107 mean=0.488 missing=0.000
- layered_score: std=0.096 mean=0.265 missing=0.000
- driving_score: std=0.092 mean=0.415 missing=0.000
- punch_score: std=0.071 mean=0.394 missing=0.000
- calm_score: std=0.066 mean=0.635 missing=0.000

### Lowest variance (compressed/collapsed)

- density_score: std=0.018 mean=0.238 missing=0.000
- speech_score: std=0.047 mean=0.073 missing=0.000
- syncopation_score: std=0.057 mean=0.486 missing=0.000
- brightness_score: std=0.065 mean=0.212 missing=0.000
- rhythm_stability_score: std=0.066 mean=0.598 missing=0.000
- calm_score: std=0.066 mean=0.635 missing=0.000
- punch_score: std=0.071 mean=0.394 missing=0.000
- driving_score: std=0.092 mean=0.415 missing=0.000
- layered_score: std=0.096 mean=0.265 missing=0.000
- energy_score: std=0.107 mean=0.488 missing=0.000

## Group separability (top features by |Cohen's d|)

### aggressive

- valence_score: d=-1.274 meanIn=0.244 meanOut=0.488 nIn=7 nOut=49
- darkness_score: d=1.159 meanIn=0.786 meanOut=0.663 nIn=7 nOut=49
- density_score: d=1.022 meanIn=0.254 meanOut=0.236 nIn=7 nOut=49
- vocal_score: d=-0.700 meanIn=0.711 meanOut=0.852 nIn=7 nOut=49
- instrumental_score: d=0.700 meanIn=0.289 meanOut=0.148 nIn=7 nOut=49
- speech_score: d=0.689 meanIn=0.100 meanOut=0.069 nIn=7 nOut=49
- energy_score: d=0.487 meanIn=0.533 meanOut=0.482 nIn=7 nOut=49
- calm_score: d=-0.414 meanIn=0.612 meanOut=0.639 nIn=7 nOut=49
- brightness_score: d=-0.394 meanIn=0.190 meanOut=0.216 nIn=7 nOut=49
- rhythm_stability_score: d=-0.326 meanIn=0.580 meanOut=0.601 nIn=7 nOut=49

### bouncy

- darkness_score: d=-2.297 meanIn=0.513 meanOut=0.711 nIn=9 nOut=47
- valence_score: d=2.023 meanIn=0.739 meanOut=0.403 nIn=9 nOut=47
- brightness_score: d=1.556 meanIn=0.286 meanOut=0.198 nIn=9 nOut=47
- rhythm_stability_score: d=0.884 meanIn=0.645 meanOut=0.589 nIn=9 nOut=47
- syncopation_score: d=-0.773 meanIn=0.450 meanOut=0.493 nIn=9 nOut=47
- speech_score: d=0.749 meanIn=0.101 meanOut=0.067 nIn=9 nOut=47
- instrumental_score: d=-0.485 meanIn=0.081 meanOut=0.182 nIn=9 nOut=47
- vocal_score: d=0.485 meanIn=0.919 meanOut=0.818 nIn=9 nOut=47
- calm_score: d=-0.480 meanIn=0.609 meanOut=0.641 nIn=9 nOut=47
- punch_score: d=0.463 meanIn=0.421 meanOut=0.389 nIn=9 nOut=47

### calm

- calm_score: d=2.258 meanIn=0.732 meanOut=0.617 nIn=9 nOut=47
- energy_score: d=-2.206 meanIn=0.334 meanOut=0.517 nIn=9 nOut=47
- driving_score: d=-1.812 meanIn=0.300 meanOut=0.437 nIn=9 nOut=47
- punch_score: d=-1.776 meanIn=0.306 meanOut=0.411 nIn=9 nOut=47
- rhythm_stability_score: d=-1.568 meanIn=0.523 meanOut=0.613 nIn=9 nOut=47
- density_score: d=-1.448 meanIn=0.218 meanOut=0.242 nIn=9 nOut=47
- pulse_score: d=-1.374 meanIn=0.418 meanOut=0.599 nIn=9 nOut=47
- syncopation_score: d=-0.844 meanIn=0.447 meanOut=0.493 nIn=9 nOut=47
- brightness_score: d=-0.716 meanIn=0.174 meanOut=0.220 nIn=9 nOut=47
- speech_score: d=-0.415 meanIn=0.057 meanOut=0.076 nIn=9 nOut=47

### driving

- vocal_score: d=-1.117 meanIn=0.643 meanOut=0.862 nIn=7 nOut=49
- instrumental_score: d=1.117 meanIn=0.357 meanOut=0.138 nIn=7 nOut=49
- energy_score: d=1.058 meanIn=0.582 meanOut=0.475 nIn=7 nOut=49
- calm_score: d=-1.010 meanIn=0.580 meanOut=0.643 nIn=7 nOut=49
- density_score: d=0.893 meanIn=0.252 meanOut=0.236 nIn=7 nOut=49
- driving_score: d=0.814 meanIn=0.479 meanOut=0.406 nIn=7 nOut=49
- punch_score: d=0.737 meanIn=0.439 meanOut=0.388 nIn=7 nOut=49
- layered_score: d=-0.651 meanIn=0.212 meanOut=0.273 nIn=7 nOut=49
- syncopation_score: d=0.633 meanIn=0.517 meanOut=0.481 nIn=7 nOut=49
- brightness_score: d=0.619 meanIn=0.247 meanOut=0.207 nIn=7 nOut=49

### emotional_reflective

- speech_score: d=-0.931 meanIn=0.037 meanOut=0.079 nIn=8 nOut=48
- darkness_score: d=0.764 meanIn=0.750 meanOut=0.667 nIn=8 nOut=48
- brightness_score: d=-0.739 meanIn=0.172 meanOut=0.219 nIn=8 nOut=48
- valence_score: d=-0.638 meanIn=0.347 meanOut=0.476 nIn=8 nOut=48
- punch_score: d=-0.615 meanIn=0.358 meanOut=0.400 nIn=8 nOut=48
- calm_score: d=0.487 meanIn=0.663 meanOut=0.631 nIn=8 nOut=48
- layered_score: d=0.486 meanIn=0.304 meanOut=0.259 nIn=8 nOut=48
- instrumental_score: d=-0.352 meanIn=0.103 meanOut=0.176 nIn=8 nOut=48
- vocal_score: d=0.352 meanIn=0.897 meanOut=0.824 nIn=8 nOut=48
- rhythm_stability_score: d=-0.317 meanIn=0.580 meanOut=0.601 nIn=8 nOut=48

### euphoric

- driving_score: d=0.645 meanIn=0.463 meanOut=0.405 nIn=10 nOut=46
- energy_score: d=0.630 meanIn=0.542 meanOut=0.476 nIn=10 nOut=46
- pulse_score: d=0.577 meanIn=0.639 meanOut=0.555 nIn=10 nOut=46
- syncopation_score: d=0.513 meanIn=0.510 meanOut=0.481 nIn=10 nOut=46
- calm_score: d=-0.498 meanIn=0.609 meanOut=0.641 nIn=10 nOut=46
- vocal_score: d=0.488 meanIn=0.917 meanOut=0.816 nIn=10 nOut=46
- instrumental_score: d=-0.488 meanIn=0.083 meanOut=0.184 nIn=10 nOut=46
- rhythm_stability_score: d=0.398 meanIn=0.620 meanOut=0.594 nIn=10 nOut=46
- punch_score: d=0.388 meanIn=0.417 meanOut=0.389 nIn=10 nOut=46
- density_score: d=0.388 meanIn=0.244 meanOut=0.237 nIn=10 nOut=46

### steady

- layered_score: d=-0.791 meanIn=0.199 meanOut=0.273 nIn=6 nOut=50
- pulse_score: d=0.787 meanIn=0.672 meanOut=0.558 nIn=6 nOut=50
- punch_score: d=0.727 meanIn=0.439 meanOut=0.389 nIn=6 nOut=50
- syncopation_score: d=0.666 meanIn=0.519 meanOut=0.482 nIn=6 nOut=50
- rhythm_stability_score: d=0.601 meanIn=0.633 meanOut=0.594 nIn=6 nOut=50
- driving_score: d=0.487 meanIn=0.455 meanOut=0.411 nIn=6 nOut=50
- vocal_score: d=-0.465 meanIn=0.748 meanOut=0.845 nIn=6 nOut=50
- instrumental_score: d=0.465 meanIn=0.252 meanOut=0.155 nIn=6 nOut=50
- brightness_score: d=-0.336 meanIn=0.193 meanOut=0.215 nIn=6 nOut=50
- density_score: d=-0.269 meanIn=0.234 meanOut=0.239 nIn=6 nOut=50

## Correlation analysis (collapsed/redundant candidates)

### Top absolute correlations

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

## Input (descriptor) availability

- arousal: availabilityRate=1.000 available=56/56
- articulation: availabilityRate=1.000 available=56/56
- dissonance: availabilityRate=1.000 available=56/56
- event_density: availabilityRate=1.000 available=56/56
- flatness: availabilityRate=1.000 available=56/56
- intensity: availabilityRate=1.000 available=56/56
- loudness_range: availabilityRate=1.000 available=56/56
- loudness_score: availabilityRate=1.000 available=56/56
- low_valence_score: availabilityRate=1.000 available=56/56
- music_speech: availabilityRate=1.000 available=56/56
- pulse_clarity: availabilityRate=1.000 available=56/56
- rhythmic_stability: availabilityRate=1.000 available=56/56
- spectral_centroid_or_brightness: availabilityRate=1.000 available=56/56
- spectral_complexity: availabilityRate=1.000 available=56/56
- spectral_rolloff: availabilityRate=1.000 available=56/56
- valence: availabilityRate=1.000 available=56/56
- vocal_instrumental: availabilityRate=1.000 available=56/56
- harshness_score: availabilityRate=0.000 available=0/56
- instrumentation_diversity: availabilityRate=0.000 available=0/56
- low_end_score: availabilityRate=0.000 available=0/56
- offbeat_score: availabilityRate=0.000 available=0/56
- provider_syncopation_or_rhythm_complexity: availabilityRate=0.000 available=0/56
- timbral_complexity: availabilityRate=0.000 available=0/56
- transient_strength: availabilityRate=0.000 available=0/56

## Feature dependency proxy (top raw inputs correlated with feature)

### acoustic_score


### brightness_score

- spectral_centroid_or_brightness: r=0.933 n=56
- spectral_rolloff: r=0.918 n=56
- arousal: r=0.505 n=56
- low_valence_score: r=-0.441 n=56
- valence: r=0.441 n=56
- flatness: r=0.377 n=56

### calm_score

- arousal: r=-0.930 n=56
- articulation: r=-0.858 n=56
- dissonance: r=-0.777 n=56
- intensity: r=-0.748 n=56
- rhythmic_stability: r=-0.735 n=56
- loudness_score: r=-0.735 n=56

### darkness_score

- valence: r=-0.957 n=56
- low_valence_score: r=0.957 n=56
- articulation: r=-0.428 n=56
- spectral_centroid_or_brightness: r=-0.424 n=56
- spectral_rolloff: r=-0.383 n=56
- rhythmic_stability: r=-0.341 n=56

### density_score

- intensity: r=0.976 n=56
- loudness_score: r=0.858 n=56
- dissonance: r=0.641 n=56
- arousal: r=0.624 n=56
- pulse_clarity: r=0.545 n=56
- articulation: r=0.480 n=56

### driving_score

- pulse_clarity: r=0.945 n=56
- arousal: r=0.727 n=56
- spectral_complexity: r=-0.726 n=56
- rhythmic_stability: r=0.715 n=56
- intensity: r=0.703 n=56
- articulation: r=0.702 n=56

### energy_score

- arousal: r=0.949 n=56
- loudness_score: r=0.814 n=56
- intensity: r=0.784 n=56
- dissonance: r=0.736 n=56
- articulation: r=0.711 n=56
- pulse_clarity: r=0.662 n=56

### harshness_score


### instrumental_score

- vocal_instrumental: r=1.000 n=56
- spectral_complexity: r=-0.317 n=56
- pulse_clarity: r=0.306 n=56
- dissonance: r=0.303 n=56
- low_valence_score: r=0.230 n=56
- valence: r=-0.230 n=56

### layered_score

- spectral_complexity: r=0.996 n=56
- pulse_clarity: r=-0.777 n=56
- articulation: r=-0.532 n=56
- rhythmic_stability: r=-0.471 n=56
- intensity: r=-0.399 n=56
- flatness: r=-0.391 n=56


## Full results

- See JSON: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_1_feature_calibration.json
