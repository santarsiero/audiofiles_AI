require('dotenv').config();

const { resolveIdentity } = require('../providers/musicbrainz');
const { fetchMusicStoryDescriptors } = require('../providers/musicstory');

async function run() {
  const title = process.argv[2];
  const artist = process.argv[3];
  const recordingIdArg = process.argv[4];

  if (!title || !artist) {
    console.error('Usage: node src/data/musicstory_one_track.js "Title" "Artist" [musicStoryRecordingId]');
    process.exitCode = 1;
    return;
  }

  const identity = await resolveIdentity({ title, artist });
  const recordingId = recordingIdArg ? Number(recordingIdArg) : null;
  const res = await fetchMusicStoryDescriptors(identity, { recordingId });

  console.log(JSON.stringify({
    input: { title, artist },
    identity,
    providerResult: {
      provider: res.provider,
      available: res.available,
      recordingId: res.recordingId || null,
      rateLimit: res.rateLimit || null,
      error: res.error || null,
      dataKeys: res.data && typeof res.data === 'object' ? Object.keys(res.data).sort() : null,
      sample: res.data || null
    }
  }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
