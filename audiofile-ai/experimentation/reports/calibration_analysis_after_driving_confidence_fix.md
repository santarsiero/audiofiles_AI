# Calibration Analysis Reporting Layer

## Summary

- Offline-only run (no network calls).
- Total songs processed: 38
- Songs with no surfaced labels: 5
- Songs with energetic surfaced: 7

## Surfaced label counts

| label | surfacedCount |
| --- | --- |
| energetic | 7 |
| driving | 8 |
| steady | 14 |
| bouncy | 5 |
| heavy | 5 |
| punchy | 4 |
| vocal | 22 |
| instrumental | 4 |
| speech | 0 |
| hypnotic | 3 |

## Expected vs surfaced summary

| label | expected | surfaced | falseNegatives | falsePositives |
| --- | --- | --- | --- | --- |
| energetic | 16 | 7 | 10 | 1 |
| driving | 14 | 8 | 7 | 1 |
| steady | 10 | 14 | 4 | 8 |
| bouncy | 10 | 5 | 8 | 3 |
| heavy | 7 | 5 | 6 | 4 |
| punchy | 5 | 4 | 3 | 2 |
| vocal | 26 | 22 | 6 | 2 |
| instrumental | 8 | 4 | 4 | 0 |
| speech | 0 | 0 | 0 | 0 |
| hypnotic | 6 | 3 | 5 | 2 |

## False negatives by label

| label | falseNegatives |
| --- | --- |
| energetic | 10 |
| driving | 7 |
| steady | 4 |
| bouncy | 8 |
| heavy | 6 |
| punchy | 3 |
| vocal | 6 |
| instrumental | 4 |
| speech | 0 |
| hypnotic | 5 |

## False positives by label

| label | falsePositives |
| --- | --- |
| energetic | 1 |
| driving | 1 |
| steady | 8 |
| bouncy | 3 |
| heavy | 4 |
| punchy | 2 |
| vocal | 2 |
| instrumental | 0 |
| speech | 0 |
| hypnotic | 2 |

## Songs with no surfaced labels

| artist | title | isrc |
| --- | --- | --- |
| Daft Punk | Harder, Better, Faster, Stronger | GBDUW0000059 |
| The White Stripes | Seven Nation Army | USVT10300001 |
| Daft Punk | Something About Us | GBDUW0000064 |
| Massive Attack | Angel | GBAAA9800327 |
| Moby | Flower | GBAJH0000377 |

## Songs with energetic surfaced

| artist | title | isrc | score | confidence |
| --- | --- | --- | --- | --- |
| FISHER | Losing It | CA5KR1821202 | 0.72 | 0.66 |
| Skrillex | Bangarang (feat. Sirah) | USAT21104243 | 0.74 | 0.69 |
| Skrillex | Scary Monsters and Nice Sprites | GBTDG1000196 | 0.74 | 0.68 |
| Sub Focus | Push The Tempo | GBUM72405427 | 0.70 | 0.65 |
| Sub Focus & Dimension | Desire | GBUM71806016 | 0.71 | 0.66 |
| Mötley Crüe | Kickstart My Heart | USBY29900215 | 0.68 | 0.63 |
| Wild Cherry | Play That Funky Music | USSM19912699 | 0.68 | 0.63 |

## Dense/sparse deferral status

- dense surfaced count: 0
- sparse surfaced count: 0
- dense present in nonSurfacedLabels with reason deferred_label: 38
- sparse present in nonSurfacedLabels with reason deferred_label: 0

Notes:
- dense/sparse must not appear in surfaced runtime labels.
- If present internally, they should appear only in analysis nonSurfacedLabels with reason deferred_label.

## Run metadata

- Generated at: 2026-05-30T13:54:12.209Z
- Source: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/calibration_set_1_with_descriptors.json
- Songs analyzed: 38

## Files

### Files modified

- (none)

### Files created

- audiofile-ai/experimentation/scripts/run_calibration_analysis_reporting.js
- /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/calibration_analysis_after_driving_confidence_fix.json
- /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/reports/calibration_analysis_after_driving_confidence_fix.md

## State definitions

- `SUPPORTED`: confidence >= 0.60 AND score >= 0.65
- `REJECTED`: confidence >= 0.60 AND score <= 0.35
- `UNCERTAIN`: confidence < 0.60 OR (0.35 < score < 0.65)

## Report structure

- Per-song: identity, surfaced labels, active label analysis (all active labels), inverse label analysis (experimental), and core dimensions.

## Songs

### Darude - Sandstorm

#### Song Identity

| field | value |
| --- | --- |
| title | Sandstorm |
| artist | Darude |
| isrc | FISGC9900001 |
| spotify_id | 6Sy9BUbgFse0n0LPA5lwy5 |
| apple_id | 338349243 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 20326415 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.66 | 0.69 |
| driving | 0.65 | 0.60 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.65 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.65 | 0.60 | SUPPORTED | false |  |
| steady | 0.66 | 0.69 | SUPPORTED | false |  |
| bouncy | 0.65 | 0.59 | UNCERTAIN | false |  |
| heavy | 0.79 | 0.59 | UNCERTAIN | false |  |
| punchy | 0.74 | 0.57 | UNCERTAIN | false |  |
| vocal | 0.34 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.66 | 0.50 | UNCERTAIN | false |  |
| speech | 0.03 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.66 | 0.48 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| light | heavy | 0.21 | 0.59 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.65 | 0.95 | true |
| pulse | 0.66 | 1.00 | true |
| brightness | 0.21 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.34 | 0.75 | true |
| speech | 0.03 | 0.95 | true |
| valence | 0.16 | 0.95 | true |
| punch | 0.74 | 0.70 | true |

### Daft Punk - One More Time

#### Song Identity

