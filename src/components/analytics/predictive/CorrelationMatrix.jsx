import React from 'react';
import { Moon, Zap, Smile, Coffee, BookOpen } from 'lucide-react';

export default function CorrelationMatrix({ correlations, currentWalletBalance, financialForecast }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      
      {/* Spending Burndown SVG Curve Chart */}
      <div className="lg:col-span-8 glass-card p-5 flex flex-col gap-4 border-brand-200/50 bg-white/70">
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase font-mono">PROJECTED RUNWAY BURNDOWN CURVE</h3>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">30-DAY PREDICTIVE LIQUIDITY ACCELERATION DECAY</p>
        </div>

        {/* SVG Burn-down curve */}
        <div className="w-full h-44 bg-slate-50/50 border rounded-2xl p-2.5 relative flex items-center justify-center">
          
          {/* Y axis helpers */}
          <div className="absolute left-3 top-3 bottom-3 flex flex-col justify-between text-[8px] text-slate-400 font-mono pointer-events-none">
            <span>Rp {currentWalletBalance.toLocaleString('id-ID')}</span>
            <span>Rp {(currentWalletBalance / 2).toLocaleString('id-ID')}</span>
            <span>Rp 0</span>
          </div>

          {/* burndown line path */}
          <svg className="w-full h-full" viewBox="0 0 500 150">
            <defs>
              <linearGradient id="burndownGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#599eff" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#599eff" stopOpacity="0.00" />
              </linearGradient>
            </defs>
            
            {/* Burndown shaded area */}
            <path 
              d={`M 0 15 L 120 40 L 250 85 L 380 120 L 500 150 L 500 150 L 0 150 Z`} 
              fill="url(#burndownGrad)" 
            />

            {/* Burndown linear path line */}
            <path 
              d={`M 0 15 L 120 40 L 250 85 L 380 120 L 500 150`} 
              fill="none" 
              stroke="#3b7fff" 
              strokeWidth="2.5" 
              strokeLinecap="round"
            />

            {/* Depletion warning dotted overlay */}
            <line x1="380" y1="0" x2="380" y2="150" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(15, 23, 42, 0.05)" strokeWidth="1" />
          </svg>

          {/* Visual labels on curve */}
          <div className="absolute right-6 bottom-3 bg-rose-500/10 border border-rose-500/25 rounded px-2 py-0.5 text-[8px] font-mono text-rose-600 font-bold animate-pulse pointer-events-none">
            Projected Balance Empty
          </div>
          <div className="absolute left-6 top-4 bg-slate-900/10 border border-slate-900/25 rounded px-2 py-0.5 text-[8px] font-mono text-slate-800 font-bold pointer-events-none">
            Balance: Rp {currentWalletBalance.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 text-center mt-1">
          <div className="bg-slate-50 border rounded-2xl p-2.5">
            <span className="text-[8px] font-bold text-slate-400 block font-mono">MONTHLY BURN EXT.</span>
            <span className="text-xs font-black text-slate-800 font-mono">Rp {(financialForecast.dailyBurnRate * 30).toLocaleString('id-ID')}</span>
          </div>
          <div className="bg-slate-50 border rounded-2xl p-2.5">
            <span className="text-[8px] font-bold text-slate-400 block font-mono">BURN VELOCITY</span>
            <span className="text-xs font-black text-indigo-600 font-mono">{(currentWalletBalance / 30 / 1000).toFixed(1)}k/Day</span>
          </div>
          <div className="bg-slate-50 border rounded-2xl p-2.5">
            <span className="text-[8px] font-bold text-slate-400 block font-mono">WEATHER INDEX</span>
            <span className="text-xs font-black text-emerald-600 font-mono">Stable</span>
          </div>
          <div className="bg-slate-50 border rounded-2xl p-2.5">
            <span className="text-[8px] font-bold text-slate-400 block font-mono">CONFIDENCE INTERVAL</span>
            <span className="text-xs font-black text-slate-700 font-mono">92.4% (R-High)</span>
          </div>
        </div>
      </div>

      {/* Dynamic Correlations Matrix Explorer */}
      <div className="lg:col-span-4 glass-card p-5 flex flex-col gap-4 border-brand-200/50 bg-white/70">
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase font-mono">CORRELATIONS SPECTRUM MATRIX</h3>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">PEARSON COEFFICIENTS EVENT LINK CLUSTERS</p>
        </div>

        <div className="flex flex-col gap-2.5">
          {[
            { id: 'spendVsSleep', label: 'Late-night Spend vs Sleep Quality', val: correlations.spendVsSleep, icon: Moon, desc: 'Negative (Late dinners hurt deep sleep)', type: 'neg' },
            { id: 'exerciseVsFocus', label: 'Exercise vs Focus Sesi', val: correlations.exerciseVsFocus, icon: Zap, desc: 'Positive (Gym increases concentration)', type: 'pos' },
            { id: 'hydrationVsMood', label: 'Hydration Ounces vs Mood Stability', val: correlations.hydrationVsMood, icon: Smile, desc: 'Positive (Hydration balances mood swings)', type: 'pos' },
            { id: 'rainVsCoding', label: 'Rainy Days vs Coding Commits', val: correlations.rainVsCoding, icon: Coffee, desc: 'Positive (Lofi rain fuels code workflow)', type: 'pos' },
            { id: 'focusVsNextDayEnergy', label: 'Focus Sesi vs Sleep Jam', val: correlations.focusVsNextDayEnergy, icon: BookOpen, desc: 'Negative (Extremely long study causes fatigue)', type: 'neg' },
          ].map(c => (
            <div 
              key={c.id} 
              className="bg-slate-50/50 border rounded-2xl p-3 flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-white border shrink-0 text-slate-500">
                  <c.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 leading-tight truncate">{c.label}</p>
                  <p className="text-[8px] text-slate-400 font-mono mt-0.5 truncate uppercase">{c.desc}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`font-extrabold text-xs font-mono
                  ${c.type === 'pos' ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {c.val > 0 ? `+${c.val}` : c.val}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
