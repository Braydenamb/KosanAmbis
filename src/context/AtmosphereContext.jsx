import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AtmosphereContext = createContext();

/* ── Procedural Web Audio Ambient Synth Engine ── */
class AmbientSynthEngine {
  constructor() {
    this.ctx = null;
    this.nodes = {};
    this.isPlaying = false;
    this.currentPreset = '';
    this.volume = 0.5;
    this.lofiInterval = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.mainGain = this.ctx.createGain();
    this.mainGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.mainGain.connect(this.ctx.destination);
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
}

const atmosphericPresets = {
  'sunny-day': {
    theme: 'sunny-day',
    bg: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
    accent: '#0ea5e9',
    glow: '0 0 20px rgba(14, 165, 233, 0.15)',
    particle: 'sunrays',
    glass: 'rgba(255, 255, 255, 0.75)',
    text: '#0f172a',
    border: 'rgba(224, 242, 254, 0.80)'
  },
  'rainy-night': {
    theme: 'rainy-night',
    bg: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 50%, #a7f3d0 100%)',
    accent: '#10b981',
    glow: '0 0 20px rgba(16, 185, 129, 0.15)',
    particle: 'rain',
    glass: 'rgba(255, 255, 255, 0.75)',
    text: '#064e3b',
    border: 'rgba(209, 250, 229, 0.80)'
  },
  'clear-night': {
    theme: 'clear-night',
    bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
    accent: '#8b5cf6',
    glow: '0 0 20px rgba(139, 92, 246, 0.15)',
    particle: 'stars',
    glass: 'rgba(255, 255, 255, 0.75)',
    text: '#4c1d95',
    border: 'rgba(237, 233, 254, 0.80)'
  },
  'storm-mode': {
    theme: 'storm-mode',
    bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)',
    accent: '#f43f5e',
    glow: '0 0 20px rgba(244, 63, 94, 0.15)',
    particle: 'heavy-rain',
    glass: 'rgba(255, 255, 255, 0.75)',
    text: '#881337',
    border: 'rgba(254, 228, 226, 0.80)'
  },
  'sunset-mode': {
    theme: 'sunset-mode',
    bg: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    accent: '#f97316',
    glow: '0 0 20px rgba(249, 115, 22, 0.15)',
    particle: 'sparkles',
    glass: 'rgba(255, 255, 255, 0.75)',
    text: '#7c2d12',
    border: 'rgba(255, 237, 213, 0.80)'
  }
};

