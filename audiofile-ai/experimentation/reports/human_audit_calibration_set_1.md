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
| steady | true |
| driving | true |

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
I think for this one, bouncy, punchy, and instrumental, possibly hypnotic too could be included, it has medieum energy too, so this could be an adjsutment made with the genre addition, these songs definitely have those traits

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
I would put punchy, bouncy, driving and steady as well, maybe hypnotic too, but these confidences are very low

---

## 3. FISHER — Losing It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| hypnotic | true |
| bouncy | true |
| driving | true |
| energetic | true |

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
This is accually done very well, and, all the confirmed labels are correct, this is exactly how I would label this aswell, it is a balanced song that is not sparse nor dense

---

## 4. Dom Dolla — Take It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| bouncy | true |
| driving | true |
| hypnotic | true |

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
I would also put heavy, and punchy, maybe sparse, as well, but is as some different parts with different densities making it more difficult, but this is good

---

## 5. MK — Rhyme Dust

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| bouncy | true |
| driving | true |
| hypnotic | true |

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
I would add punchy, and possibly heavy, medium energy, maybe vocals, since for house this is maybe something with genre, again not the most dense, but also not sparse since overpowering sounds, so this is good, so we just need to determine some calirations, these songs have big sounds that make then not sparse even though there are not many

---

## 6. Kylie Minogue — Can't Get You Out of My Head

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| bouncy | true |
| driving | true |

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
I could support a punchy and a hypnotic label, but it is not the highest punchy, so we will need a range for punchy, as with the other labels, maybe vocals to, but this si good, for the heavy, it could be alittle, but I agree not heavy enough for a full support, but it is some,

---

## 7. Daft Punk — Veridis Quo

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| instrumental | true |

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
I would add hypnotic, but it is not the highest hypnotic, so we will need a range for hypnotic, as with the other labels, but hypnotic is more then less here, but I agree with the rest, sparse can also be included here, and I likley would, maybe alittle light, but this may not be

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
punchy, steady, vocal, heavy, hypnotic, driving, bouncy and medium energy, this is what I think, maybe sparse as well, but it would be a range, like a 2/5

---

## 9. Skrillex — Bangarang (feat. Sirah)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| energetic | true |
| punchy | true |
| steady | true |

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
I would include heavy, hypnotic, and dense, maybe some bouncy, 

---

## 10. Skrillex — Scary Monsters and Nice Sprites

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| heavy | true |
| energetic | true |

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
I would include dense, maybe some hypnotic, maybe a tiny punchy, but not much, maybe instrumental 

---

## 11. Sub Focus — Push The Tempo

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| steady | true |
| heavy | true |
| energetic | true |
| driving | true |

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
maybe alittle punchy, maybe alittle hpynotic, manye alittle sparse, but those gaps are filled so

---

## 12. Sub Focus & Dimension — Desire

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| vocal | true |
| heavy | true |
| energetic | true |
| driving | true |

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
I agree with all of the supported, again alittle punchy, alittle hypnotic, these could be traits of drum and bass, since the beat pattern creates tehse traits

---

## Notes from EDM
The AI did pretty good with these, if accaully did pretty good with the scores, but confidence prevented some I would include, but there were no False positives which is great

## 13. Lil Jon & The East Side Boyz — Get Low

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
I would agree with punchy alittle, heavy forsure, maybe a little hypnotic, some energy, alittle sparse but loud sounds so I agree with the no put, middle driving and steady, which is exactly what the scores report

---

## 14. Denzel Curry — STILL IN THE PAINT

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
for sure heavy, punchy, dense, energtic, bouncy, some driving and a little hypnotic, which are represnted by the scores, so all of the scores are very good, confidence is low, but it is good

---

## 15. The Game — Hate It Or Love It

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| steady | true |
| punchy | null |
| driving | true |

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
I am not sure if I would put punchy, but this is also a more calm song, so this is a confusing one, it is all around a pretty neutral song, so I do not think it did a good job with this one, but it is a hard song with enough contrast to create confusion, the system does predict what this song has, but the contrast within it balances it making it harder to pale, so we will likely have to explore more

---

## 16. Rob $tone — Chill Bill (feat. J. Davi$ & Spooks)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
I think steady, sparse, calm, and hypnotic, heavy is possible, but in a lesser form, same as punchy, it exists, but not enoughf for the full label, which again supports needed more buckets, this song again has so much contrast in its sounds that it does make it quite difficult

