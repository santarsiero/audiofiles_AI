// Experimental composite feature definitions (exploratory only).
// These are research formulas, not validated semantics and not production mapping.

const FEATURE_DEFINITIONS = {
  energy_score_v1: {
    featureName: 'energy_score_v1',
    description:
      'Experimental energy composite. Uses arousal/intensity/loudness/articulation/pulse_clarity. Exploratory only.',
    contributors: ['arousal', 'intensity', 'loudness', 'articulation', 'pulse_clarity'],
    notes: [
      'Exploratory formula only. Does not represent validated energy semantics.',
      'Includes loudness which may dominate. Check correlations and collapse risk.'
    ]
  },

  brightness_score_v1: {
    featureName: 'brightness_score_v1',
    description:
      'Experimental spectral brightness composite. Uses brightness/roll_off/centroid/flatness. Exploratory only.',
    contributors: ['brightness', 'roll_off', 'centroid', 'flatness'],
    notes: [
      'Spectral descriptors are observed to correlate strongly; avoid accidental over-weighting.',
      'Exploratory composite only; validate with listening later.'
    ]
  },

  pulse_score_v1: {
    featureName: 'pulse_score_v1',
    description:
      'Experimental rhythmic clarity/drive composite. Uses pulse_clarity/rhythmic_stability/danceability with negative complexity. Exploratory only.',
    contributors: ['pulse_clarity', 'rhythmic_stability', 'danceability', 'complexity'],
    notes: [
      'Uses complexity as a negative contributor (higher complexity may reduce perceived pulse clarity).',
      'Exploratory composite only; validate with listening later.'
    ]
  },

  vocal_presence_score_v1: {
    featureName: 'vocal_presence_score_v1',
    description:
      'Experimental vocal presence composite. Uses vocal_instrumental and music_speech. Orientation is uncertain; treat as exploratory.',
    contributors: ['vocal_instrumental', 'music_speech'],
    notes: [
      'Descriptor orientation may be ambiguous: higher vocal_instrumental may indicate more instrumentalness (not more vocal).',
      'This feature should be treated as highly experimental until validated.'
    ]
  },

  density_score_v1: {
    featureName: 'density_score_v1',
    description:
      'Experimental density/complexity composite. Uses event_density/complexity/loudness_range/spread. Highly experimental.',
    contributors: ['event_density', 'complexity', 'loudness_range', 'spread'],
    notes: [
      'event_density appears possibly collapsed in earlier analysis; treat as unstable.',
      'Exploratory composite only; validate with larger dataset.'
    ]
  }
};

const FEATURE_KEYS = Object.keys(FEATURE_DEFINITIONS);

module.exports = {
  FEATURE_DEFINITIONS,
  FEATURE_KEYS
};