| field | value |
| --- | --- |
| title | One More Time |
| artist | Daft Punk |
| isrc | GBDUW0000053 |
| spotify_id | 0DiWol3AO6WpXZgp0goxAV |
| apple_id | 697195462 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 1945387 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.99 | 0.74 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.53 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.50 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.48 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.51 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.72 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.70 | 0.52 | UNCERTAIN | false |  |
| vocal | 0.99 | 0.74 | SUPPORTED | false |  |
| instrumental | 0.01 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.10 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.48 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.47 | 0.00 | UNCERTAIN |
| light | heavy | 0.28 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.53 | 0.95 | true |
| pulse | 0.48 | 1.00 | true |
| brightness | 0.28 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 0.99 | 0.75 | true |
| speech | 0.10 | 0.95 | true |
| valence | 0.41 | 0.95 | true |
| punch | 0.70 | 0.70 | true |

### FISHER - Losing It

#### Song Identity

| field | value |
| --- | --- |
| title | Losing It |
| artist | FISHER |
| isrc | CA5KR1821202 |
| spotify_id |  |
| apple_id | 1408454985 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 19535907 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.85 | 0.89 |
| hypnotic | 0.85 | 0.80 |
| bouncy | 0.78 | 0.77 |
| driving | 0.79 | 0.77 |
| energetic | 0.72 | 0.66 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.72 | 0.66 | SUPPORTED | false |  |
| driving | 0.79 | 0.77 | SUPPORTED | false |  |
| steady | 0.85 | 0.89 | SUPPORTED | false |  |
| bouncy | 0.78 | 0.77 | SUPPORTED | false |  |
| heavy | 0.74 | 0.63 | SUPPORTED | false |  |
| punchy | 0.88 | 0.66 | SUPPORTED | false |  |
| vocal | 0.19 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.81 | 0.61 | SUPPORTED | false |  |
| speech | 0.13 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.85 | 0.80 | SUPPORTED | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| calm | energetic | 0.28 | 0.66 | REJECTED |
| light | heavy | 0.26 | 0.63 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.72 | 0.95 | true |
| pulse | 0.85 | 1.00 | true |
| brightness | 0.26 | 0.90 | true |
| density | 0.10 | 0.70 | true |
| vocal_presence | 0.19 | 0.75 | true |
| speech | 0.13 | 0.95 | true |
| valence | 0.41 | 0.95 | true |
| punch | 0.88 | 0.70 | true |

### Dom Dolla - Take It

#### Song Identity

| field | value |
| --- | --- |
| title | Take It |
| artist | Dom Dolla |
| isrc | AUDCB1701202 |
| spotify_id | 14fIlfcmFPlj4V2IazeJ25 |
| apple_id | 1454818194 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 20084197 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.76 | 0.80 |
| bouncy | 0.68 | 0.68 |
| driving | 0.69 | 0.66 |
| hypnotic | 0.76 | 0.65 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.60 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.69 | 0.66 | SUPPORTED | false |  |
| steady | 0.76 | 0.80 | SUPPORTED | false |  |
| bouncy | 0.68 | 0.68 | SUPPORTED | false |  |
| heavy | 0.81 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.78 | 0.60 | UNCERTAIN | false |  |
| vocal | 0.75 | 0.53 | UNCERTAIN | false |  |
| instrumental | 0.25 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.07 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.76 | 0.65 | SUPPORTED | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.40 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.60 | 0.95 | true |
| pulse | 0.76 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.75 | 0.75 | true |
| speech | 0.07 | 0.95 | true |
| valence | 0.31 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### MK - Rhyme Dust

#### Song Identity

| field | value |
| --- | --- |
| title | Rhyme Dust |
| artist | MK |
| isrc | GBARL2300220 |
| spotify_id | 6JGxs7oSmmFIUcZ5ft54aJ |
| apple_id | 1671893661 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 22759775 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.75 | 0.79 |
| bouncy | 0.66 | 0.65 |
| driving | 0.68 | 0.65 |
| hypnotic | 0.75 | 0.64 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.57 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.68 | 0.65 | SUPPORTED | false |  |
| steady | 0.75 | 0.79 | SUPPORTED | false |  |
| bouncy | 0.66 | 0.65 | SUPPORTED | false |  |
| heavy | 0.85 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.78 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.64 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.36 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.14 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.75 | 0.64 | SUPPORTED | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| light | heavy | 0.15 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.57 | 0.95 | true |
| pulse | 0.75 | 1.00 | true |
| brightness | 0.15 | 0.90 | true |
| density | 0.10 | 0.70 | true |
| vocal_presence | 0.64 | 0.59 | true |
| speech | 0.14 | 0.95 | true |
| valence | 0.46 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### Kylie Minogue - Can't Get You Out of My Head

#### Song Identity

| field | value |
| --- | --- |
| title | Can't Get You Out of My Head |
| artist | Kylie Minogue |
| isrc | GBAYE0100913 |
| spotify_id | 50VkZxRo83mPJAKQk6UEaK |
| apple_id | 726320692 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 955913 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.70 | 0.74 |
| bouncy | 0.63 | 0.69 |
| driving | 0.65 | 0.61 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.56 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.65 | 0.61 | UNCERTAIN | false |  |
| steady | 0.70 | 0.74 | SUPPORTED | false |  |
| bouncy | 0.63 | 0.69 | UNCERTAIN | false |  |
| heavy | 0.93 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.75 | 0.58 | UNCERTAIN | false |  |
| vocal | 0.56 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.44 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.04 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.70 | 0.56 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.56 | 0.95 | true |
| pulse | 0.70 | 1.00 | true |
| brightness | 0.07 | 0.90 | true |
| density | 0.08 | 0.70 | true |
| vocal_presence | 0.56 | 0.59 | true |
| speech | 0.04 | 0.95 | true |
| valence | 0.85 | 0.95 | true |
| punch | 0.75 | 0.70 | true |

### Daft Punk - Veridis Quo

#### Song Identity

