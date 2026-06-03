require('dotenv').config();

const { processSong } = require('../pipeline/processSong');

async function run() {
  const testSongs = [
    {
      title: 'Test High Energy',
      artist: 'AudioFile',
      mock: {
        arousal: 0.9,
        intensity: 0.85,
        event_density: 0.8,
        pulse_clarity: 0.75,
        rhythmic_stability: 0.8,
        loudness_lufs: -7,
        brightness: 0.7,
        spectral_rolloff: 0.65,
        flatness: 0.55,
        valence: 0.6,
        spectral_complexity: 0.6,
        timbral_complexity: 0.65,
        loudness_range: 0.45,
        instrumentation_diversity: 0.55,
        low_end_score: 0.7,
        vocal_instrumental: 0.2,
        music_speech: 0.1,
        harshness_score: 0.65,
        dissonance: 0.55,
        articulation: 0.6,
        transient_strength: 0.7,
        offbeat_score: 0.25,
        syncopation: 0.3
      }
    },
    {
      title: 'Test Calm Sparse',
      artist: 'AudioFile',
      mock: {
        arousal: 0.2,
        intensity: 0.25,
        event_density: 0.2,
        pulse_clarity: 0.55,
        rhythmic_stability: 0.75,
        loudness_lufs: -20,
        brightness: 0.35,
        spectral_rolloff: 0.3,
        flatness: 0.25,
        valence: 0.4,
        spectral_complexity: 0.25,
        timbral_complexity: 0.3,
        loudness_range: 0.35,
        instrumentation_diversity: 0.3,
        low_end_score: 0.35,
        vocal_instrumental: 0.85,
        music_speech: 0.05,
        harshness_score: 0.15,
        dissonance: 0.1,
        articulation: 0.15,
        transient_strength: null,
        offbeat_score: null,
        syncopation: null
      }
    },
    {
      title: 'Test Speech Content',
      artist: 'AudioFile',
      mock: {
        vocal_instrumental: 0.4,
        music_speech: 0.9,
        arousal: 0.45,
        intensity: 0.4,
        event_density: 0.35,
        pulse_clarity: 0.4,
        rhythmic_stability: 0.55,
        loudness_lufs: -14
      }
    },
    {
      title: 'Test Bright Driving',
      artist: 'AudioFile',
      mock: {
        arousal: 0.7,
        intensity: 0.65,
        event_density: 0.6,
        pulse_clarity: 0.8,
        rhythmic_stability: 0.85,
        loudness_lufs: -10,
        brightness: 0.85,
        spectral_rolloff: 0.8,
        flatness: 0.5,
        valence: 0.7,
        low_end_score: 0.55,
        vocal_instrumental: 0.6,
        music_speech: 0.05
      }
    },
    {
      title: 'Test Minimal Features',
      artist: 'AudioFile',
      mock: {
        arousal: null,
        intensity: 0.6,
        loudness_lufs: null,
        event_density: null,
        pulse_clarity: 0.65
      }
    }
  ];

  const outputs = [];

  for (const s of testSongs) {
    const out = await processSong(
      { title: s.title, artist: s.artist },
      {
        musicStoryOverride: s.mock
      }
    );

    outputs.push(out);
  }

  for (const out of outputs) {
    console.log('---');
    console.log(JSON.stringify(out, null, 2));
  }

  const missing = new Map();
  for (const out of outputs) {
    const missingDescriptors = out && out.analysis && Array.isArray(out.analysis.missingDescriptors) ? out.analysis.missingDescriptors : [];
    for (const f of missingDescriptors) missing.set(f, (missing.get(f) || 0) + 1);
  }

  console.log('---');
  console.log('Missing features summary (feature -> count_songs_missing):');
  console.log(JSON.stringify(Object.fromEntries([...missing.entries()].sort((a, b) => a[0].localeCompare(b[0]))), null, 2));
}

run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
