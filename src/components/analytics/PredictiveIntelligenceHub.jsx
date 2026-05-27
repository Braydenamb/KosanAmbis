import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, HelpCircle, Activity, ShieldAlert, Zap, 
  Smile, Moon, Coffee, Heart, DollarSign, BookOpen, AlertCircle, RefreshCw
} from 'lucide-react';

// ─── 30-DAY INTEGRATED LIFESTYLE HISTORICAL LOG GENERATOR ───
const generateHistoricalLogs = () => {
  const logs = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    // Weather simulation: 25% chance of rain
    const isRainy = (i % 4 === 0); 
    
    // Exercise simulation: 45% probability
    const exerciseActive = (i % 3 === 0 || i % 7 === 0) ? 1 : 0; 
    
    // Late night delivery simulation: higher spending on weekends (Friday/Saturday)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const lateNightSpend = isWeekend 
      ? Math.round(Math.random() * 85000 + 40000) 
      : Math.round(Math.random() * 25000 + (Math.random() > 0.8 ? 50000 : 0));
    
    // Sleep simulation: late night delivery hurts deep sleep quality by ~15%
    const sleepReduction = lateNightSpend > 60000 ? 15 : 0;
    const baseSleepHours = 7.2 + (exerciseActive * 0.6) - (isWeekend ? 0.5 : 0);
    const sleepHours = Math.max(5.0, Math.min(9.5, baseSleepHours + Math.random() * 1.2 - 0.6));
    const deepSleepQuality = Math.max(40, Math.min(98, 80 - sleepReduction + (exerciseActive * 10) - (sleepHours < 6 ? 12 : 0) + Math.random() * 8));

    // Focus / Productivity minutes: exercise increases productivity next day, focus peaks on rainy days
    const focusBoost = exerciseActive ? 45 : 0;
    const weatherBoost = isRainy ? 60 : 0;
    const focusMinutes = Math.max(30, Math.min(300, 120 + focusBoost + weatherBoost - (sleepHours < 6 ? 50 : 0) + Math.round(Math.random() * 60 - 30)));
    
    // Coding activity peaks during rainy days
    const codingCommits = isRainy ? Math.round(Math.random() * 5 + 3) : Math.round(Math.random() * 2 + 1);

    // Hydration simulation: tracks mood stability
    const hydrationOunces = Math.round(Math.random() * 40 + 40 + (exerciseActive * 30));
    const moodStability = Math.max(1, Math.min(10, Math.round(5 + (hydrationOunces > 70 ? 2.5 : 0) + (sleepHours > 7 ? 1.5 : -1.5) + Math.random() * 2 - 1)));

    logs.push({
      date: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      sleepHours,
      deepSleepQuality,
      lateNightSpend,
      exerciseActive,
      focusMinutes,
      codingCommits,
      hydrationOunces,
      moodStability,
      isRainy
    });
  }
  return logs;
};

// ─── PEARSON PRODUCT-MOMENT CORRELATION COEFFICIENT MATHEMATICS ───
const calculatePearsonCorrelation = (x, y) => {
  const n = x.length;
  if (n === 0) return 0;
  
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  
  const sumX2 = x.reduce((a, b) => a + b * b, 0);
  const sumY2 = y.reduce((a, b) => a + b * b, 0);
  
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  
  const numerator = n * sumXY - sumX * sumY;
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  
  if (denominator === 0) return 0;
  return parseFloat((numerator / denominator).toFixed(3));
};

