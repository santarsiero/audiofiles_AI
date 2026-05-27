# CONTROL_3_MANIFOLD_STRESS_TEST

## Run metadata

- Generated at: 2026-05-27T18:19:44.726Z
- Source cache: baseline/data/musicstory (via loadMusicStoryBatches)
- Total cache successes: 365
- Sampled tracks: 260
- Core feature count: 15
- Core input count: 17

## Part 1 — Controlled dataset expansion

- Selection strategy: Quantile seeding across key dimensions + farthest-point sampling for coverage in core feature space
- Seeds (quantiles): 91
- Farthest-point fill: 187

## Part 2 — Latent structure re-evaluation (global)

### Core-feature correlation highlights (top absolute)

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
- layered_score vs pulse_score: r=-0.804 n=260
- punch_score vs rhythm_stability_score: r=0.785 n=260
- layered_score vs punch_score: r=-0.764 n=260
- calm_score vs density_score: r=-0.749 n=260
- energy_score vs punch_score: r=0.747 n=260
- punch_score vs syncopation_score: r=0.741 n=260
- driving_score vs layered_score: r=-0.721 n=260
- calm_score vs pulse_score: r=-0.710 n=260

### PCA (features)

- PCA rows: 260 (features: 15)

- PC1: explainedVarianceRatio=0.450
  topLoadings=driving_score:-0.379, punch_score:-0.368, pulse_score:-0.363, calm_score:0.340, energy_score:-0.322, syncopation_score:-0.320
- PC2: explainedVarianceRatio=0.218
  topLoadings=darkness_score:-0.503, valence_score:0.466, brightness_score:0.419, instrumental_score:-0.301, vocal_score:0.301, rhythm_stability_score:0.210
- PC3: explainedVarianceRatio=0.125
  topLoadings=instrumental_score:0.458, vocal_score:-0.458, density_score:-0.407, valence_score:0.324, darkness_score:-0.273, energy_score:-0.247
- PC4: explainedVarianceRatio=0.068
  topLoadings=instrumental_score:0.416, vocal_score:-0.416, brightness_score:0.333, density_score:0.314, speech_score:0.314, layered_score:0.314
- PC5: explainedVarianceRatio=0.060
  topLoadings=speech_score:0.889, energy_score:-0.260, layered_score:-0.213, calm_score:0.176, density_score:-0.155, syncopation_score:0.105
- PC6: explainedVarianceRatio=0.039
  topLoadings=brightness_score:0.642, rhythm_stability_score:-0.482, syncopation_score:0.393, density_score:-0.292, valence_score:-0.175, layered_score:-0.171

### Unique variance (approx)

- speech_score: uniqueVariance=0.874 R²=0.126 preds=brightness_score,instrumental_score,vocal_score,darkness_score,density_score,calm_score
- rhythm_stability_score: uniqueVariance=0.334 R²=0.666 preds=punch_score,pulse_score,driving_score,calm_score,layered_score,energy_score
- layered_score: uniqueVariance=0.259 R²=0.741 preds=pulse_score,punch_score,driving_score,syncopation_score,rhythm_stability_score,calm_score
- density_score: uniqueVariance=0.222 R²=0.778 preds=energy_score,calm_score,driving_score,syncopation_score,punch_score,pulse_score
- syncopation_score: uniqueVariance=0.094 R²=0.906 preds=pulse_score,driving_score,punch_score,layered_score,energy_score,calm_score
- energy_score: uniqueVariance=0.000 R²=1.000 preds=calm_score,driving_score,density_score,punch_score,pulse_score,syncopation_score
- driving_score: uniqueVariance=0.000 R²=1.000 preds=pulse_score,punch_score,syncopation_score,calm_score,energy_score,layered_score
- pulse_score: uniqueVariance=0.000 R²=1.000 preds=driving_score,syncopation_score,punch_score,layered_score,calm_score,energy_score
- punch_score: uniqueVariance=0.000 R²=1.000 preds=driving_score,pulse_score,calm_score,rhythm_stability_score,layered_score,energy_score
- calm_score: uniqueVariance=0.000 R²=1.000 preds=energy_score,driving_score,punch_score,density_score,pulse_score,rhythm_stability_score

## Part 3 — Local vs global collapse

- KMeans clusters: k=6

### Key pair correlations by cluster

- energy_score vs calm_score: c0:r=-0.985(n=67) | c1:r=-0.993(n=8) | c2:r=-0.941(n=29) | c3:r=-0.963(n=71) | c4:r=-0.983(n=28) | c5:r=-0.936(n=57)
- pulse_score vs driving_score: c0:r=0.946(n=67) | c1:r=0.919(n=8) | c2:r=0.930(n=29) | c3:r=0.930(n=71) | c4:r=0.890(n=28) | c5:r=0.826(n=57)
- pulse_score vs punch_score: c0:r=0.898(n=67) | c1:r=0.937(n=8) | c2:r=0.859(n=29) | c3:r=0.895(n=71) | c4:r=0.870(n=28) | c5:r=0.594(n=57)
- darkness_score vs valence_score: c0:r=-0.891(n=67) | c1:r=-0.963(n=8) | c2:r=-0.872(n=29) | c3:r=-0.899(n=71) | c4:r=-0.901(n=28) | c5:r=-0.949(n=57)
- density_score vs energy_score: c0:r=0.828(n=67) | c1:r=0.897(n=8) | c2:r=0.850(n=29) | c3:r=0.805(n=71) | c4:r=0.832(n=28) | c5:r=0.811(n=57)
- syncopation_score vs pulse_score: c0:r=0.908(n=67) | c1:r=0.194(n=8) | c2:r=0.860(n=29) | c3:r=0.896(n=71) | c4:r=0.897(n=28) | c5:r=0.733(n=57)
- brightness_score vs valence_score: c0:r=0.229(n=67) | c1:r=0.531(n=8) | c2:r=0.003(n=29) | c3:r=0.226(n=71) | c4:r=0.065(n=28) | c5:r=0.330(n=57)

