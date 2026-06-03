import React from 'react';
import { DollarSign, Moon, Smile } from 'lucide-react';

export default function SimulatorLab({ 
  spendCutPercentage, setSpendCutPercentage, 
  extraSleepMinutes, setExtraSleepMinutes, 
  hydrationIncrease, setHydrationIncrease,
  simulatedRunway, simulatedProductivity, simulatedMood 
}) {
  return (
    <div className="glass-card p-5 border-brand-200/50 flex flex-col gap-5 bg-white/70">
      <div>
        <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase font-mono">🔮 WHAT-IF PREDICTIVE LAB & SCENARIO SANDBOX</h3>
        <p className="text-[10px] text-slate-400 font-mono mt-0.5">INTERACT WITH SLIDERS TO PROJEKT LIFESTYLE CAUSE-EFFECT IMPACT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Simulator 1: Cash cut */}
        <div className="bg-slate-50/50 border rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500 border border-emerald-100 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block font-mono">SANDBOX SCENARIO 1</span>
              <h4 className="text-xs font-black uppercase text-slate-700 leading-tight">Reduce late-night food delivery</h4>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Spend Cut:</span>
              <span className="font-mono text-emerald-600">{spendCutPercentage}% Less</span>
            </div>
            <input 
              type="range"
              min="0"
              max="80"
              step="5"
              value={spendCutPercentage}
              onChange={e => setSpendCutPercentage(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-2.5 mt-2 flex flex-col gap-0.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 font-mono block">PROJECTED FIN. EXTRA RUNWAY:</span>
            <span className="text-sm font-black text-emerald-600 font-mono">+{simulatedRunway.extraDays} Hari Tambahan</span>
            <span className="text-[8px] text-slate-400 font-mono">Runway extend: {simulatedRunway.newRunwayDays} Days total</span>
          </div>
        </div>

        {/* Simulator 2: Extra Sleep */}
        <div className="bg-slate-50/50 border rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500 border border-indigo-100 shrink-0">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block font-mono">SANDBOX SCENARIO 2</span>
              <h4 className="text-xs font-black uppercase text-slate-700 leading-tight">Increase sleep duration</h4>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Extra Sleep:</span>
              <span className="font-mono text-indigo-600">+{extraSleepMinutes} Minutes</span>
            </div>
            <input 
              type="range"
              min="0"
              max="180"
              step="15"
              value={extraSleepMinutes}
              onChange={e => setExtraSleepMinutes(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-2.5 mt-2 flex flex-col gap-0.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 font-mono block">PROJECTED NEXT-DAY STUDY FOCUS:</span>
            <span className="text-sm font-black text-indigo-600 font-mono">+{simulatedProductivity}% Sesi Durasi</span>
            <span className="text-[8px] text-slate-400 font-mono">Confidence Level: 87.5% (High-R)</span>
          </div>
        </div>

        {/* Simulator 3: Water Intake */}
        <div className="bg-slate-50/50 border rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-500 border border-blue-100 shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 block font-mono">SANDBOX SCENARIO 3</span>
              <h4 className="text-xs font-black uppercase text-slate-700 leading-tight">Increase daily water intake</h4>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
              <span>Extra Intake:</span>
              <span className="font-mono text-blue-600">+{hydrationIncrease} oz (~3 Gelas)</span>
            </div>
            <input 
              type="range"
              min="0"
              max="64"
              step="8"
              value={hydrationIncrease}
              onChange={e => setHydrationIncrease(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-2.5 mt-2 flex flex-col gap-0.5 text-center">
            <span className="text-[9px] font-bold text-slate-400 font-mono block">PROJECTED DAILY MOOD STABILITY:</span>
            <span className="text-sm font-black text-blue-600 font-mono">+{simulatedMood}% Stabilitas Indeks</span>
            <span className="text-[8px] text-slate-400 font-mono">No false positive correlation risk detected</span>
          </div>
        </div>

      </div>
    </div>
  );
}