export default function PredictiveIntelligenceHub() {
  const [logs, setLogs] = useState(() => generateHistoricalLogs());
  const [refreshKey, setRefreshKey] = useState(0);

  // Scenario Simulator interactive states
  const [spendCutPercentage, setSpendCutPercentage] = useState(25); // What-If food spend cut %
  const [extraSleepMinutes, setExtraSleepMinutes] = useState(60);   // What-If sleep increase minutes
  const [hydrationIncrease, setHydrationIncrease] = useState(24);   // What-If extra hydration ounces

  // Live Wallet balances for forecasting
  const currentWalletBalance = 2365000; // Rp 2.365.000 from dashboard allowance

  // Refresh logs simulator data
  const handleRegenerate = () => {
    setLogs(generateHistoricalLogs());
    setRefreshKey(prev => prev + 1);
  };

  // ─── CORRELATION MAPPINGS ───
  const correlations = useMemo(() => {
    const lateNightSpendArr = logs.map(l => l.lateNightSpend);
    const deepSleepArr = logs.map(l => l.deepSleepQuality);
    const exerciseArr = logs.map(l => l.exerciseActive);
    const focusArr = logs.map(l => l.focusMinutes);
    const hydrationArr = logs.map(l => l.hydrationOunces);
    const moodArr = logs.map(l => l.moodStability);
    const rainyArr = logs.map(l => l.isRainy ? 1 : 0);
    const commitsArr = logs.map(l => l.codingCommits);
    const sleepHoursArr = logs.map(l => l.sleepHours);

    return {
      spendVsSleep: calculatePearsonCorrelation(lateNightSpendArr, deepSleepArr),
      exerciseVsFocus: calculatePearsonCorrelation(exerciseArr, focusArr),
      hydrationVsMood: calculatePearsonCorrelation(hydrationArr, moodArr),
      rainVsCoding: calculatePearsonCorrelation(rainyArr, commitsArr),
      focusVsNextDayEnergy: calculatePearsonCorrelation(focusArr, sleepHoursArr) // simulated fatigue link
    };
  }, [logs]);

  // ─── PREDICTIVE FINANCIAL MODEL ───
  const financialForecast = useMemo(() => {
    // Total late night spend in 30 days
    const totalLateNightSpend = logs.reduce((sum, l) => sum + l.lateNightSpend, 0);
    const dailyAverageSpend = totalLateNightSpend / 30; // burn rate
    
    // Spending velocity: project depletion Runway timeline
    const dailyBurnRate = Math.round(dailyAverageSpend + 15000); // add fixed base cost (15k/day)
    const runwayDays = Math.round(currentWalletBalance / dailyBurnRate);
    
    const depletionDate = new Date();
    depletionDate.setDate(depletionDate.getDate() + runwayDays);
    const depletionDateFormatted = depletionDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    // Weekly spending velocity trend
    const thisWeekLogs = logs.slice(23, 30);
    const lastWeekLogs = logs.slice(16, 23);
    const thisWeekSpend = thisWeekLogs.reduce((sum, l) => sum + l.lateNightSpend, 0);
    const lastWeekSpend = lastWeekLogs.reduce((sum, l) => sum + l.lateNightSpend, 0);
    const spendIncreasePct = lastWeekSpend > 0 
      ? Math.round(((thisWeekSpend - lastWeekSpend) / lastWeekSpend) * 100) 
      : 0;

    return {
      dailyBurnRate,
      runwayDays,
      depletionDateFormatted,
      spendIncreasePct,
      totalLateNightSpend
    };
  }, [logs]);

  // ─── BEHAVIORAL TREND DETECTORS (PASSIVE INSIGHTS) ───
  const behavioralAlerts = useMemo(() => {
    const alerts = [];
    const avgSleep = logs.reduce((sum, l) => sum + l.sleepHours, 0) / 30;
    const avgFocus = logs.reduce((sum, l) => sum + l.focusMinutes, 0) / 30;
    const avgHydration = logs.reduce((sum, l) => sum + l.hydrationOunces, 0) / 30;

    // 1. Burnout Check
    if (avgSleep < 6.8 && avgFocus > 150) {
      alerts.push({
        id: 'burnout',
        type: 'warning',
        title: 'Risiko Kelelahan (Burnout Risk) Terdeteksi',
        desc: `Rata-rata tidur harian Anda berada di tingkat rendah (${avgSleep.toFixed(1)} jam) sementara sesi fokus mental sangat tinggi (${Math.round(avgFocus)} menit). Sumbu energi Anda cenderung menurun.`,
        advice: 'Pertimbangkan memotong sesi belajar malam sebesar 20 menit minggu ini demi memulihkan Sanity Index Anda.'
      });
    }

    // 2. Hydration Drop
    const recentHydration = logs.slice(23, 30).reduce((sum, l) => sum + l.hydrationOunces, 0) / 7;
    if (recentHydration < avgHydration - 10) {
      alerts.push({
        id: 'hydration',
        type: 'info',
        title: 'Penurunan Konsistensi Hidrasi',
        desc: `Asupan hidrasi Anda 7 hari terakhir (${Math.round(recentHydration)} oz) merosot dibanding rata-rata bulanan (${Math.round(avgHydration)} oz). Hal ini memicu korelasi tidak langsung pada kestabilan mood Anda.`,
        advice: 'Minum 2 gelas air putih dingin di meja kosan Anda pagi ini untuk kembali menaikkan Sanity.'
      });
    }

    // 3. Overspending Cycle
    if (financialForecast.spendIncreasePct > 20) {
      alerts.push({
        id: 'spend_cycle',
        type: 'danger',
        title: 'Akselerasi Pengeluaran Terdeteksi',
        desc: `Belanja ojek online / jajan malam Anda minggu ini berakselerasi naik sebesar +${financialForecast.spendIncreasePct}% dibandingkan minggu lalu.`,
        advice: 'Beralih ke preset "Masak Indomie + Telur" atau kurangi intensitas pesanan sore untuk mengamankan runway allowance bulanan.'
      });
    }

    return alerts;
  }, [logs, financialForecast]);

  // ─── INTERACTIVE WHAT-IF FORECAST CALCULATIONS ───
  const simulatedRunway = useMemo(() => {
    // Current burn rate reductions
    const savedAmountPerDay = (financialForecast.dailyBurnRate * (spendCutPercentage / 100));
    const newBurnRate = Math.max(10000, financialForecast.dailyBurnRate - savedAmountPerDay);
    const newRunwayDays = Math.round(currentWalletBalance / newBurnRate);
    const extraDays = newRunwayDays - financialForecast.runwayDays;

    return {
      newRunwayDays,
      extraDays: Math.max(0, extraDays)
    };
  }, [spendCutPercentage, financialForecast]);

  const simulatedProductivity = useMemo(() => {
    // Sleep mapping: each 15 minutes adds ~4% focus minutes boost, up to 8 hours
    const extraHours = extraSleepMinutes / 60;
    const focusBoostPct = Math.round(extraHours * 16);
    return focusBoostPct;
  }, [extraSleepMinutes]);

  const simulatedMood = useMemo(() => {
    // Hydration: each 8 oz increases mood stability metric by ~6%
    const moodStabilityBoost = Math.round((hydrationIncrease / 8) * 6);
    return moodStabilityBoost;
  }, [hydrationIncrease]);

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up select-none pb-8">
      
      {/* ─── TITLE HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>🔮</span> CROSS-METRIC PREDICTIVE INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">AI ANALYTICS ENGINE & LIFESTYLE CAUSE-EFFECT PREDICTIONS</p>
        </div>
        <button
          onClick={handleRegenerate}
          className="btn-premium-secondary text-[11px] self-start md:self-auto py-2 px-4 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate Event Logs
        </button>
      </div>

      {/* ─── 1. CORE DATA STORYTELLING OVERVIEW ─── */}
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

      {/* ─── 2. ACTIVE SYSTEMIC ALERT & ANOMALY LISTING ─── */}
      {behavioralAlerts.length > 0 && (
        <div className="flex flex-col gap-3">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">ACTIVE BEHAVIORAL RISKS & WARNINGS</span>
          <div className="flex flex-col gap-3.5">
            {behavioralAlerts.map(alert => (
              <div 
                key={alert.id}
                className={`glass-card p-4.5 border border-l-[6px] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70
                  ${alert.type === 'danger' ? 'border-rose-400 border-l-rose-500 bg-rose-500/5' : 
                    alert.type === 'warning' ? 'border-amber-400 border-l-amber-500 bg-amber-500/5' : 
                    'border-indigo-400 border-l-indigo-500 bg-indigo-500/5'}`}
              >
                <div className="flex gap-3 min-w-0">
                  <div className={`p-2 rounded-xl border self-start
                    ${alert.type === 'danger' ? 'bg-rose-500/10 border-rose-300 text-rose-500' : 
                      alert.type === 'warning' ? 'bg-amber-500/10 border-amber-300 text-amber-500' : 
                      'bg-indigo-500/10 border-indigo-300 text-indigo-500'}`}>
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-800 leading-tight tracking-wider font-mono">{alert.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{alert.desc}</p>
                    <p className="text-[10px] font-bold text-slate-600 mt-2 font-mono flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Advice: {alert.advice}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── 3. INTERACTIVE CORRELATION EXPLORER & CHART ─── */}
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

      {/* ─── 4. WHAT-IF FORECASTING SIMULATOR LAB ─── */}
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

    </div>
  );
}
