const { resolveIdentity } = require('../providers/musicbrainz');
const { fetchMusicStoryDescriptors } = require('../providers/musicstory');
const { fetchAcousticBrainzDescriptors } = require('../providers/acousticbrainz');
const { normalizeFromDescriptors } = require('../features/normalize');
const { scoreLabels, scoreAlignedLabels, surfaceAlignedLabels } = require('../mapping/labelScorer');
const { mappingConfig } = require('../mapping/mappingConfig');

function pickDimension(dimensionObjects, key) {
  if (!dimensionObjects || typeof dimensionObjects !== 'object') return null;
  return dimensionObjects[key] || null;
}

function mapDimensions(dimensionObjects) {
  const energy = pickDimension(dimensionObjects, 'energy_score');
  const pulse = pickDimension(dimensionObjects, 'pulse_score');
  const brightness = pickDimension(dimensionObjects, 'brightness_score');
  const density = pickDimension(dimensionObjects, 'density_score');
  const vocalPresence = pickDimension(dimensionObjects, 'vocal_presence_score');
  const speech = pickDimension(dimensionObjects, 'speech_score');
  const valence = pickDimension(dimensionObjects, 'valence_score');
  const punch = pickDimension(dimensionObjects, 'punch_score');

  return {
    energy,
    pulse,
    brightness,
    density,
    vocal_presence: vocalPresence,
    speech,
    valence,
    punch
  };
}

function buildAnalysis({ analysis, surfacing, dimensions }) {
  const missingDescriptors = Array.isArray(analysis && analysis.missingFeatures) ? analysis.missingFeatures : [];
  const lowConfidenceDimensions = Array.isArray(analysis && analysis.lowConfidenceDimensions) ? analysis.lowConfidenceDimensions : [];

  const missingDimensions = [];
  if (dimensions && typeof dimensions === 'object') {
    for (const [k, d] of Object.entries(dimensions)) {
      if (!d || d.score === null || d.score === undefined || d.usable === false || (typeof d.confidence === 'number' && d.confidence < 0.4)) {
        missingDimensions.push(k);
      }
    }
  }

  const nonSurfacedLabels = Array.isArray(surfacing && surfacing.nonSurfacedLabels) ? surfacing.nonSurfacedLabels : [];
  const suppressedLabels = nonSurfacedLabels.filter((l) => Array.isArray(l.nonSurfacedReasons) && l.nonSurfacedReasons.includes('label_suppressed'));

  return {
    missingDescriptors,
    missingDimensions,
    lowConfidenceDimensions,
    suppressedLabels,
    nonSurfacedLabels,
    alignedLabels: Array.isArray(surfacing && surfacing.alignedLabels) ? surfacing.alignedLabels : [],
    surfacedLabels: Array.isArray(surfacing && surfacing.surfacedLabels) ? surfacing.surfacedLabels : [],
    warnings: Array.isArray(analysis && analysis.warnings) ? analysis.warnings : []
  };
}

function buildRuntimeAlignmentOutput({ songIdentity, rawSources, normalizedFeatures, aiLabels, dimensionObjects, surfacing, analysis }) {
  const dimensions = mapDimensions(dimensionObjects);
  const labels = Array.isArray(surfacing && surfacing.surfacedLabels) ? surfacing.surfacedLabels : [];

  const outAnalysis = buildAnalysis({ analysis, surfacing, dimensions });

  return {
    songIdentity,
    provider: 'music_story',
    pipelineVersion: 'audiofile-ai-runtime-alignment-v0.1',
    dimensions,
    labels,
    analysis: outAnalysis,
    versions: {
      ontologyVersion: mappingConfig.versions.ontologyVersion,
      semanticCompositionVersion: mappingConfig.versions.semanticCompositionVersion,
      runtimeAlignmentVersion: mappingConfig.versions.runtimeAlignmentVersion
    },
    legacyCompatibility: {
      rawSources,
      normalizedFeatures,
      aiLabels
    }
  };
}

async function processSong(input, options = {}) {
  const songIdentity = await resolveIdentity({ title: input.title, artist: input.artist });

  const musicStory = options.musicStoryOverride
    ? { provider: 'music_story', available: true, data: options.musicStoryOverride }
    : await fetchMusicStoryDescriptors(songIdentity, {
        recordingId: input && input.musicStoryRecordingId ? input.musicStoryRecordingId : null,
        isrc: input && input.isrc ? input.isrc : null
      });

  const acousticBrainz = options.acousticBrainzOverride
    ? { provider: 'acousticbrainz', available: true, data: options.acousticBrainzOverride }
    : await fetchAcousticBrainzDescriptors(songIdentity);

  const rawSources = {
    musicStory: musicStory && musicStory.available ? musicStory.data : {},
    acousticBrainz: acousticBrainz && acousticBrainz.available ? acousticBrainz.data : {},
    musicBrainz: songIdentity,
    metadata: {},
    llm: {}
  };

  const { normalizedFeatures, dimensionObjects, analysis } = normalizeFromDescriptors({ musicStory, acousticBrainz });
  const aiLabels = scoreLabels(normalizedFeatures, analysis);
  const alignedLabels = scoreAlignedLabels(dimensionObjects, analysis);
  const surfacing = surfaceAlignedLabels({ alignedLabels, dimensionObjects });
  analysis.warnings = Array.isArray(analysis.warnings) ? analysis.warnings : [];
  analysis.warnings.push(...surfacing.warnings);

  const legacyAiLabels = aiLabels.map((l) => ({
    ...l,
    ontologyVersion: mappingConfig.versions.ontologyVersion,
    mappingVersion: mappingConfig.versions.mappingVersion
  }));

  return buildRuntimeAlignmentOutput({
    songIdentity,
    rawSources,
    normalizedFeatures,
    aiLabels: legacyAiLabels,
    dimensionObjects,
    surfacing,
    analysis
  });
}

module.exports = {
  processSong,
  buildRuntimeAlignmentOutput
};
