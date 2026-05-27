# FINAL_FEATURE_STABILITY_REPORT (Music Story-only phase)

## Purpose

Classify each normalized feature by representation quality under Music Story-only descriptors. This is a carry-forward assessment for the next phase (representation + mapping), not an ontology redesign.

## Evidence sources used

- CONTROL_1: experimentation/outputs/control_1_feature_calibration.json
- CONTROL_2: experimentation/outputs/control_2_dimension_independence_analysis_v2.json
- CONTROL_3: experimentation/outputs/control_3_manifold_stress_test.json

## TRUSTED CORE FEATURES

### layered_score

- Carry forward: YES
- missingRate=0.0%
- std=0.096
- p90-p10=0.242
- uniqueVariance≈0.259
- max|r|≈0.804 (vs pulse_score)
- dominanceTop1≈0.893 (top=spectral_complexity)

### rhythm_stability_score

- Carry forward: YES
- missingRate=0.0%
- std=0.066
- p90-p10=0.149
- uniqueVariance≈0.334
- max|r|≈0.785 (vs punch_score)
- dominanceTop1≈1.000 (top=rhythmic_stability)

### speech_score

- Carry forward: YES
- missingRate=0.0%
- std=0.047
- p90-p10=0.118
- uniqueVariance≈0.874
- max|r|≈0.268 (vs brightness_score)
- dominanceTop1≈1.000 (top=music_speech)

## PARTIALLY TRUSTED / COUPLED

### brightness_score

- Carry forward: YES
- missingRate=0.0%
- std=0.065
- p90-p10=0.166
- uniqueVariance≈0.000
- max|r|≈0.705 (vs darkness_score)
- dominanceTop1≈0.447 (top=spectral_centroid_or_brightness)

### calm_score

- Carry forward: YES
- missingRate=0.0%
- std=0.066
- p90-p10=0.162
- uniqueVariance≈0.000
- max|r|≈0.970 (vs energy_score)
- dominanceTop1≈0.438 (top=arousal)

### darkness_score

- Carry forward: YES
- missingRate=0.0%
- std=0.112
- p90-p10=0.286
- uniqueVariance≈0.000
- max|r|≈0.970 (vs valence_score)
- dominanceTop1≈0.363 (top=low_valence_score)

### density_score

- Carry forward: YES
- missingRate=0.0%
- std=0.018
- p90-p10=0.045
- uniqueVariance≈0.222
- max|r|≈0.820 (vs energy_score)
- dominanceTop1≈0.753 (top=intensity)

### driving_score

- Carry forward: YES
- missingRate=0.0%
- std=0.092
- p90-p10=0.233
- uniqueVariance≈0.000
- max|r|≈0.961 (vs pulse_score)
- dominanceTop1≈0.571 (top=pulse_clarity)

### energy_score

- Carry forward: YES
- missingRate=0.0%
- std=0.107
- p90-p10=0.274
- uniqueVariance≈0.000
- max|r|≈0.970 (vs calm_score)
- dominanceTop1≈0.566 (top=arousal)

### instrumental_score

- Carry forward: YES
- missingRate=0.0%
- std=0.209
- p90-p10=0.486
- uniqueVariance≈0.000
- max|r|≈1.000 (vs vocal_score)
- dominanceTop1≈1.000 (top=vocal_instrumental)

### pulse_score

- Carry forward: YES
- missingRate=0.0%
- std=0.148
- p90-p10=0.365
- uniqueVariance≈0.000
- max|r|≈0.961 (vs driving_score)
- dominanceTop1≈0.853 (top=pulse_clarity)

### punch_score

- Carry forward: YES
- missingRate=0.0%
- std=0.071
- p90-p10=0.190
- uniqueVariance≈0.000
- max|r|≈0.927 (vs driving_score)
- dominanceTop1≈0.487 (top=articulation)

### syncopation_score

- Carry forward: YES
- missingRate=0.0%
- std=0.057
- p90-p10=0.155
- uniqueVariance≈0.094
- max|r|≈0.918 (vs pulse_score)
- dominanceTop1≈0.537 (top=pulse_clarity)

### valence_score

- Carry forward: YES
- missingRate=0.0%
- std=0.206
- p90-p10=0.516
- uniqueVariance≈0.000
- max|r|≈0.970 (vs darkness_score)
- dominanceTop1≈0.500 (top=low_valence_score)

### vocal_score

- Carry forward: YES
- missingRate=0.0%
- std=0.209
- p90-p10=0.486
- uniqueVariance≈0.000
- max|r|≈1.000 (vs instrumental_score)
- dominanceTop1≈1.000 (top=vocal_instrumental)

## UNTRUSTWORTHY / DESCRIPTOR-STARVED

### acoustic_score

- Carry forward: NO
- missingRate=100.0%

### harshness_score

- Carry forward: NO
- missingRate=100.0%

### low_end_score

- Carry forward: NO
- missingRate=100.0%

### offbeat_score

- Carry forward: NO
- missingRate=100.0%

## Notes / guardrails for next phase

- Coupled features should not be treated as independent evidence sources for confidence or label agreement.
- Descriptor-starved features should not be used for downstream decisions until descriptor support exists.

