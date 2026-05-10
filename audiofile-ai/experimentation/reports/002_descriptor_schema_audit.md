# 002 Descriptor Schema Audit (Music Story successful payloads)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69

## Summary (Observed)

- Observed keys (unique): 54
- Fields present in all successful payloads: 54
- Fields missing in at least one successful payload: 0

## Unexpected Fields (Not in registry)

These fields were observed in successful payloads but are not currently listed in the registry. This suggests the registry may need extension, or these fields may be non-essential.

```text

```

## Registry Fields Not Observed

These fields were listed in the registry but were not observed in the current successful payloads. This suggests they may be optional, absent for this dataset, or named differently.

```text
chroma07
```

## Array Field Notes (Cautious)

- Observed: array fields (moods/timbres/themes) appear to vary in frequency and vocabulary across tracks.
- Possible: mood names may represent a useful semantic layer, but requires later validation.

## Output Artifacts

- outputs/descriptors/schema_audit.json
- outputs/descriptors/field_coverage.csv
- outputs/descriptors/mood_frequencies.csv
- outputs/descriptors/timbre_frequencies.csv
- outputs/descriptors/theme_frequencies.csv

## Warnings

```json
[]
```
