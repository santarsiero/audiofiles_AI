# AudioFile AI — Experiment & Findings Log

**Purpose:**
This document is the running operational memory for empirical findings during AudioFile AI development.

It exists to record:
- implementation discoveries
- descriptor API behavior
- feature behavior
- label behavior
- pipeline failures
- mismatch patterns
- experimental observations
- unresolved anomalies

This is NOT a finalized truth document.

Entries in this log are:
- observations
- hypotheses
- implementation findings
- experimental notes

Nothing in this log should automatically become architecture or ontology truth without validation and promotion into official specs.

---

# Logging Rules

## 1. Preserve uncertainty
Do not rewrite findings into certainty unless validated.

Use:
- “appears”
- “observed”
- “possible”
- “suspected”
- “inconsistent”

Avoid:
- “proves”
- “confirms”
- “always”

unless empirically validated.

---

## 2. Record failures explicitly
Failed experiments are valuable.

Do not remove:
- failed mappings
- weak relationships
- unstable labels
- unusable descriptors

---

## 3. Prefer observations over interpretation
Good:
- “Pulse feature undefined in 42% of songs due to missing pulse clarity descriptor”

Bad:
- “Pulse feature does not work”

---

## 4. Preserve implementation context
Whenever possible, include:
- pipeline version
- provider used
- batch used
- configuration version

---

## 5. Do not silently rewrite history
If understanding changes:
- append a new entry
- do not overwrite old findings

This document should preserve the evolution of understanding over time.

---

# Entry Template

---

## [DATE] — [SHORT TITLE]

### Context
- Pipeline version:
- Descriptor provider:
- Batch:
- Config version:
- Related feature(s):
- Related label(s):

### Observation
Clear description of what was observed.

### Evidence
- Quantitative findings
- Example songs
- Missing descriptor counts
- Comparison mismatches
- Confidence patterns
- Failure rates

### Interpretation
Possible meaning or hypothesis.

Must remain tentative unless validated.

### Impact
Describe possible implications for:
- ontology
- feature mappings
- label scoring
- API strategy
- implementation priorities

### Status
One of:
- OPEN
- MONITORING
- VALIDATED
- REJECTED

---

# Suggested Observation Categories

## Descriptor Coverage
Examples:
- missing descriptor frequency
- provider inconsistency
- genre-dependent gaps

---

## Feature Stability
Examples:
- unstable feature scores
- feature collapse
- weak proxy behavior

---

## Label Reliability
Examples:
- labels rarely produced
- opposing labels frequently tied
- confidence collapse

---

## LLM Comparison
Examples:
- systematic disagreement
- agreement clusters
- label drift between systems

---

## API Behavior
Examples:
- rate limits
- malformed responses
- inconsistent descriptor naming

---

## Ontology Findings
Examples:
- labels collapsing together
- features behaving redundantly
- missing conceptual dimensions

---

# Interpretation Rules

The purpose of this document is to:
- support iterative refinement
- discover patterns
- guide future experimentation

This document must NOT:
- silently redefine architecture
- redefine ontology without validation
- become a source of unquestioned truth

Validated findings should eventually be promoted into:
- ontology revisions
- architecture revisions
- implementation changes
- future versioned specifications