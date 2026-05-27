# FINAL_LATENT_STRUCTURE_SUMMARY (Music Story-only phase)

## Purpose

Concise, evidence-based summary of the latent structure and effective dimensionality of the current representation space.

## Evidence sources used

- CONTROL_1: experimentation/outputs/control_1_feature_calibration.json
- CONTROL_2: experimentation/outputs/control_2_dimension_independence_analysis_v2.json
- CONTROL_3: experimentation/outputs/control_3_manifold_stress_test.json

## Feature space PCA (CONTROL_3)

- rows=260 dims=15

- PC1: explainedVarianceRatio=0.450 eigenvalue=6.781
  topLoadings=driving_score:-0.379, punch_score:-0.368, pulse_score:-0.363, calm_score:0.340, energy_score:-0.322, syncopation_score:-0.320
- PC2: explainedVarianceRatio=0.218 eigenvalue=3.286
  topLoadings=darkness_score:-0.503, valence_score:0.466, brightness_score:0.419, instrumental_score:-0.301, vocal_score:0.301, rhythm_stability_score:0.210
- PC3: explainedVarianceRatio=0.125 eigenvalue=1.879
  topLoadings=instrumental_score:0.458, vocal_score:-0.458, density_score:-0.407, valence_score:0.324, darkness_score:-0.273, energy_score:-0.247
- PC4: explainedVarianceRatio=0.068 eigenvalue=1.019
  topLoadings=instrumental_score:0.416, vocal_score:-0.416, brightness_score:0.333, density_score:0.314, speech_score:0.314, layered_score:0.314
- PC5: explainedVarianceRatio=0.060 eigenvalue=0.901
  topLoadings=speech_score:0.889, energy_score:-0.260, layered_score:-0.213, calm_score:0.176, density_score:-0.155, syncopation_score:0.105
- PC6: explainedVarianceRatio=0.039 eigenvalue=0.584
  topLoadings=brightness_score:0.642, rhythm_stability_score:-0.482, syncopation_score:0.393, density_score:-0.292, valence_score:-0.175, layered_score:-0.171

- PC1–3 explainedVarianceRatio sum≈0.793
- PC1–6 explainedVarianceRatio sum≈0.960

## Descriptor space PCA (CONTROL_3 inputTrace)

- rows=260 dims=17

- PC1: explainedVarianceRatio=0.336 eigenvalue=5.402
  topLoadings=arousal:0.365, articulation:0.364, dissonance:0.353, intensity:0.319, pulse_clarity:0.309, loudness_score:0.296
- PC2: explainedVarianceRatio=0.176 eigenvalue=2.823
  topLoadings=low_valence_score:0.533, valence:-0.533, spectral_centroid_or_brightness:-0.275, intensity:0.256, vocal_instrumental:0.244, pulse_clarity:0.243
- PC3: explainedVarianceRatio=0.159 eigenvalue=2.551
  topLoadings=event_density:-0.400, spectral_complexity:-0.363, rhythmic_stability:0.360, spectral_rolloff:-0.338, spectral_centroid_or_brightness:-0.338, vocal_instrumental:0.266
- PC4: explainedVarianceRatio=0.088 eigenvalue=1.419
  topLoadings=spectral_rolloff:-0.406, loudness_score:0.384, spectral_centroid_or_brightness:-0.350, event_density:0.330, flatness:-0.307, vocal_instrumental:-0.296
- PC5: explainedVarianceRatio=0.062 eigenvalue=1.002
  topLoadings=music_speech:-0.791, flatness:0.318, vocal_instrumental:-0.257, dissonance:-0.225, loudness_score:0.218, event_density:-0.213
- PC6: explainedVarianceRatio=0.054 eigenvalue=0.867
  topLoadings=vocal_instrumental:0.641, music_speech:-0.422, flatness:-0.332, dissonance:0.265, spectral_complexity:0.219, pulse_clarity:-0.216

- PC1–3 explainedVarianceRatio sum≈0.671
- PC1–6 explainedVarianceRatio sum≈0.876

## Coupled / alias relationships (evidence)

- instrumental_score vs vocal_score: r=-1.000 n=260
- calm_score vs energy_score: r=-0.970 n=260
- darkness_score vs valence_score: r=-0.970 n=260
- driving_score vs pulse_score: r=0.961 n=260
- driving_score vs punch_score: r=0.927 n=260
- pulse_score vs syncopation_score: r=0.918 n=260
- pulse_score vs punch_score: r=0.912 n=260
- driving_score vs syncopation_score: r=0.870 n=260
- calm_score vs driving_score: r=-0.866 n=260
- calm_score vs punch_score: r=-0.855 n=260
- driving_score vs energy_score: r=0.846 n=260
- density_score vs energy_score: r=0.820 n=260

## Effective dimensionality (practical)

- In Music Story-only static descriptors, the representation behaves as low-rank with a few dominant axes.
- Several named dimensions are redundant projections of these same axes (not independent coordinates).