| field | value |
| --- | --- |
| title | Veridis Quo |
| artist | Daft Punk |
| isrc | GBDUW0000066 |
| spotify_id | 2LD2gT7gwAurzdQDQtILds |
| apple_id | 697196125 |
| inputMusicStoryRecordingId | 1945394 |
| providerRecordingId | 1945394 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.71 | 0.75 |
| instrumental | 0.95 | 0.71 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.43 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.60 | 0.00 | UNCERTAIN | true | energy_below_required; drive_combo_below_required |
| steady | 0.71 | 0.75 | SUPPORTED | false |  |
| bouncy | 0.57 | 0.54 | UNCERTAIN | false |  |
| heavy | 0.95 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.67 | 0.49 | UNCERTAIN | false |  |
| vocal | 0.05 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.95 | 0.71 | SUPPORTED | false |  |
| speech | 0.04 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.71 | 0.58 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.93 | 0.00 | UNCERTAIN |
| calm | energetic | 0.57 | 0.00 | UNCERTAIN |
| light | heavy | 0.05 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.43 | 0.95 | true |
| pulse | 0.71 | 1.00 | true |
| brightness | 0.05 | 0.90 | true |
| density | 0.07 | 0.70 | true |
| vocal_presence | 0.05 | 0.75 | true |
| speech | 0.04 | 0.95 | true |
| valence | 0.35 | 0.95 | true |
| punch | 0.67 | 0.70 | true |

### Daft Punk - Harder, Better, Faster, Stronger

#### Song Identity

| field | value |
| --- | --- |
| title | Harder, Better, Faster, Stronger |
| artist | Daft Punk |
| isrc | GBDUW0000059 |
| spotify_id | 5W3cjX2J3tjhG8zb6u0qHn |
| apple_id | 697195787 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 554600 |

#### Surfaced Labels

- (none)

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.54 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.55 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.56 | 0.56 | UNCERTAIN | false |  |
| bouncy | 0.55 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.81 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.75 | 0.58 | UNCERTAIN | false |  |
| vocal | 0.67 | 0.46 | UNCERTAIN | false |  |
| instrumental | 0.33 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.14 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.56 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.46 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.54 | 0.95 | true |
| pulse | 0.56 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.67 | 0.75 | true |
| speech | 0.14 | 0.95 | true |
| valence | 0.69 | 0.95 | true |
| punch | 0.75 | 0.70 | true |

#### Warnings

- no_labels_surfaced

### Skrillex - Bangarang (feat. Sirah)

#### Song Identity

| field | value |
| --- | --- |
| title | Bangarang (feat. Sirah) |
| artist | Skrillex |
| isrc | USAT21104243 |
| spotify_id |  |
| apple_id | 491596647 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 4447381 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.95 | 0.71 |
| energetic | 0.74 | 0.69 |
| punchy | 0.83 | 0.63 |
| steady | 0.60 | 0.60 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.74 | 0.69 | SUPPORTED | false |  |
| driving | 0.66 | 0.59 | UNCERTAIN | false |  |
| steady | 0.60 | 0.60 | UNCERTAIN | false |  |
| bouncy | 0.67 | 0.52 | UNCERTAIN | false |  |
| heavy | 0.69 | 0.59 | UNCERTAIN | false |  |
| punchy | 0.83 | 0.63 | SUPPORTED | false |  |
| vocal | 0.95 | 0.71 | SUPPORTED | false |  |
| instrumental | 0.05 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.22 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.60 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.85 | 0.00 | UNCERTAIN |
| calm | energetic | 0.26 | 0.69 | REJECTED |
| light | heavy | 0.31 | 0.59 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.74 | 0.95 | true |
| pulse | 0.60 | 1.00 | true |
| brightness | 0.31 | 0.90 | true |
| density | 0.15 | 0.70 | true |
| vocal_presence | 0.95 | 0.75 | true |
| speech | 0.22 | 0.95 | true |
| valence | 0.55 | 0.95 | true |
| punch | 0.83 | 0.70 | true |

### Skrillex - Scary Monsters and Nice Sprites

#### Song Identity

| field | value |
| --- | --- |
| title | Scary Monsters and Nice Sprites |
| artist | Skrillex |
| isrc | GBTDG1000196 |
| spotify_id | 4rwpZEcnalkuhPyGkEdhu0 |
| apple_id | 409001935 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 3426441 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| heavy | 0.83 | 0.69 |
| energetic | 0.74 | 0.68 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.74 | 0.68 | SUPPORTED | false |  |
| driving | 0.62 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.54 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.64 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.83 | 0.69 | SUPPORTED | false |  |
| punchy | 0.74 | 0.55 | UNCERTAIN | false |  |
| vocal | 0.57 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.43 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.09 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.54 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.26 | 0.68 | REJECTED |
| light | heavy | 0.17 | 0.69 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.74 | 0.95 | true |
| pulse | 0.54 | 1.00 | true |
| brightness | 0.17 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 0.57 | 0.59 | true |
| speech | 0.09 | 0.95 | true |
| valence | 0.37 | 0.95 | true |
| punch | 0.74 | 0.70 | true |

### Sub Focus - Push The Tempo

#### Song Identity

| field | value |
| --- | --- |
| title | Push The Tempo |
| artist | Sub Focus |
| isrc | GBUM72405427 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 30835261 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |
| steady | 0.68 | 0.71 |
| heavy | 0.82 | 0.65 |
| energetic | 0.70 | 0.65 |
| driving | 0.69 | 0.64 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.70 | 0.65 | SUPPORTED | false |  |
| driving | 0.69 | 0.64 | SUPPORTED | false |  |
| steady | 0.68 | 0.71 | SUPPORTED | false |  |
| bouncy | 0.69 | 0.62 | SUPPORTED | false |  |
| heavy | 0.82 | 0.65 | SUPPORTED | false |  |
| punchy | 0.72 | 0.55 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.68 | 0.52 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.30 | 0.65 | REJECTED |
| light | heavy | 0.18 | 0.65 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.70 | 0.95 | true |
| pulse | 0.68 | 1.00 | true |
| brightness | 0.18 | 0.90 | true |
| density | 0.13 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.23 | 0.95 | true |
| punch | 0.72 | 0.70 | true |

