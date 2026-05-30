# Human Audit — Calibration Set 1 (38 songs)

This file is intended for manual labeling QA.

Rules:
- For each **Assigned Label**, set `isValid` to `true` or `false` (start as `null`).
- Use the label groups below as decision support (sorted by descending confidence).

---

## 1. Darude — Sandstorm

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| driving | null |

### Expected Labels (calibration reference)

- energetic
- driving
- steady
- instrumental
- hypnotic

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.66 | 0.69 | SUPPORTED |
| driving |  | 0.65 | 0.60 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.79 | 0.59 | UNCERTAIN |
| light | heavy | 0.21 | 0.59 | UNCERTAIN |
| bouncy |  | 0.65 | 0.59 | UNCERTAIN |
| punchy |  | 0.74 | 0.57 | UNCERTAIN |
| instrumental |  | 0.66 | 0.50 | UNCERTAIN |
| hypnotic |  | 0.66 | 0.48 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| energetic |  | 0.65 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| vocal |  | 0.34 | 0.00 | UNCERTAIN |
| speech |  | 0.03 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 2. Daft Punk — One More Time

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- energetic
- driving
- bouncy
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.99 | 0.74 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.70 | 0.52 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| heavy |  | 0.72 | 0.00 | UNCERTAIN |
| energetic |  | 0.53 | 0.00 | UNCERTAIN |
| bouncy |  | 0.51 | 0.00 | UNCERTAIN |
| driving |  | 0.50 | 0.00 | UNCERTAIN |
| steady |  | 0.48 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.48 | 0.00 | UNCERTAIN |
| calm | energetic | 0.47 | 0.00 | UNCERTAIN |
| light | heavy | 0.28 | 0.00 | UNCERTAIN |
| speech |  | 0.10 | 0.00 | UNCERTAIN |
| instrumental |  | 0.01 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 3. FISHER — Losing It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| hypnotic | null |
| bouncy | null |
| driving | null |
| energetic | null |

### Expected Labels (calibration reference)

- driving
- steady
- hypnotic
- instrumental

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.85 | 0.89 | SUPPORTED |
| hypnotic |  | 0.85 | 0.80 | SUPPORTED |
| bouncy |  | 0.78 | 0.77 | SUPPORTED |
| driving |  | 0.79 | 0.77 | SUPPORTED |
| energetic |  | 0.72 | 0.66 | SUPPORTED |
| punchy |  | 0.88 | 0.66 | SUPPORTED |
| heavy |  | 0.74 | 0.63 | SUPPORTED |
| instrumental |  | 0.81 | 0.61 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| vocal |  | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.13 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| calm | energetic | 0.28 | 0.66 | REJECTED |
| light | heavy | 0.26 | 0.63 | REJECTED |

### Notes


---

## 4. Dom Dolla — Take It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| bouncy | null |
| driving | null |
| hypnotic | null |

### Expected Labels (calibration reference)

- driving
- steady
- bouncy
- instrumental

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.76 | 0.80 | SUPPORTED |
| bouncy |  | 0.68 | 0.68 | SUPPORTED |
| driving |  | 0.69 | 0.66 | SUPPORTED |
| hypnotic |  | 0.76 | 0.65 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.78 | 0.60 | UNCERTAIN |
| vocal |  | 0.75 | 0.53 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| heavy |  | 0.81 | 0.00 | UNCERTAIN |
| energetic |  | 0.60 | 0.00 | UNCERTAIN |
| calm | energetic | 0.40 | 0.00 | UNCERTAIN |
| instrumental |  | 0.25 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.07 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 5. MK — Rhyme Dust

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| bouncy | null |
| driving | null |
| hypnotic | null |

### Expected Labels (calibration reference)

