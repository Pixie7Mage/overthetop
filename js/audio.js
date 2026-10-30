/**
 * KINETIC AUDIO ENGINE
 * Procedural Web Audio API sound synthesizer for Warm Industrial tactile feedback.
 * Zero external audio files required. Real-time synthesis of mechanical clicks,
 * deep sub-thuds, resonance sweeps, spring snaps, and ember breathing hums.
 */

class KineticAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = localStorage.getItem('kinetic_audio_muted') === 'true';
    this.isInitialized = false;
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 0.65;
      this.masterGain.connect(this.ctx.destination);
      this.isInitialized = true;
      this.startAmbientHum();
    } catch (e) {
      console.warn('Web Audio API not supported or blocked:', e);
    }
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    localStorage.setItem('kinetic_audio_muted', this.isMuted);
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.65, now, 0.05);
    }
    return this.isMuted;
  }

  haptic(ms = 18) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(ms);
      } catch (e) {}
    }
  }

  // Act / Section transition deep resonant sub-thud
  playThud(freq = 75, duration = 0.55) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(25);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(18, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(30, now + duration);

    gain.gain.setValueAtTime(0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  // Crisp mechanical toggle click / analog shutter snap
  playClick(pitch = 1.0) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(12);
    const now = this.ctx.currentTime;

    // High frequency transient pop
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(350 * pitch, now + 0.035);

    oscGain.gain.setValueAtTime(0.35, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.04);

    // Mechanical friction burst (white noise bandpass)
    const bufferSize = this.ctx.sampleRate * 0.02;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200 * pitch;
    filter.Q.value = 2.5;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.25, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.03);
  }

  // Scale dial / slider fine detent tick
  playDetent(index = 0) {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(8);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 880 + (index % 4) * 110;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.02);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  // Elastic snap / rubber-band release
  playSpring() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(16);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Shatter / Hero crack resonance
  playShatter() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(45);
    const now = this.ctx.currentTime;

    // Sub explosion
    this.playThud(95, 0.8);

    // Glass crystal chime sweep
    [1200, 1680, 2400, 3200, 4800].forEach((freq, idx) => {
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(freq * (1 + (Math.random() * 0.1 - 0.05)), now + idx * 0.03);
      chime.frequency.exponentialRampToValueAtTime(freq * 0.6, now + 0.4 + idx * 0.05);

      cGain.gain.setValueAtTime(0, now);
      cGain.gain.setValueAtTime(0.22, now + idx * 0.03);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + idx * 0.05);

      chime.connect(cGain);
      cGain.connect(this.masterGain);
      chime.start(now + idx * 0.03);
      chime.stop(now + 0.6 + idx * 0.05);
    });
  }

  // Act V Ignition Rocket / Kinetic Accelerator Launch Surge
  playIgnite() {
    if (this.isMuted) return;
    this.ensureContext();
    if (!this.ctx) return;

    this.haptic(60);
    const now = this.ctx.currentTime;
    const dur = 2.2;

    // Sub rumble
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(45, now);
    subOsc.frequency.exponentialRampToValueAtTime(110, now + 0.6);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + dur);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(now);
    subOsc.stop(now + dur);

    // Filtered noise surge (thruster jet)
    const bufLen = this.ctx.sampleRate * dur;
    const noiseBuf = this.ctx.createBuffer(1, bufLen, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.Q.value = 3.5;
    bpf.frequency.setValueAtTime(220, now);
    bpf.frequency.exponentialRampToValueAtTime(3800, now + 1.1);
    bpf.frequency.exponentialRampToValueAtTime(540, now + dur);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.1, now);
    nGain.gain.linearRampToValueAtTime(0.55, now + 0.5);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

    noiseSrc.connect(bpf);
    bpf.connect(nGain);
    nGain.connect(this.masterGain);

    noiseSrc.start(now);
    noiseSrc.stop(now + dur);
  }

  // Warm organic hum for resting ember
  startAmbientHum() {
    if (!this.ctx || this.ambientOsc) return;
    try {
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.value = 55; // Low A

      filter.type = 'lowpass';
      filter.frequency.value = 110;

      this.ambientGain.gain.value = this.isMuted ? 0 : 0.04;

      this.ambientOsc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      this.ambientOsc.start();
    } catch (e) {}
  }
}

// Global audio singleton
window.kineticAudio = new KineticAudioEngine();

// Initialize audio context on first user interaction
['pointerdown', 'keydown', 'scroll'].forEach((evt) => {
  window.addEventListener(evt, () => window.kineticAudio.ensureContext(), { once: true, passive: true });
});
