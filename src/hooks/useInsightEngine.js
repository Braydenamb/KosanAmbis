/**
 * useInsightEngine — Local AI Behavioral Pattern Detection
 * Analyzes localStorage daily history to surface meaningful life insights.
 * Runs entirely client-side. No backend, no AI API calls.
 */

import { useMemo } from 'react';

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}
function sum(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0);
}

// Load daily snapshots from localStorage
export function loadDailySnapshots() {
  try {
    const raw = localStorage.getItem('zf_daily_snapshots');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

// Persist a daily snapshot
export function saveTodaySnapshot(snapshot) {
  try {
    const snapshots = loadDailySnapshots();
    const today = new Date().toISOString().split('T')[0];
    const existing = snapshots.findIndex(s => s.date === today);
    
    const entry = { date: today, ...snapshot, updatedAt: Date.now() };
    
    if (existing >= 0) {
      snapshots[existing] = { ...snapshots[existing], ...entry };
    } else {
      snapshots.push(entry);
    }
    
    // Keep only last 60 days
    const sorted = snapshots
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 60);
    
    localStorage.setItem('zf_daily_snapshots', JSON.stringify(sorted));
  } catch (e) {
    console.warn('InsightEngine: could not save snapshot', e);
  }
}

// ─── INSIGHT DETECTORS ────────────────────────────────────────────────────────

function detectBurnoutRisk(snapshots) {
  const last7 = snapshots.slice(0, 7);
  if (last7.length < 4) return null;

  const avgSleep = avg(last7.map(d => d.sleepHours || 0));
  const avgFocus = avg(last7.map(d => d.focusHours || 0));
  const highWorkDays = last7.filter(d => (d.focusHours || 0) >= 5).length;

  if (avgFocus >= 5 && avgSleep < 6.5 && highWorkDays >= 4) {
    return {
      id: 'burnout_risk',
      type: 'BURNOUT_WARNING',
      severity: 'high',
      emoji: '🚨',
      title: 'Risiko Burnout Terdeteksi',
      message: `${highWorkDays} hari kerja intensif + rata-rata tidur hanya ${avgSleep.toFixed(1)} jam. Pola berbahaya.`,
      suggestion: 'Ambil 1 hari istirahat total besok. Burnout = produktivitas -40% selama 2 minggu ke depan.',
      actionLabel: 'Aktifkan Rest Mode',
      actionType: 'rest_mode',
    };
  }

  if (avgSleep < 5.5 && last7.length >= 3) {
    return {
      id: 'sleep_debt',
      type: 'SLEEP_DEBT',
      severity: 'medium',
      emoji: '😴',
      title: 'Sleep Debt Menumpuk',
      message: `Rata-rata tidur ${avgSleep.toFixed(1)} jam / malam dalam 7 hari terakhir. Di bawah kebutuhan optimal.`,
      suggestion: 'Tidur 8 jam malam ini untuk mulai recovery. Sleep debt membutuhkan 4-5 hari untuk pulih penuh.',
      actionLabel: null,
    };
  }

  return null;
}

function detectSpendingAnomaly(snapshots, currentExpenses) {
  const last7 = snapshots.slice(0, 7);
  const prev7 = snapshots.slice(7, 14);
  if (last7.length < 3 || prev7.length < 3) return null;

  const thisWeekTotal = sum(last7.map(d => d.dailySpending || 0));
  const lastWeekTotal = sum(prev7.map(d => d.dailySpending || 0));

  if (lastWeekTotal > 0 && thisWeekTotal > lastWeekTotal * 1.5) {
    const spike = thisWeekTotal - lastWeekTotal;
    const spikeK = Math.round(spike / 1000);
    return {
      id: 'spending_spike',
      type: 'SPENDING_SPIKE',
      severity: 'medium',
      emoji: '💸',
      title: 'Lonjakan Pengeluaran',
      message: `Pengeluaran minggu ini naik +${spikeK}k dibanding minggu lalu. Lebih dari 50% peningkatan.`,
      suggestion: 'Aktifkan Budget Awareness Mode untuk minggu ini?',
      actionLabel: 'Lihat Detail',
      actionType: 'show_spending',
    };
  }

  return null;
}

function detectSleepProductivityCorrelation(snapshots) {
  const qualified = snapshots.filter(d => d.sleepHours != null && d.productivityScore != null);
  if (qualified.length < 10) return null;

  const goodSleep = qualified.filter(d => d.sleepHours >= 7);
  const badSleep  = qualified.filter(d => d.sleepHours < 6);
  if (goodSleep.length < 4 || badSleep.length < 3) return null;

  const goodAvg = avg(goodSleep.map(d => d.productivityScore));
  const badAvg  = avg(badSleep.map(d => d.productivityScore));
  const delta   = Math.round(((goodAvg - badAvg) / Math.max(badAvg, 1)) * 100);

  if (delta > 20) {
    return {
      id: 'sleep_productivity_correlation',
      type: 'POSITIVE_INSIGHT',
      severity: 'info',
      emoji: '📈',
      title: 'Data: Tidur = Produktivitas',
      message: `Berdasarkan ${qualified.length} hari data: kamu ${delta}% lebih produktif setelah tidur 7+ jam.`,
      suggestion: `Target tidur malam ini: 7-8 jam untuk performa optimal besok.`,
      actionLabel: null,
    };
  }
  return null;
}

function detectCaffeineOveruse(snapshots, currentExpenses) {
  const last7 = snapshots.slice(0, 7);
  if (last7.length < 3) return null;

  const coffeeDays = last7.filter(d => (d.coffeeCount || 0) >= 3).length;
  const avgSleep = avg(last7.map(d => d.sleepHours || 7));

  if (coffeeDays >= 4 && avgSleep < 6.5) {
    return {
      id: 'caffeine_sleep_trap',
      type: 'HABIT_LOOP',
      severity: 'medium',
      emoji: '☕',
      title: 'Caffeine-Sleep Loop Terdeteksi',
      message: `${coffeeDays} hari dalam 7 hari terakhir: 3+ kopi/hari dengan tidur rata-rata ${avgSleep.toFixed(1)} jam.`,
      suggestion: 'Pola berbahaya: kopi kompensasi tidur kurang, tidur kurang karena kafein. Kurangi kopi setelah jam 2 siang.',
      actionLabel: null,
    };
  }
  return null;
}

function detectProductivityStreak(snapshots) {
  let streak = 0;
  for (const day of snapshots) {
    if ((day.productivityScore || 0) >= 60) {
      streak++;
    } else {
      break;
    }
  }

  if (streak >= 5) {
    return {
      id: 'productivity_streak',
      type: 'ACHIEVEMENT',
      severity: 'positive',
      emoji: '🔥',
      title: `${streak} Hari Streak Produktif!`,
      message: `Kamu produktif ${streak} hari berturut-turut. Konsistensi ini yang membedakan ambisius dan biasa-biasa.`,
      suggestion: streak >= 7 ? 'Ambil reward kecil untuk rayakan 7-day streak!' : null,
      actionLabel: streak >= 7 ? 'Klaim Reward' : null,
      actionType: 'claim_reward',
    };
  }
  return null;
}

function detectInactivityRisk(snapshots) {
  const last3 = snapshots.slice(0, 3);
  if (last3.length < 3) return null;

  const avgScore = avg(last3.map(d => d.productivityScore || 0));
  if (avgScore < 20) {
    return {
      id: 'inactivity_risk',
      type: 'NUDGE',
      severity: 'low',
      emoji: '💤',
      title: '3 Hari Produktivitas Rendah',
      message: `Rata-rata skor produktivitas 3 hari terakhir: ${Math.round(avgScore)}/100. Mulai dari langkah kecil.`,
      suggestion: 'Mulai dengan 1 tugas kecil hari ini. Momentum dimulai dari satu langkah.',
      actionLabel: null,
    };
  }
  return null;
}

function detectBudgetHealthy(walletBalance, monthlyAllowance) {
  if (!monthlyAllowance || !walletBalance) return null;
  const ratio = walletBalance / monthlyAllowance;
  const today = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const monthProgress = today / daysInMonth;

  // If 70%+ of month is over but 60%+ of allowance remains → great!
  if (monthProgress >= 0.7 && ratio >= 0.6) {
    return {
      id: 'budget_healthy',
      type: 'ACHIEVEMENT',
      severity: 'positive',
      emoji: '💚',
      title: 'Keuangan Sehat Bulan Ini!',
      message: `${Math.round(monthProgress * 100)}% bulan sudah berlalu, masih punya ${Math.round(ratio * 100)}% uang bulanan. Mantap!`,
      suggestion: null,
      actionLabel: null,
    };
  }

  // If early in month but already spent 60%+ → warning
  if (monthProgress <= 0.4 && ratio <= 0.4) {
    return {
      id: 'budget_warning',
      type: 'SPENDING_SPIKE',
      severity: 'high',
      emoji: '⚠️',
      title: 'Pengeluaran Terlalu Cepat',
      message: `Baru ${Math.round(monthProgress * 100)}% bulan berjalan, tapi sudah habis ${Math.round((1 - ratio) * 100)}% uang bulanan.`,
      suggestion: 'Kurangi pengeluaran non-esensial sekarang. Uang kos jangan sampai kering.',
      actionLabel: null,
    };
  }

  return null;
}

// ─── MAIN HOOK ────────────────────────────────────────────────────────────────
/**
 * useInsightEngine — Computes behavioral insights from history + current state.
 * @param {Object} characterState - Current values from CharacterContext
 */
export function useInsightEngine(characterState) {
  const {
    sleepHours,
    focusHours,
    walletBalance,
    walletAllowance,
    walletExpenses,
  } = characterState || {};

  const snapshots = useMemo(() => loadDailySnapshots(), []);

  const insights = useMemo(() => {
    const detected = [
      detectBurnoutRisk(snapshots),
      detectSpendingAnomaly(snapshots, walletExpenses),
      detectSleepProductivityCorrelation(snapshots),
      detectCaffeineOveruse(snapshots, walletExpenses),
      detectProductivityStreak(snapshots),
      detectInactivityRisk(snapshots),
      detectBudgetHealthy(walletBalance, walletAllowance),
    ].filter(Boolean);

    // Sort by severity: high → medium → positive → info → low
    const severityOrder = { high: 0, medium: 1, positive: 2, info: 3, low: 4 };
    return detected.sort(
      (a, b) => (severityOrder[a.severity] ?? 5) - (severityOrder[b.severity] ?? 5)
    );
  }, [snapshots, walletBalance, walletAllowance, walletExpenses]);

  return { insights, snapshotCount: snapshots.length };
}