- driving
- steady
- instrumental

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.75 | 0.79 | SUPPORTED |
| bouncy |  | 0.66 | 0.65 | SUPPORTED |
| driving |  | 0.68 | 0.65 | SUPPORTED |
| hypnotic |  | 0.75 | 0.64 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.78 | 0.59 | UNCERTAIN |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| heavy |  | 0.85 | 0.00 | UNCERTAIN |
| vocal |  | 0.64 | 0.00 | UNCERTAIN |
| energetic |  | 0.57 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| instrumental |  | 0.36 | 0.00 | UNCERTAIN |
| light | heavy | 0.15 | 0.00 | UNCERTAIN |
| speech |  | 0.14 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 6. Kylie Minogue — Can't Get You Out of My Head

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| bouncy | null |
| driving | null |

### Expected Labels (calibration reference)

- driving
- hypnotic
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.70 | 0.74 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| bouncy |  | 0.63 | 0.69 | UNCERTAIN |
| driving |  | 0.65 | 0.61 | UNCERTAIN |
| punchy |  | 0.75 | 0.58 | UNCERTAIN |
| hypnotic |  | 0.70 | 0.56 | UNCERTAIN |
| heavy |  | 0.93 | 0.00 | UNCERTAIN |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| vocal |  | 0.56 | 0.00 | UNCERTAIN |
| energetic |  | 0.56 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| instrumental |  | 0.44 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |
| speech |  | 0.04 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 7. Daft Punk — Veridis Quo

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| instrumental | null |

### Expected Labels (calibration reference)

- calm
- sparse
- instrumental
- hypnotic

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.71 | 0.75 | SUPPORTED |
| instrumental |  | 0.95 | 0.71 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| hypnotic |  | 0.71 | 0.58 | UNCERTAIN |
| bouncy |  | 0.57 | 0.54 | UNCERTAIN |
| punchy |  | 0.67 | 0.49 | UNCERTAIN |
| heavy |  | 0.95 | 0.00 | UNCERTAIN |
| sparse | dense | 0.93 | 0.00 | UNCERTAIN |
| driving |  | 0.60 | 0.00 | UNCERTAIN |
| calm | energetic | 0.57 | 0.00 | UNCERTAIN |
| energetic |  | 0.43 | 0.00 | UNCERTAIN |
| light | heavy | 0.05 | 0.00 | UNCERTAIN |
| vocal |  | 0.05 | 0.00 | UNCERTAIN |
| speech |  | 0.04 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 8. Daft Punk — Harder, Better, Faster, Stronger

### Assigned Labels (surfaced)

_None_

### Expected Labels (calibration reference)

- driving
- punchy
- vocal
- hypnotic

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.75 | 0.58 | UNCERTAIN |
| steady |  | 0.56 | 0.56 | UNCERTAIN |
| vocal |  | 0.67 | 0.46 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| heavy |  | 0.81 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.56 | 0.00 | UNCERTAIN |
| driving |  | 0.55 | 0.00 | UNCERTAIN |
| bouncy |  | 0.55 | 0.00 | UNCERTAIN |
| energetic |  | 0.54 | 0.00 | UNCERTAIN |
| calm | energetic | 0.46 | 0.00 | UNCERTAIN |
| instrumental |  | 0.33 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.14 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 9. Skrillex — Bangarang (feat. Sirah)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| energetic | null |
| punchy | null |
| steady | null |

### Expected Labels (calibration reference)

- energetic
- heavy
- punchy
- dense

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.95 | 0.71 | SUPPORTED |
| energetic |  | 0.74 | 0.69 | SUPPORTED |
| punchy |  | 0.83 | 0.63 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.60 | 0.60 | UNCERTAIN |
| heavy |  | 0.69 | 0.59 | UNCERTAIN |
| light | heavy | 0.31 | 0.59 | UNCERTAIN |
| driving |  | 0.66 | 0.59 | UNCERTAIN |
| bouncy |  | 0.67 | 0.52 | UNCERTAIN |
| sparse | dense | 0.85 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.60 | 0.00 | UNCERTAIN |
| speech |  | 0.22 | 0.00 | UNCERTAIN |
| instrumental |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| calm | energetic | 0.26 | 0.69 | REJECTED |

### Notes


---

## 10. Skrillex — Scary Monsters and Nice Sprites

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| heavy | null |
| energetic | null |

### Expected Labels (calibration reference)