### Sub Focus & Dimension - Desire

#### Song Identity

| field | value |
| --- | --- |
| title | Desire |
| artist | Sub Focus & Dimension |
| isrc | GBUM71806016 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 19545468 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.68 | 0.71 |
| vocal | 0.91 | 0.67 |
| heavy | 0.81 | 0.66 |
| energetic | 0.71 | 0.66 |
| driving | 0.69 | 0.64 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.71 | 0.66 | SUPPORTED | false |  |
| driving | 0.69 | 0.64 | SUPPORTED | false |  |
| steady | 0.68 | 0.71 | SUPPORTED | false |  |
| bouncy | 0.69 | 0.62 | SUPPORTED | false |  |
| heavy | 0.81 | 0.66 | SUPPORTED | false |  |
| punchy | 0.72 | 0.55 | UNCERTAIN | false |  |
| vocal | 0.91 | 0.67 | SUPPORTED | false |  |
| instrumental | 0.09 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.07 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.68 | 0.52 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.29 | 0.66 | REJECTED |
| light | heavy | 0.19 | 0.66 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.71 | 0.95 | true |
| pulse | 0.68 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 0.91 | 0.75 | true |
| speech | 0.07 | 0.95 | true |
| valence | 0.34 | 0.95 | true |
| punch | 0.72 | 0.70 | true |

### Lil Jon & The East Side Boyz - Get Low

#### Song Identity

| field | value |
| --- | --- |
| title | Get Low |
| artist | Lil Jon & The East Side Boyz |
| isrc | USTV10200084 |
| spotify_id | 0r2Bul2NuCViraT2zX1l5j |
| apple_id | 311288439 |
| inputMusicStoryRecordingId | 1406940 |
| providerRecordingId | 1406940 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.53 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.54 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.54 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.54 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.84 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.69 | 0.51 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.08 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.54 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.85 | 0.00 | UNCERTAIN |
| calm | energetic | 0.47 | 0.00 | UNCERTAIN |
| light | heavy | 0.16 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.53 | 0.95 | true |
| pulse | 0.54 | 1.00 | true |
| brightness | 0.16 | 0.90 | true |
| density | 0.15 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.08 | 0.95 | true |
| valence | 0.17 | 0.95 | true |
| punch | 0.69 | 0.70 | true |

### Denzel Curry - STILL IN THE PAINT

#### Song Identity

| field | value |
| --- | --- |
| title | STILL IN THE PAINT |
| artist | Denzel Curry |
| isrc | USC4R2447762 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 31138337 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.66 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.51 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.58 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.95 | 0.60 | UNCERTAIN | false |  |
| punchy | 0.74 | 0.55 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.11 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.51 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.83 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| light | heavy | 0.05 | 0.60 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.66 | 0.95 | true |
| pulse | 0.51 | 1.00 | true |
| brightness | 0.05 | 0.90 | true |
| density | 0.17 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.11 | 0.95 | true |
| valence | 0.38 | 0.95 | true |
| punch | 0.74 | 0.70 | true |

### The Game - Hate It Or Love It

#### Song Identity

| field | value |
| --- | --- |
| title | Hate It Or Love It |
| artist | The Game |
| isrc | USIR10401121 |
| spotify_id | 2wGSgTmgSF3xjRrHkTc25R |
| apple_id | 1440799195 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 161875 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |
| steady | 0.66 | 0.69 |
| punchy | 0.80 | 0.61 |
| driving | 0.65 | 0.60 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.65 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.65 | 0.60 | SUPPORTED | false |  |
| steady | 0.66 | 0.69 | SUPPORTED | false |  |
| bouncy | 0.65 | 0.59 | UNCERTAIN | false |  |
| heavy | 0.88 | 0.59 | UNCERTAIN | false |  |
| punchy | 0.80 | 0.61 | SUPPORTED | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.23 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.66 | 0.48 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| light | heavy | 0.12 | 0.59 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.65 | 0.95 | true |
| pulse | 0.66 | 1.00 | true |
| brightness | 0.12 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.23 | 0.95 | true |
| valence | 0.50 | 0.95 | true |
| punch | 0.80 | 0.70 | true |

### Rob $tone - Chill Bill (feat. J. Davi$ & Spooks)

#### Song Identity

| field | value |
| --- | --- |
| title | Chill Bill (feat. J. Davi$ & Spooks) |
| artist | Rob $tone |
| isrc | USRC11601124 |
| spotify_id | 5uDASfU19gDxSjW8cnCaBp |
| apple_id | 1124141439 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 17651619 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.45 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.52 | 0.00 | UNCERTAIN | true | pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.57 | 0.60 | UNCERTAIN | false |  |
| bouncy | 0.51 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.82 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.68 | 0.53 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.29 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.55 | 0.00 | UNCERTAIN |
| light | heavy | 0.18 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.45 | 0.95 | true |
| pulse | 0.57 | 1.00 | true |
| brightness | 0.18 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.29 | 0.95 | true |
| valence | 0.20 | 0.95 | true |
| punch | 0.68 | 0.70 | true |

### Nirvana - Smells Like Teen Spirit

#### Song Identity

| field | value |
| --- | --- |
| title | Smells Like Teen Spirit |
| artist | Nirvana |
| isrc | USGF19942501 |
| spotify_id | 75aLTVBSGIquqzQ6AkmK3Q |
| apple_id | 1440783625 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 9040386 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.66 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.44 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; drive_combo_below_required |
| steady | 0.29 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.47 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.78 | 0.60 | UNCERTAIN | false |  |
| punchy | 0.77 | 0.57 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.29 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| light | heavy | 0.22 | 0.60 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.66 | 0.95 | true |
| pulse | 0.29 | 1.00 | true |
| brightness | 0.22 | 0.90 | true |
| density | 0.18 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.67 | 0.95 | true |
| punch | 0.77 | 0.70 | true |

