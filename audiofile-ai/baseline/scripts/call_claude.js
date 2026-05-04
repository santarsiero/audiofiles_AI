const https = require('https');
const { config } = require('../config');

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function postJson(url, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);

    const req = https.request(
      {
        method: 'POST',
        hostname: u.hostname,
        path: u.pathname + u.search,
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve({ status: res.statusCode, body: data });
        });
      }
    );

    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

function backoffDelayMs(attempt) {
  const base = config.retries.baseDelayMs;
  const max = config.retries.maxDelayMs;
  const d = Math.min(max, base * Math.pow(2, attempt));
  const jitter = Math.floor(Math.random() * 250);
  return d + jitter;
}

function extractJsonObject(text) {
  if (!text) return null;

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) return null;

  const candidate = text.slice(firstBrace, lastBrace + 1);
  try {
    return JSON.parse(candidate);
  } catch {
    return null;
  }
}

async function callClaude({ prompt }) {
  if (!config.anthropic.apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY');
  }

  await sleep(config.rateLimits.minTimeBetweenCallsMs);

  const body = {
    model: config.anthropic.model,
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
  };

  let lastErr = null;

  for (let attempt = 0; attempt <= config.retries.maxRetries; attempt += 1) {
    try {
      const resp = await postJson(
        'https://api.anthropic.com/v1/messages',
        {
          'x-api-key': config.anthropic.apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body
      );

      if (resp.status >= 200 && resp.status < 300) {
        const parsed = JSON.parse(resp.body);
        const text =
          parsed && Array.isArray(parsed.content) && parsed.content[0] && parsed.content[0].text
            ? parsed.content[0].text
            : '';

        const json = extractJsonObject(text);

        return {
          responseText: text,
          parsed: json,
          parseError: json ? null : 'Failed to parse JSON object from model text'
        };
      }

      const truncated = String(resp.body || '').slice(0, 800);
      console.log(`[Claude] HTTP ${resp.status}: ${truncated}`);
      lastErr = new Error(`Anthropic HTTP ${resp.status}: ${truncated}`);
    } catch (e) {
      console.log(`[Claude] exception: ${e && e.message ? e.message : String(e)}`);
      lastErr = e;
    }

    if (attempt < config.retries.maxRetries) {
      const delay = backoffDelayMs(attempt);
      console.log(`[Claude] retry ${attempt + 1}/${config.retries.maxRetries} after ${delay}ms`);
      await sleep(delay);
      continue;
    }
  }

  throw lastErr || new Error('Unknown Claude error');
}

module.exports = {
  callClaude
};
