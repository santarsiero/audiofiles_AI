# Final Runtime Alignment Validation Report

## Summary

- **Cache source used**: `/Users/nicksantarsiero/Documents/GitHub/audiofiles_AI/audiofile-ai/baseline/data/musicstory`
- **Validation result**: **PASS**
- **Total cache entries inspected**: 1875
- **Successful payloads found**: 365
- **Payloads skipped**: 1510
- **Runtime outputs produced**: 365
- **Runtime failures**: 0
- **Schema failures**: 0

## Surfacing statistics

- **Average surfaced labels/song**: 2.263
- **0 labels**: 21
- **1–2 labels**: 210
- **3–5 labels**: 134

## Warning statistics

- **low_dimension_coverage**: 0
- **no_labels_surfaced**: 21

## Dimension statistics

| dimension | avg_score | avg_conf | usable | unusable | missing_score | low_conf |
|---|---:|---:|---:|---:|---:|---:|
| energy | 0.6055 | 0.9500 | 365 | 0 | 0 | 0 |
| pulse | 0.5474 | 1.0000 | 365 | 0 | 0 | 0 |
| brightness | 0.1752 | 0.9000 | 365 | 0 | 0 | 0 |
| density | 0.1331 | 0.7000 | 365 | 0 | 0 | 0 |
| vocal_presence | 0.7893 | 0.7266 | 365 | 0 | 0 | 0 |
| speech | 0.0739 | 0.9500 | 365 | 0 | 0 | 0 |
| valence | 0.4465 | 0.9500 | 365 | 0 | 0 | 0 |
| punch | 0.7279 | 0.7000 | 365 | 0 | 0 | 0 |

## Label statistics (surfaced only)

| label | surfaced_count | avg_surfaced_conf |
|---|---:|---:|
| bouncy | 100 | 0.6728 |
| driving | 34 | 0.6419 |
| energetic | 43 | 0.6538 |
| heavy | 166 | 0.6664 |
| hypnotic | 35 | 0.6583 |
| instrumental | 12 | 0.6559 |
| punchy | 31 | 0.6194 |
| speech | 0 | null |
| steady | 184 | 0.7066 |
| vocal | 221 | 0.7159 |

## Example outputs

