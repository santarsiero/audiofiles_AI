async function fetchMusicStoryDescriptors(songIdentity) {
  return {
    provider: 'music_story',
    available: false,
    data: null,
    songIdentity
  };
}

module.exports = {
  fetchMusicStoryDescriptors
};