- energetic
- heavy
- punchy
- dense

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.83 | 0.69 | SUPPORTED |
| energetic |  | 0.74 | 0.68 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.74 | 0.55 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| bouncy |  | 0.64 | 0.00 | UNCERTAIN |
| driving |  | 0.62 | 0.00 | UNCERTAIN |
| vocal |  | 0.57 | 0.00 | UNCERTAIN |
| steady |  | 0.54 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.54 | 0.00 | UNCERTAIN |
| instrumental |  | 0.43 | 0.00 | UNCERTAIN |
| speech |  | 0.09 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| light | heavy | 0.17 | 0.69 | REJECTED |
| calm | energetic | 0.26 | 0.68 | REJECTED |

### Notes


---

## 11. Sub Focus — Push The Tempo

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| steady | null |
| heavy | null |
| energetic | null |
| driving | null |

### Expected Labels (calibration reference)

- energetic
- driving
- punchy
- dense

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |
| steady |  | 0.68 | 0.71 | SUPPORTED |
| heavy |  | 0.82 | 0.65 | SUPPORTED |
| energetic |  | 0.70 | 0.65 | SUPPORTED |
| driving |  | 0.69 | 0.64 | SUPPORTED |
| bouncy |  | 0.69 | 0.62 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.72 | 0.55 | UNCERTAIN |
| hypnotic |  | 0.68 | 0.52 | UNCERTAIN |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| light | heavy | 0.18 | 0.65 | REJECTED |
| calm | energetic | 0.30 | 0.65 | REJECTED |

### Notes


---

## 12. Sub Focus & Dimension — Desire

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| vocal | null |
| heavy | null |
| energetic | null |
| driving | null |

### Expected Labels (calibration reference)

- energetic
- driving
- vocal
- dense

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.68 | 0.71 | SUPPORTED |
| vocal |  | 0.91 | 0.67 | SUPPORTED |
| heavy |  | 0.81 | 0.66 | SUPPORTED |
| energetic |  | 0.71 | 0.66 | SUPPORTED |
| driving |  | 0.69 | 0.64 | SUPPORTED |
| bouncy |  | 0.69 | 0.62 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.72 | 0.55 | UNCERTAIN |
| hypnotic |  | 0.68 | 0.52 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| instrumental |  | 0.09 | 0.00 | UNCERTAIN |
| speech |  | 0.07 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| light | heavy | 0.19 | 0.66 | REJECTED |
| calm | energetic | 0.29 | 0.66 | REJECTED |

### Notes


---

## 13. Lil Jon & The East Side Boyz — Get Low

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- energetic
- dense
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.69 | 0.51 | UNCERTAIN |
| sparse | dense | 0.85 | 0.00 | UNCERTAIN |
| heavy |  | 0.84 | 0.00 | UNCERTAIN |
| steady |  | 0.54 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.54 | 0.00 | UNCERTAIN |
| driving |  | 0.54 | 0.00 | UNCERTAIN |
| bouncy |  | 0.54 | 0.00 | UNCERTAIN |
| energetic |  | 0.53 | 0.00 | UNCERTAIN |
| calm | energetic | 0.47 | 0.00 | UNCERTAIN |
| light | heavy | 0.16 | 0.00 | UNCERTAIN |
| speech |  | 0.08 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 14. Denzel Curry — STILL IN THE PAINT

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- energetic
- heavy
- dense
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.95 | 0.60 | UNCERTAIN |
| light | heavy | 0.05 | 0.60 | UNCERTAIN |
| punchy |  | 0.74 | 0.55 | UNCERTAIN |
| sparse | dense | 0.83 | 0.00 | UNCERTAIN |
| energetic |  | 0.66 | 0.00 | UNCERTAIN |
| bouncy |  | 0.58 | 0.00 | UNCERTAIN |
| driving |  | 0.57 | 0.00 | UNCERTAIN |
| steady |  | 0.51 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.51 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| speech |  | 0.11 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 15. The Game — Hate It Or Love It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| steady | null |
| punchy | null |
| driving | null |