### High-label-count song
```json
{
  "songIdentity": {
    "title": "Strings of Life",
    "artist": "Derrick May",
    "isrc": "BEZ350800105"
  },
  "provider": "music_story",
  "pipelineVersion": "audiofile-ai-runtime-alignment-v0.1",
  "dimensions": {
    "energy": {
      "score": 0.33804224999999993,
      "confidence": 0.95,
      "evidence": [
        "arousal",
        "loudness",
        "intensity"
      ],
      "missing": [],
      "usable": true
    },
    "pulse": {
      "score": 0.19993814999999998,
      "confidence": 1,
      "evidence": [
        "pulse_clarity",
        "rhythmic_stability",
        "complexity",
        "danceability",
        "articulation"
      ],
      "missing": [],
      "usable": true
    },
    "brightness": {
      "score": 0.11944404320625002,
      "confidence": 0.9,
      "evidence": [
        "brightness",
        "roll_off",
        "centroid"
      ],
      "missing": [],
      "usable": true
    },
    "density": {
      "score": 0.1766595,
      "confidence": 0.7,
      "evidence": [
        "event_density",
        "intensity",
        "complexity"
      ],
      "missing": [],
      "usable": true
    },
    "vocal_presence": {
      "score": 0.95929,
      "confidence": 0.75,
      "evidence": [
        "vocal_instrumental",
        "music_speech"
      ],
      "missing": [],
      "usable": true
    },
    "speech": {
      "score": 0.12801,
      "confidence": 0.95,
      "evidence": [
        "music_speech"
      ],
      "missing": [],
      "usable": true
    },
    "valence": {
      "score": 0.26979,
      "confidence": 0.95,
      "evidence": [
        "valence"
      ],
      "missing": [],
      "usable": true
    },
    "punch": {
      "score": 0.63154,
      "confidence": 0.7,
      "evidence": [
        "articulation",
        "loudness_range"
      ],
      "missing": [],
      "usable": true
    }
  },
  "labels": [
    {
      "labelId": "vocal",
      "score": 0.95929,
      "confidence": 0.7151057135282693,
      "dimensionsUsed": [
        "vocal_presence_score"
      ],
      "evidence": [
        "vocal_presence_score"
      ],
      "suppressed": false,
      "suppressionReasons": []
    }
  ],
  "analysis": {
    "missingDescriptors": [
      "timbral_complexity",
      "instrumentation_diversity",
      "low_end_score",
      "harshness_score",
      "transient_strength",
      "offbeat_score",
      "provider_syncopation_or_rhythm_complexity"
    ],
    "missingDimensions": [],
    "lowConfidenceDimensions": [],
    "suppressedLabels": [
      {
        "labelId": "energetic",
        "score": 0.33804224999999993,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "heavy",
        "score": 0.88055595679375,
        "confidence": 0,
        "dimensionsUsed": [
          "brightness_score",
          "energy_score"
        ],
        "evidence": [
          "brightness_score",
          "energy_score",
          "density_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_too_low",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "instrumental",
        "score": 0.040710000000000024,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "instrumental_not_low_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.12801,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      }
    ],
    "nonSurfacedLabels": [
      {
        "labelId": "energetic",
        "score": 0.33804224999999993,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "heavy",
        "score": 0.88055595679375,
        "confidence": 0,
        "dimensionsUsed": [
          "brightness_score",
          "energy_score"
        ],
        "evidence": [
          "brightness_score",
          "energy_score",
          "density_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_too_low",
          "energy_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "punchy",
        "score": 0.63154,
        "confidence": 0.44207799987316,
        "dimensionsUsed": [
          "punch_score"
        ],
        "evidence": [
          "punch_score",
          "energy_score",
          "pulse_score"
        ],
        "suppressed": false,
        "suppressionReasons": [],
        "nonSurfacedReasons": [
          "below_surface_confidence_threshold"
        ]
      },
      {
        "labelId": "dense",
        "score": 0.1766595,
        "confidence": 0,
        "dimensionsUsed": [
          "density_score"
        ],
        "evidence": [
          "density_score",
          "energy_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "density_hard_suppress",
          "density_below_required"
        ],
        "nonSurfacedReasons": [
          "deferred_label"
        ]
      },
      {
        "labelId": "instrumental",
        "score": 0.040710000000000024,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "instrumental_not_low_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.12801,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      }
    ],
    "alignedLabels": [
      {
        "labelId": "energetic",
        "score": 0.33804224999999993,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.26899019999999996,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "energy_too_low",
          "pulse_below_required",
          "energy_below_required"
        ]
      },
      {
        "labelId": "heavy",
        "score": 0.88055595679375,
        "confidence": 0,
        "dimensionsUsed": [
          "brightness_score",
          "energy_score"
        ],
        "evidence": [
          "brightness_score",
          "energy_score",
          "density_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_too_low",
          "energy_below_required"
        ]
      },
      {
        "labelId": "punchy",
        "score": 0.63154,
        "confidence": 0.44207799987316,
        "dimensionsUsed": [
          "punch_score"
        ],
        "evidence": [
          "punch_score",
          "energy_score",
          "pulse_score"
        ],
        "suppressed": false,
        "suppressionReasons": []
      },
      {
        "labelId": "dense",
        "score": 0.1766595,
        "confidence": 0,
        "dimensionsUsed": [
          "density_score"
        ],
        "evidence": [
          "density_score",
          "energy_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "density_hard_suppress",
          "density_below_required"
        ]
      },
      {
        "labelId": "vocal",
        "score": 0.95929,
        "confidence": 0.7151057135282693,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": false,
        "suppressionReasons": []
      },
      {
        "labelId": "instrumental",
        "score": 0.040710000000000024,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "instrumental_not_low_enough"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.12801,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.19993814999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_too_low",
          "pulse_below_required"
        ]
      }
    ],
    "surfacedLabels": [
      {
        "labelId": "vocal",
        "score": 0.95929,
        "confidence": 0.7151057135282693,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": false,
        "suppressionReasons": []
      }
    ],
    "warnings": []
  },
  "versions": {
    "ontologyVersion": "audiofile-ai-ontology-v0.1.3",
    "semanticCompositionVersion": "audiofile-ai-semantic-composition-v0.1.1",
    "runtimeAlignmentVersion": "audiofile-ai-runtime-alignment-v0.1"
  },
  "legacyCompatibility": {
    "rawSources": {
      "musicStory": {
        "arousal": 0.40616,
        "valence": 0.26979,
        "vocal_instrumental": 0.04071,
        "music_speech": 0.12801,
        "electric_acoustic": 0.24113,
        "danceability": 0.48784,
        "studio_live": 0.33089,
        "melodicity": 0.46997,
        "dissonance": 0.49965,
        "articulation": 0.3859,
        "rhythmic_stability": 0.48126,
        "event_density": 0.071778,
        "pulse_clarity": 0.181882,
        "bpm": 105,
        "complexity": 0.718573,
        "binary": 1,
        "roll_off": 1095.961657,
        "brightness": 0.105084,
        "zero_cross_rate": 0.040882,
        "centroid": 2391.932319,
        "spread": 3327.083112,
        "flatness": 0.169072,
        "mfcc01": -9.968684,
        "mfcc02": 2.944699,
        "mfcc03": -0.795125,
        "mfcc04": 0.547456,
        "mfcc05": 0.027966,
        "mfcc06": -0.157161,
        "mfcc07": -0.184473,
        "mfcc08": 0.203431,
        "mfcc09": -0.767205,
        "mfcc10": -0.447193,
        "mfcc11": -0.196998,
        "mfcc12": -0.344541,
        "mfcc13": -0.418116,
        "chroma01": 12136,
        "chroma02": 3144,
        "chroma03": 7216,
        "chroma04": 1357,
        "chroma05": 3015,
        "chroma06": 13874,
        "chroma08": 5155,
        "chroma09": 1672,
        "chroma10": 7938,
        "chroma11": 3162,
        "chroma12": 1761,
        "complexity_chroma": 0.272727,
        "intensity": 0.103227,
        "loudness": -20.854652,
        "absolute_loudness": -19.399903,
        "loudness_range": 8.400293,
        "moods": [
          {
            "name": "Distrustful",
            "value": 0.96
          },
          {
            "name": "Sad",
            "value": 0.73
          }
        ],
        "timbres": [
          "Electric",
          "Vocal"
        ],
        "themes": [
          "Diner"
        ]
      }
    },
    "normalizedFeatures": {
      "energy_score": 0.33804224999999993,
      "density_score": 0.1766595,
      "layered_score": 0.44761625,
      "brightness_score": 0.11944404320625002,
      "darkness_score": 0.8137355315520833,
      "pulse_score": 0.19993814999999998,
      "rhythm_stability_score": 0.48126,
      "offbeat_score": null,
      "syncopation_score": 0.359339075,
      "vocal_score": 0.95929,
      "vocal_presence_score": 0.95929,
      "speech_score": 0.12801,
      "instrumental_score": 0.04071,
      "harshness_score": null,
      "punch_score": 0.63154,
      "calm_score": 0.7332008906249999,
      "low_end_score": null,
      "acoustic_score": null,
      "valence_score": 0.26979,
      "driving_score": 0.21105564374999997
    },
    "aiLabels": []
  }
}
```

