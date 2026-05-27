/**
 * dummyAutomation.js — Dummy data for Phase 2, 3, 4
 * Simulates: Telegram bot history, GitHub activity, Health metrics
 */

// ─── PHASE 2: TELEGRAM BOT DUMMY HISTORY ─────────────────────────────────────
export const DUMMY_BOT_HISTORY = [
  { id: 1, from: 'user', text: 'makan warteg akbar 18k', time: '08:32', date: 'Hari ini' },
  { id: 2, from: 'bot', emoji: '🍽️', text: '✅ Makan 18k di Warteg Akbar tercatat!\n💰 Sisa: Rp 2.482.000\n📊 [████████░░] Budget makan 31%', time: '08:32' },
  { id: 3, from: 'user', text: 'kopi susu 22000', time: '10:15', date: 'Hari ini' },
  { id: 4, from: 'bot', emoji: '☕', text: '☕ Kopi Susu 22k tercatat!\n☕ Kopi ke-3 minggu ini = Rp 67.000\n💡 Tips: 12 kopi/bulan × 22k = Rp 264k. Worth it?', time: '10:15' },
  { id: 5, from: 'user', text: 'transferan ortu 500rb', time: '11:00', date: 'Hari ini' },
  { id: 6, from: 'bot', emoji: '💸', text: '🎉 Pemasukan +500k masuk!\n💰 Saldo naik ke Rp 2.982.000\n🧠 Sanity +15! Dompet sehat = jiwa tenang.', time: '11:00' },
  { id: 7, from: 'user', text: 'gojek ke kampus 18500', time: '12:55', date: 'Hari ini' },
  { id: 8, from: 'bot', emoji: '🚗', text: '🚗 Gojek 18.5k tercatat!\n💰 Sisa: Rp 2.963.500\n📊 Transport minggu ini: Rp 74.000', time: '12:55' },
  { id: 9, from: 'user', text: 'berapa duit gw?', time: '14:00', date: 'Hari ini' },
  { id: 10, from: 'bot', emoji: '💰', text: '💰 SALDO KOSAN AMBIS\nBalance: Rp 2.963.500\nKeluar bulan ini: Rp 536.500\nTagihan pending: Rp 990.000\nSisa aman: Rp 1.973.500\nStatus: 💚 FINANCIAL HEALTH OPTIMAL', time: '14:00' },
  { id: 11, from: 'user', text: 'spotify 54990', time: '15:20', date: 'Kemarin' },
  { id: 12, from: 'bot', emoji: '🎮', text: '🎧 Spotify 54.99k tercatat!\nKategori: Hiburan\n📅 Langganan bulanan terdeteksi. Auto-remind bulan depan ya!', time: '15:20' },
  { id: 13, from: 'user', text: 'gimana pengeluaran minggu ini?', time: '19:00', date: 'Kemarin' },
  { id: 14, from: 'bot', emoji: '📊', text: '📊 WEEKLY SPENDING REPORT\n\n🍽️ Makan: Rp 287.000 (45%)\n☕ Kopi: Rp 145.000 (23%)\n🚗 Transport: Rp 89.000 (14%)\n🎮 Hiburan: Rp 54.990 (9%)\n📌 Lainnya: Rp 60.510 (9%)\n\nTotal: Rp 636.500\nBudget: Rp 800.000 (79% terpakai)\n\n💡 Kopi naik 35% dari minggu lalu!', time: '19:00' },
];

export const BOT_QUICK_REPLIES = [
  { label: '💰 Saldo', command: 'berapa duit gw?' },
  { label: '📊 Minggu ini', command: 'gimana pengeluaran minggu ini?' },
  { label: '📋 Tagihan', command: 'tagihan apa aja?' },
  { label: '🔔 Insight', command: 'tips hemat bulan ini?' },
];

