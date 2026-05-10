const path = require('path');

const { readJsonFile, writeJsonFile, ensureDir } = require('../utils/io');

function featureMeta(featureName) {
  if (featureName === 'energy_score_v1') {
    return {
      featureDescription:
        'Experimental composite feature intended to represent perceived musical energy/activation.',
      questionsToConsider: [
        'Does the song feel energetic?',
        'Does it feel physically activating?',
        'Does the score align with intensity?',
        'Does it feel over-influenced by loudness?'
      ]
    };
  }

  if (featureName === 'brightness_score_v1') {
    return {
      featureDescription:
        'Experimental composite feature intended to represent perceived spectral/tonal brightness.',
      questionsToConsider: [
        'Does the song sound bright/sharp/crisp?',
        'Does it feel spectrally bright?',
        'Does the score align with perceived tonal brightness?',
        'Does it feel over-influenced by harshness?'
      ]
    };
  }

  if (featureName === 'pulse_score_v1') {
    return {
      featureDescription:
        'Experimental composite feature intended to represent rhythmic clarity/drive and groove stability.',
      questionsToConsider: [
        'Does the song have a strong rhythmic drive?',
        'Is the pulse clear and stable?',
        'Does the song feel dance/groove-oriented?',
        'Does complexity reduce pulse clarity?'
      ]
    };
  }

  if (featureName === 'vocal_presence_score_v1') {
    return {
      featureDescription:
        'Experimental composite feature intended to represent vocal prominence (orientation may be uncertain).',
      questionsToConsider: [
        'Does the song actually feel vocal-heavy?',
        'Does the feature appear inverted?',
        'Does the feature seem to measure instrumentalness instead?',
        'Does speech affect the score unexpectedly?'
      ]
    };
  }

  if (featureName === 'density_score_v1') {
    return {
      featureDescription:
        'Experimental composite feature intended to represent perceived density/fullness/layering.',
      questionsToConsider: [
        'Does the song feel dense/full/layered?',
        'Does the feature feel more like complexity?',
        'Does the feature feel more like arrangement busyness?',
        'Does the score align with perceived sonic fullness?'
      ]
    };
  }

  return {
    featureDescription: 'Experimental composite feature (description not specified).',
    questionsToConsider: []
  };
}

function blankHumanReview() {
  return {
    listened: false,

    heardRating: null,
    heardDescription: '',

    doesFeatureMatch: null,

    confidence: null,

    notes: '',

    possibleIssues: [],

    semanticThoughts: '',

    wouldKeepFeatureBehavior: null,

    suggestedFeatureChanges: '',

    possibleFeatureRename: ''
  };
}

function toValidationEntries(group, songs) {
  if (!Array.isArray(songs)) return [];
  return songs.map((s, idx) => ({
    group,
    rank: idx + 1,
    song: {
      title: s.title || '',
      artist: s.artist || '',
      isrc: s.isrc || '',
      score: typeof s.score === 'number' ? s.score : 0
    },
    humanReview: blankHumanReview()
  }));
}

async function run() {
  const repPath = path.join(__dirname, '..', 'outputs', 'features', 'representative_tracks.json');
  const rep = readJsonFile(repPath);

  if (!rep || typeof rep !== 'object' || !rep.byFeature || typeof rep.byFeature !== 'object') {
    console.error('[009] representative_tracks.json schema unexpected or missing byFeature');
    process.exitCode = 1;
    return;
  }

  const datasetContext = rep.dataset || {};

  const featureNames = [
    'energy_score_v1',
    'brightness_score_v1',
    'pulse_score_v1',
    'vocal_presence_score_v1',
    'density_score_v1'
  ];

  const features = [];

  for (const featureName of featureNames) {
    const b = rep.byFeature[featureName];
    if (!b) {
      console.error(`[009] Missing feature in representative_tracks.json: ${featureName}`);
      process.exitCode = 1;
      return;
    }

    const meta = featureMeta(featureName);

    const validationEntries = [
      ...toValidationEntries('high', b.highest),
      ...toValidationEntries('low', b.lowest),
      ...toValidationEntries('median', b.nearMedian)
    ];

    features.push({
      featureName,
      featureDescription: meta.featureDescription,
      questionsToConsider: meta.questionsToConsider,
      validationEntries
    });
  }

  const outDir = path.join(__dirname, '..', 'human_validation', 'templates');
  ensureDir(outDir);

  const outPath = path.join(outDir, 'human_validation_v1.json');

  writeJsonFile(outPath, {
    metadata: {
      version: 'human-validation-v0.1',
      generatedAt: new Date().toISOString(),
      datasetContext: {
        totalEntries: datasetContext.totalEntries,
        successfulPayloads: datasetContext.successfulPayloads,
        failedPayloads: datasetContext.failedPayloads
      },
      instructions: [
        'This file is for human semantic validation only.',
        'Do not interpret feature scores as ground truth.',
        'Evaluate based on listening perception.',
        'Use cautious interpretation.'
      ]
    },
    features
  });

  console.log('[009] Wrote human validation template:');
  console.log(`- ${outPath}`);
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
