/**
 * Procedural mock data generator for KosanAmbis 2.0 Life Heatmap Canvas
 * Creates 365 days of rich metric records ending on the specified date.
 */

export function generateYearlyData(endDateStr = '2026-05-26') {
  const data = [];
  const endDate = new Date(endDateStr);
  
  // Seedable random helper to keep data consistent across renders
  let seed = 42;
  function random() {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  // Curated lists of journal snippets and habits
  const journalsByState = {
    burnout: [
      "Kepala pening banget. Begadang ngerjain tugas tapi rasanya mentok. Cuma pengen tidur seharian.",
      "Kelelaham mental total. Sisa transferan menipis, tugas makin numpuk, energi nol persen.",
      "Dihantam stres tugas kelompok. Diskusi gak jalan, akhirnya ngerjain sendiri sampai subuh.",
      "Badan lemas, tidur gak nyenyak. Butuh rehat dari segala tumpukan deadline ini.",
      "Hari ini mager total. Bahkan buat masak mie instan aja rasanya berat banget."
    ],
    ambis: [
      "Lagi produktif parah! Coding React berjam-jam lancar jaya, tugas praktikum kelar.",
      "Mood hari ini luar biasa cerah. Semua checklist harian berhasil dicentang hijau!",
      "Ngebut PKM bareng tim. Diskusi hangat di warkop sampai malam, ide-ide mengalir liar.",
      "Habis olahraga pagi lanjut fokus belajar. Rasanya hidup teratur banget.",
      "Sesi deep work 5 jam tanpa henti. Berasa jadi hacker profesional!"
    ],
    cozy: [
      "Cuaca syahdu hujan gerimis. Enak banget rebahan sambil dengerin lofi music di kamar.",
      "Beresin seluruh isi kosan. Cuci sprei, sapu lantai, kamar jadi wangi lavender.",
      "Masak indomie rebus pakai telur sambil nonton anime. Kenikmatan kosan hakiki.",
      "Nongkrong santai sama tetangga sebelah kosan. Cerita ngalor ngidul gak jelas.",
      "Tidur siang nyenyak banget. Kadang hidup cuma butuh hening sejenak."
    ],
    average: [
      "Hari kuliah biasa. Kelas matematika diskrit lumayan ngebosenin tapi aman.",
      "Beli warteg lauk telur dadar dan tempe orek. Hemat dan mengenyangkan.",
      "Nyicil tugas dikit-dikit sambil denger podcast. Roda hidup berputar normal.",
      "Nyetrika baju numpuk sambil denger lagu pop lama. Hari yang tenang.",
      "Minum air putih banyak hari ini. Berusaha tetap sehat di tengah kesibukan."
    ]
  };

  const habitPool = [
    "Cuci Piring", "Minum Air 2L", "Meditasi 10j", "Belajar React", 
    "Olahraga Ringan", "Beresin Kamar", "Jurnal Harian", "No Gadget 1j"
  ];

  // Helper to get season from date
  // Spring: Mar-May, Summer: Jun-Aug, Autumn: Sep-Nov, Winter: Dec-Feb
  function getSeason(date) {
    const month = date.getMonth(); // 0 = Jan, 11 = Dec
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  // Iterate backwards 365 times
  for (let i = 364; i >= 0; i--) {
    const currentDate = new Date(endDate);
    currentDate.setDate(endDate.getDate() - i);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayOfWeek = currentDate.getDay(); // 0 = Sun, 6 = Sat
    const season = getSeason(currentDate);

    // 1. Establish base trends based on Season
    let baseMood = 0.6;
    let baseProductivity = 0.5;
    let baseSleep = 7.0;
    let baseStress = 0.4;
    let baseSocial = 0.5;

    if (season === 'spring') {
      baseMood = 0.7;
      baseProductivity = 0.65;
      baseSleep = 6.8;
      baseStress = 0.35;
    } else if (season === 'summer') {
      baseMood = 0.85; // high joy in summer
      baseProductivity = 0.45; // lower work focus
      baseSleep = 7.5;
      baseStress = 0.25;
      baseSocial = 0.75; // very social
    } else if (season === 'autumn') {
      baseMood = 0.55;
      baseProductivity = 0.75; // high work focus (exams!)
      baseSleep = 6.2; // less sleep
      baseStress = 0.6; // exam stress
      baseSocial = 0.35;
    } else if (season === 'winter') {
      baseMood = 0.65;
      baseProductivity = 0.4; // hibernation
      baseSleep = 7.8; // long sleep
      baseStress = 0.3;
      baseSocial = 0.3; // hermit mode
    }

    // 2. Adjust for Weekday vs Weekend
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    if (isWeekend) {
      baseMood += 0.15;
      baseProductivity -= 0.3;
      baseSleep += 1.2;
      baseStress -= 0.2;
      baseSocial += 0.2;
    } else {
      baseProductivity += 0.1;
      baseSleep -= 0.5;
      baseStress += 0.1;
    }

    // 3. Inject Procedural "Life Cycles" (Streaks of Burnout & Ambis)
    // We create periodic waves using sine inputs mapped to dates
    const timeVal = currentDate.getTime() / (1000 * 60 * 60 * 24); // days unit
    const waveBurnout = Math.sin(timeVal / 15.0); // wave repeats every ~94 days
    const waveAmbis = Math.cos(timeVal / 11.0); // wave repeats every ~69 days

    let isBurnoutStreak = false;
    let isAmbisStreak = false;

    if (waveBurnout < -0.8) {
      isBurnoutStreak = true;
    } else if (waveAmbis > 0.8 && !isBurnoutStreak) {
      isAmbisStreak = true;
    }

    if (isBurnoutStreak) {
      baseMood = 0.15 + random() * 0.15;
      baseProductivity = 0.05 + random() * 0.15;
      baseSleep = 4.2 + random() * 1.5;
      baseStress = 0.85 + random() * 0.15;
      baseSocial = 0.1 + random() * 0.15;
    } else if (isAmbisStreak) {
      baseMood = 0.8 + random() * 0.2;
      baseProductivity = 0.85 + random() * 0.15;
      baseSleep = 6.0 + random() * 1.2;
      baseStress = 0.3 + random() * 0.2;
      baseSocial = 0.4 + random() * 0.3;
    }

    // 4. Clamping and Jittering values
    const jitter = () => (random() - 0.5) * 0.15;
    const mood = Math.min(Math.max(baseMood + jitter(), 0), 1);
    const productivity = Math.min(Math.max(baseProductivity + jitter(), 0), 1);
    const stress = Math.min(Math.max(baseStress + jitter(), 0), 1);
    const social = Math.min(Math.max(baseSocial + jitter(), 0), 1);
    const sleep = Math.min(Math.max(baseSleep + (random() - 0.5) * 2.0, 2), 12);
    
    // Hydration maps roughly with mood/health
    const hydration = Math.min(Math.max(Math.round(6 + (mood - stress) * 4 + (random() - 0.5) * 3), 0), 12);
    
    // Focus hours matches productivity
    const focusMinutes = Math.round(productivity * 360 + (random() * 90));

    // Choose habits completed
    const habitsCount = Math.round(productivity * 5 + (random() * 3));
    const habits = [];
    for (let h = 0; h < habitsCount; h++) {
      const idx = Math.floor(random() * habitPool.length);
      const hName = habitPool[idx];
      if (!habits.includes(hName)) {
        habits.push(hName);
      }
    }

    // Dynamic journal snippet
    let journalSnippet = "";
    let stateKey = "average";
    if (isBurnoutStreak) stateKey = "burnout";
    else if (isAmbisStreak) stateKey = "ambis";
    else if (mood > 0.7 && productivity < 0.4) stateKey = "cozy";

    const snippets = journalsByState[stateKey];
    const snipIndex = Math.floor(random() * snippets.length);
    journalSnippet = snippets[snipIndex];

    data.push({
      date: dateStr,
      mood,
      productivity,
      sleep: parseFloat(sleep.toFixed(1)),
      hydration,
      stress,
      social,
      focusMinutes,
      habits,
      journalSnippet
    });
  }

  return data;
}