export const BOT_AUTO_RESPONSES = {
  'berapa duit': (balance) => `💰 SALDO KOSAN AMBIS\nBalance: ${formatIDR(balance)}\nStatus: ${balance > 1500000 ? '💚 FINANCIAL HEALTH OPTIMAL' : balance > 500000 ? '🟡 ECONOMY SAVING STATE' : '🔴 LIQUIDITY CRITICAL'}`,
  'tagihan': () => `📋 TAGIHAN AKTIF\n⚠️ Token Listrik: Rp 100.000 (1 hari lagi)\n⏳ Kos Bulanan: Rp 800.000 (4 hari lagi)\n📱 Paket Data: Rp 75.000 (12 hari lagi)\n\nTotal pending: Rp 975.000`,
  'tips hemat': () => `💡 SPENDING TIPS MINGGU INI\n\n1. Kurangi kopi luar → hemat ~Rp 50k/minggu\n2. Gojek bisa dikurangi 2x → hemat ~Rp 37k\n3. Masak sendiri 2x seminggu → hemat ~Rp 60k\n\nPotensi hemat: Rp 147k/minggu = Rp 588k/bulan 🔥`,
  'gimana': () => `📊 WEEKLY SPENDING REPORT\n\n🍽️ Makan: Rp 287.000 (45%)\n☕ Kopi: Rp 145.000 (23%)\n🚗 Transport: Rp 89.000 (14%)\n\nTotal: Rp 636.500 / Rp 800.000 budget`,
};

function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

// ─── PHASE 3: GITHUB & PRODUCTIVITY DUMMY DATA ────────────────────────────────
export const DUMMY_GITHUB = {
  username: 'braydenamb',
  avatar: '👨‍💻',
  totalCommits: 347,
  currentStreak: 5,
  longestStreak: 12,
  weeklyCommits: [3, 7, 2, 5, 4, 1, 0],  // Mon-Sun
  recentCommits: [
    { id: 'c1', repo: 'KosanAmbis', branch: 'main', message: 'feat: implement Zero-Friction NLP parser for Indonesian expense tracking', time: '2 jam lalu', additions: 287, deletions: 12, sha: 'a3f7c2d' },
    { id: 'c2', repo: 'KosanAmbis', branch: 'main', message: 'fix: QuickAddBar collapse animation on mobile viewport', time: '4 jam lalu', additions: 43, deletions: 67, sha: 'b8e2a1f' },
    { id: 'c3', repo: 'tugas-ai-praktikum', branch: 'dev', message: 'feat: add neural network classification untuk dataset MNIST', time: 'Kemarin 23:14', additions: 512, deletions: 0, sha: 'c4d9e3a' },
    { id: 'c4', repo: 'KosanAmbis', branch: 'feature/health', message: 'chore: setup Health API integration architecture', time: 'Kemarin 21:30', additions: 134, deletions: 8, sha: 'd2f1b5c' },
    { id: 'c5', repo: 'portofolio-web', branch: 'main', message: 'style: redesign hero section with glassmorphism aesthetic', time: '2 hari lalu', additions: 89, deletions: 201, sha: 'e6a3c8d' },
  ],
  repos: [
    { name: 'KosanAmbis', language: 'JavaScript', commits: 47, stars: 3 },
    { name: 'tugas-ai-praktikum', language: 'Python', commits: 23, stars: 0 },
    { name: 'portofolio-web', language: 'HTML', commits: 15, stars: 7 },
  ],
  languageBreakdown: [
    { lang: 'JavaScript', pct: 62, color: '#f7df1e' },
    { lang: 'Python', pct: 23, color: '#3572A5' },
    { lang: 'HTML/CSS', pct: 12, color: '#e34c26' },
    { lang: 'Other', pct: 3, color: '#94a3b8' },
  ],
};

export const DUMMY_VSCODE_SESSIONS = [
  { date: 'Hari ini', duration: '3j 45m', project: 'KosanAmbis', files: 12, keystrokes: 4823 },
  { date: 'Kemarin', duration: '5j 12m', project: 'tugas-ai-praktikum', files: 7, keystrokes: 7241 },
  { date: '2 hari lalu', duration: '2j 30m', project: 'portofolio-web', files: 4, keystrokes: 2190 },
  { date: '3 hari lalu', duration: '6j 08m', project: 'KosanAmbis', files: 18, keystrokes: 9834 },
  { date: '4 hari lalu', duration: '1j 20m', project: 'tugas-ai-praktikum', files: 3, keystrokes: 1456 },
];

export const DUMMY_OBSIDIAN_NOTES = [
  { title: 'Ringkasan Kuliah AI — Pertemuan 8', words: 847, edited: '1 jam lalu', tags: ['kuliah', 'ai', 'notes'] },
  { title: 'Ide Project SaaS — Dashboard Analytics', words: 423, edited: '3 jam lalu', tags: ['project', 'ide'] },
  { title: 'Daily Journal — 27 Mei 2026', words: 312, edited: 'Kemarin 22:00', tags: ['journal'] },
  { title: 'Budget Planning Q2 2026', words: 589, edited: 'Kemarin 19:30', tags: ['finance', 'planning'] },
  { title: 'Roadmap Belajar Machine Learning', words: 1024, edited: '3 hari lalu', tags: ['belajar', 'ml'] },
];

