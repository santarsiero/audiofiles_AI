async function fetchAcousticBrainzDescriptors(songIdentity) {
  return {
    provider: 'acousticbrainz',
    available: false,
    data: null,
    songIdentity
  };
}

module.exports = {
  fetchAcousticBrainzDescriptors
};