---

## Notes from Rap
It did pretty good, but this is a harder genre, since there was alot of contrast within the sounds, and descriptors, meaning for the rap genre we will ahve to determine how to see through this, but it is on theme where songs with high contrast have some trouble, but ones with less contrast are good,

## 17. Nirvana — Smells Like Teen Spirit

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
I would include heavy and punchy for sure, song has alot of energy, like 4/5, a little driving, which is exactly what the score should be, same with dense, some density, but this builds and drops, so denseity and energy chanages

---

## 18. Mötley Crüe — Kickstart My Heart

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| energetic | true |

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
I would put heavy and punchy, it has some bouncy and drive, which is reflected by the score, overall scores are really good, with some confidence fixs, also more dense then sparse, but not dense

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
difficult song since it builds so much, this is definitely a progressive song, I would out punchy, heavy , I understand sparse, but its got too much for sa full sparse, esspically since it builds at times, I would say it is hypnotic, maybe alittle steady and driving, scores are decent here, but maybe more hypnotic, but that is because it has an infection bassline, this bassline makes this song (side note, I eventually want the system to have that info, bit that will take time, like be able to say the bassline is the driver and what makes this song)

---

## 20. Franz Ferdinand — Take Me Out

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| heavy | true |

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
I would punhcy, energeitc, ad maybe some bouncy and drive, scores are overall pretty good heere, but punchy needed

---

## Notes for Rock
We are discovering that strict inclusion exclusion doesn't alwasy work, aluding to more ranges, this is completelty reflected in the data, where it will ahve medium range scores with low confidence, which makes sense since the label itslef doesn't apply, but a sub verion of it might, rock is decent, not great, but this is because it's sounds are often more in the middle range, with some being more dominant and being included, but some being more minor or just parts, were genre tuning will help with this, along with more labels for the mid ranges

## 21. Stevie Wonder — Superstition

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
this song is tricky as a human labeler as well, I would put it as funky and interesting, with density coming from a fullness, it also has many parts as well, so this is a hard one, I would not put heavy, and I wouldnt give a fully punchy, but I can understand this ones, there is some heavyness too, but not a full, this would fall more into the passion too, which is not here yet, this song is very full, we will likely have to come back to this one

---

## 22. Earth, Wind & Fire — Let's Groove

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
some punchy, density from fullness, I accaully think the scores ehre are pretty good, with it having an accurate score, with many aspects existing, but due to the density it is hard to place any single one, so disco is going to be hard, but I think it is becaseu the songs are so dense with color and songs that it is hard to apply these strict inclusion exclsion labels, I think many of the labels for these songs don't yet exitist, since it is heavy and punchy but it is so colorful and full that this is blended out and not the doninant heard things by the listener

---

## 23. Wild Cherry — Play That Funky Music

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| energetic | true |
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
same as above scores are pretty accurate, and these are hard to label due to the full density and sound quality, but it is dancable, builds, has some punch, bounce, drive, so we just need to expore disco more, it has good enerergy, but I am not sure if I acan say heavy, maybe but not nearly as much as other examples of heavy

---

## 24. The Jacksons — Blame It on the Boogie

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
same as above, so much going on it is hard to place much, so we will have to explore more for this

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
this one is steady, maybe alittle punch, alittle drive, not really heay, maybe hypnotic, this one is not as dense as the others making it not as hard to place, but this is disco pop, so not on the same as the other songs, scores are accurate, just too dense to have dominate features

---

## Notes for Disco
(side note is that Get Lucky is not the same as the other songs, but it is very disco groove inspired, which is why it has aspects of the other songs, but alittle more certainty)
this was by far the hardest genre we encountered yet, and I think the algoithm did a great job with the scores, and a great job of not including, since I myslef am struggling with these songs, they are so dense, and have so much in them and going on that it is hard to be certain about many labels, with them existing is some snese, but not enough to be fully confirmed or they are balanced by something else, this genre will need exploration, since the densitiy coming from fullness here makes it difficult, which is a good note, that songs that are dense from fullness are much harder even for a human to label then a song that is dense from overpowering sounds, which makes sense, since as a labeler, I would likely overlabel these songs as use way too many since there is so much going on