### Expected Labels (calibration reference)

- vocal
- steady

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |
| steady |  | 0.66 | 0.69 | SUPPORTED |
| punchy |  | 0.80 | 0.61 | SUPPORTED |
| driving |  | 0.65 | 0.60 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.88 | 0.59 | UNCERTAIN |
| light | heavy | 0.12 | 0.59 | UNCERTAIN |
| bouncy |  | 0.65 | 0.59 | UNCERTAIN |
| hypnotic |  | 0.66 | 0.48 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| energetic |  | 0.65 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| speech |  | 0.23 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 16. Rob $tone — Chill Bill (feat. J. Davi$ & Spooks)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- calm
- sparse
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.57 | 0.60 | UNCERTAIN |
| punchy |  | 0.68 | 0.53 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| heavy |  | 0.82 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.57 | 0.00 | UNCERTAIN |
| calm | energetic | 0.55 | 0.00 | UNCERTAIN |
| driving |  | 0.52 | 0.00 | UNCERTAIN |
| bouncy |  | 0.51 | 0.00 | UNCERTAIN |
| energetic |  | 0.45 | 0.00 | UNCERTAIN |
| speech |  | 0.29 | 0.00 | UNCERTAIN |
| light | heavy | 0.18 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 17. Nirvana — Smells Like Teen Spirit

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- energetic
- heavy
- dense
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.78 | 0.60 | UNCERTAIN |
| light | heavy | 0.22 | 0.60 | UNCERTAIN |
| punchy |  | 0.77 | 0.57 | UNCERTAIN |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| energetic |  | 0.66 | 0.00 | UNCERTAIN |
| bouncy |  | 0.47 | 0.00 | UNCERTAIN |
| driving |  | 0.44 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| steady |  | 0.29 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.29 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 18. Mötley Crüe — Kickstart My Heart

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| energetic | null |

### Expected Labels (calibration reference)

- energetic
- driving
- heavy
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.95 | 0.71 | SUPPORTED |
| energetic |  | 0.68 | 0.63 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.65 | 0.55 | UNCERTAIN |
| light | heavy | 0.35 | 0.55 | UNCERTAIN |
| punchy |  | 0.70 | 0.52 | UNCERTAIN |
| sparse | dense | 0.80 | 0.00 | UNCERTAIN |
| bouncy |  | 0.51 | 0.00 | UNCERTAIN |
| driving |  | 0.47 | 0.00 | UNCERTAIN |
| steady |  | 0.33 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.33 | 0.00 | UNCERTAIN |
| speech |  | 0.06 | 0.00 | UNCERTAIN |
| instrumental |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| calm | energetic | 0.32 | 0.63 | REJECTED |

### Notes


---

## 19. The White Stripes — Seven Nation Army

### Assigned Labels (surfaced)

_None_

### Expected Labels (calibration reference)

- steady
- heavy
- vocal

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.66 | 0.46 | UNCERTAIN |
| sparse | dense | 0.84 | 0.00 | UNCERTAIN |
| heavy |  | 0.81 | 0.00 | UNCERTAIN |
| instrumental |  | 0.59 | 0.00 | UNCERTAIN |
| calm | energetic | 0.58 | 0.00 | UNCERTAIN |
| energetic |  | 0.42 | 0.00 | UNCERTAIN |
| vocal |  | 0.41 | 0.00 | UNCERTAIN |
| bouncy |  | 0.37 | 0.00 | UNCERTAIN |
| driving |  | 0.36 | 0.00 | UNCERTAIN |
| steady |  | 0.32 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.32 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.08 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 20. Franz Ferdinand — Take Me Out

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| heavy | null |

### Expected Labels (calibration reference)

- driving
- energetic
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.90 | 0.67 | SUPPORTED |
| heavy |  | 0.76 | 0.60 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.73 | 0.54 | UNCERTAIN |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| energetic |  | 0.66 | 0.00 | UNCERTAIN |
| bouncy |  | 0.46 | 0.00 | UNCERTAIN |
| driving |  | 0.42 | 0.00 | UNCERTAIN |
| calm | energetic | 0.34 | 0.00 | UNCERTAIN |
| steady |  | 0.25 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.25 | 0.00 | UNCERTAIN |
| instrumental |  | 0.10 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| light | heavy | 0.24 | 0.60 | REJECTED |

