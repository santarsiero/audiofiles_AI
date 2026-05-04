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

async function callGpt({ prompt }) {
  if (!config.openai.apiKey) {
    throw new Error('Missing OPENAI_API_KEY');
  }

  await sleep(config.rateLimits.minTimeBetweenCallsMs);

  const body = {
    model: config.openai.model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0,
    response_format: { type: 'json_object' }
  };

  let lastErr = null;

  for (let attempt = 0; attempt <= config.retries.maxRetries; attempt += 1) {
    try {
      const resp = await postJson(
        'https://api.openai.com/v1/chat/completions',
        {
          Authorization: `Bearer ${config.openai.apiKey}`,
          'Content-Type': 'application/json'
        },
        body
      );

      if (resp.status >= 200 && resp.status < 300) {
        const parsed = JSON.parse(resp.body);
        const text =
          parsed &&
          parsed.choices &&
          parsed.choices[0] &&
          parsed.choices[0].message &&
          parsed.choices[0].message.content
            ? parsed.choices[0].message.content
            : '';

        const json = extractJsonObject(text);

        return {
          responseText: text,
          parsed: json,
          parseError: json ? null : 'Failed to parse JSON object from model text'
        };
      }

      const truncated = String(resp.body || '').slice(0, 800);
      console.log(`[GPT] HTTP ${resp.status}: ${truncated}`);
      lastErr = new Error(`OpenAI HTTP ${resp.status}: ${truncated}`);
    } catch (e) {
      console.log(`[GPT] exception: ${e && e.message ? e.message : String(e)}`);
      lastErr = e;
    }

    if (attempt < config.retries.maxRetries) {
      const delay = backoffDelayMs(attempt);
      console.log(`[GPT] retry ${attempt + 1}/${config.retries.maxRetries} after ${delay}ms`);
      await sleep(delay);
      continue;
    }
  }

  throw lastErr || new Error('Unknown GPT error');
}

module.exports = {
  callGpt
};
