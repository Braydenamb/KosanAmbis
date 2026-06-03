import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AmbientSynthEngine } from '../utils/ambientSynthEngine';

const AtmosphereContext = createContext();

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
        },
        playClick: () => {
          engineRef.current.playClick();
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
