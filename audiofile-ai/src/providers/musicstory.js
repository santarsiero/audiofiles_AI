async function fetchMusicStoryDescriptors(songIdentity, options = {}) {
  const https = require('https');

  const token = process.env.MUSIC_STORY_TOKEN;
  const baseUrl = process.env.MUSIC_STORY_BASE_URL || 'https://api.v2.music-story.com';

  if (!token) {
    return {
      provider: 'music_story',
      available: false,
      data: null,
      songIdentity,
      error: 'MUSIC_STORY_TOKEN not set'
    };
  }

  function getJson(path) {
    const url = `${baseUrl}${path}`;
    return new Promise((resolve, reject) => {
      https
        .get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json'
            }
          },
          (res) => {
            let data = '';
            res.on('data', (chunk) => {
              data += chunk;
            });
            res.on('end', () => {
              const rateLimit = {
                remaining: res.headers['x-rate-limit-remaining'],
                limit: res.headers['x-rate-limit-limit'],
                retryAfter: res.headers['x-rate-limit-retry-after']
              };

              if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
                return resolve({ ok: false, status: res.statusCode || null, json: null, raw: data, rateLimit });
              }

              try {
                const json = data ? JSON.parse(data) : null;
                return resolve({ ok: true, status: res.statusCode, json, raw: data, rateLimit });
              } catch (e) {
                return reject(e);
              }
            });
          }
        )
        .on('error', reject);
    });
  }

  function buildRecordingSearchPath() {
    const isrcOverride = options && options.isrc ? String(options.isrc) : null;
    if (isrcOverride) {
      return `/api/recording?isrc=${encodeURIComponent(isrcOverride)}`;
    }

    if (songIdentity && songIdentity.isrc) {
      return `/api/recording?isrc=${encodeURIComponent(songIdentity.isrc)}`;
    }

    const title = (songIdentity && songIdentity.title) || '';
    const artist = (songIdentity && songIdentity.artist) || '';
    const query = `${title} ${artist}`.trim();
    return query ? `/api/recording?query=${encodeURIComponent(query)}` : null;
  }

  try {
    const overrideId = options && options.recordingId ? options.recordingId : null;
    if (overrideId) {
      const descRes = await getJson(`/api/recording/${encodeURIComponent(overrideId)}/audiodescriptions`);
      if (!descRes.ok) {
        return {
          provider: 'music_story',
          available: false,
          data: null,
          songIdentity,
          error: `Music Story audiodescriptions failed (${descRes.status})`,
          rateLimit: descRes.rateLimit,
          recordingId: overrideId
        };
      }

      return {
        provider: 'music_story',
        available: true,
        data: descRes.json,
        songIdentity,
        recordingId: overrideId,
        rateLimit: descRes.rateLimit
      };
    }

    const searchPath = buildRecordingSearchPath();
    if (!searchPath) {
      return {
        provider: 'music_story',
        available: false,
        data: null,
        songIdentity,
        error: 'Missing identity fields (need isrc or title/artist)'
      };
    }

    const searchRes = await getJson(searchPath);
    if (!searchRes.ok) {
      return {
        provider: 'music_story',
        available: false,
        data: null,
        songIdentity,
        error: `Music Story recording search failed (${searchRes.status})`,
        rateLimit: searchRes.rateLimit
      };
    }

    const hit = searchRes.json && Array.isArray(searchRes.json.hits) ? searchRes.json.hits[0] : null;
    const recordingId = hit && hit.id ? hit.id : null;

    if (!recordingId) {
      return {
        provider: 'music_story',
        available: false,
        data: null,
        songIdentity,
        error: 'No recording hit found',
        rateLimit: searchRes.rateLimit
      };
    }

    const descRes = await getJson(`/api/recording/${encodeURIComponent(recordingId)}/audiodescriptions`);
    if (!descRes.ok) {
      return {
        provider: 'music_story',
        available: false,
        data: null,
        songIdentity,
        error: `Music Story audiodescriptions failed (${descRes.status})`,
        rateLimit: descRes.rateLimit,
        recordingId
      };
    }

    return {
      provider: 'music_story',
      available: true,
      data: descRes.json,
      songIdentity,
      recordingId,
      rateLimit: descRes.rateLimit
    };
  } catch (e) {
    return {
      provider: 'music_story',
      available: false,
      data: null,
      songIdentity,
      error: e && e.message ? e.message : String(e)
    };
  }
}

module.exports = {
  fetchMusicStoryDescriptors
};
