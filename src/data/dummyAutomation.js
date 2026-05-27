/**
 * dummyAutomation.js — Highly realistic dummy data for KosanAmbis 2.0
 * Simulates: Telegram bot history, GitHub activity, VSCode sessions, Obsidian logs, Health metrics
 * Fully interconnected to tell the cohesive story of Brayden.
 */

// ─── PHASE 2: TELEGRAM BOT HISTORY (Interconnected with wallet balance Rp 2.430.000) ─────────────────
export const DUMMY_BOT_HISTORY = [
  { id: 1, from: 'user', text: 'makan nasi padang 27k', time: '12:30', date: 'Hari ini' },
  { id: 2, from: 'bot', emoji: '🍽️', text: '✅ Makan siang Nasi Padang Rp 27.000 tercatat!\n💰 Sisa Saldo: Rp 2.430.000\n📊 Kategori: Makan (Total bulan ini: Rp 187.000)', time: '12:30' },
  { id: 3, from: 'user', text: 'kopi cold brew 29000', time: '14:15', date: 'Hari ini' },
  { id: 4, from: 'bot', emoji: '☕', text: '☕ Kopi Cold Brew Rp 29.000 tercatat!\n⚡ Kafein ke-4 minggu ini. Sanity +5, Dompet -29k.\n💡 Tips: Kamu menghemat Rp 45.000 minggu ini dibanding minggu lalu!', time: '14:15' },
  { id: 5, from: 'user', text: 'gojek ke stasiun 18500', time: '16:00', date: 'Hari ini' },
  { id: 6, from: 'bot', emoji: '🚗', text: '🚗 Gojek Rp 18.500 tercatat!\n💰 Sisa Saldo: Rp 2.401.500\n📊 Transport bulan ini: Rp 53.500', time: '16:00' },
  { id: 7, from: 'user', text: 'berapa duit gw?', time: '18:15', date: 'Hari ini' },
  { id: 8, from: 'bot', emoji: '💰', text: '💰 STATUS DOMPET BRAYDEN\nAllowance: Rp 3.500.000\nTotal Pengeluaran: Rp 1.070.000\nSisa Saldo: Rp 2.430.000\n\n📌 Tagihan Terdekat:\n- Token Listrik Kos: Rp 100.000 (1 hari lagi)\n- Uang Kosan Bulanan: Rp 800.000 (4 hari lagi)\n\n💚 KONDISI DOMPET AMAN & OPTIMAL', time: '18:15' },
  { id: 9, from: 'user', text: 'gimana pengeluaran minggu ini?', time: '20:10', date: 'Kemarin' },
  { id: 10, from: 'bot', emoji: '📊', text: '📊 WEEKLY FINANCIAL AUDIT\n\n🍽️ Makan & Warteg: Rp 175.000 (35%)\n☕ Kopi Warkop: Rp 73.000 (15%)\n🚗 Gojek & Bensin: Rp 53.500 (11%)\n💻 Dev Tools & Domain: Rp 301.010 (60%)\n🛒 Indomaret Logistik: Rp 84.500 (17%)\n\nTotal Pengeluaran Terlacak: Rp 1.070.000\n💡 Pengeluaran paling produktif: Pembelian domain portofolio!', time: '20:10' }
];

export const BOT_QUICK_REPLIES = [
  { label: '💰 Saldo Aktif', command: 'berapa duit gw?' },
  { label: '📊 Laporan Keuangan', command: 'gimana pengeluaran minggu ini?' },
  { label: '📋 Tagihan Kos', command: 'tagihan apa aja?' },
  { label: '💡 Tips Hemat', command: 'tips hemat minggu ini?' }
];

export const BOT_AUTO_RESPONSES = {
  'berapa duit': (balance) => `💰 STATUS DOMPET BRAYDEN\nSisa Saldo: ${formatIDR(balance)}\nStatus: ${balance > 1500000 ? '💚 KONDISI DOMPET AMAN & OPTIMAL' : balance > 500000 ? '🟡 MODE HEMAT AKTIF' : '🔴 STATUS KRITIS: MATIKAN NONGKRONG'}`,
  'tagihan': () => `📋 TAGIHAN KOSAN AKTIF\n⚠️ Token Listrik Kamar: Rp 100.000 (1 hari lagi)\n⏳ Uang Kos Bulanan: Rp 800.000 (4 hari lagi)\n📱 Paket Data By.U: Rp 75.000 (12 hari lagi)\n\nTotal pending: Rp 975.000`,
  'tips hemat': () => `💡 REKOMENDASI HEMAT MINGGU INI\n\n1. Kurangi kopi Tokopedia/Starbucks, ganti kopi warkop → hemat ~Rp 45k/minggu\n2. Gunakan voucher promo GoPay untuk Gojek → hemat ~Rp 20k\n3. Makan Warteg Akbar porsi double dibanding beli Gofood → hemat ~Rp 85k\n\nPotensi tabungan: Rp 150k/minggu = Rp 600k/bulan! 🔥`,
  'gimana': () => `📊 WEEKLY FINANCIAL AUDIT\n\n🍽️ Makan: Rp 175.000\n☕ Kopi: Rp 73.000\n🚗 Transport: Rp 53.500\nTotal Pengeluaran: Rp 1.070.000 / Rp 3.500.000 allowance.`
};