### Notes


---

## 21. Stevie Wonder — Superstition

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- bouncy
- steady
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.97 | 0.73 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.64 | 0.45 | UNCERTAIN |
| heavy |  | 0.85 | 0.00 | UNCERTAIN |
| sparse | dense | 0.82 | 0.00 | UNCERTAIN |
| calm | energetic | 0.59 | 0.00 | UNCERTAIN |
| energetic |  | 0.41 | 0.00 | UNCERTAIN |
| bouncy |  | 0.31 | 0.00 | UNCERTAIN |
| driving |  | 0.29 | 0.00 | UNCERTAIN |
| steady |  | 0.22 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.22 | 0.00 | UNCERTAIN |
| light | heavy | 0.15 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |
| instrumental |  | 0.03 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 22. Earth, Wind & Fire — Let's Groove

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- bouncy
- driving
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.65 | 0.45 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| heavy |  | 0.81 | 0.00 | UNCERTAIN |
| calm | energetic | 0.64 | 0.00 | UNCERTAIN |
| steady |  | 0.38 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.38 | 0.00 | UNCERTAIN |
| driving |  | 0.37 | 0.00 | UNCERTAIN |
| bouncy |  | 0.37 | 0.00 | UNCERTAIN |
| energetic |  | 0.36 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.06 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 23. Wild Cherry — Play That Funky Music

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| energetic | null |
| heavy | null |

### Expected Labels (calibration reference)

- bouncy
- energetic
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.98 | 0.73 | SUPPORTED |
| energetic |  | 0.68 | 0.63 | SUPPORTED |
| heavy |  | 0.76 | 0.62 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.78 | 0.57 | UNCERTAIN |
| sparse | dense | 0.84 | 0.00 | UNCERTAIN |
| bouncy |  | 0.52 | 0.00 | UNCERTAIN |
| driving |  | 0.49 | 0.00 | UNCERTAIN |
| steady |  | 0.36 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.36 | 0.00 | UNCERTAIN |
| speech |  | 0.13 | 0.00 | UNCERTAIN |
| instrumental |  | 0.02 | 0.00 | UNCERTAIN |

#### Cut

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| calm | energetic | 0.32 | 0.63 | REJECTED |
| light | heavy | 0.24 | 0.62 | REJECTED |

### Notes


---

## 24. The Jacksons — Blame It on the Boogie

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- bouncy
- driving
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.99 | 0.74 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| heavy |  | 0.79 | 0.59 | UNCERTAIN |
| light | heavy | 0.21 | 0.59 | UNCERTAIN |
| punchy |  | 0.77 | 0.57 | UNCERTAIN |
| sparse | dense | 0.81 | 0.00 | UNCERTAIN |
| energetic |  | 0.65 | 0.00 | UNCERTAIN |
| bouncy |  | 0.48 | 0.00 | UNCERTAIN |
| driving |  | 0.45 | 0.00 | UNCERTAIN |
| calm | energetic | 0.35 | 0.00 | UNCERTAIN |
| steady |  | 0.31 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.31 | 0.00 | UNCERTAIN |
| speech |  | 0.09 | 0.00 | UNCERTAIN |
| instrumental |  | 0.01 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 25. Daft Punk — Get Lucky (feat. Pharrell Williams and Nile Rodgers)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- bouncy
- steady
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.90 | 0.67 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.77 | 0.59 | UNCERTAIN |
| steady |  | 0.56 | 0.58 | UNCERTAIN |
| heavy |  | 0.93 | 0.00 | UNCERTAIN |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| energetic |  | 0.56 | 0.00 | UNCERTAIN |
| bouncy |  | 0.56 | 0.00 | UNCERTAIN |
| driving |  | 0.56 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.56 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| instrumental |  | 0.10 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |
| speech |  | 0.04 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 26. Mark Ronson — Uptown Funk (feat. Bruno Mars)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| punchy | null |

