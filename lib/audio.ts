// ASCEND Synthesized Web Audio & Haptic Feedback Engine
// Zero external files, zero latency, ultra-lightweight and battery friendly

let audioCtx: AudioContext | null = null;
let ambientSource: AudioNode | null = null;
let ambientGain: GainNode | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playHaptic(type: 'light' | 'medium' | 'success' | 'celebrate' = 'light') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'light':
        navigator.vibrate(12);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'success':
        navigator.vibrate([20, 40, 30]);
        break;
      case 'celebrate':
        navigator.vibrate([40, 60, 40, 80, 60]);
        break;
    }
  } catch (e) {
    // Silent fail if permissions restricted
  }
}

// Satisfying crisp metallic/gold pop checkmark
export function playCheckmarkSound(enabled: boolean = true) {
  if (!enabled) return;
  playHaptic('light');
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  // Rapid pitch envelope: quick pop 440Hz -> 880Hz
  osc.frequency.setValueAtTime(520, now);
  osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.08);

  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.16);
}

// Ascending triumphant chord for victories
export function playVictorySound(enabled: boolean = true) {
  if (!enabled) return;
  playHaptic('success');
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

  freqs.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const startTime = now + idx * 0.06;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.14, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + 0.45);
  });
}

// Epic celebration sound for "Día Ganado" or Level Up
export function playDayWonCelebrationSound(enabled: boolean = true) {
  if (!enabled) return;
  playHaptic('celebrate');
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Grand fanfare arpeggio
  const chordNotes = [
    { freq: 440.0, time: 0 },      // A4
    { freq: 554.37, time: 0.08 },   // C#5
    { freq: 659.25, time: 0.16 },   // E5
    { freq: 880.0, time: 0.26 },    // A5
    { freq: 1108.73, time: 0.38 },  // C#6
    { freq: 1318.51, time: 0.50 }   // E6
  ];

  chordNotes.forEach(({ freq, time }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const noteStart = now + time;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteStart);

    gain.gain.setValueAtTime(0, noteStart);
    gain.gain.linearRampToValueAtTime(0.18, noteStart + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 0.7);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteStart);
    osc.stop(noteStart + 0.75);
  });
}

// Deep meditative singing bowl gong for focus completion
export function playFocusGongSound(enabled: boolean = true) {
  if (!enabled) return;
  playHaptic('celebrate');
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const fundamental = 216; // Deep soothing tone
  const harmonics = [fundamental, fundamental * 1.5, fundamental * 2.02, fundamental * 2.76];

  harmonics.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const amp = 0.2 / (i + 1);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(amp, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.6);
  });
}

// Ambient Focus Sound (Synthesized Brown Noise + Deep Binaural Drift)
export function startFocusAmbientNoise(volume: number = 0.04) {
  const ctx = getAudioContext();
  if (!ctx) return;

  stopFocusAmbientNoise();

  const bufferSize = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);

  // Generate Brownian noise (soothing, deep rumble like distant rain or mountain wind)
  let lastOut = 0.0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    output[i] = (lastOut + 0.02 * white) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  // Filter out harsh frequencies
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.001, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  whiteNoise.start();

  ambientSource = whiteNoise;
  ambientGain = gain;
}

export function stopFocusAmbientNoise() {
  if (ambientGain && audioCtx) {
    ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    setTimeout(() => {
      try {
        if (ambientSource) {
          (ambientSource as AudioBufferSourceNode).stop();
          ambientSource.disconnect();
          ambientSource = null;
        }
      } catch (e) {
        // ignore
      }
    }, 600);
  }
}