### Mötley Crüe - Kickstart My Heart

#### Song Identity

| field | value |
| --- | --- |
| title | Kickstart My Heart |
| artist | Mötley Crüe |
| isrc | USBY29900215 |
| spotify_id | 4Yqy0GpeDEXLibWJCZyQew |
| apple_id | 1764396024 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 17752557 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.95 | 0.71 |
| energetic | 0.68 | 0.63 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.68 | 0.63 | SUPPORTED | false |  |
| driving | 0.47 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; drive_combo_below_required |
| steady | 0.33 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.51 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.65 | 0.55 | UNCERTAIN | false |  |
| punchy | 0.70 | 0.52 | UNCERTAIN | false |  |
| vocal | 0.95 | 0.71 | SUPPORTED | false |  |
| instrumental | 0.05 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.06 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.33 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.80 | 0.00 | UNCERTAIN |
| calm | energetic | 0.32 | 0.63 | REJECTED |
| light | heavy | 0.35 | 0.55 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.68 | 0.95 | true |
| pulse | 0.33 | 1.00 | true |
| brightness | 0.35 | 0.90 | true |
| density | 0.20 | 0.70 | true |
| vocal_presence | 0.95 | 0.75 | true |
| speech | 0.06 | 0.95 | true |
| valence | 0.19 | 0.95 | true |
| punch | 0.70 | 0.70 | true |

### The White Stripes - Seven Nation Army

#### Song Identity

| field | value |
| --- | --- |
| title | Seven Nation Army |
| artist | The White Stripes |
| isrc | USVT10300001 |
| spotify_id | 3dPQuX8Gs42Y7b454ybpMR |
| apple_id | 1533513537 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 4393363 |

#### Surfaced Labels

- (none)

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.42 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.36 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.32 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.37 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.81 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.66 | 0.46 | UNCERTAIN | false |  |
| vocal | 0.41 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.59 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.08 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.32 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.84 | 0.00 | UNCERTAIN |
| calm | energetic | 0.58 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.42 | 0.95 | true |
| pulse | 0.32 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.16 | 0.70 | true |
| vocal_presence | 0.41 | 0.59 | true |
| speech | 0.08 | 0.95 | true |
| valence | 0.12 | 0.95 | true |
| punch | 0.66 | 0.70 | true |

#### Warnings

- no_labels_surfaced

### Franz Ferdinand - Take Me Out

#### Song Identity

| field | value |
| --- | --- |
| title | Take Me Out |
| artist | Franz Ferdinand |
| isrc | GBCEL0300192 |
| spotify_id | 20I8RduZC2PWMWTDCZuuAN |
| apple_id | 315844084 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 51934 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.90 | 0.67 |
| heavy | 0.76 | 0.60 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.66 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.42 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; drive_combo_below_required |
| steady | 0.25 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.46 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.76 | 0.60 | SUPPORTED | false |  |
| punchy | 0.73 | 0.54 | UNCERTAIN | false |  |
| vocal | 0.90 | 0.67 | SUPPORTED | false |  |
| instrumental | 0.10 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.25 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| light | heavy | 0.24 | 0.60 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.66 | 0.95 | true |
| pulse | 0.25 | 1.00 | true |
| brightness | 0.24 | 0.90 | true |
| density | 0.18 | 0.70 | true |
| vocal_presence | 0.90 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.78 | 0.95 | true |
| punch | 0.73 | 0.70 | true |

### Stevie Wonder - Superstition

#### Song Identity

| field | value |
| --- | --- |
| title | Superstition |
| artist | Stevie Wonder |
| isrc | USMO17200984 |
| spotify_id | 4N0TP4Rmj6QQezWV88ARNJ |
| apple_id | 1440808985 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 1508092 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.97 | 0.73 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.41 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.29 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.22 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.31 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.85 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.64 | 0.45 | UNCERTAIN | false |  |
| vocal | 0.97 | 0.73 | SUPPORTED | false |  |
| instrumental | 0.03 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.22 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| calm | energetic | 0.59 | 0.00 | UNCERTAIN |
| light | heavy | 0.15 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.41 | 0.95 | true |
| pulse | 0.22 | 1.00 | true |
| brightness | 0.15 | 0.90 | true |
| density | 0.18 | 0.70 | true |
| vocal_presence | 0.97 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.50 | 0.95 | true |
| punch | 0.64 | 0.70 | true |

### Earth, Wind & Fire - Let's Groove

#### Song Identity

| field | value |
| --- | --- |
| title | Let's Groove |
| artist | Earth, Wind & Fire |
| isrc | USSM18100641 |
| spotify_id | 3koCCeSaVUyrRo3N2gHrd8 |
| apple_id | 523229275 |
| inputMusicStoryRecordingId | 1004323 |
| providerRecordingId | 1004323 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.36 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.37 | 0.00 | UNCERTAIN | true | pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.38 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.37 | 0.00 | UNCERTAIN | true | pulse_below_required; energy_below_required |
| heavy | 0.81 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.65 | 0.45 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.06 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.38 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.64 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.36 | 0.95 | true |
| pulse | 0.38 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.06 | 0.95 | true |
| valence | 0.22 | 0.95 | true |
| punch | 0.65 | 0.70 | true |

### Wild Cherry - Play That Funky Music

#### Song Identity

| field | value |
| --- | --- |
| title | Play That Funky Music |
| artist | Wild Cherry |
| isrc | USSM19912699 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 432877 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.98 | 0.73 |
| energetic | 0.68 | 0.63 |
| heavy | 0.76 | 0.62 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.68 | 0.63 | SUPPORTED | false |  |
| driving | 0.49 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.36 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.52 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.76 | 0.62 | SUPPORTED | false |  |
| punchy | 0.78 | 0.57 | UNCERTAIN | false |  |
| vocal | 0.98 | 0.73 | SUPPORTED | false |  |
| instrumental | 0.02 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.13 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.36 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.84 | 0.00 | UNCERTAIN |
| calm | energetic | 0.32 | 0.63 | REJECTED |
| light | heavy | 0.24 | 0.62 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.68 | 0.95 | true |
| pulse | 0.36 | 1.00 | true |
| brightness | 0.24 | 0.90 | true |
| density | 0.16 | 0.70 | true |
| vocal_presence | 0.98 | 0.75 | true |
| speech | 0.13 | 0.95 | true |
| valence | 0.86 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### The Jacksons - Blame It on the Boogie

