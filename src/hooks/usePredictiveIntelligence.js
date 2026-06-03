import { useState, useMemo } from 'react';
import { generateHistoricalLogs } from '../data/dummyLogs';
import { calculatePearsonCorrelation } from '../utils/mathUtils';

export const usePredictiveIntelligence = () => {
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

  return {
    logs,
    refreshKey,
    handleRegenerate,
    currentWalletBalance,
    spendCutPercentage,
    setSpendCutPercentage,
    extraSleepMinutes,
    setExtraSleepMinutes,
    hydrationIncrease,
    setHydrationIncrease,
    correlations,
    financialForecast,
    behavioralAlerts,
    simulatedRunway,
    simulatedProductivity,
    simulatedMood
  };
};
