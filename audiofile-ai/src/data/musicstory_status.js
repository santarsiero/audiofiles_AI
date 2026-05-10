require('dotenv').config();

const https = require('https');

async function getJson(url, token) {
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
            const out = {
              status: res.statusCode || null,
              headers: {
                'x-rate-limit-remaining': res.headers['x-rate-limit-remaining'],
                'x-rate-limit-limit': res.headers['x-rate-limit-limit'],
                'x-rate-limit-retry-after': res.headers['x-rate-limit-retry-after']
              },
              body: null,
              raw: data
            };

            try {
              out.body = data ? JSON.parse(data) : null;
            } catch {
              out.body = null;
            }

            resolve(out);
          });
        }
      )
      .on('error', reject);
  });
}

async function run() {
  const token = process.env.MUSIC_STORY_TOKEN;
  const baseUrl = process.env.MUSIC_STORY_BASE_URL || 'https://api.v2.music-story.com';

  if (!token) {
    console.error('MUSIC_STORY_TOKEN is not set');
    process.exitCode = 1;
    return;
  }

  const res = await getJson(`${baseUrl}/user/api/status`, token);
  console.log(JSON.stringify(res, null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