#### Song Identity

| field | value |
| --- | --- |
| title | Blame It on the Boogie |
| artist | The Jacksons |
| isrc | USSM17801024 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 2235096 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.99 | 0.74 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.65 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.45 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; drive_combo_below_required |
| steady | 0.31 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.48 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.79 | 0.59 | UNCERTAIN | false |  |
| punchy | 0.77 | 0.57 | UNCERTAIN | false |  |
| vocal | 0.99 | 0.74 | SUPPORTED | false |  |
| instrumental | 0.01 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.09 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.31 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.81 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| light | heavy | 0.21 | 0.59 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.65 | 0.95 | true |
| pulse | 0.31 | 1.00 | true |
| brightness | 0.21 | 0.90 | true |
| density | 0.19 | 0.70 | true |
| vocal_presence | 0.99 | 0.75 | true |
| speech | 0.09 | 0.95 | true |
| valence | 0.83 | 0.95 | true |
| punch | 0.77 | 0.70 | true |

### Daft Punk - Get Lucky (feat. Pharrell Williams and Nile Rodgers)

#### Song Identity

| field | value |
| --- | --- |
| title | Get Lucky (feat. Pharrell Williams and Nile Rodgers) |
| artist | Daft Punk |
| isrc | USQX91300108 |
| spotify_id | 69kOkLUCkxIZYexIgSG8rq |
| apple_id | 617154366 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 23011398 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.90 | 0.67 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.56 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.56 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.56 | 0.58 | UNCERTAIN | false |  |
| bouncy | 0.56 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.93 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.77 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.90 | 0.67 | SUPPORTED | false |  |
| instrumental | 0.10 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.04 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.56 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.56 | 0.95 | true |
| pulse | 0.56 | 1.00 | true |
| brightness | 0.07 | 0.90 | true |
| density | 0.10 | 0.70 | true |
| vocal_presence | 0.90 | 0.75 | true |
| speech | 0.04 | 0.95 | true |
| valence | 0.76 | 0.95 | true |
| punch | 0.77 | 0.70 | true |

### Mark Ronson - Uptown Funk (feat. Bruno Mars)

#### Song Identity

| field | value |
| --- | --- |
| title | Uptown Funk (feat. Bruno Mars) |
| artist | Mark Ronson |
| isrc | GBARL1401524 |
| spotify_id | 0EI7zP0JAnUEVsUISYaVS7 |
| apple_id | 943946671 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 9355929 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.90 | 0.66 |
| punchy | 0.82 | 0.62 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.57 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.57 | 0.60 | UNCERTAIN | false |  |
| bouncy | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.79 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.82 | 0.62 | SUPPORTED | false |  |
| vocal | 0.90 | 0.66 | SUPPORTED | false |  |
| instrumental | 0.10 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.09 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| light | heavy | 0.21 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.57 | 0.95 | true |
| pulse | 0.57 | 1.00 | true |
| brightness | 0.21 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.90 | 0.75 | true |
| speech | 0.09 | 0.95 | true |
| valence | 0.79 | 0.95 | true |
| punch | 0.82 | 0.70 | true |

### Backstreet Boys - I Want It That Way

#### Song Identity

| field | value |
| --- | --- |
| title | I Want It That Way |
| artist | Backstreet Boys |
| isrc | USJI19910614 |
| spotify_id | 47BBI51FKFwOMlIiX6m8ya |
| apple_id | 283567164 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 1365657 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |
| steady | 0.65 | 0.69 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.56 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.62 | 0.57 | UNCERTAIN | false |  |
| steady | 0.65 | 0.69 | SUPPORTED | false |  |
| bouncy | 0.61 | 0.58 | UNCERTAIN | false |  |
| heavy | 0.77 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.69 | 0.54 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.00 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.65 | 0.48 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| light | heavy | 0.23 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.56 | 0.95 | true |
| pulse | 0.65 | 1.00 | true |
| brightness | 0.23 | 0.90 | true |
| density | 0.08 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.00 | 0.95 | true |
| valence | 0.38 | 0.95 | true |
| punch | 0.69 | 0.70 | true |

### Lady Gaga - Telephone

#### Song Identity

| field | value |
| --- | --- |
| title | Telephone |
| artist | Lady Gaga |
| isrc | USUM70905541 |
| spotify_id | 7rl7ao5pb9BhvAzPdWStxi |
| apple_id | 1476727675 |
| inputMusicStoryRecordingId | 9235806 |
| providerRecordingId | 9235806 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.97 | 0.72 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.62 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.59 | 0.00 | UNCERTAIN | true | pulse_below_required; drive_combo_below_required |
| steady | 0.56 | 0.59 | UNCERTAIN | false |  |
| bouncy | 0.59 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.81 | 0.55 | UNCERTAIN | false |  |
| punchy | 0.78 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.97 | 0.72 | SUPPORTED | false |  |
| instrumental | 0.03 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.04 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.56 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.38 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.55 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.62 | 0.95 | true |
| pulse | 0.56 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.97 | 0.75 | true |
| speech | 0.04 | 0.95 | true |
| valence | 0.65 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### Sabrina Carpenter - Feather

#### Song Identity

