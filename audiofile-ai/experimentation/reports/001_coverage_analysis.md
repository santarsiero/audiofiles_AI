# 001 Coverage Analysis (Music Story cached batches)

## Dataset Context

- Total entries: 141
- Successful payloads: 88
- Failed payloads: 53
- Success rate: 62.41%
- Failure rate: 37.59%

## Batch-by-batch Summary

| Batch file | Total | Successes | Failures | Success rate |
| --- | --- | --- | --- | --- |
| batch_1_musicstory.json | 47 | 37 | 10 | 78.72% |
| batch_2_musicstory.json | 47 | 28 | 19 | 59.57% |
| batch_3_musicstory.json | 47 | 23 | 24 | 48.94% |

## Failure Type Breakdown

| Failure type | Count | % of failures |
| --- | --- | --- |
| no_recording_hit | 34 | 64.15% |
| rate_limited_429 | 10 | 18.87% |
| audiodescriptions_404 | 9 | 16.98% |
| other | 0 | 0% |

## Top Failure Messages (Observed)

| Error message | Count | % of failures |
| --- | --- | --- |
| No recording hit found | 34 | 64.15% |
| Music Story audiodescriptions failed (404) | 9 | 16.98% |
| Music Story recording search failed (429) | 6 | 11.32% |
| Music Story audiodescriptions failed (429) | 4 | 7.55% |

## Input recordingId vs ISRC-first (Observed)

- Entries with input musicStoryRecordingId: 39
- Successes with input musicStoryRecordingId: 37
- Failures with input musicStoryRecordingId: 2
- Success rate with input musicStoryRecordingId: 94.87%

- Entries without input musicStoryRecordingId: 102
- Successes without input musicStoryRecordingId: 51
- Failures without input musicStoryRecordingId: 51
- Success rate without input musicStoryRecordingId: 50%

## Observed Trends (Cautious)

- Observed: failure messages appear to cluster into a small set of recurring error strings.
- Observed: success rate may differ depending on whether an input recordingId is provided.
- Possible: certain ISRC prefixes may show different hit rates; this suggests a potential catalog coverage bias that needs validation.
- Needs validation: whether failures represent true catalog absence vs. lookup strategy limitations.

## Warnings

```json
[]
```

## Output Artifacts

- outputs/coverage/coverage_summary.json
- outputs/coverage/failures.csv
- outputs/coverage/successes.csv