export const DUMMY_FOCUS_SESSIONS = [
  { date: 'Sen', minutes: 320, sessions: 4, score: 85 },
  { date: 'Sel', minutes: 285, sessions: 5, score: 78 },
  { date: 'Rab', minutes: 150, sessions: 2, score: 45 },
  { date: 'Kam', minutes: 390, sessions: 6, score: 92 },
  { date: 'Jum', minutes: 225, sessions: 3, score: 65 },
  { date: 'Sab', minutes: 90,  sessions: 1, score: 28 },
  { date: 'Min', minutes: 0,   sessions: 0, score: 0  },
];

// ─── PHASE 4: HEALTH DUMMY DATA ────────────────────────────────────────────────
export const DUMMY_HEALTH_TODAY = {
  steps: { value: 6842, target: 8000, unit: 'langkah' },
  calories: { burned: 1847, intake: 2100, unit: 'kal' },
  sleep: { hours: 7.2, quality: 'Good', deepSleep: 2.1, remSleep: 1.8, awakeTime: 0.4 },
  heartRate: { resting: 72, current: 78, max: 142, zone: 'Normal' },
  hydration: { liters: 1.8, target: 2.0, unit: 'L' },
  activeMinutes: { value: 47, target: 30, unit: 'menit' },
  stress: { level: 38, trend: 'down', label: 'Rendah' },
  oxygenSat: { value: 97, unit: '%' },
};

export const DUMMY_HEALTH_WEEK = [
  { day: 'Sen', steps: 9241, sleep: 7.8, hr: 69, calories: 2100 },
  { day: 'Sel', steps: 7834, sleep: 6.5, hr: 74, calories: 1920 },
  { day: 'Rab', steps: 4312, sleep: 5.2, hr: 81, calories: 1650 },
  { day: 'Kam', steps: 10203, sleep: 8.1, hr: 67, calories: 2280 },
  { day: 'Jum', steps: 6721, sleep: 7.0, hr: 73, calories: 1870 },
  { day: 'Sab', steps: 3120, sleep: 9.2, hr: 65, calories: 1540 },
  { day: 'Min', steps: 6842, sleep: 7.2, hr: 72, calories: 1847 },
];

export const DUMMY_HEALTH_INSIGHTS = [
  { icon: '😴', title: 'Tidur Terbaik Minggu Ini', desc: 'Sabtu 9.2 jam — resting HR turun ke 65 bpm keesokan harinya.' },
  { icon: '🏃', title: 'Paling Aktif', desc: 'Kamis 10.203 langkah — produktivitas coding juga tertinggi hari itu.' },
  { icon: '⚠️', title: 'Rabu Fatigue Alert', desc: 'Tidur 5.2 jam + resting HR 81 bpm → tanda stres fisiologis.' },
];

export const DUMMY_HEALTH_PROVIDERS = [
  { id: 'samsung', name: 'Samsung Health', icon: '📱', connected: true, lastSync: '5 menit lalu', device: 'Galaxy Watch 6' },
  { id: 'gfit', name: 'Google Fit', icon: '🏃', connected: false, lastSync: null, device: null },
  { id: 'garmin', name: 'Garmin Connect', icon: '⌚', connected: false, lastSync: null, device: null },
  { id: 'fitbit', name: 'Fitbit', icon: '💪', connected: false, lastSync: null, device: null },
];

// ─── XP EFFECTS MAPPING ────────────────────────────────────────────────────────
export const HEALTH_XP_RULES = [
  { condition: (h) => h.steps.value >= h.steps.target, xp: 15, label: 'Step target tercapai! +15 XP' },
  { condition: (h) => h.sleep.hours >= 7.5, xp: 10, label: 'Tidur optimal +10 XP' },
  { condition: (h) => h.hydration.liters >= h.hydration.target, xp: 8, label: 'Hidrasi terpenuhi +8 XP' },
  { condition: (h) => h.activeMinutes.value >= h.activeMinutes.target, xp: 12, label: 'Active minutes target +12 XP' },
  { condition: (h) => h.heartRate.resting < 70, xp: 5, label: 'Resting HR sehat +5 XP' },
];

export const COMMIT_XP_RULES = {
  perCommit: 5,
  streakBonus: (streak) => streak >= 7 ? 30 : streak >= 5 ? 20 : streak >= 3 ? 10 : 0,
  lateNightPenalty: -5, // after 23:00
};