## 26. Mark Ronson — Uptown Funk (feat. Bruno Mars)

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| punchy | true |

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
I agree with vocal and punchy, but it is not the same punch as before, it is from the drum kick, punchy doen't feel like the right word, bit is also is a punchy of sorts, same with heavy, it is there but doesn't feel like the right word, some density, some hypnotic, some driving, some bouncy, some enerey, so this is really making me see that classifiying the different denisties tells alot about a song, (dense from full vs size of sound)
---

## 27. Backstreet Boys — I Want It That Way

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| steady | true |

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
I agree with steady, scores are pretty good, maybe alittle more calm, I would not say punchy, and accually think it is more flowy, some hypnotic, some bouncy some drive but not enough to be included, this would be a pretty song, but we dont have that label yet

---

## 28. Lady Gaga — Telephone

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |

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
I would agree with punchy, heavy, maybe steady, bouncy, energtic, hypnotic, but I am noticing an immerging trend, and that is of contrast like rap, were disco was dense and a full mix, these are dense, but with many sounds alining more but often the beat and vocals contrast like rap, which makes it hard to see what is dominate, but overall scores here are good, we just need to see how to use them better for the song

---

## 29. Sabrina Carpenter — Feather

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| vocal | true |
| steady | true |

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
I agree with steady, I understand heavy and light, and this is because of what we said above, there is a contrast between the beat and vocals, , so I think all the scores here are good, like they present well, with the punch, drive, bouncy, enerergy, and I understand not inclduing because the vocals are light and flowy,so we might need a way to detect for this, esspcailly if this trend keeps up with pop music of this large contrast

---

## 30. Bruno Mars — Treasure

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |
| vocal | true |
| punchy | true |
| bouncy | true |

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
not the most punchy, and I don't know if thats the rught word, but it definitely is bouncy, driving, steady, maybe alittle hypnotic, energietc, not as much contrast within this song, but which is why it is alittle easier to label, but still constrast between beat and vocal, so we need to explore this more so the solution

---

## Notes for Pop
Pop appears to have disco influence in beat density, but not as dense, and that seems to create contrast, where the beats are often more low, punchy, heavy, and vocals are more light, flowy, airy, which is consitaint with pop, this might not be alwasy true, and veries to extent between songs, but this is observed

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
I understand punchy here since the words cut like a night, this is a vocal punch, I also agree with heavy and sparse and calm, overall scores are good, this is an itneresting song, but it does good, maybe just better mapping, but this is hard I understand, but overall good scores

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
I agree with vocals, punchy, sparse, heavy, calm, steady, hypnotic, these all exist, and some driving and bouncy, again scores are good, just need to see how to map them better

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
I agree with heavy for sure and sparse, some hypnotic, I feel the punch, again, scores are really good here, we just need the way to map better, and find the right words, pretty steady too, and its calm but errie (which is a label we do not have yet, but it is) a little bounce

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
I agree with punchy, sparse, heavy, some enregy, some bounce, song vocals, some instruments so this is accurate, just a hard song to label, but good scores

---

## 35. Camille Saint-Saëns — Danse macabre, Op. 40

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| instrumental | true |

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
I agree with heavy, but these songs are so dense that they bascailly exhibt everything, this is where the genre weights will really come into play, since this song is energetic by the end of it (its a tension energy, something we dicussed in another chat) it also have contrast from the flowy and punchy, there is so much contrast in this song that it has many labels, so this is a hard one, this is the same with the other classical songs, they are so full and dense, having both densities and so much contrast they are hard to place, but this is why we have the genre helpers

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

## Notes for Classical
As said above, alot going on, all over the place, we will refine

---

## 38. Suzanne Vega — Tom's Diner

### Assigned Labels (surfaced)

| label | isValid |
| --- | --- |
| steady | true |

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
This is a steady vocal songs, calm too, alittle punch, alittle bounce, alittle hypnotic, alittle drive, not really heavy, and I would support sparse here


## Total Notes
This was a good experiment, overall, I think the scores are great, I do not think we need to change those any more, now we see how we can use these confidnces or imporove them, and them map to the labels proplerly, if I said alittle or maybe, that means its not a full support, but also not abscent, that is where more words will come into play, and where this middle scores will map too witht eh full oncology, but overall the system is good, I and happy with it, now we need the genre mapping better and expand oncology, but this is great