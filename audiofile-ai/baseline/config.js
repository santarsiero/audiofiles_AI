const config = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY || null,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini'
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || null,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-haiku-20240307'
  },
  rateLimits: {
    minTimeBetweenCallsMs: Number(process.env.MIN_TIME_BETWEEN_CALLS_MS || 1200)
  },
  retries: {
    maxRetries: Number(process.env.MAX_RETRIES || 5),
    baseDelayMs: Number(process.env.RETRY_BASE_DELAY_MS || 6000),
    maxDelayMs: Number(process.env.RETRY_MAX_DELAY_MS || 45000)
  },
  allowedLabels: [
    'low_energy',
    'high_energy',
    'very_high_energy',
    'sparse',
    'dense',
    'layered',
    'bright',
    'dark',
    'steady',
    'driving',
    'bouncy',
    'syncopated',
    'vocal',
    'instrumental',
    'speech',
    'calm',
    'aggressive',
    'punchy'
  ]
};

module.exports = {
  config
};
