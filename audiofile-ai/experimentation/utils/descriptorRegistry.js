const NUMERIC_DESCRIPTOR_KEYS = [
  // Core semantic numeric
  'arousal',
  'valence',
  'vocal_instrumental',
  'music_speech',
  'electric_acoustic',
  'danceability',
  'studio_live',
  'melodicity',
  'dissonance',
  'articulation',
  'rhythmic_stability',
  'event_density',
  'pulse_clarity',
  'complexity',
  'binary',
  'intensity',
  'loudness',
  'absolute_loudness',
  'loudness_range',
  'bpm',

  // Spectral numeric
  'roll_off',
  'brightness',
  'zero_cross_rate',
  'centroid',
  'spread',
  'flatness',

  // MFCC numeric
  'mfcc01',
  'mfcc02',
  'mfcc03',
  'mfcc04',
  'mfcc05',
  'mfcc06',
  'mfcc07',
  'mfcc08',
  'mfcc09',
  'mfcc10',
  'mfcc11',
  'mfcc12',
  'mfcc13',

  // Chroma numeric
  'chroma01',
  'chroma02',
  'chroma03',
  'chroma04',
  'chroma05',
  'chroma06',
  'chroma07',
  'chroma08',
  'chroma09',
  'chroma10',
  'chroma11',
  'chroma12',
  'complexity_chroma'
];

const ARRAY_DESCRIPTOR_KEYS = ['moods', 'timbres', 'themes'];

const DESCRIPTOR_CATEGORIES = {
  core_semantic_numeric: [
    'arousal',
    'valence',
    'vocal_instrumental',
    'music_speech',
    'electric_acoustic',
    'danceability',
    'studio_live',
    'melodicity',
    'dissonance',
    'articulation',
    'rhythmic_stability',
    'event_density',
    'pulse_clarity',
    'complexity',
    'binary',
    'intensity',
    'loudness',
    'absolute_loudness',
    'loudness_range',
    'bpm'
  ],
  spectral_numeric: [
    'roll_off',
    'brightness',
    'zero_cross_rate',
    'centroid',
    'spread',
    'flatness'
  ],
  mfcc_numeric: [
    'mfcc01',
    'mfcc02',
    'mfcc03',
    'mfcc04',
    'mfcc05',
    'mfcc06',
    'mfcc07',
    'mfcc08',
    'mfcc09',
    'mfcc10',
    'mfcc11',
    'mfcc12',
    'mfcc13'
  ],
  chroma_numeric: [
    'chroma01',
    'chroma02',
    'chroma03',
    'chroma04',
    'chroma05',
    'chroma06',
    'chroma07',
    'chroma08',
    'chroma09',
    'chroma10',
    'chroma11',
    'chroma12',
    'complexity_chroma'
  ],
  provider_semantic_arrays: ['moods', 'timbres', 'themes']
};

const V1_ACTIVE_RELEVANT_KEYS = [
  'arousal',
  'intensity',
  'loudness',
  'loudness_range',
  'event_density',
  'brightness',
  'centroid',
  'pulse_clarity',
  'rhythmic_stability',
  'danceability',
  'vocal_instrumental',
  'music_speech'
];

module.exports = {
  NUMERIC_DESCRIPTOR_KEYS,
  ARRAY_DESCRIPTOR_KEYS,
  DESCRIPTOR_CATEGORIES,
  V1_ACTIVE_RELEVANT_KEYS
};
