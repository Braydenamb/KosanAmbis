import React from 'react';
import { TrendingUp, TrendingDown, Activity, Smile, Moon, DollarSign } from 'lucide-react';

export default function PredictiveOverview({ financialForecast, correlations }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Burn Rate Allowance runway card */}
      <div className="glass-card p-5 flex flex-col justify-between border-brand-200/50 shadow-sm relative overflow-hidden bg-white/70">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-600 pointer-events-none">
          <DollarSign className="w-36 h-36" />
        </div>
        <div className="z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">FINANCIAL RUNWAY FORECAST</span>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-3xl font-black text-slate-800 leading-none">{financialForecast.runwayDays}</span>
            <span className="text-sm font-bold text-slate-500">Hari runway</span>
          </div>
          <p className="text-[11px] text-slate-500 font-content mt-2">
            Berdasarkan burn rate harian Anda saat ini, saldo allowance diproyeksikan habis pada tanggal:
          </p>
          <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl px-3 py-2 mt-3.5 text-center text-amber-700 font-mono font-bold text-xs">
            📅 {financialForecast.depletionDateFormatted}
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>DAILY BURN: Rp {financialForecast.dailyBurnRate.toLocaleString('id-ID')}</span>
          <span className={financialForecast.spendIncreasePct > 0 ? "text-rose-500 font-bold" : "text-emerald-500 font-bold"}>
            {financialForecast.spendIncreasePct > 0 ? `▲ +${financialForecast.spendIncreasePct}%` : '▼ 0%'}
          </span>
        </div>
      </div>

      {/* Primary Correlation highlight */}
      <div className="glass-card p-5 flex flex-col justify-between border-brand-200/50 shadow-sm relative overflow-hidden bg-white/70">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-600 pointer-events-none">
          <Moon className="w-36 h-36" />
        </div>
        <div className="z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">PRIMARY BEHAVIORAL INTERPRETATION</span>
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider mt-3.5 flex items-center gap-1.5 font-mono">
            <Moon className="w-4 h-4 text-indigo-500" />
            Late-night Spend vs Sleep Quality
          </h3>
          <p className="text-[11px] text-slate-500 font-content mt-2 leading-relaxed">
            Makan malam jajan ojek online di atas pukul 21:00 mengganggu kedalaman tidur rem harian Anda sebesar:
          </p>
          <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl px-3 py-2 mt-3.5 text-center text-rose-600 font-mono font-bold text-xs flex items-center justify-center gap-1">
            <TrendingDown className="w-4 h-4" /> 15% Penurunan Deep Sleep
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>PEARSON CORRELATION R:</span>
          <span className="font-extrabold text-indigo-600">{correlations.spendVsSleep}</span>
        </div>
      </div>

      {/* Anomaly / Alert Engine Card */}
      <div className="glass-card p-5 flex flex-col justify-between border-brand-200/50 shadow-sm relative overflow-hidden bg-white/70">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] text-brand-600 pointer-events-none">
          <Activity className="w-36 h-36" />
        </div>
        <div className="z-10">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">HEALTH & MOOD CORRELATION</span>
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider mt-3.5 flex items-center gap-1.5 font-mono">
            <Smile className="w-4 h-4 text-emerald-500" />
            Hydration vs Mood Stability
          </h3>
          <p className="text-[11px] text-slate-500 font-content mt-2 leading-relaxed">
            Konsistensi asupan air minum Anda terbukti menyeimbangkan gejolak mood harian kosan Anda:
          </p>
          <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-2 mt-3.5 text-center text-emerald-600 font-mono font-bold text-xs flex items-center justify-center gap-1">
            <TrendingUp className="w-4 h-4" /> +28% Stabilitas Mood
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span>PEARSON CORRELATION R:</span>
          <span className="font-extrabold text-emerald-600">+{correlations.hydrationVsMood}</span>
        </div>
      </div>

    </div>
  );
}
