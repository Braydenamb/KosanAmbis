// 30 Days of highly realistic interconnected productivity data for contribution grid
// Tells the story of Brayden: a productive but human developer hybrid student
// value ranges: 0 (mager/gray), 1-2 (lumayan/light blue), 3-4 (produktif/medium blue), 5+ (ambis/dark blue)
export const contributionPixels = [
  { date: "2026-04-27", hours: 0.5, status: "Drained after exams, long sleep", level: 0 },
  { date: "2026-04-28", hours: 2.2, status: "Obsidian notes compiled & sorted", level: 1 },
  { date: "2026-04-29", hours: 4.5, status: "Slicing neubrutalist UI components", level: 2 },
  { date: "2526-04-30", hours: 6.8, status: "🔥 Deep Work session: React Router v7 migration", level: 3 },
  { date: "2026-05-01", hours: 1.5, status: "Coffee break, mild fatigue", level: 1 },
  { date: "2026-05-02", hours: 0, status: "Rebahan & cozy anime binge", level: 0 },
  { date: "2026-05-03", hours: 0, status: "Weekend social battery reset", level: 0 },
  { date: "2026-05-04", hours: 5.2, status: "⚡ Warkop coding: Python clustering", level: 3 },
  { date: "2026-05-05", hours: 3.8, status: "AI practical assignment MNIST", level: 2 },
  { date: "2026-05-06", hours: 2.5, status: "Cleaned kosan, minor bugs resolved", level: 1 },
  { date: "2026-05-07", hours: 7.2, status: "🔥 Extreme Ambis: PKM Proposal finalised", level: 3 },
  { date: "2026-05-08", hours: 4.0, status: "Keystrokes peak, VSCode dashboard finished", level: 2 },
  { date: "2026-05-09", hours: 1.2, status: "Warteg hangout, slow day", level: 1 },
  { date: "2026-05-10", hours: 0, status: "Total lazy Sunday, absolute rest", level: 0 },
  { date: "2026-05-11", hours: 5.8, status: "⚡ Sesi deep focus 5.8 jam on fire", level: 3 },
  { date: "2026-05-12", hours: 6.2, status: "⚡ Integrated audio soundscapes into app", level: 3 },
  { date: "2026-05-13", hours: 4.1, status: "Drafted pricing page UI", level: 2 },
  { date: "2026-05-14", hours: 3.0, status: "Obsidian journal entry completed", level: 2 },
  { date: "2026-05-15", hours: 2.1, status: "Helped a classmate debug Tailwind grid", level: 1 },
  { date: "2026-05-16", hours: 0, status: "Rest day, family dinner", level: 0 },
  { date: "2026-05-17", hours: 0, status: "Cozy warkop chilling, rain vibes", level: 0 },
  { date: "2026-05-18", hours: 6.5, status: "⚡ Zero-Friction Input NLP engine built", level: 3 },
  { date: "2026-05-19", hours: 5.0, status: "🔥 Integrated Samsung Health metrics", level: 3 },
  { date: "2026-05-20", hours: 4.3, status: "Refining Pearson Correlation engine", level: 2 },
  { date: "2026-05-21", hours: 5.5, status: "⚡ Designed Forecasting sliders UX", level: 3 },
  { date: "2026-05-22", hours: 3.2, status: "Polished sidebar micro-badges layout", level: 2 },
  { date: "2026-05-23", hours: 1.0, status: "Late night gaming, slow Saturday", level: 1 },
  { date: "2026-05-24", hours: 0, status: "Recharging focus before busy week", level: 0 },
  { date: "2026-05-25", hours: 7.8, status: "⚡ Absolute flow: 7.8h deep work peak", level: 3 },
  { date: "2026-05-26", hours: 5.4, status: "🔥 Mounted AI Analyst tab in main navbar", level: 3 },
];

// Weekly focus hours for chart (Monday - Sunday)
// Reflects realistic weekly flow (busy midweek, chill weekend)
export const weeklyEnergyData = [
  { day: "Senin", hours: 5.8, label: "5.8 Jam" },
  { day: "Selasa", hours: 6.2, label: "6.2 Jam" },
  { day: "Rabu", hours: 4.1, label: "4.1 Jam" },
  { day: "Kamis", hours: 5.5, label: "5.5 Jam" },
  { day: "Jumat", hours: 3.2, label: "3.2 Jam" },
  { day: "Sabtu", hours: 1.0, label: "1 Jam" },
  { day: "Minggu", hours: 0.5, label: "30 Menit" },
];

// Initial Weekly Missions
export const initialMissions = [
  { id: 1, text: "Tugas kuliah Praktikum AI (Neural Network MNIST)", completed: false },
  { id: 2, text: "Beresin kamar kosan (baju kotor, dispenser, & ganti sprei)", completed: false },
  { id: 3, text: "Revisi proposal Program Kreativitas Mahasiswa (PKM AI IoT)", completed: false },
  { id: 4, text: "Slicing Portofolio Web Neubrutalist Glassmorphism", completed: false }
];

// Initial Rewards
export const initialRewards = [
  { id: 1, text: "5 Hari Streak Ambis = Kopi Susu Creamy Toko Sebelah", hoursNeeded: 5, unlocked: false, icon: "☕" },
  { id: 2, text: "10 Jam Fokus = Checkout mechanical switches di Tokopedia", hoursNeeded: 10, unlocked: false, icon: "🛍️" },
  { id: 3, text: "20 Jam Fokus = Beli McD Double Cheeseburger Share Box", hoursNeeded: 20, unlocked: false, icon: "🍔" }
];