### Expected Labels (calibration reference)

- energetic
- bouncy
- punchy
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.90 | 0.66 | SUPPORTED |
| punchy |  | 0.82 | 0.62 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.57 | 0.60 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| heavy |  | 0.79 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.57 | 0.00 | UNCERTAIN |
| driving |  | 0.57 | 0.00 | UNCERTAIN |
| bouncy |  | 0.57 | 0.00 | UNCERTAIN |
| energetic |  | 0.57 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| light | heavy | 0.21 | 0.00 | UNCERTAIN |
| instrumental |  | 0.10 | 0.00 | UNCERTAIN |
| speech |  | 0.09 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 27. Backstreet Boys — I Want It That Way

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| steady | null |

### Expected Labels (calibration reference)

- vocal
- steady

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |
| steady |  | 0.65 | 0.69 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| bouncy |  | 0.61 | 0.58 | UNCERTAIN |
| driving |  | 0.62 | 0.57 | UNCERTAIN |
| punchy |  | 0.69 | 0.54 | UNCERTAIN |
| hypnotic |  | 0.65 | 0.48 | UNCERTAIN |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| heavy |  | 0.77 | 0.00 | UNCERTAIN |
| energetic |  | 0.56 | 0.00 | UNCERTAIN |
| calm | energetic | 0.44 | 0.00 | UNCERTAIN |
| light | heavy | 0.23 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |
| speech |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 28. Lady Gaga — Telephone

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- energetic
- vocal
- driving

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.97 | 0.72 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.78 | 0.59 | UNCERTAIN |
| steady |  | 0.56 | 0.59 | UNCERTAIN |
| heavy |  | 0.81 | 0.55 | UNCERTAIN |
| light | heavy | 0.19 | 0.55 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| energetic |  | 0.62 | 0.00 | UNCERTAIN |
| bouncy |  | 0.59 | 0.00 | UNCERTAIN |
| driving |  | 0.59 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.56 | 0.00 | UNCERTAIN |
| calm | energetic | 0.38 | 0.00 | UNCERTAIN |
| speech |  | 0.04 | 0.00 | UNCERTAIN |
| instrumental |  | 0.03 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 29. Sabrina Carpenter — Feather

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |
| steady | null |

### Expected Labels (calibration reference)

- vocal
- light
- bouncy

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 1.00 | 0.75 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.59 | 0.62 | UNCERTAIN |
| heavy |  | 0.91 | 0.58 | UNCERTAIN |
| light | heavy | 0.09 | 0.58 | UNCERTAIN |
| punchy |  | 0.71 | 0.55 | UNCERTAIN |
| sparse | dense | 0.86 | 0.00 | UNCERTAIN |
| energetic |  | 0.64 | 0.00 | UNCERTAIN |
| bouncy |  | 0.62 | 0.00 | UNCERTAIN |
| driving |  | 0.61 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.59 | 0.00 | UNCERTAIN |
| calm | energetic | 0.36 | 0.00 | UNCERTAIN |
| speech |  | 0.03 | 0.00 | UNCERTAIN |
| instrumental |  | 0.00 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 30. Bruno Mars — Treasure

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |
| vocal | null |
| punchy | null |
| bouncy | null |

### Expected Labels (calibration reference)

- bouncy
- vocal
- energetic

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.87 | 0.64 | SUPPORTED |
| punchy |  | 0.82 | 0.62 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.63 | 0.67 | UNCERTAIN |
| bouncy |  | 0.63 | 0.61 | UNCERTAIN |
| driving |  | 0.63 | 0.58 | UNCERTAIN |
| heavy |  | 0.86 | 0.56 | UNCERTAIN |
| light | heavy | 0.14 | 0.56 | UNCERTAIN |
| sparse | dense | 0.90 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.63 | 0.00 | UNCERTAIN |
| energetic |  | 0.62 | 0.00 | UNCERTAIN |
| calm | energetic | 0.38 | 0.00 | UNCERTAIN |
| instrumental |  | 0.13 | 0.00 | UNCERTAIN |
| speech |  | 0.07 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 31. Bill Withers — Ain't No Sunshine

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | null |

