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
  return (
    <aside className={`w-full flex flex-col gap-4 lg:gap-6 overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'items-center' : 'items-stretch'}`}>
      {/* 0. BRAND CARD */}
      <div className={`glass-card relative group transition-all duration-300 ease-in-out w-full ${collapsed ? 'p-0 items-center justify-center h-14 max-w-[56px] rounded-full overflow-hidden mx-auto' : 'p-6 flex flex-col gap-4 overflow-hidden'}`} title={collapsed ? "KosanAmbis" : ""}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-200/25 rounded-full blur-2xl group-hover:bg-brand-300/35 transition-all duration-300"></div>
        <div className={`flex items-center w-full min-w-0 transition-all duration-500 ease-in-out ${collapsed ? 'justify-center h-14 w-14 shrink-0' : 'gap-4 justify-start'}`}>
          <div className={`transition-all duration-500 shrink-0 flex items-center justify-center ${collapsed ? 'p-0 bg-transparent border-transparent text-brand-600 w-14 h-14' : 'p-3 bg-brand-500/10 border border-brand-500/20 rounded-2xl text-brand-600 shadow-sm'}`}>
            <Shield className="w-6 h-6" />
          </div>
          <div className={`transition-all duration-500 ease-in-out min-w-0 ${collapsed ? 'opacity-0 max-w-0 pointer-events-none translate-x-3' : 'opacity-100 max-w-xs translate-x-0'}`}>
            <h2 className="font-extrabold text-lg text-slate-800 leading-none tracking-tight truncate">KosanAmbis</h2>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block mt-2 font-mono whitespace-nowrap">LIFE CENTER v2.0</span>
          </div>
        </div>
      </div>

      {/* 1. STATUS MODE */}
      <div className={`glass-card flex flex-col transition-all duration-300 ease-in-out w-full ${collapsed ? 'p-0 items-center justify-center h-14 max-w-[56px] rounded-full overflow-hidden mx-auto' : 'p-5 gap-3'}`} title={collapsed ? `Core Operating State: ${statusMode.text}` : ''}>
        
        {/* COLLAPSED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex items-center justify-center ${collapsed ? 'opacity-100 max-h-14 w-14 h-14' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}`}>
          <span className="text-2xl scale-110">{statusMode.emoji}</span>
        </div>

        {/* EXPANDED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-3 w-full ${collapsed ? 'opacity-0 max-h-0 pointer-events-none overflow-hidden' : 'opacity-100 max-h-40'}`}>
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <User className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">CORE OPERATING STATE</span>
          </h3>
          <div className={`flex items-center gap-3.5 p-4 rounded-2xl border ${statusMode.color} transition-all duration-300 w-full`}>
            <span className="text-2xl shrink-0">{statusMode.emoji}</span>
            <div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-60 font-mono">CURRENT STATE</div>
              <div className="font-extrabold text-slate-800 text-sm leading-tight mt-1 truncate">{statusMode.text}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STREAK MODE AMBIS */}
      <div className={`glass-card flex flex-col transition-all duration-300 ease-in-out w-full ${collapsed ? 'p-0 items-center justify-center h-14 max-w-[56px] rounded-full overflow-hidden mx-auto' : 'p-5 gap-3'}`} title={collapsed ? `Streak Integrity: ${streakDays} Days` : ''}>
        
        {/* COLLAPSED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex items-center justify-center ${collapsed ? 'opacity-100 max-h-14 w-14 h-14' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}`}>
          <Flame className="w-7 h-7 text-indigo-500 fill-indigo-400 shrink-0 animate-pulse" />
        </div>

        {/* EXPANDED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-3 w-full ${collapsed ? 'opacity-0 max-h-0 pointer-events-none overflow-hidden' : 'opacity-100 max-h-48'}`}>
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Flame className="w-4 h-4 text-brand-500 shrink-0" />
            <span className="truncate">STREAK INTEGRITY</span>
          </h3>
          <div className="flex items-center justify-start min-w-0 w-full">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl animate-pulse shrink-0 flex items-center justify-center">
              <Flame className="w-7 h-7 text-indigo-500 fill-indigo-400 shrink-0" />
            </div>
            <div className="ml-4 min-w-0">
              <div className="text-xl font-extrabold text-slate-800 leading-none whitespace-nowrap">
                <KineticCounter value={streakDays} /> Days
              </div>
              <div className="text-[9px] font-bold text-slate-400 mt-2 block font-mono whitespace-nowrap">CONSISTENCY STATUS</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden mt-1 border border-white/50">
            <div 
              className="bg-brand-500 h-full rounded-full transition-all duration-500" 
              style={{ width: `${Math.min((streakDays / 7) * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-slate-400 font-black uppercase tracking-widest font-mono w-full">
            <span>DAY 0</span>
            <span>GOAL: 7 DAYS</span>
          </div>
        </div>
      </div>

      {/* 3. WATER INTAKE TRACKER */}
      <div className={`glass-card flex flex-col transition-all duration-300 ease-in-out w-full ${collapsed ? 'relative overflow-visible p-0 items-center justify-center h-14 max-w-[56px] rounded-full gap-0 mx-auto' : 'p-5 gap-4'}`} title={collapsed ? `Water Hydration: ${waterIntake} glasses` : ''}>
        
        {/* COLLAPSED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex items-center justify-center relative ${collapsed ? 'opacity-100 max-h-14 w-14 h-14' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}`}>
          <Droplet className="w-7 h-7 text-blue-500 shrink-0" />
          {collapsed && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-blue-500 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-md border border-white animate-pop-spring z-10">
              {waterIntake}
            </div>
          )}
        </div>

        {/* EXPANDED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-4 w-full ${collapsed ? 'opacity-0 max-h-0 pointer-events-none overflow-hidden' : 'opacity-100 max-h-48'}`}>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono min-w-0 truncate">
              <Droplet className="w-4 h-4 text-blue-500 shrink-0" />
              <span className="truncate">WATER HYDRATION</span>
            </h3>
            <span className={`text-[8px] px-2 py-0.5 rounded-full font-black border font-mono shrink-0 ${waterColor} transition-colors duration-300`}>
              {waterStatus}
            </span>
          </div>

          <div className="flex items-center justify-between bg-white/40 p-2.5 rounded-xl border border-white/60 w-full">
            <button 
              onClick={() => handleWaterChange(-1)}
              className="p-1 hover:bg-slate-200 rounded-lg text-rose-500 hover:text-rose-600 active:scale-90 transition-all cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <div className="text-center">
              <div className="text-xl font-extrabold text-slate-800 leading-none font-mono">
                <KineticCounter value={waterIntake} /> <span className="text-[10px] font-normal text-slate-400">/ 8 gls</span>
              </div>
            </div>

            <button 
              onClick={() => handleWaterChange(1)}
              className="p-1 hover:bg-slate-200 rounded-lg text-brand-600 hover:text-brand-700 active:scale-90 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden border border-white/50">
            <div 
              className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${Math.min((waterIntake / 8) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. SLEEP TRACKER */}
      <div className={`glass-card flex flex-col transition-all duration-300 ease-in-out w-full ${collapsed ? 'relative overflow-visible p-0 items-center justify-center h-14 max-w-[56px] rounded-full gap-0 mx-auto' : 'p-5 gap-4'}`} title={collapsed ? `Sleep Monitors: ${sleepHours} hours` : ''}>
        
        {/* COLLAPSED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex items-center justify-center relative ${collapsed ? 'opacity-100 max-h-14 w-14 h-14' : 'opacity-0 max-h-0 pointer-events-none overflow-hidden'}`}>
          <Moon className="w-7 h-7 text-indigo-500 shrink-0" />
          {collapsed && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-indigo-500 text-white font-mono text-[9px] font-black flex items-center justify-center shadow-md border border-white animate-pop-spring z-10">
              {sleepHours}
            </div>
          )}
        </div>

        {/* EXPANDED VIEW */}
        <div className={`transition-all duration-500 ease-in-out flex flex-col gap-4 w-full ${collapsed ? 'opacity-0 max-h-0 pointer-events-none overflow-hidden' : 'opacity-100 max-h-48'}`}>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono min-w-0 truncate">
              <Moon className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="truncate">SLEEP MONITORS</span>
            </h3>
          </div>

          <div className="flex items-center justify-between bg-white/40 p-2.5 rounded-xl border border-white/60 w-full">
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

          <div className={`p-2 rounded-xl border text-[9px] font-black text-center uppercase tracking-wider font-mono ${sleepColor} transition-colors duration-300 w-full`}>
            {sleepStatus}
          </div>
        </div>
      </div>
    </aside>
  );
}