## Part 4 — Descriptor bottleneck analysis (inputTrace descriptors)

### Descriptor PCA

- PCA rows: 260 (inputs: 17)
- PC1: explainedVarianceRatio=0.336
  topLoadings=arousal:0.365, articulation:0.364, dissonance:0.353, intensity:0.319, pulse_clarity:0.309, loudness_score:0.296
- PC2: explainedVarianceRatio=0.176
  topLoadings=low_valence_score:0.533, valence:-0.533, spectral_centroid_or_brightness:-0.275, intensity:0.256, vocal_instrumental:0.244, pulse_clarity:0.243
- PC3: explainedVarianceRatio=0.159
  topLoadings=event_density:-0.400, spectral_complexity:-0.363, rhythmic_stability:0.360, spectral_rolloff:-0.338, spectral_centroid_or_brightness:-0.338, vocal_instrumental:0.266
- PC4: explainedVarianceRatio=0.088
  topLoadings=spectral_rolloff:-0.406, loudness_score:0.384, spectral_centroid_or_brightness:-0.350, event_density:0.330, flatness:-0.307, vocal_instrumental:-0.296
- PC5: explainedVarianceRatio=0.062
  topLoadings=music_speech:-0.791, flatness:0.318, vocal_instrumental:-0.257, dissonance:-0.225, loudness_score:0.218, event_density:-0.213
- PC6: explainedVarianceRatio=0.054
  topLoadings=vocal_instrumental:0.641, music_speech:-0.422, flatness:-0.332, dissonance:0.265, spectral_complexity:0.219, pulse_clarity:-0.216

## Part 5 — Nonlinear structure testing (proxy)

### Spearman correlations for key pairs

- energy_score vs calm_score: spearman_r=-0.956 n=260
- pulse_score vs driving_score: spearman_r=0.955 n=260
- pulse_score vs punch_score: spearman_r=0.894 n=260
- darkness_score vs valence_score: spearman_r=-0.971 n=260
- density_score vs energy_score: spearman_r=0.808 n=260
- syncopation_score vs pulse_score: spearman_r=0.910 n=260
- brightness_score vs valence_score: spearman_r=0.521 n=260

### Local neighborhood correlations (kNN) for key pairs

- energy_score vs calm_score: mean=-0.946 median=-0.953 p10=-0.987 p90=-0.896 neighborhoods=260
- pulse_score vs driving_score: mean=0.830 median=0.859 p10=0.693 p90=0.935 neighborhoods=260
- pulse_score vs punch_score: mean=0.690 median=0.707 p10=0.473 p90=0.886 neighborhoods=260
- darkness_score vs valence_score: mean=-0.867 median=-0.882 p10=-0.945 p90=-0.755 neighborhoods=260
- density_score vs energy_score: mean=0.734 median=0.764 p10=0.552 p90=0.874 neighborhoods=260
- syncopation_score vs pulse_score: mean=0.802 median=0.824 p10=0.643 p90=0.934 neighborhoods=260
- brightness_score vs valence_score: mean=0.145 median=0.167 p10=-0.220 p90=0.476 neighborhoods=260

## Part 6 — Semantic axis stability conclusions

- brightness_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- calm_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- darkness_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- density_score: Locally/Moderately Independent (confidence=medium) note=some unique variance remains, but entangled
- driving_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- energy_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- instrumental_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- layered_score: Globally Independent (confidence=high) note=retains unique variance after conditioning on nearest correlated dimensions
- pulse_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- punch_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- rhythm_stability_score: Globally Independent (confidence=high) note=retains unique variance after conditioning on nearest correlated dimensions
- speech_score: Globally Independent (confidence=high) note=retains unique variance after conditioning on nearest correlated dimensions
- syncopation_score: Descriptor-Limited (confidence=medium) note=
- valence_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions
- vocal_score: Fundamentally Redundant (in current descriptor space) (confidence=high) note=can be predicted almost entirely by correlated dimensions

## Final required answers

- Independent semantic axes (features PCA, rough): PC1-3 sum≈0.793
- Independent semantic axes (descriptor PCA, rough): PC1-3 sum≈0.671
- Bottleneck assessment: Mixed evidence: both descriptor limitations and architecture-induced coupling likely contribute.
- Highest-leverage next analytical step: Acquire additional descriptor providers or raw-audio features for at least one expanded batch, then rerun this same stress test to directly measure descriptor-space dimensional capacity vs current Music Story ceiling.

## Full outputs

- JSON: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/control_3_manifold_stress_test.json