### Expected Labels (calibration reference)

- calm
- sparse
- vocal

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.99 | 0.74 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.63 | 0.44 | UNCERTAIN |
| heavy |  | 0.89 | 0.00 | UNCERTAIN |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.63 | 0.00 | UNCERTAIN |
| energetic |  | 0.37 | 0.00 | UNCERTAIN |
| bouncy |  | 0.32 | 0.00 | UNCERTAIN |
| driving |  | 0.31 | 0.00 | UNCERTAIN |
| steady |  | 0.27 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.27 | 0.00 | UNCERTAIN |
| light | heavy | 0.11 | 0.00 | UNCERTAIN |
| speech |  | 0.06 | 0.00 | UNCERTAIN |
| instrumental |  | 0.01 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 32. Daft Punk — Something About Us

### Assigned Labels (surfaced)

_None_

### Expected Labels (calibration reference)

- calm
- sparse
- vocal

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| vocal |  | 0.79 | 0.57 | UNCERTAIN |
| punchy |  | 0.68 | 0.48 | UNCERTAIN |
| sparse | dense | 0.93 | 0.00 | UNCERTAIN |
| heavy |  | 0.88 | 0.00 | UNCERTAIN |
| calm | energetic | 0.68 | 0.00 | UNCERTAIN |
| steady |  | 0.55 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.55 | 0.00 | UNCERTAIN |
| driving |  | 0.46 | 0.00 | UNCERTAIN |
| bouncy |  | 0.43 | 0.00 | UNCERTAIN |
| energetic |  | 0.32 | 0.00 | UNCERTAIN |
| instrumental |  | 0.21 | 0.00 | UNCERTAIN |
| speech |  | 0.20 | 0.00 | UNCERTAIN |
| light | heavy | 0.12 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 33. Massive Attack — Angel

### Assigned Labels (surfaced)

_None_

### Expected Labels (calibration reference)

- heavy
- hypnotic
- sparse

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.69 | 0.48 | UNCERTAIN |
| heavy |  | 0.93 | 0.00 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| calm | energetic | 0.59 | 0.00 | UNCERTAIN |
| instrumental |  | 0.59 | 0.00 | UNCERTAIN |
| steady |  | 0.52 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.52 | 0.00 | UNCERTAIN |
| driving |  | 0.47 | 0.00 | UNCERTAIN |
| bouncy |  | 0.46 | 0.00 | UNCERTAIN |
| vocal |  | 0.41 | 0.00 | UNCERTAIN |
| energetic |  | 0.41 | 0.00 | UNCERTAIN |
| speech |  | 0.07 | 0.00 | UNCERTAIN |
| light | heavy | 0.07 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 34. Moby — Flower

### Assigned Labels (surfaced)

_None_

### Expected Labels (calibration reference)

- sparse
- steady
- vocal

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.70 | 0.52 | UNCERTAIN |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| heavy |  | 0.78 | 0.00 | UNCERTAIN |
| energetic |  | 0.57 | 0.00 | UNCERTAIN |
| vocal |  | 0.53 | 0.00 | UNCERTAIN |
| instrumental |  | 0.47 | 0.00 | UNCERTAIN |
| bouncy |  | 0.46 | 0.00 | UNCERTAIN |
| calm | energetic | 0.43 | 0.00 | UNCERTAIN |
| driving |  | 0.43 | 0.00 | UNCERTAIN |
| steady |  | 0.35 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.35 | 0.00 | UNCERTAIN |
| light | heavy | 0.22 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 35. Camille Saint-Saëns — Danse macabre, Op. 40

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| instrumental | null |

### Expected Labels (calibration reference)