| field | value |
| --- | --- |
| title | Feather |
| artist | Sabrina Carpenter |
| isrc | USUM72301876 |
| spotify_id | 2Zo1PcszsT9WQ0ANntJbID |
| apple_id | 1676555853 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 23335426 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 1.00 | 0.75 |
| steady | 0.59 | 0.62 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.64 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.61 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.59 | 0.62 | UNCERTAIN | false |  |
| bouncy | 0.62 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.91 | 0.58 | UNCERTAIN | false |  |
| punchy | 0.71 | 0.55 | UNCERTAIN | false |  |
| vocal | 1.00 | 0.75 | SUPPORTED | false |  |
| instrumental | 0.00 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.03 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.59 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.36 | 0.00 | UNCERTAIN |
| light | heavy | 0.09 | 0.58 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.64 | 0.95 | true |
| pulse | 0.59 | 1.00 | true |
| brightness | 0.09 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 1.00 | 0.75 | true |
| speech | 0.03 | 0.95 | true |
| valence | 0.45 | 0.95 | true |
| punch | 0.71 | 0.70 | true |

### Bruno Mars - Treasure

#### Song Identity

| field | value |
| --- | --- |
| title | Treasure |
| artist | Bruno Mars |
| isrc | USAT21206969 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 5260845 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.63 | 0.67 |
| vocal | 0.87 | 0.64 |
| punchy | 0.82 | 0.62 |
| bouncy | 0.63 | 0.61 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.62 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.63 | 0.58 | UNCERTAIN | false |  |
| steady | 0.63 | 0.67 | UNCERTAIN | false |  |
| bouncy | 0.63 | 0.61 | UNCERTAIN | false |  |
| heavy | 0.86 | 0.56 | UNCERTAIN | false |  |
| punchy | 0.82 | 0.62 | SUPPORTED | false |  |
| vocal | 0.87 | 0.64 | SUPPORTED | false |  |
| instrumental | 0.13 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.07 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.63 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| calm | energetic | 0.38 | 0.00 | UNCERTAIN |
| light | heavy | 0.14 | 0.56 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.62 | 0.95 | true |
| pulse | 0.63 | 1.00 | true |
| brightness | 0.14 | 0.90 | true |
| density | 0.10 | 0.70 | true |
| vocal_presence | 0.87 | 0.75 | true |
| speech | 0.07 | 0.95 | true |
| valence | 0.96 | 0.95 | true |
| punch | 0.82 | 0.70 | true |

### Bill Withers - Ain't No Sunshine

#### Song Identity

| field | value |
| --- | --- |
| title | Ain't No Sunshine |
| artist | Bill Withers |
| isrc | USSM10000372 |
| spotify_id | 1k1Bqnv2R0uJXQN4u6LKYt |
| apple_id | 293521573 |
| inputMusicStoryRecordingId | 443903 |
| providerRecordingId | 443903 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.99 | 0.74 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.37 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.31 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.27 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.32 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; energy_below_required |
| heavy | 0.89 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.63 | 0.44 | UNCERTAIN | false |  |
| vocal | 0.99 | 0.74 | SUPPORTED | false |  |
| instrumental | 0.01 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.06 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.27 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.63 | 0.00 | UNCERTAIN |
| light | heavy | 0.11 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.37 | 0.95 | true |
| pulse | 0.27 | 1.00 | true |
| brightness | 0.11 | 0.90 | true |
| density | 0.13 | 0.70 | true |
| vocal_presence | 0.99 | 0.75 | true |
| speech | 0.06 | 0.95 | true |
| valence | 0.55 | 0.95 | true |
| punch | 0.63 | 0.70 | true |

### Daft Punk - Something About Us

#### Song Identity

| field | value |
| --- | --- |
| title | Something About Us |
| artist | Daft Punk |
| isrc | GBDUW0000064 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 554601 |

#### Surfaced Labels

- (none)

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.32 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.46 | 0.00 | UNCERTAIN | true | energy_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.55 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.43 | 0.00 | UNCERTAIN | true | energy_too_low; pulse_below_required; energy_below_required |
| heavy | 0.88 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.68 | 0.48 | UNCERTAIN | false |  |
| vocal | 0.79 | 0.57 | UNCERTAIN | false |  |
| instrumental | 0.21 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.20 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.55 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.93 | 0.00 | UNCERTAIN |
| calm | energetic | 0.68 | 0.00 | UNCERTAIN |
| light | heavy | 0.12 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.32 | 0.95 | true |
| pulse | 0.55 | 1.00 | true |
| brightness | 0.12 | 0.90 | true |
| density | 0.07 | 0.70 | true |
| vocal_presence | 0.79 | 0.75 | true |
| speech | 0.20 | 0.95 | true |
| valence | 0.58 | 0.95 | true |
| punch | 0.68 | 0.70 | true |

#### Warnings

- no_labels_surfaced

### Massive Attack - Angel

#### Song Identity

| field | value |
| --- | --- |
| title | Angel |
| artist | Massive Attack |
| isrc | GBAAA9800327 |
| spotify_id |  |
| apple_id | 724466660 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 9155950 |

#### Surfaced Labels

- (none)

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.41 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.47 | 0.00 | UNCERTAIN | true | pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.52 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.46 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.93 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.69 | 0.48 | UNCERTAIN | false |  |
| vocal | 0.41 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.59 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.07 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.52 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.59 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.41 | 0.95 | true |
| pulse | 0.52 | 1.00 | true |
| brightness | 0.07 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.41 | 0.59 | true |
| speech | 0.07 | 0.95 | true |
| valence | 0.18 | 0.95 | true |
| punch | 0.69 | 0.70 | true |

#### Warnings

- no_labels_surfaced

### Moby - Flower

#### Song Identity

| field | value |
| --- | --- |
| title | Flower |
| artist | Moby |
| isrc | GBAJH0000377 |
| spotify_id |  |
| apple_id | 281242696 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 9392266 |

#### Surfaced Labels