### Abstention / no-label song
```json
{
  "songIdentity": {
    "title": "50//50",
    "artist": "Vantage",
    "isrc": "QZES51852621"
  },
  "provider": "music_story",
  "pipelineVersion": "audiofile-ai-runtime-alignment-v0.1",
  "dimensions": {
    "energy": {
      "score": 0.560475725,
      "confidence": 0.95,
      "evidence": [
        "arousal",
        "loudness",
        "intensity"
      ],
      "missing": [],
      "usable": true
    },
    "pulse": {
      "score": 0.48449990000000004,
      "confidence": 1,
      "evidence": [
        "pulse_clarity",
        "rhythmic_stability",
        "complexity",
        "danceability",
        "articulation"
      ],
      "missing": [],
      "usable": true
    },
    "brightness": {
      "score": 0.06455200907500001,
      "confidence": 0.9,
      "evidence": [
        "brightness",
        "roll_off",
        "centroid"
      ],
      "missing": [],
      "usable": true
    },
    "density": {
      "score": 0.13960514999999998,
      "confidence": 0.7,
      "evidence": [
        "event_density",
        "intensity",
        "complexity"
      ],
      "missing": [],
      "usable": true
    },
    "vocal_presence": {
      "score": 0.39519000000000004,
      "confidence": 0.595,
      "evidence": [
        "vocal_instrumental",
        "music_speech"
      ],
      "missing": [],
      "usable": true
    },
    "speech": {
      "score": 0.0287,
      "confidence": 0.95,
      "evidence": [
        "music_speech"
      ],
      "missing": [],
      "usable": true
    },
    "valence": {
      "score": 0.42588,
      "confidence": 0.95,
      "evidence": [
        "valence"
      ],
      "missing": [],
      "usable": true
    },
    "punch": {
      "score": 0.687826,
      "confidence": 0.7,
      "evidence": [
        "articulation",
        "loudness_range"
      ],
      "missing": [],
      "usable": true
    }
  },
  "labels": [],
  "analysis": {
    "missingDescriptors": [
      "timbral_complexity",
      "instrumentation_diversity",
      "low_end_score",
      "harshness_score",
      "transient_strength",
      "offbeat_score",
      "provider_syncopation_or_rhythm_complexity"
    ],
    "missingDimensions": [],
    "lowConfidenceDimensions": [],
    "suppressedLabels": [
      {
        "labelId": "energetic",
        "score": 0.560475725,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "vocal",
        "score": 0.39519000000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band",
          "vocal_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "instrumental",
        "score": 0.60481,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.0287,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      }
    ],
    "nonSurfacedLabels": [
      {
        "labelId": "energetic",
        "score": 0.560475725,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "heavy",
        "score": 0.935447990925,
        "confidence": 0.543266717337185,
        "dimensionsUsed": [
          "brightness_score",
          "energy_score"
        ],
        "evidence": [
          "brightness_score",
          "energy_score",
          "density_score",
          "punch_score"
        ],
        "suppressed": false,
        "suppressionReasons": [],
        "nonSurfacedReasons": [
          "below_surface_confidence_threshold"
        ]
      },
      {
        "labelId": "punchy",
        "score": 0.687826,
        "confidence": 0.511478199785604,
        "dimensionsUsed": [
          "punch_score"
        ],
        "evidence": [
          "punch_score",
          "energy_score",
          "pulse_score"
        ],
        "suppressed": false,
        "suppressionReasons": [],
        "nonSurfacedReasons": [
          "below_surface_confidence_threshold"
        ]
      },
      {
        "labelId": "dense",
        "score": 0.13960514999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "density_score"
        ],
        "evidence": [
          "density_score",
          "energy_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "density_hard_suppress",
          "density_below_required"
        ],
        "nonSurfacedReasons": [
          "deferred_label"
        ]
      },
      {
        "labelId": "vocal",
        "score": 0.39519000000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band",
          "vocal_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "instrumental",
        "score": 0.60481,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.0287,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ],
        "nonSurfacedReasons": [
          "label_suppressed"
        ]
      }
    ],
    "alignedLabels": [
      {
        "labelId": "energetic",
        "score": 0.560475725,
        "confidence": 0,
        "dimensionsUsed": [
          "energy_score"
        ],
        "evidence": [
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "energy_not_high_enough"
        ]
      },
      {
        "labelId": "driving",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ]
      },
      {
        "labelId": "steady",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_not_high_enough"
        ]
      },
      {
        "labelId": "bouncy",
        "score": 0.5224878125,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score",
          "energy_score"
        ],
        "evidence": [
          "pulse_score",
          "energy_score",
          "valence_score",
          "brightness_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ]
      },
      {
        "labelId": "heavy",
        "score": 0.935447990925,
        "confidence": 0.543266717337185,
        "dimensionsUsed": [
          "brightness_score",
          "energy_score"
        ],
        "evidence": [
          "brightness_score",
          "energy_score",
          "density_score",
          "punch_score"
        ],
        "suppressed": false,
        "suppressionReasons": []
      },
      {
        "labelId": "punchy",
        "score": 0.687826,
        "confidence": 0.511478199785604,
        "dimensionsUsed": [
          "punch_score"
        ],
        "evidence": [
          "punch_score",
          "energy_score",
          "pulse_score"
        ],
        "suppressed": false,
        "suppressionReasons": []
      },
      {
        "labelId": "dense",
        "score": 0.13960514999999998,
        "confidence": 0,
        "dimensionsUsed": [
          "density_score"
        ],
        "evidence": [
          "density_score",
          "energy_score",
          "punch_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "density_hard_suppress",
          "density_below_required"
        ]
      },
      {
        "labelId": "vocal",
        "score": 0.39519000000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band",
          "vocal_not_high_enough"
        ]
      },
      {
        "labelId": "instrumental",
        "score": 0.60481,
        "confidence": 0,
        "dimensionsUsed": [
          "vocal_presence_score"
        ],
        "evidence": [
          "vocal_presence_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "vocal_uncertainty_band"
        ]
      },
      {
        "labelId": "speech",
        "score": 0.0287,
        "confidence": 0,
        "dimensionsUsed": [
          "speech_score"
        ],
        "evidence": [
          "speech_score"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "speech_not_high_enough"
        ]
      },
      {
        "labelId": "hypnotic",
        "score": 0.48449990000000004,
        "confidence": 0,
        "dimensionsUsed": [
          "pulse_score"
        ],
        "evidence": [
          "pulse_score",
          "rhythmic_stability",
          "complexity",
          "event_density"
        ],
        "suppressed": true,
        "suppressionReasons": [
          "pulse_below_required"
        ]
      }
    ],
    "surfacedLabels": [],
    "warnings": [
      "no_labels_surfaced"
    ]
  },
  "versions": {
    "ontologyVersion": "audiofile-ai-ontology-v0.1.3",
    "semanticCompositionVersion": "audiofile-ai-semantic-composition-v0.1.1",
    "runtimeAlignmentVersion": "audiofile-ai-runtime-alignment-v0.1"
  },
  "legacyCompatibility": {
    "rawSources": {
      "musicStory": {
        "arousal": 0.60767,
        "valence": 0.42588,
        "vocal_instrumental": 0.60481,
        "music_speech": 0.0287,
        "electric_acoustic": 0.03268,
        "danceability": 0.71616,
        "studio_live": 0.15613,
        "melodicity": 0.63686,
        "dissonance": 0.46082,
        "articulation": 0.47971,
        "rhythmic_stability": 0.6114,
        "event_density": 0.049417,
        "pulse_clarity": 0.475462,
        "bpm": 62,
        "complexity": 0.329608,
        "binary": 0.884571,
        "roll_off": 608.434828,
        "brightness": 0.055141,
        "zero_cross_rate": 0.033155,
        "centroid": 2811.064196,
        "spread": 3827.712833,
        "flatness": 0.228345,
        "mfcc01": -8.143329,
        "mfcc02": 3.12711,
        "mfcc03": -0.760904,
        "mfcc04": 0.451284,
        "mfcc05": -0.16328,
        "mfcc06": -0.352585,
        "mfcc07": -0.329975,
        "mfcc08": -0.169164,
        "mfcc09": -0.354173,
        "mfcc10": -0.183764,
        "mfcc11": -0.349398,
        "mfcc12": -0.280382,
        "mfcc13": -0.348734,
        "chroma01": 6459,
        "chroma02": 2064,
        "chroma03": 12864,
        "chroma04": 752,
        "chroma05": 2228,
        "chroma06": 8917,
        "chroma08": 5155,
        "chroma09": 1512,
        "chroma10": 15387,
        "chroma11": 3894,
        "chroma12": 2071,
        "complexity_chroma": 0.272727,
        "intensity": 0.242055,
        "loudness": -13.341622,
        "absolute_loudness": -13.341622,
        "loudness_range": 4.593582,
        "moods": [
          {
            "name": "Impatient",
            "value": 0.97
          },
          {
            "name": "Energic",
            "value": 0.61
          }
        ],
        "timbres": [
          "Instrumental",
          "Electric"
        ],
        "themes": [
          "Party"
        ]
      }
    },
    "normalizedFeatures": {
      "energy_score": 0.560475725,
      "density_score": 0.13960514999999998,
      "layered_score": 0.234606575,
      "brightness_score": 0.06455200907500001,
      "darkness_score": 0.774857772736111,
      "pulse_score": 0.48449990000000004,
      "rhythm_stability_score": 0.6114,
      "offbeat_score": null,
      "syncopation_score": 0.43654995,
      "vocal_score": 0.39519000000000004,
      "vocal_presence_score": 0.39519000000000004,
      "speech_score": 0.0287,
      "instrumental_score": 0.60481,
      "harshness_score": null,
      "punch_score": 0.687826,
      "calm_score": 0.6194215578124999,
      "low_end_score": null,
      "acoustic_score": null,
      "valence_score": 0.42588,
      "driving_score": 0.39947162031249994
    },
    "aiLabels": []
  }
}
```

## Known limitations

- This validation uses cached Music Story payloads only and does not include representative semantic evaluation.

## Recommended next step

- Build Representative Semantic Validation Set