- dense
- instrumental

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| instrumental |  | 0.84 | 0.63 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.60 | 0.42 | UNCERTAIN |
| calm | energetic | 0.90 | 0.00 | UNCERTAIN |
| sparse | dense | 0.89 | 0.00 | UNCERTAIN |
| heavy |  | 0.89 | 0.00 | UNCERTAIN |
| vocal |  | 0.16 | 0.00 | UNCERTAIN |
| steady |  | 0.11 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.11 | 0.00 | UNCERTAIN |
| light | heavy | 0.11 | 0.00 | UNCERTAIN |
| driving |  | 0.11 | 0.00 | UNCERTAIN |
| bouncy |  | 0.11 | 0.00 | UNCERTAIN |
| energetic |  | 0.10 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 36. Pyotr Ilyich Tchaikovsky — The Nutcracker (Suite), Op. 71a, TH. 35: 3. Waltz of the Flowers

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| instrumental | null |

### Expected Labels (calibration reference)

- instrumental
- light

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| instrumental |  | 0.93 | 0.70 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.61 | 0.43 | UNCERTAIN |
| heavy |  | 0.90 | 0.00 | UNCERTAIN |
| sparse | dense | 0.87 | 0.00 | UNCERTAIN |
| calm | energetic | 0.86 | 0.00 | UNCERTAIN |
| energetic |  | 0.14 | 0.00 | UNCERTAIN |
| bouncy |  | 0.13 | 0.00 | UNCERTAIN |
| driving |  | 0.13 | 0.00 | UNCERTAIN |
| steady |  | 0.11 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.11 | 0.00 | UNCERTAIN |
| light | heavy | 0.10 | 0.00 | UNCERTAIN |
| vocal |  | 0.07 | 0.00 | UNCERTAIN |
| speech |  | 0.03 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 37. Antonín Dvořák — Symphony No. 9 in E Minor, Op. 95, B. 178 "From the New World": IV. Allegro con fuoco

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| instrumental | null |

### Expected Labels (calibration reference)

- energetic
- dense
- instrumental

### Label Evidence

#### Confirmed

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| instrumental |  | 0.85 | 0.64 | SUPPORTED |

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| punchy |  | 0.62 | 0.43 | UNCERTAIN |
| heavy |  | 0.90 | 0.00 | UNCERTAIN |
| sparse | dense | 0.83 | 0.00 | UNCERTAIN |
| calm | energetic | 0.76 | 0.00 | UNCERTAIN |
| energetic |  | 0.24 | 0.00 | UNCERTAIN |
| bouncy |  | 0.17 | 0.00 | UNCERTAIN |
| driving |  | 0.15 | 0.00 | UNCERTAIN |
| vocal |  | 0.15 | 0.00 | UNCERTAIN |
| light | heavy | 0.10 | 0.00 | UNCERTAIN |
| steady |  | 0.10 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.10 | 0.00 | UNCERTAIN |
| speech |  | 0.04 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes


---

## 38. Suzanne Vega — Tom's Diner

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | null |

### Expected Labels (calibration reference)

- vocal
- sparse

### Label Evidence

#### Confirmed

_None_

#### Uncertain

| label | baseLabel | score | confidence | state |
| --- | --- | ---: | ---: | --- |
| steady |  | 0.62 | 0.65 | UNCERTAIN |
| punchy |  | 0.74 | 0.57 | UNCERTAIN |
| bouncy |  | 0.54 | 0.54 | UNCERTAIN |
| vocal |  | 0.72 | 0.51 | UNCERTAIN |
| sparse | dense | 0.92 | 0.00 | UNCERTAIN |
| heavy |  | 0.81 | 0.00 | UNCERTAIN |
| hypnotic |  | 0.62 | 0.00 | UNCERTAIN |
| driving |  | 0.55 | 0.00 | UNCERTAIN |
| calm | energetic | 0.54 | 0.00 | UNCERTAIN |
| energetic |  | 0.46 | 0.00 | UNCERTAIN |
| instrumental |  | 0.28 | 0.00 | UNCERTAIN |
| light | heavy | 0.19 | 0.00 | UNCERTAIN |
| speech |  | 0.05 | 0.00 | UNCERTAIN |

#### Cut

_None_

### Notes

