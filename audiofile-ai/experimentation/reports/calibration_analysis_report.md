# Calibration Analysis Reporting Layer

## Run metadata

- Generated at: 2026-05-30T03:55:43.698Z
- Source: /Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/experimentation/outputs/musicstory_successes_only.json
- Songs analyzed: 8

## Files

### Files modified

- (none)

### Files created

- audiofile-ai/experimentation/scripts/run_calibration_analysis_reporting.js
- audiofile-ai/experimentation/outputs/calibration_analysis.json
- audiofile-ai/experimentation/reports/calibration_analysis_report.md

## State definitions

- `SUPPORTED`: confidence >= 0.60 AND score >= 0.65
- `REJECTED`: confidence >= 0.60 AND score <= 0.35
- `UNCERTAIN`: confidence < 0.60 OR (0.35 < score < 0.65)

## Report structure

- Per-song: identity, surfaced labels, active label analysis (all active labels), inverse label analysis (experimental), and core dimensions.

## Songs

### Derrick May - Strings of Life

#### Song Identity

| field | value |
| --- | --- |
| title | Strings of Life |
| artist | Derrick May |
| isrc | BEZ350800105 |
| spotify_id | 5S7zaCv2inktON7vNdGpHj |
| apple_id | 1804523655 |
| inputMusicStoryRecordingId | 1100904 |
| providerRecordingId | 1100904 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.96 | 0.72 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.34 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.27 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required |
| steady | 0.20 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.27 | 0.00 | UNCERTAIN | true | pulse_too_low; energy_too_low; pulse_below_required; energy_below_required |
| heavy | 0.88 | 0.00 | UNCERTAIN | true | energy_too_low; energy_below_required |
| punchy | 0.63 | 0.44 | UNCERTAIN | false |  |
| vocal | 0.96 | 0.72 | SUPPORTED | false |  |
| instrumental | 0.04 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.13 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.20 | 0.00 | UNCERTAIN | true | pulse_too_low; pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| calm | energetic | 0.66 | 0.00 | UNCERTAIN |
| light | heavy | 0.12 | 0.00 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.34 | 0.95 | true |
| pulse | 0.20 | 1.00 | true |
| brightness | 0.12 | 0.90 | true |
| density | 0.18 | 0.70 | true |
| vocal_presence | 0.96 | 0.75 | true |
| speech | 0.13 | 0.95 | true |
| valence | 0.27 | 0.95 | true |
| punch | 0.63 | 0.70 | true |

### GRiZ - Griztronics

#### Song Identity

| field | value |
| --- | --- |
| title | Griztronics |
| artist | GRiZ |
| isrc | CAUM81900241 |
| spotify_id | 6OTClxme7EYRZGO6An3SMc |
| apple_id | 1474897054 |
| inputMusicStoryRecordingId | 20083648 |
| providerRecordingId | 20083648 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.89 | 0.66 |
| heavy | 0.80 | 0.62 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.64 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.58 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.53 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.58 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.80 | 0.62 | SUPPORTED | false |  |
| punchy | 0.72 | 0.53 | UNCERTAIN | false |  |
| vocal | 0.89 | 0.66 | SUPPORTED | false |  |
| instrumental | 0.11 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.18 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.53 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.36 | 0.00 | UNCERTAIN |
| light | heavy | 0.20 | 0.62 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.64 | 0.95 | true |
| pulse | 0.53 | 1.00 | true |
| brightness | 0.20 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 0.89 | 0.75 | true |
| speech | 0.18 | 0.95 | true |
| valence | 0.35 | 0.95 | true |
| punch | 0.72 | 0.70 | true |

### Ski Aggu - Friesenjung

#### Song Identity

| field | value |
| --- | --- |
| title | Friesenjung |
| artist | Ski Aggu |
| isrc | DE1FB2300037 |
| spotify_id | 6tAKikIvnoWfUeZrfkopLL |
| apple_id | 1688994637 |
| inputMusicStoryRecordingId | 23032935 |
| providerRecordingId | 23032935 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.73 | 0.77 |
| heavy | 0.83 | 0.74 |
| bouncy | 0.74 | 0.67 |
| energetic | 0.75 | 0.63 |
| driving | 0.74 | 0.63 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.75 | 0.63 | SUPPORTED | false |  |
| driving | 0.74 | 0.63 | SUPPORTED | false |  |
| steady | 0.73 | 0.77 | SUPPORTED | false |  |
| bouncy | 0.74 | 0.67 | SUPPORTED | false |  |
| heavy | 0.83 | 0.74 | SUPPORTED | false |  |
| punchy | 0.77 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.74 | 0.52 | UNCERTAIN | false |  |
| instrumental | 0.26 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.06 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.73 | 0.60 | SUPPORTED | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.88 | 0.00 | UNCERTAIN |
| calm | energetic | 0.25 | 0.63 | REJECTED |
| light | heavy | 0.17 | 0.74 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.75 | 0.95 | true |
| pulse | 0.73 | 1.00 | true |
| brightness | 0.17 | 0.90 | true |
| density | 0.12 | 0.70 | true |
| vocal_presence | 0.74 | 0.75 | true |
| speech | 0.06 | 0.95 | true |
| valence | 0.55 | 0.95 | true |
| punch | 0.77 | 0.70 | true |

