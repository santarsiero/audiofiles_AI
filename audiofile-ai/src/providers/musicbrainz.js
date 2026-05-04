const https = require('https');

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'AudioFile-AI-V1/0.1 ( prototype; contact: local )',
            Accept: 'application/json'
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => {
            data += chunk;
          });
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              reject(e);
            }
          });
        }
      )
      .on('error', reject);
  });
}

async function resolveIdentity({ title, artist }) {
  const query = `recording:"${title}" AND artist:"${artist}"`;
  const url = `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json&limit=1`;

  const result = await getJson(url);
  const recording = (result && result.recordings && result.recordings[0]) || null;

  if (!recording) {
    return {
      title,
      artist,
      mbid: null,
      isrc: null,
      providerIds: {}
    };
  }

  const artistCredit = Array.isArray(recording['artist-credit'])
    ? recording['artist-credit'].map((a) => (a && a.name ? a.name : '')).join('')
    : artist;

  const isrc = Array.isArray(recording.isrcs) && recording.isrcs.length > 0 ? recording.isrcs[0] : null;

  return {
    title: recording.title || title,
    artist: artistCredit || artist,
    mbid: recording.id || null,
    isrc,
    providerIds: {}
  };
}

module.exports = {
  resolveIdentity
};