- (none)

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.57 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.43 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required; drive_combo_below_required |
| steady | 0.35 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.46 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |
| heavy | 0.78 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.70 | 0.52 | UNCERTAIN | false |  |
| vocal | 0.53 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.47 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.35 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| light | heavy | 0.22 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.57 | 0.95 | true |
| pulse | 0.35 | 1.00 | true |
| brightness | 0.22 | 0.90 | true |
| density | 0.13 | 0.70 | true |
| vocal_presence | 0.53 | 0.59 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.70 | 0.95 | true |
| punch | 0.70 | 0.70 | true |

#### Warnings

- no_labels_surfaced

### Camille Saint-Saëns - Danse macabre, Op. 40

#### Song Identity

| field | value |
| --- | --- |
| title | Danse macabre, Op. 40 |
| artist | Camille Saint-Saëns |
| isrc | GBF078010150 |
| spotify_id | 4oCQmcmwRTGtiQX8aowav4 |
| apple_id | 1452506045 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 1744853 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| instrumental | 0.84 | 0.63 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.10 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.11 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.11 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.11 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required |
| heavy | 0.89 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.60 | 0.42 | UNCERTAIN | false |  |
| vocal | 0.16 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.84 | 0.63 | SUPPORTED | false |  |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.11 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.90 | 0.00 | UNCERTAIN |
| light | heavy | 0.11 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.10 | 0.95 | true |
| pulse | 0.11 | 1.00 | true |
| brightness | 0.11 | 0.90 | true |
| density | 0.11 | 0.70 | true |
| vocal_presence | 0.16 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.13 | 0.95 | true |
| punch | 0.60 | 0.70 | true |

### Pyotr Ilyich Tchaikovsky - The Nutcracker (Suite), Op. 71a, TH. 35: 3. Waltz of the Flowers

#### Song Identity

| field | value |
| --- | --- |
| title | The Nutcracker (Suite), Op. 71a, TH. 35: 3. Waltz of the Flowers |
| artist | Pyotr Ilyich Tchaikovsky |
| isrc | DEF058203578 |
| spotify_id | 3eAG6YnPxAcN571Rtcirg8 |
| apple_id | 1452511616 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 1739490 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| instrumental | 0.93 | 0.70 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.14 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.13 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.11 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.13 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required |
| heavy | 0.90 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.61 | 0.43 | UNCERTAIN | false |  |
| vocal | 0.07 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.93 | 0.70 | SUPPORTED | false |  |
| speech | 0.03 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.11 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.86 | 0.00 | UNCERTAIN |
| light | heavy | 0.10 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.14 | 0.95 | true |
| pulse | 0.11 | 1.00 | true |
| brightness | 0.10 | 0.90 | true |
| density | 0.13 | 0.70 | true |
| vocal_presence | 0.07 | 0.75 | true |
| speech | 0.03 | 0.95 | true |
| valence | 0.12 | 0.95 | true |
| punch | 0.61 | 0.70 | true |

### Antonín Dvořák - Symphony No. 9 in E Minor, Op. 95, B. 178 "From the New World": IV. Allegro con fuoco

#### Song Identity

| field | value |
| --- | --- |
| title | Symphony No. 9 in E Minor, Op. 95, B. 178 "From the New World": IV. Allegro con fuoco |
| artist | Antonín Dvořák |
| isrc | USBC10402787 |
| spotify_id | 5B4DykTZOnoGXSX0M6XaOo |
| apple_id | 358328228 |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 23954940 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| instrumental | 0.85 | 0.64 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.24 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.15 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required; drive_combo_below_required |
| steady | 0.10 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.17 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required |
| heavy | 0.90 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.62 | 0.43 | UNCERTAIN | false |  |
| vocal | 0.15 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.85 | 0.64 | SUPPORTED | false |  |
| speech | 0.04 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.10 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.83 | 0.00 | UNCERTAIN |
| calm | energetic | 0.76 | 0.00 | UNCERTAIN |
| light | heavy | 0.10 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.24 | 0.95 | true |
| pulse | 0.10 | 1.00 | true |
| brightness | 0.10 | 0.90 | true |
| density | 0.17 | 0.70 | true |
| vocal_presence | 0.15 | 0.75 | true |
| speech | 0.04 | 0.95 | true |
| valence | 0.13 | 0.95 | true |
| punch | 0.62 | 0.70 | true |

### Suzanne Vega - Tom's Diner

#### Song Identity

| field | value |
| --- | --- |
| title | Tom's Diner |
| artist | Suzanne Vega |
| isrc | USAM10300195 |
| spotify_id |  |
| apple_id |  |
| inputMusicStoryRecordingId |  |
| providerRecordingId | 5248854 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.62 | 0.65 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.46 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.55 | 0.00 | UNCERTAIN | true | energy_below_required; drive_combo_below_required |
| steady | 0.62 | 0.65 | UNCERTAIN | false |  |
| bouncy | 0.54 | 0.54 | UNCERTAIN | false |  |
| heavy | 0.81 | 0.00 | UNCERTAIN | true | energy_below_required |
| punchy | 0.74 | 0.57 | UNCERTAIN | false |  |
| vocal | 0.72 | 0.51 | UNCERTAIN | false |  |
| instrumental | 0.28 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.62 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| calm | energetic | 0.54 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.46 | 0.95 | true |
| pulse | 0.62 | 1.00 | true |
| brightness | 0.19 | 0.90 | true |
| density | 0.08 | 0.70 | true |
| vocal_presence | 0.72 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.47 | 0.95 | true |
| punch | 0.74 | 0.70 | true |

## Validation results

- Generated Markdown report and JSON output without network calls.
- Confirmed active labels included: energetic, driving, steady, bouncy, heavy, punchy, vocal, instrumental, speech, hypnotic
- Confirmed inverse labels included: sparse, calm, light

## Known limitations

- Inverse labels are computed as score = 1 - baseLabel.score and share the base label confidence (first-pass heuristic).
- State thresholds are intentionally simple and may be refined after human review.
- Selection is currently the first N songs in the input file (not randomized).

## Next recommended step

Rerun calibration report after dense deferral and energetic threshold adjustment.