### Alok - Jungle

#### Song Identity

| field | value |
| --- | --- |
| title | Jungle |
| artist | Alok |
| isrc | DEE862301476 |
| spotify_id | 0OvO2X2Q3i98dc5RcgEN3x |
| apple_id | 1705391359 |
| inputMusicStoryRecordingId | 23227803 |
| providerRecordingId | 23227803 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.98 | 0.74 |
| heavy | 0.87 | 0.61 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.62 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.60 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.57 | 0.57 | UNCERTAIN | false |  |
| bouncy | 0.60 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.87 | 0.61 | SUPPORTED | false |  |
| punchy | 0.69 | 0.53 | UNCERTAIN | false |  |
| vocal | 0.98 | 0.74 | SUPPORTED | false |  |
| instrumental | 0.02 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.00 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.84 | 0.00 | UNCERTAIN |
| calm | energetic | 0.38 | 0.00 | UNCERTAIN |
| light | heavy | 0.13 | 0.61 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.62 | 0.95 | true |
| pulse | 0.57 | 1.00 | true |
| brightness | 0.13 | 0.90 | true |
| density | 0.16 | 0.70 | true |
| vocal_presence | 0.98 | 0.75 | true |
| speech | 0.00 | 0.95 | true |
| valence | 0.09 | 0.95 | true |
| punch | 0.69 | 0.70 | true |

### FAST BOY - Forget You

#### Song Identity

| field | value |
| --- | --- |
| title | Forget You |
| artist | FAST BOY |
| isrc | DEUM72300002 |
| spotify_id | 1YWr18dWRmuvPgAsPBsOow |
| apple_id | 1669621170 |
| inputMusicStoryRecordingId | 22737126 |
| providerRecordingId | 22737126 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.91 | 0.68 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.59 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.55 | 0.00 | UNCERTAIN | true | pulse_not_high_enough |
| bouncy | 0.57 | 0.00 | UNCERTAIN | true | pulse_below_required |
| heavy | 0.85 | 0.57 | UNCERTAIN | false |  |
| punchy | 0.71 | 0.52 | UNCERTAIN | false |  |
| vocal | 0.91 | 0.68 | SUPPORTED | false |  |
| instrumental | 0.09 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.55 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| calm | energetic | 0.41 | 0.00 | UNCERTAIN |
| light | heavy | 0.15 | 0.57 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.59 | 0.95 | true |
| pulse | 0.55 | 1.00 | true |
| brightness | 0.15 | 0.90 | true |
| density | 0.14 | 0.70 | true |
| vocal_presence | 0.91 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.27 | 0.95 | true |
| punch | 0.71 | 0.70 | true |

### Mr. Oizo - Cut Dick

#### Song Identity

| field | value |
| --- | --- |
| title | Cut Dick |
| artist | Mr. Oizo |
| isrc | FR0NT0800750 |
| spotify_id | 4sqZAKBTC4a2x1Ivil7h36 |
| apple_id | 295295608 |
| inputMusicStoryRecordingId | 983434 |
| providerRecordingId | 983434 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.64 | 0.67 |
| instrumental | 0.86 | 0.64 |
| bouncy | 0.62 | 0.62 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.59 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.62 | 0.00 | UNCERTAIN | true | pulse_below_required |
| steady | 0.64 | 0.67 | UNCERTAIN | false |  |
| bouncy | 0.62 | 0.62 | UNCERTAIN | false |  |
| heavy | 0.87 | 0.58 | UNCERTAIN | false |  |
| punchy | 0.78 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.14 | 0.00 | UNCERTAIN | true | vocal_not_high_enough |
| instrumental | 0.86 | 0.64 | SUPPORTED | false |  |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.64 | 0.00 | UNCERTAIN | true | pulse_below_required |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.91 | 0.00 | UNCERTAIN |
| calm | energetic | 0.41 | 0.00 | UNCERTAIN |
| light | heavy | 0.13 | 0.58 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.59 | 0.95 | true |
| pulse | 0.64 | 1.00 | true |
| brightness | 0.13 | 0.90 | true |
| density | 0.09 | 0.70 | true |
| vocal_presence | 0.14 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.74 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### Calvin Harris - I Need Your Love

#### Song Identity

