const { resolveIdentity } = require('../providers/musicbrainz');
const { fetchMusicStoryDescriptors } = require('../providers/musicstory');
const { fetchAcousticBrainzDescriptors } = require('../providers/acousticbrainz');
const { normalizeFromDescriptors } = require('../features/normalize');
const { scoreLabels } = require('../mapping/labelScorer');
const { mappingConfig } = require('../mapping/mappingConfig');

async function processSong(input, options = {}) {
  const songIdentity = await resolveIdentity({ title: input.title, artist: input.artist });

  const musicStory = options.musicStoryOverride
    ? { provider: 'music_story', available: true, data: options.musicStoryOverride }
    : await fetchMusicStoryDescriptors(songIdentity);

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

  const { normalizedFeatures, analysis } = normalizeFromDescriptors({ musicStory, acousticBrainz });
  const aiLabels = scoreLabels(normalizedFeatures, analysis);

  return {
    songIdentity,
    rawSources,
    normalizedFeatures,
    aiLabels: aiLabels.map((l) => ({
      ...l,
      ontologyVersion: mappingConfig.versions.ontologyVersion,
      mappingVersion: mappingConfig.versions.mappingVersion
    })),
    derivedLabels: [],
    humanLabels: [],
    analysis
  };
}

module.exports = {
  processSong
};
