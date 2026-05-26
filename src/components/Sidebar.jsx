import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { Flame, Droplet, Moon, Plus, Minus, User, Shield, Sparkles } from 'lucide-react';
import KineticCounter from './ui/KineticCounter';

export default function Sidebar({ collapsed = false }) {
  const {
    focusHours,
    waterIntake,
    setWaterIntake,
    sleepHours,
    setSleepHours,
    addToast,
    addXP
  } = useCharacter();

  const streakDays = 5;

  // 1. Calculate Status Mode based on focus hours
  let statusMode = { emoji: '😴', text: 'REBAHAN COZY', color: 'text-slate-500 bg-slate-100/60 border-slate-200' };
  if (focusHours >= 4.5) {
    statusMode = { emoji: '⚡', text: 'SUPER SLAYER', color: 'text-blue-600 bg-blue-500/10 border-blue-200/50 shadow-glow' };
  } else if (focusHours >= 2.0) {
    statusMode = { emoji: '🔥', text: 'AMBIS FOCUS', color: 'text-indigo-600 bg-indigo-500/10 border-indigo-200/50' };
  }

  // 3. Water Intake Status
  let waterStatus = "DEHIDRASI RINGAN";
  let waterColor = "text-rose-600 bg-rose-500/10 border-rose-200/50";
  if (waterIntake >= 6) {
    waterStatus = "HYDRATED KING 👑";
    waterColor = "text-blue-600 bg-blue-500/10 border-blue-200/50";
  } else if (waterIntake >= 3) {
    waterStatus = "DISPENSER WANDERING 💧";
    waterColor = "text-sky-600 bg-sky-500/10 border-sky-200/50";
  }

  // 4. Sleep Tracker Status
  let sleepStatus = "MANUSIA NORMAL";
  let sleepColor = "text-slate-600 bg-slate-500/10 border-slate-200/50";
  if (sleepHours < 5) {
    sleepStatus = "ZOMBI KOSAN 🧠";
    sleepColor = "text-rose-600 bg-rose-500/10 border-rose-200/50";
  } else if (sleepHours > 8) {
    sleepStatus = "TIDUR HIBERNASI 😴";
    sleepColor = "text-amber-600 bg-amber-500/10 border-amber-200/50";
  }

  const handleWaterChange = (change) => {
    setWaterIntake(prev => {
      const newVal = prev + change;
      const capped = newVal < 0 ? 0 : newVal > 12 ? 12 : newVal;
      if (change > 0) {
        addToast("💧 Glekk! Kebutuhan hidrasi sel otak terpenuhi.");
        addXP(5);
      }
      return capped;
    });
  };

  const handleSleepChange = (change) => {
    setSleepHours(prev => {
      const newVal = prev + change;
      const capped = newVal < 0 ? 0 : newVal > 24 ? 24 : Number(newVal.toFixed(1));
      if (change > 0) {
        addToast(`🌙 Rekaman tidur tersimpan (+${change} jam).`);
      }
      return capped;
    });
  };

  // Compact Render Mode for Responsive Collapsed State
  if (collapsed) {
    return (
      <aside className="w-full flex flex-col gap-4 items-center">
        {/* Brand Card - Icon only */}
        <div className="glass-card p-4 flex items-center justify-center relative overflow-hidden group w-14 h-14" title="KosanAmbis">
          <Shield className="w-6 h-6 text-brand-600 shrink-0" />
        </div>

        {/* State - Icon only */}
        <div className="glass-card p-4 flex items-center justify-center w-14 h-14" title={`Core Operating State: ${statusMode.text}`}>
          <span className="text-2xl shrink-0">{statusMode.emoji}</span>
        </div>

        {/* Streak - Icon only */}
        <div className="glass-card p-4 flex flex-col items-center justify-center w-14 h-14" title={`Streak Integrity: ${streakDays} Days`}>
          <Flame className="w-6 h-6 text-indigo-500 fill-indigo-400 shrink-0 animate-pulse" />
        </div>

        {/* Water - Icon only */}
        <div className="glass-card p-4 flex flex-col items-center justify-center w-14 h-14 gap-1" title={`Water Hydration: ${waterIntake} glasses`}>
          <Droplet className="w-6 h-6 text-blue-500 shrink-0" />
          <span className="text-[10px] font-bold font-mono text-slate-600 leading-none">{waterIntake}</span>
        </div>

        {/* Sleep - Icon only */}
        <div className="glass-card p-4 flex flex-col items-center justify-center w-14 h-14 gap-1" title={`Sleep Monitors: ${sleepHours} hours`}>
          <Moon className="w-6 h-6 text-indigo-500 shrink-0" />
          <span className="text-[10px] font-bold font-mono text-slate-600 leading-none">{sleepHours}</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      {/* 0. BRAND CARD */}
      <div className="glass-card p-6 flex flex-col gap-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-200/25 rounded-full blur-2xl group-hover:bg-brand-300/35 transition-all duration-300"></div>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-600 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-slate-800 leading-none tracking-tight">KosanAmbis</h2>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-2 font-mono">LIFE CENTER v2.0</span>
          </div>
        </div>
      </div>

      {/* 1. STATUS MODE */}
      <div className="glass-card p-5 flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
          <User className="w-4 h-4 text-brand-500" />
          CORE OPERATING STATE
        </h3>
        <div className={`flex items-center gap-3.5 p-4 rounded-2xl border ${statusMode.color} transition-all duration-300`}>
          <span className="text-2xl">{statusMode.emoji}</span>
          <div>
            <div className="text-[8px] font-black uppercase tracking-widest opacity-60 font-mono">CURRENT STATE</div>
            <div className="font-extrabold text-slate-800 text-sm leading-tight mt-1">{statusMode.text}</div>
          </div>
        </div>
      </div>

      {/* 2. STREAK MODE AMBIS */}
      <div className="glass-card p-5 flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
          <Flame className="w-4 h-4 text-brand-500" />
          STREAK INTEGRITY
        </h3>
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-pulse">
              <Flame className="w-7 h-7 text-indigo-500 fill-indigo-400" />
            </div>
            <div>
              <div className="text-xl font-extrabold text-slate-800 leading-none">
                <KineticCounter value={streakDays} /> Days
              </div>
              <div className="text-[9px] font-bold text-slate-400 mt-2 block font-mono">CONSISTENCY STATUS</div>
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden mt-1 border border-white/50">
          <div 
            className="bg-brand-500 h-full rounded-full transition-all duration-500" 
            style={{ width: `${Math.min((streakDays / 7) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-widest font-mono">
          <span>DAY 0</span>
          <span>GOAL: 7 DAYS</span>
        </div>
      </div>

      {/* 3. WATER INTAKE TRACKER */}
      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Droplet className="w-4 h-4 text-blue-500" />
            WATER HYDRATION
          </h3>
          <span className={`text-[8px] px-2 py-0.5 rounded-full font-black border font-mono ${waterColor} transition-colors duration-300`}>
            {waterStatus}
          </span>
        </div>

        <div className="flex items-center justify-between bg-white/40 p-2.5 rounded-xl border border-white/60">
          <button 
            onClick={() => handleWaterChange(-1)}
            className="p-1 hover:bg-slate-200 rounded-lg text-rose-500 hover:text-rose-600 active:scale-90 transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <div className="text-xl font-extrabold text-slate-800 leading-none font-mono">
              <KineticCounter value={waterIntake} /> <span className="text-[10px] font-normal text-slate-404">/ 8 gls</span>
            </div>
          </div>

          <button 
            onClick={() => handleWaterChange(1)}
            className="p-1 hover:bg-slate-200 rounded-lg text-brand-600 hover:text-brand-700 active:scale-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar Water */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden border border-white/50">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((waterIntake / 8) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. SLEEP TRACKER */}
      <div className="glass-card p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Moon className="w-4 h-4 text-indigo-500" />
            SLEEP MONITORS
          </h3>
        </div>

        <div className="flex items-center justify-between bg-white/40 p-2.5 rounded-xl border border-white/60">
          <button 
            onClick={() => handleSleepChange(-0.5)}
            className="p-1 hover:bg-slate-200 rounded-lg text-rose-500 hover:text-rose-600 active:scale-90 transition-all cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <div className="text-xl font-extrabold text-slate-800 leading-none font-mono">
              <KineticCounter value={sleepHours} /> <span className="text-xs font-normal text-slate-400">Hrs</span>
            </div>
          </div>

          <button 
            onClick={() => handleSleepChange(0.5)}
            className="p-1 hover:bg-slate-200 rounded-lg text-brand-600 hover:text-brand-700 active:scale-90 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className={`p-2 rounded-xl border text-[9px] font-black text-center uppercase tracking-wider font-mono ${sleepColor} transition-colors duration-300`}>
          {sleepStatus}
        </div>
      </div>
    </aside>
  );
}
