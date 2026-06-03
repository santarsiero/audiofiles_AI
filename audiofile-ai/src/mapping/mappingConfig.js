const mappingConfig = {
  energyBuckets: {
    low_energy: { maxExclusive: 0.35 },
    high_energy: { minInclusive: 0.65, maxExclusive: 0.82 },
    very_high_energy: { minInclusive: 0.82 }
  },
  labels: {
    sparse: { scoreField: 'density_score', invert: true, threshold: 0.35, requires: ['density_score'], applyRule: { scoreMin: 0.68, confidenceMin: 0.55 } },
    dense: { scoreField: 'density_score', threshold: 0.68, requires: ['density_score'], applyRule: { scoreMin: 0.68, confidenceMin: 0.55 } },

    bright: { scoreField: 'brightness_score', threshold: 0.68, requires: ['brightness_score'], applyRule: { scoreMin: 0.68, confidenceMin: 0.55 } },

    steady: { scoreField: 'pulse_score', threshold: 0.7, requires: ['pulse_score'], applyRule: { scoreMin: 0.68, confidenceMin: 0.55 } },

    vocal: { scoreField: 'vocal_score', threshold: 0.65, requires: ['vocal_score', 'speech_score'], direct: true },
    instrumental: { scoreField: 'instrumental_score', threshold: 0.7, requires: ['instrumental_score'], direct: true },
    speech: { scoreField: 'speech_score', threshold: 0.7, requires: ['speech_score'], direct: true },

    punchy: { scoreField: 'punch_score', threshold: 0.72, requires: ['punch_score'], applyRule: { scoreMin: 0.72, confidenceMin: 0.6 } }
  },
  confidence: {
    sourceReliability: {
      music_story: 0.9,
      acousticbrainz: 0.75,
      metadata: 0.45,
      llm: 0.3
    }
  },
  versions: {
    mappingVersion: 'descriptor-mapper-v0.1',
    ontologyVersion: 'audiofile-ai-ontology-v0.1.3',
    semanticCompositionVersion: 'audiofile-ai-semantic-composition-v0.1.1',
    runtimeAlignmentVersion: 'audiofile-ai-runtime-alignment-v0.1'
  }
};

module.exports = {
  mappingConfig
};
