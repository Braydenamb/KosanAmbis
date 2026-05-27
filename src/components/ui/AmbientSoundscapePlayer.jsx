import React, { useState } from 'react';
import { useAtmosphere } from '../../context/AtmosphereContext';
import {
  Volume2, VolumeX, Music, CloudRain, Coffee, Headphones,
  Trees, Radio, Play, Pause, ChevronUp, ChevronDown, Sun,
  Moon, Zap, Sunset
} from 'lucide-react';

export default function AmbientSoundscapePlayer() {
  const {
    activeTheme, selectTheme,
    audioPreset, isPlaying,
    volume, setVolume,
    playSoundPreset, toggleAudio,
    uiMode, toggleUiMode,
    isAdaptive, setIsAdaptive,
    isMidnightProtected,
    focusMode, setFocusMode
  } = useAtmosphere();


  const [isOpen, setIsOpen] = useState(false);

  const presets = [
    { id: 'lofi',     label: 'Lofi Chords',   icon: Music,       desc: 'Procedural relaxing piano chords' },
    { id: 'rain',     label: 'Rain Shower',   icon: CloudRain,   desc: 'Pink noise stream & soft wind' },
    { id: 'cafe',     label: 'Cafe Murmur',   icon: Coffee,      desc: 'Ambient whispers & cup clinks' },
    { id: 'binaural', label: 'Binaural Theta',icon: Headphones,  desc: '6Hz brainwave binaural beats' },
    { id: 'forest',   label: 'Deep Forest',   icon: Trees,       desc: 'Gentle wind & synthesized birds' },
    { id: 'white',    label: 'White Noise',   icon: Radio,       desc: 'Pure focus signal' },
  ];

  const themes = [
    { id: 'sunny-day',   label: 'Sunny Day',    icon: Sun,      color: 'text-amber-500' },
    { id: 'rainy-night', label: 'Rainy Night',  icon: CloudRain, color: 'text-emerald-500' },
    { id: 'clear-night', label: 'Clear Night',  icon: Moon,     color: 'text-indigo-500' },
    { id: 'storm-mode',  label: 'Storm Mode',   icon: Zap,      color: 'text-rose-500' },
    { id: 'sunset-mode', label: 'Sunset Mode',  icon: Sunset,   color: 'text-orange-500' },
  ];

  return (
    <div
      className="fixed bottom-6 right-6 z-[var(--z-overlay,100)] flex flex-col items-end gap-3"
      role="region"
      aria-label="Ambient soundscape and atmosphere settings"
    >
      {/* ── Main expandable card ── */}
      {isOpen && (
        <div
          className="w-80 ds-card p-5 flex flex-col gap-4 animate-slide-up shadow-2xl"
          style={{
            background: 'var(--c-bg-card-active, rgba(255, 255, 255, 0.70))',
            borderColor: 'var(--c-accent-active, var(--c-border))',
            transition: 'all 0.4s var(--ease-out)',
            backdropFilter: 'blur(32px) saturate(200%)'
          }}
        >
          {/* Top Header */}
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: 'var(--c-border-active, var(--c-border))' }}>
            <div>
              <h3 className="text-xs font-bold font-display uppercase tracking-wider text-slate-800" style={{ color: 'var(--c-text-active)' }}>
                Atmosphere Controller
              </h3>
              <p className="text-[9px] font-mono text-slate-400">PROCEDURAL AMBIENT SYNTH v2.0</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Collapse player panel"
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Futuristic UI Mode Switcher */}
          <div className="bg-slate-50 border rounded-2xl p-2.5 flex items-center justify-between" style={{ borderColor: 'var(--c-border-active, var(--c-border))' }}>
            <div>
              <span className="text-[10px] font-bold text-slate-700 block">Design Mode</span>
              <span className="text-[8px] text-slate-400 block font-mono">NEUBRUTALISM vs LIQUID</span>
            </div>
            <button
              onClick={toggleUiMode}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border
                ${uiMode === 'neubrutalist'
                  ? 'bg-amber-400 text-black border-black shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:scale-105 active:scale-95'}`}
            >
              {uiMode === 'neubrutalist' ? '🦖 NEUBRUTALISM' : '🌊 LIQUID FLUID'}
            </button>
          </div>

          {/* Study Focus Mode Switcher */}
          <div className="bg-slate-50 border rounded-2xl p-2.5 flex items-center justify-between" style={{ borderColor: 'var(--c-border-active, var(--c-border))' }}>
            <div>
              <span className="text-[10px] font-bold text-slate-700 block">Study Focus Mode</span>
              <span className="text-[8px] text-slate-400 block font-mono">VIGNETTE & CONCENTRATION</span>
            </div>
            <button
              onClick={() => setFocusMode(f => !f)}
              className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer border
                ${focusMode
                  ? 'bg-indigo-600 text-white border-indigo-700 shadow-[0_0_10px_rgba(99,102,241,0.5)] active:translate-x-0.5 active:translate-y-0.5'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:scale-105 active:scale-95'}`}
            >
              {focusMode ? '🧘 DEEP WORK ON' : '💤 FOCUS OFF'}
            </button>
          </div>

          {/* Theme/Weather Simulation presets (Dummy Selector) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="ds-section-label text-slate-400 block">Adaptive Atmosphere Presets</span>
              <button
                onClick={() => setIsAdaptive(a => !a)}
                className={`px-2 py-0.5 rounded-lg text-[8px] font-mono font-bold tracking-tight border transition-all cursor-pointer
                  ${isAdaptive 
                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 animate-pulse' 
                    : 'bg-slate-100 text-slate-400 border-slate-200'}`}
              >
                {isAdaptive ? '🤖 ADAPTIVE ACTIVE' : '🔒 LOCK MANUAL'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {themes.map(t => {
                const isActive = activeTheme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectTheme(t.id)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold cursor-pointer transition-all
                      ${isActive
                        ? 'bg-slate-50 border-slate-300 shadow-sm font-bold'
                        : 'bg-slate-100/30 border-slate-200/50 hover:bg-slate-100/50 text-slate-700'}`}
                  >
                    <t.icon className={`w-3.5 h-3.5 ${t.color}`} />
                    <span style={{ color: isActive ? 'var(--c-accent-active)' : 'inherit' }}>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound Preset Matrix */}
          <div>
            <span className="ds-section-label block mb-2 text-slate-400">Ambient Synthesizer Loops</span>
            <div className="grid grid-cols-2 gap-2">
              {presets.map(p => {
                const isActive = audioPreset === p.id && isPlaying;
                return (
                  <button
                    key={p.id}
                    onClick={() => playSoundPreset(p.id)}
                    aria-pressed={isActive}
                    title={p.desc}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all text-left cursor-pointer
                      ${isActive
                        ? 'border-slate-300 bg-slate-50 shadow-sm'
                        : 'border-slate-200/60 bg-slate-100/30 hover:bg-slate-100/50 text-slate-700'}`}
                  >
                    <div className={`p-1.5 rounded-lg border transition-all
                      ${isActive ? 'bg-slate-900 text-slate-50 border-slate-400/20' : 'bg-slate-100 text-slate-500 border-slate-200/40'}`}>
                      <p.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-800 leading-tight">{p.label}</p>
                      <p className="text-[8px] text-slate-400 font-mono mt-0.5 truncate">{p.id.toUpperCase()}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Visualizer & Level Slider */}
          <div className="bg-slate-100/30 border rounded-2xl p-3 flex flex-col gap-2.5" style={{ borderColor: 'var(--c-border-active, var(--c-border))' }}>
            {/* Midnight volume protective warning badge */}
            {isMidnightProtected && (
              <div className="bg-amber-500/10 border border-amber-500/35 rounded-xl px-2 py-1 flex items-center justify-between animate-pulse">
                <span className="text-[8px] font-bold text-amber-600 font-mono">🌙 MIDNIGHT EAR DEFENSE ON</span>
                <span className="text-[7px] text-amber-500 font-mono">Volume cap 40%</span>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleAudio}
                  aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
                  className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <div>
                  <p className="text-[10px] font-bold text-slate-700 leading-tight">
                    {isPlaying ? presets.find(p => p.id === audioPreset)?.label : 'Synthesizer Stopped'}
                  </p>
                  <p className="text-[8px] text-slate-400 font-mono mt-0.5">PRESS 'M' TO MUTE</p>
                </div>
              </div>

              {/* Dynamic animated wave visualizer */}
              {isPlaying && (
                <div className="flex items-end gap-0.5 h-3.5" aria-hidden="true">
                  <div className="w-0.5 bg-slate-700 animate-audio-wave h-3.5" style={{ animationDelay: '0.1s' }} />
                  <div className="w-0.5 bg-slate-700 animate-audio-wave h-2" style={{ animationDelay: '0.3s' }} />
                  <div className="w-0.5 bg-slate-700 animate-audio-wave h-4" style={{ animationDelay: '0.2s' }} />
                  <div className="w-0.5 bg-slate-700 animate-audio-wave h-2.5" style={{ animationDelay: '0.5s' }} />
                </div>
              )}
            </div>


            {/* Volume slider */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleAudio}
                aria-label={isPlaying ? 'Mute' : 'Unmute'}
                className="text-slate-400 hover:text-slate-600"
              >
                {volume === 0 || !isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                aria-label="Volume controller"
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800"
              />
              <span className="text-[9px] font-mono font-bold text-slate-500 w-6 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open atmosphere controller"
        aria-expanded={isOpen}
        className="btn-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, var(--c-accent-active, var(--c-primary-500)) 0%, var(--c-primary-600) 100%)',
          boxShadow: 'var(--shadow-glow-active, 0 4px 12px rgba(37, 99, 235, 0.3))'
        }}
      >
        {isOpen ? <ChevronDown className="w-5 h-5 text-white" /> : <ChevronUp className="w-5 h-5 text-white animate-bounce-slow" />}
      </button>
    </div>
  );
}