function formatIDR(n) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

// ─── PHASE 3: GITHUB & DEV ACTIVITY DUMMY DATA ────────────────────────────────
export const DUMMY_GITHUB = {
  username: 'braydenamb',
  avatar: '👨‍💻',
  totalCommits: 412,
  currentStreak: 7,
  longestStreak: 15,
  weeklyCommits: [5, 8, 4, 6, 3, 1, 0],  // Mon-Sun
  recentCommits: [
    { id: 'c1', repo: 'KosanAmbis', branch: 'main', message: 'feat: refine KineticCounter layout clipping using inline-block standard contexts', time: '1 jam lalu', additions: 42, deletions: 15, sha: 'f9e2b1c' },
    { id: 'c2', repo: 'KosanAmbis', branch: 'main', message: 'style: perfect monthly aligned labels above contributions grid', time: '3 jam lalu', additions: 68, deletions: 12, sha: 'e8d3a7f' },
    { id: 'c3', repo: 'KosanAmbis', branch: 'main', message: 'feat: implement local AI Pearson correlation predictive analytics', time: '1 hari lalu', additions: 512, deletions: 8, sha: 'b2a7d4e' },
    { id: 'c4', repo: 'tugas-ai-praktikum', branch: 'dev', message: 'feat: setup training pipeline for MNIST classification model', time: 'Kemarin 21:05', additions: 184, deletions: 4, sha: 'c5b8e9a' },
    { id: 'c5', repo: 'portofolio-neubrutalist', branch: 'main', message: 'style: design dynamic glassmorphic card widgets and buttons', time: '3 hari lalu', additions: 289, deletions: 104, sha: 'a1d2c3b' }
  ],
  repos: [
    { name: 'KosanAmbis', language: 'JavaScript', commits: 64, stars: 12 },
    { name: 'tugas-ai-praktikum', language: 'Python', commits: 35, stars: 2 },
    { name: 'portofolio-neubrutalist', language: 'HTML', commits: 18, stars: 8 }
  ],
  languageBreakdown: [
    { lang: 'JavaScript', pct: 65, color: '#f7df1e' },
    { lang: 'Python', pct: 22, color: '#3572A5' },
    { lang: 'HTML/CSS', pct: 10, color: '#e34c26' },
    { lang: 'Other', pct: 3, color: '#94a3b8' }
  ]
};

export const DUMMY_VSCODE_SESSIONS = [
  { date: 'Hari ini', duration: '4j 12m', project: 'KosanAmbis', files: 8, keystrokes: 5824 },
  { date: 'Kemarin', duration: '5j 30m', project: 'tugas-ai-praktikum', files: 12, keystrokes: 8192 },
  { date: '2 hari lalu', duration: '3j 15m', project: 'KosanAmbis', files: 5, keystrokes: 3410 },
  { date: '3 hari lalu', duration: '2j 45m', project: 'portofolio-neubrutalist', files: 6, keystrokes: 2890 },
  { date: '4 hari lalu', duration: '6j 18m', project: 'tugas-ai-praktikum', files: 15, keystrokes: 9421 }
];

export const DUMMY_OBSIDIAN_NOTES = [
  { title: 'AI Practical Notes — Neural Networks Pertemuan 9', words: 1024, edited: '45 menit lalu', tags: ['kuliah', 'ai', 'study'] },
  { title: 'Obsidian Daily Journal — 27 Mei 2026', words: 412, edited: '2 jam lalu', tags: ['journal', 'life'] },
  { title: 'Project Proposal — Neubrutalist Glass Dashboard', words: 890, edited: 'Kemarin 20:15', tags: ['project', 'concept'] },
  { title: 'React Performance Optimisation Checklist', words: 620, edited: 'Kemarin 14:00', tags: ['dev', 'react'] },
  { title: 'Budget Allocation Kosan Q2 2026', words: 345, edited: '3 hari lalu', tags: ['finance', 'kosan'] }
];

