# Human Semantic Validation (V0.1)

This folder contains materials for **manual listening review** to semantically validate experimental composite feature behavior.

## Purpose

The goal of human validation is NOT:
- deciding final labels
- proving semantic truth
- perfectly scoring songs

The goal IS:
- checking whether experimental composite features align with human perception
- identifying where feature formulas appear correct
- identifying where feature formulas appear misleading
- identifying possible feature orientation problems
- identifying conceptual ambiguity

## Important Notes

- This validation is **exploratory**.
- Composite feature scores are **not ground truth**.
- Treat all feature formulas as **experimental hypotheses**.
- Feature failures are valuable findings.

## Where to Get the Songs

Use:
- Spotify
- Apple Music
- YouTube
- local library files

Any legitimate listening source is acceptable.

The exact audio source is less important than:
- hearing the song clearly
- listening long enough to judge the feature

Recommended:
- listen to the most recognizable section
- usually chorus/drop/main groove
- approximately 30–90 seconds is enough for first-pass validation

## Suggested Listening Order

Review ONE feature at a time.

Recommended order:
1. energy_score_v1
2. pulse_score_v1
3. brightness_score_v1
4. density_score_v1
5. vocal_presence_score_v1

Why:
- energy and pulse appear strongest/stablest
- vocal_presence currently appears inverted
- density appears conceptually ambiguous

## How to Organize Reviews

For EACH feature, review:
- top scoring songs first
- then lowest scoring songs
- then median songs

Do NOT jump randomly between features during one review session.

## How to Think During Review

Do NOT ask:
“Is this song good?”

Instead ask:
“Does this song strongly express the feature dimension?”

Examples:

energy:
- activation
- intensity
- forcefulness
- momentum

pulse:
- rhythmic clarity
- groove drive
- rhythmic steadiness

brightness:
- crispness
- spectral sharpness
- tonal brightness

density:
- fullness
- layering
- arrangement busyness
- sonic saturation

vocal presence:
- human vocal prominence
- speech prominence
- instrumentalness

## How to Fill Out Ratings

heardRating:
1 = extremely low feature presence
5 = extremely high feature presence

doesFeatureMatch:
- yes
- partial
- no

confidence:
- high
- medium
- low

Use "partial" often. Do NOT force binary judgments.

## Most Important Thing To Record

The MOST important field is:
notes

Specifically record:
- WHY something feels correct
- WHY something feels incorrect
- WHAT the feature appears to actually measure

Examples:
- “This feels rhythmically stable but not energetic.”
- “This sounds spectrally bright but emotionally dark.”
- “This feels dense because of arrangement complexity, not loudness.”
- “This feature seems inverted.”
- “This feature confuses pulse with simplicity.”

## Recommended Session Structure

Do NOT attempt to review all songs in one sitting.

Recommended:
- 1 feature per session
- 10–20 songs per session
- take notes immediately after listening

## After Completing Reviews

The completed review JSON should be saved into:

- `experimentation/human_validation/filled_reviews/`

Recommended naming:
- `human_validation_review_<date>.json`

Example:
- `human_validation_review_2026-05-10.json`
