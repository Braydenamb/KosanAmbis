/* ── Procedural Web Audio Ambient Synth Engine ── */
export class AmbientSynthEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {};
    this.isPlaying = false;
    this.currentPreset = '';
    this.volume = 0.5;
    this.lofiInterval = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return;
    }
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.mainGain.connect(this.ctx.destination);
      
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      console.warn("Failed to initialize AudioContext:", e);
    }
  }

  setVolume(vol) {
    this.volume = vol;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  stopAll() {
    this.isPlaying = false;
    this.currentPreset = '';
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }
    Object.keys(this.nodes).forEach(key => {
      try {
        if (this.nodes[key].stop) this.nodes[key].stop();
        if (this.nodes[key].disconnect) this.nodes[key].disconnect();
      } catch (e) {}
      delete this.nodes[key];
    });
  }

  /* ── Noise Generator helper (for rain, wind, white/pink noise) ── */
  createNoiseNode(type = 'pink') {
    if (!this.ctx) return null;
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // rescue clipping
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    } else { // white noise
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    }

    const source = this.ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;
    return source;
  }

  /* ── Preset 1: Rain & Thunder ── */
  playRain() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'rain';

    // Rain sound
    const rain = this.createNoiseNode('pink');
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.28, this.ctx.currentTime);

    rain.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);
    rain.start(0);

    this.nodes.rainSource = rain;
    this.nodes.rainGain = gain;

    // Gentle wind roar
    const wind = this.createNoiseNode('brown');
    const windFilter = this.ctx.createBiquadFilter();
    windFilter.type = 'bandpass';
    windFilter.frequency.setValueAtTime(180, this.ctx.currentTime);
    windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    wind.connect(windFilter);
    windFilter.connect(windGain);
    windGain.connect(this.mainGain);
    wind.start(0);

    this.nodes.windSource = wind;
    this.nodes.windGain = windGain;

    // Gentle thunderstorm generator loop
    const playThunder = () => {
      if (this.currentPreset !== 'rain' || !this.isPlaying) return;
      const delay = Math.random() * 12000 + 8000;
      setTimeout(() => {
        if (this.currentPreset !== 'rain' || !this.isPlaying) return;
        try {
          const osc = this.ctx.createOscillator();
          const filter = this.ctx.createBiquadFilter();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(45, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(15, this.ctx.currentTime + 3.0);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(60, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.5);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.mainGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 4);
        } catch (e) {}
        playThunder();
      }, delay);
    };
    playThunder();
  }

  /* ── Preset 2: Café Ambience ── */
  playCafe() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'cafe';

    // Clutter murmurs (brown noise bandpass modulated)
    const murmur = this.createNoiseNode('brown');
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    murmur.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);
    murmur.start(0);

    this.nodes.murmurSource = murmur;

    // Synthetic clinks & murmurs
    const generateClinks = () => {
      if (this.currentPreset !== 'cafe' || !this.isPlaying) return;
      const delay = Math.random() * 4000 + 1000;
      setTimeout(() => {
        if (this.currentPreset !== 'cafe' || !this.isPlaying) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(Math.random() * 1500 + 800, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.008, this.ctx.currentTime + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);

          osc.connect(gain);
          gain.connect(this.mainGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
        generateClinks();
      }, delay);
    };
    generateClinks();
  }

  /* ── Preset 3: Binaural Alpha/Theta Waves ── */
  playBinaural() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'binaural';

    // Left Ear (100Hz)
    const oscL = this.ctx.createOscillator();
    const pannerL = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainL = this.ctx.createGain();

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(100, this.ctx.currentTime);
    gainL.gain.setValueAtTime(0.16, this.ctx.currentTime);

    if (pannerL) {
      pannerL.pan.setValueAtTime(-1, this.ctx.currentTime);
      oscL.connect(pannerL);
      pannerL.connect(gainL);
    } else {
      oscL.connect(gainL);
    }
    gainL.connect(this.mainGain);
    oscL.start();

    // Right Ear (106Hz → 6Hz Theta Beats for focus)
    const oscR = this.ctx.createOscillator();
    const pannerR = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const gainR = this.ctx.createGain();

    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(106, this.ctx.currentTime);
    gainR.gain.setValueAtTime(0.16, this.ctx.currentTime);

    if (pannerR) {
      pannerR.pan.setValueAtTime(1, this.ctx.currentTime);
      oscR.connect(pannerR);
      pannerR.connect(gainR);
    } else {
      oscR.connect(gainR);
    }
    gainR.connect(this.mainGain);
    oscR.start();

    this.nodes.oscL = oscL;
    this.nodes.oscR = oscR;
  }

  /* ── Preset 4: Lofi Chill Chords (Piano progression) ── */
  playLofi() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'lofi';

    // Soft static vinyl crackle
    const vinyl = this.createNoiseNode('white');
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, this.ctx.currentTime);
    filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

    const vinylGain = this.ctx.createGain();
    vinylGain.gain.setValueAtTime(0.006, this.ctx.currentTime);

    vinyl.connect(filter);
    filter.connect(vinylGain);
    vinylGain.connect(this.mainGain);
    vinyl.start(0);
    this.nodes.vinyl = vinyl;

    // Synth Lofi progression
    const chords = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7
      [146.83, 174.61, 220.00, 261.63], // Dm7
      [164.81, 196.00, 246.94, 293.66], // Em7
      [130.81, 164.81, 196.00, 246.94]  // Cmaj7
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (this.currentPreset !== 'lofi' || !this.isPlaying) return;
      const notes = chords[chordIdx];
      chordIdx = (chordIdx + 1) % chords.length;

      notes.forEach((freq) => {
        try {
          const osc = this.ctx.createOscillator();
          const gainNode = this.ctx.createGain();
          const panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gainNode.gain.setValueAtTime(0.0, this.ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.6);
          gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 3.8);

          if (panner) {
            panner.pan.setValueAtTime((Math.random() - 0.5) * 0.6, this.ctx.currentTime);
            osc.connect(panner);
            panner.connect(gainNode);
          } else {
            osc.connect(gainNode);
          }
          gainNode.connect(this.mainGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 4.0);
        } catch (e) {}
      });
    };

    playChord();
    this.lofiInterval = setInterval(playChord, 4000);
  }

  /* ── Preset 5: Forest Ambience (Wind & Birds) ── */
  playForest() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'forest';

    // Forest wind rustle
    const wind = this.createNoiseNode('pink');
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    wind.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);
    wind.start(0);

    this.nodes.forestWind = wind;

    // Bird chirping loop
    const playBird = () => {
      if (this.currentPreset !== 'forest' || !this.isPlaying) return;
      const delay = Math.random() * 6000 + 3000;
      setTimeout(() => {
        if (this.currentPreset !== 'forest' || !this.isPlaying) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
          osc.frequency.linearRampToValueAtTime(1600, this.ctx.currentTime + 0.08);
          osc.frequency.linearRampToValueAtTime(1400, this.ctx.currentTime + 0.16);

          gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.015, this.ctx.currentTime + 0.02);
          gain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.22);

          osc.connect(gain);
          gain.connect(this.mainGain);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.25);
        } catch (e) {}
        playBird();
      }, delay);
    };
    playBird();
  }

  /* ── Preset 6: Pure White Noise ── */
  playWhiteNoise() {
    this.init();
    this.stopAll();
    this.isPlaying = true;
    this.currentPreset = 'white';

    const source = this.createNoiseNode('white');
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);

    source.connect(gain);
    gain.connect(this.mainGain);
    source.start(0);

    this.nodes.whiteSource = source;
  }

  /* ── Tactile Satisfying click sound effect ── */
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Satisfying organic mechanical pop/click sweep
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.022, this.ctx.currentTime + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.mainGain || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
}
