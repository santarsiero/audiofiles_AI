# 001 Coverage Analysis (Music Story cached batches)

## Dataset Context

- Total entries: 209
- Successful payloads: 140
- Failed payloads: 69
- Success rate: 66.99%
- Failure rate: 33.01%

## Batch-by-batch Summary

| Batch file | Total | Successes | Failures | Success rate |
| --- | --- | --- | --- | --- |
| batch_1_musicstory.json | 47 | 37 | 10 | 78.72% |
| batch_2_musicstory.json | 47 | 28 | 19 | 59.57% |
| batch_3_musicstory.json | 47 | 28 | 19 | 59.57% |
| batch_4_musicstory.json | 47 | 35 | 12 | 74.47% |
| batch_5_musicstory.json | 21 | 12 | 9 | 57.14% |

## Failure Type Breakdown

| Failure type | Count | % of failures |
| --- | --- | --- |
| no_recording_hit | 50 | 72.46% |
| audiodescriptions_404 | 14 | 20.29% |
| rate_limited_429 | 5 | 7.25% |
| other | 0 | 0% |

## Top Failure Messages (Observed)

| Error message | Count | % of failures |
| --- | --- | --- |
| No recording hit found | 50 | 72.46% |
| Music Story audiodescriptions failed (404) | 14 | 20.29% |
| Music Story audiodescriptions failed (429) | 3 | 4.35% |
| Music Story recording search failed (429) | 2 | 2.9% |

## Input recordingId vs ISRC-first (Observed)

- Entries with input musicStoryRecordingId: 39
- Successes with input musicStoryRecordingId: 37
- Failures with input musicStoryRecordingId: 2
- Success rate with input musicStoryRecordingId: 94.87%

- Entries without input musicStoryRecordingId: 170
- Successes without input musicStoryRecordingId: 103
- Failures without input musicStoryRecordingId: 67
- Success rate without input musicStoryRecordingId: 60.59%

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
