Place batch JSON files here (e.g. batch_1.json).
Run:
node baseline/scripts/run_batch.js batch_1.json

NOTE (for later): baseline/scripts/clean.js currently assumes a fixed total of 6 model outputs per song (2 models x 3 prompts).
If a song ever has fewer than 6 successful outputs (API error, parse error, partial resume), then agreement/score fields and
some evidence-strength thresholds can be skewed. Future improvement: have normalization emit per-song total_outputs and have
clean.js use that as its denominator instead of a constant.
