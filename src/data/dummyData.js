// 30 Days of realistic productivity data for contribution grid
// value ranges: 0 (mager/gray), 1-2 (lumayan/light green), 3-4 (produktif/medium green), 5+ (ambis/dark green)
export const contributionPixels = [
  { date: "2026-04-27", hours: 0, status: "Mode Mager Total", level: 0 },
  { date: "2026-04-28", hours: 2, status: "Lumayan lah", level: 1 },
  { date: "2026-04-29", hours: 4, status: "Cukup Produktif", level: 2 },
  { date: "2026-04-30", hours: 6, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-01", hours: 1, status: "Niat Tapi Mager", level: 1 },
  { date: "2026-05-02", hours: 0, status: "Rebahan Seharian", level: 0 },
  { date: "2026-05-03", hours: 0, status: "Mode Mager", level: 0 },
  { date: "2026-05-04", hours: 5, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-05", hours: 3, status: "Cukup Produktif", level: 2 },
  { date: "2026-05-06", hours: 2, status: "Lumayan lah", level: 1 },
  { date: "2026-05-07", hours: 6, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-08", hours: 4, status: "Cukup Produktif", level: 2 },
  { date: "2026-05-09", hours: 1, status: "Niat Tapi Mager", level: 1 },
  { date: "2026-05-10", hours: 0, status: "Mode Mager Total", level: 0 },
  { date: "2026-05-11", hours: 5, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-12", hours: 6, status: "⚡ Lagi On Fire", level: 3 },
  { date: "2026-05-13", hours: 4, status: "Cukup Produktif", level: 2 },
  { date: "2026-05-14", hours: 3, status: "Lumayan lah", level: 2 },
  { date: "2026-05-15", hours: 2, status: "Niat Tapi Mager", level: 1 },
  { date: "2026-05-16", hours: 0, status: "Rebahan Total", level: 0 },
  { date: "2026-05-17", hours: 0, status: "Mode Mager", level: 0 },
  { date: "2026-05-18", hours: 6, status: "⚡ Lagi On Fire", level: 3 },
  { date: "2026-05-19", hours: 5, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-20", hours: 4, status: "Cukup Produktif", level: 2 },
  { date: "2026-05-21", hours: 5, status: "🔥 Ambis Mode", level: 3 },
  { date: "2026-05-22", hours: 3, status: "Lumayan lah", level: 2 },
  { date: "2026-05-23", hours: 1, status: "Niat Tapi Mager", level: 1 },
  { date: "2026-05-24", hours: 0, status: "Mode Mager", level: 0 },
  { date: "2026-05-25", hours: 7, status: "⚡ Lagi On Fire", level: 3 },
  { date: "2026-05-26", hours: 5, status: "🔥 Ambis Mode", level: 3 },
];

// Weekly focus hours for chart (Monday - Sunday)
export const weeklyEnergyData = [
  { day: "Senin", hours: 5.5, label: "5.5 Jam" },
  { day: "Selasa", hours: 6.0, label: "6 Jam" },
  { day: "Rabu", hours: 3.5, label: "3.5 Jam" },
  { day: "Kamis", hours: 5.0, label: "5 Jam" },
  { day: "Jumat", hours: 2.0, label: "2 Jam" },
  { day: "Sabtu", hours: 1.0, label: "1 Jam" },
  { day: "Minggu", hours: 0.5, label: "30 Menit" },
];

// Initial Weekly Missions
export const initialMissions = [
  { id: 1, text: "Tugas kuliah Praktikum AI (Python)", completed: false },
  { id: 2, text: "Beresin kamar kosan (baju kotor & dispenser)", completed: false },
  { id: 3, text: "Revisi proposal program kreativitas mahasiswa", completed: false }
];

// Initial Rewards
export const initialRewards = [
  { id: 1, text: "5 Hari Streak Ambis = Kopi Susu Creamy", hoursNeeded: 5, unlocked: false, icon: "☕" },
  { id: 2, text: "10 Jam Fokus = Checkout Wishlist Tokopedia", hoursNeeded: 10, unlocked: false, icon: "🛍️" },
  { id: 3, text: "20 Jam Fokus = Beli McD Share Box", hoursNeeded: 20, unlocked: false, icon: "🍔" }
];