export const DUMMY_FOCUS_SESSIONS = [
  { date: 'Sen', minutes: 348, sessions: 5, score: 88 },
  { date: 'Sel', minutes: 372, sessions: 6, score: 90 },
  { date: 'Rab', minutes: 246, sessions: 4, score: 72 },
  { date: 'Kam', minutes: 330, sessions: 5, score: 85 },
  { date: 'Jum', minutes: 192, sessions: 3, score: 58 },
  { date: 'Sab', minutes: 60,  sessions: 1, score: 25 },
  { date: 'Min', minutes: 30,  sessions: 1, score: 18 }
];

// ─── PHASE 4: SAMSUNG HEALTH DUMMY DATA ──────────────────────────────────────────
export const DUMMY_HEALTH_TODAY = {
  steps: { value: 7842, target: 8000, unit: 'langkah' },
  calories: { burned: 2120, intake: 2250, unit: 'kal' },
  sleep: { hours: 6.6, quality: 'Moderate', deepSleep: 1.4, remSleep: 1.5, awakeTime: 0.5 },
  heartRate: { resting: 68, current: 74, max: 135, zone: 'Normal' },
  hydration: { liters: 1.8, target: 2.5, unit: 'L' },
  activeMinutes: { value: 42, target: 30, unit: 'menit' },
  stress: { level: 41, trend: 'down', label: 'Sedang' },
  oxygenSat: { value: 98, unit: '%' }
};

export const DUMMY_HEALTH_WEEK = [
  { day: 'Sen', steps: 8940, sleep: 7.2, hr: 67, calories: 2200 },
  { day: 'Sel', steps: 8120, sleep: 6.8, hr: 68, calories: 2150 },
  { day: 'Rab', steps: 5120, sleep: 5.5, hr: 78, calories: 1750 },
  { day: 'Kam', steps: 9420, sleep: 7.8, hr: 66, calories: 2300 },
  { day: 'Jum', steps: 6840, sleep: 6.4, hr: 72, calories: 1980 },
  { day: 'Sab', steps: 3500, sleep: 8.5, hr: 64, calories: 1600 },
  { day: 'Min', steps: 7842, sleep: 6.6, hr: 68, calories: 2120 }
];

export const DUMMY_HEALTH_INSIGHTS = [
  { icon: '😴', title: 'Pemulihan Tidur Stabil', desc: 'Rata-rata tidur 6.6 jam seminggu menjaga konsentrasi coding stabil di atas 4 jam.' },
  { icon: '🏃', title: 'Aktif di Luar Kosan', desc: 'Senin 8.940 langkah — hidrasi meningkat pesat bersamaan dengan langkah kaki.' },
  { icon: '⚠️', title: 'Wednesday Fatigue Alert', desc: 'Tidur Rabu hanya 5.5 jam menaikkan tingkat stres fisiologis ke 48% hari berikutnya.' }
];

export const DUMMY_HEALTH_PROVIDERS = [
  { id: 'samsung', name: 'Samsung Health', icon: '📱', connected: true, lastSync: '5 menit lalu', device: 'Galaxy Watch 6' },
  { id: 'gfit', name: 'Google Fit', icon: '🏃', connected: false, lastSync: null, device: null },
  { id: 'garmin', name: 'Garmin Connect', icon: '⌚', connected: false, lastSync: null, device: null },
  { id: 'fitbit', name: 'Fitbit', icon: '💪', connected: false, lastSync: null, device: null }
];

// ─── GAMIFICATION XP ENGINE ──────────────────────────────────────────────────
export const HEALTH_XP_RULES = [
  { condition: (h) => h.steps.value >= h.steps.target, xp: 15, label: 'Langkah target harian tercapai! +15 XP' },
  { condition: (h) => h.sleep.hours >= 7.5, xp: 10, label: 'Tidur nyenyak berkualitas optimal +10 XP' },
  { condition: (h) => h.hydration.liters >= h.hydration.target, xp: 8, label: 'Hidrasi tercukupi penuh +8 XP' },
  { condition: (h) => h.activeMinutes.value >= h.activeMinutes.target, xp: 12, label: 'Target menit aktif tercapai +12 XP' },
  { condition: (h) => h.heartRate.resting < 70, xp: 5, label: 'Detak jantung istirahat sehat +5 XP' }
];

export const COMMIT_XP_RULES = {
  perCommit: 5,
  streakBonus: (streak) => streak >= 7 ? 30 : streak >= 5 ? 20 : streak >= 3 ? 10 : 0,
  lateNightPenalty: -5 // after 23:00
};
