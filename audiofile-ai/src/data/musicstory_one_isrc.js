require('dotenv').config();

const { fetchMusicStoryDescriptors } = require('../providers/musicstory');

async function run() {
  const isrc = process.argv[2];
  if (!isrc) {
    console.error('Usage: node src/data/musicstory_one_isrc.js ISRC');
    process.exitCode = 1;
    return;
  }

  const res = await fetchMusicStoryDescriptors({ title: null, artist: null, isrc: null }, { isrc });

  console.log(JSON.stringify({
    input: { isrc },
    providerResult: res
  }, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