| field | value |
| --- | --- |
| title | I Need Your Love |
| artist | Calvin Harris |
| isrc | GBARL1201390 |
| spotify_id | 0f8GDk3hYFkHkpecyUByZ7 |
| apple_id | 1647424714 |
| inputMusicStoryRecordingId | 5124579 |
| providerRecordingId | 5124579 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| vocal | 0.99 | 0.74 |
| steady | 0.69 | 0.73 |
| heavy | 0.87 | 0.71 |
| bouncy | 0.71 | 0.68 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.72 | 0.60 | UNCERTAIN | false |  |
| driving | 0.71 | 0.59 | UNCERTAIN | false |  |
| steady | 0.69 | 0.73 | SUPPORTED | false |  |
| bouncy | 0.71 | 0.68 | SUPPORTED | false |  |
| heavy | 0.87 | 0.71 | SUPPORTED | false |  |
| punchy | 0.78 | 0.59 | UNCERTAIN | false |  |
| vocal | 0.99 | 0.74 | SUPPORTED | false |  |
| instrumental | 0.01 | 0.00 | UNCERTAIN | true | instrumental_not_low_enough |
| speech | 0.05 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.69 | 0.54 | UNCERTAIN | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.28 | 0.60 | UNCERTAIN |
| light | heavy | 0.13 | 0.71 | REJECTED |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.72 | 0.95 | true |
| pulse | 0.69 | 1.00 | true |
| brightness | 0.13 | 0.90 | true |
| density | 0.13 | 0.70 | true |
| vocal_presence | 0.99 | 0.75 | true |
| speech | 0.05 | 0.95 | true |
| valence | 0.72 | 0.95 | true |
| punch | 0.78 | 0.70 | true |

### Gorillaz - Clint Eastwood - Ed Case / Sweetie Irie Refix

#### Song Identity

| field | value |
| --- | --- |
| title | Clint Eastwood - Ed Case / Sweetie Irie Refix |
| artist | Gorillaz |
| isrc | GBAYE1400479 |
| spotify_id | 2g1qxZKavK3UZeKesmqynB |
| apple_id | 850576763 |
| inputMusicStoryRecordingId | 34686789 |
| providerRecordingId | 34686789 |

#### Surfaced Labels

| label | score | confidence |
| --- | --- | --- |
| steady | 0.78 | 0.82 |
| bouncy | 0.68 | 0.72 |
| hypnotic | 0.78 | 0.68 |
| punchy | 0.82 | 0.63 |

#### Active Label Analysis

| label | score | confidence | state | suppressed | suppressionReason |
| --- | --- | --- | --- | --- | --- |
| energetic | 0.58 | 0.00 | UNCERTAIN | true | energy_not_high_enough |
| driving | 0.68 | 0.51 | UNCERTAIN | false |  |
| steady | 0.78 | 0.82 | SUPPORTED | false |  |
| bouncy | 0.68 | 0.72 | SUPPORTED | false |  |
| heavy | 0.78 | 0.57 | UNCERTAIN | false |  |
| punchy | 0.82 | 0.63 | SUPPORTED | false |  |
| vocal | 0.58 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; vocal_not_high_enough |
| instrumental | 0.42 | 0.00 | UNCERTAIN | true | vocal_uncertainty_band; instrumental_not_low_enough |
| speech | 0.10 | 0.00 | UNCERTAIN | true | speech_not_high_enough |
| hypnotic | 0.78 | 0.68 | SUPPORTED | false |  |

#### Experimental Inverse Label Analysis

| label | baseLabel | score | confidence | state |
| --- | --- | --- | --- | --- |
| sparse | dense | 0.91 | 0.00 | UNCERTAIN |
| calm | energetic | 0.42 | 0.00 | UNCERTAIN |
| light | heavy | 0.22 | 0.57 | UNCERTAIN |

#### Dimension Analysis

| dimension | score | confidence | usable |
| --- | --- | --- | --- |
| energy | 0.58 | 0.95 | true |
| pulse | 0.78 | 1.00 | true |
| brightness | 0.22 | 0.90 | true |
| density | 0.09 | 0.70 | true |
| vocal_presence | 0.58 | 0.59 | true |
| speech | 0.10 | 0.95 | true |
| valence | 0.87 | 0.95 | true |
| punch | 0.82 | 0.70 | true |

## Validation results

- Generated Markdown report and JSON output without network calls.
- Confirmed active labels included: energetic, driving, steady, bouncy, heavy, punchy, vocal, instrumental, speech, hypnotic
- Confirmed inverse labels included: sparse, calm, light

## Known limitations

- Inverse labels are computed as score = 1 - baseLabel.score and share the base label confidence (first-pass heuristic).
- State thresholds are intentionally simple and may be refined after human review.
- Sample selection is currently the first N songs in the consolidated cache file (not randomized).

## Next recommended step

Build Calibration Set v1 (30–40 songs).