export function AtmosphereProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState('sunny-day');
  const [uiMode, setUiMode] = useState('liquid');
  const [focusMode, setFocusMode] = useState(false);
  const [audioPreset, setAudioPreset] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isAdaptive, setIsAdaptive] = useState(true);
  const [isMidnightProtected, setIsMidnightProtected] = useState(false);

  const engineRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = new AmbientSynthEngine();
  }

  // Time-based automatic cycle and midnight adjustments
  useEffect(() => {
    const checkTime = () => {
      const date = new Date();
      const hour = date.getHours();
      
      // Midnight Protected mode: volume restriction between 23:00 and 06:00
      const isNight = hour >= 23 || hour < 6;
      setIsMidnightProtected(isNight);

      // Midnight eye-saver screen filter active between 00:00 and 06:00
      const isMidnightSaver = hour >= 0 && hour < 6;
      const root = document.documentElement;
      if (isMidnightSaver) {
        root.classList.add('midnight-mode-active');
      } else {
        root.classList.remove('midnight-mode-active');
      }

      // If automatic atmosphere cycle is enabled, update activeTheme based on time of day
      if (isAdaptive) {
        if (hour >= 6 && hour < 11) {
          setActiveTheme('sunny-day');   // Fresh Morning
        } else if (hour >= 11 && hour < 16) {
          setActiveTheme('sunny-day');   // Bright Afternoon
        } else if (hour >= 16 && hour < 19) {
          setActiveTheme('sunset-mode');  // Cinematic Sunset
        } else {
          // Evening & Night: Keep existing rain/storm or fallback to serene clear night
          setActiveTheme(prev => (prev === 'rainy-night' || prev === 'storm-mode') ? prev : 'clear-night');
        }
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isAdaptive]);

  // Effect to apply dynamic theme variables and toggle dark mode class
  useEffect(() => {
    const preset = atmosphericPresets[activeTheme];
    if (!preset) return;

    const root = document.documentElement;
    root.style.setProperty('--c-bg-app', preset.bg);
    root.style.setProperty('--c-accent-active', preset.accent);
    root.style.setProperty('--shadow-glow-active', preset.glow);
    root.style.setProperty('--c-bg-card-active', preset.glass);
    root.style.setProperty('--c-text-active', preset.text);
    root.style.setProperty('--c-border-active', preset.border);

    // Keep all themes in beautiful light pastel mode as requested by user
    root.classList.remove('theme-dark');
  }, [activeTheme]);


  // Neubrutalism vs Liquid layout token injection
  useEffect(() => {
    const root = document.documentElement;
    if (uiMode === 'neubrutalist') {
      root.classList.add('mode-neubrutalist');
      root.style.setProperty('--ui-border-width', '3px');
      root.style.setProperty('--ui-border-color', '#000000');
      root.style.setProperty('--ui-card-bg', '#ffffff');
      root.style.setProperty('--ui-card-shadow', '4px 4px 0px #000000');
      root.style.setProperty('--ui-hover-transform', 'translate(-3px, -3px)');
      root.style.setProperty('--ui-active-transform', 'translate(1px, 1px)');
    } else {
      root.classList.remove('mode-neubrutalist');
      root.style.setProperty('--ui-border-width', '1px');
      root.style.setProperty('--ui-border-color', 'var(--c-border-active, rgba(226, 232, 240, 0.80))');
      root.style.setProperty('--ui-card-bg', 'var(--c-bg-card-active, rgba(255, 255, 255, 0.75))');
      root.style.setProperty('--ui-card-shadow', 'var(--shadow-premium, 0 8px 24px rgba(15, 23, 42, 0.06))');
      root.style.setProperty('--ui-hover-transform', 'scale(1.01)');
      root.style.setProperty('--ui-active-transform', 'scale(0.98)');
    }
  }, [uiMode, activeTheme]);

  // Focus Mode DOM class injection
  useEffect(() => {
    const root = document.documentElement;
    if (focusMode) {
      root.classList.add('focus-mode-active');
      // Automatically trigger Lofi preset when deep work starts (if no audio is playing)
      if (!isPlaying) {
        playSoundPreset('lofi');
      }
    } else {
      root.classList.remove('focus-mode-active');
    }
  }, [focusMode]);

  // Adjust volume with automatic midnight cap (max 40% volume)
  useEffect(() => {
    const actualVol = isMidnightProtected ? Math.min(volume, 0.40) : volume;
    engineRef.current.setVolume(actualVol);
  }, [volume, isMidnightProtected]);

  // Accessibility keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut M: Mute/Unmute
      if (e.key.toLowerCase() === 'm' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleAudio();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioPreset, isPlaying]);

  const selectTheme = (themeName) => {
    if (atmosphericPresets[themeName]) {
      setIsAdaptive(false); // Pause automatic cycles when user overrides theme choice
      setActiveTheme(themeName);
    }
  };

  const playSoundPreset = (preset) => {
    setAudioPreset(preset);
    setIsPlaying(true);
    switch (preset) {
      case 'rain':
        engineRef.current.playRain();
        break;
      case 'cafe':
        engineRef.current.playCafe();
        break;
      case 'binaural':
        engineRef.current.playBinaural();
        break;
      case 'lofi':
        engineRef.current.playLofi();
        break;
      case 'forest':
        engineRef.current.playForest();
        break;
      case 'white':
        engineRef.current.playWhiteNoise();
        break;
      default:
        engineRef.current.stopAll();
        setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      engineRef.current.stopAll();
      setIsPlaying(false);
    } else {
      playSoundPreset(audioPreset || 'lofi');
    }
  };

  return (
    <AtmosphereContext.Provider
      value={{
        activeTheme,
        selectTheme,
        particleMode: atmosphericPresets[activeTheme]?.particle || 'sunrays',
        uiMode,
        toggleUiMode: () => setUiMode(prev => prev === 'liquid' ? 'neubrutalist' : 'liquid'),
        focusMode,
        setFocusMode,
        audioPreset,
        isPlaying,
        volume,
        setVolume,
        playSoundPreset,
        toggleAudio,
        isAdaptive,
        setIsAdaptive,
        isMidnightProtected,
        stopAudio: () => {
          engineRef.current.stopAll();
          setIsPlaying(false);
        }
      }}
    >
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) {
    throw new Error('useAtmosphere must be used within an AtmosphereProvider');
  }
  return context;
}
