import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveTodaySnapshot } from '../hooks/useInsightEngine';

const CharacterContext = createContext();

export function CharacterProvider({ children }) {
  // --- Helper to load from LocalStorage with aggressive sanitization ---
  const loadLocally = (key, defaultValue) => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return defaultValue;
      const parsed = JSON.parse(item);
      if (parsed === null || parsed === undefined) return defaultValue;

      // Robust check for array matching
      if (Array.isArray(defaultValue) && !Array.isArray(parsed)) {
        return defaultValue;
      }
      // Robust check for object matching
      if (typeof defaultValue === 'object' && defaultValue !== null && (typeof parsed !== 'object' || parsed === null)) {
        return defaultValue;
      }

      return parsed;
    } catch (e) {
      return defaultValue;
    }
  };

  // --- Basic Kosan States ---
  const [focusHours, setFocusHours] = useState(() => loadLocally('ankos_focus_hours', 4.2));
  const [waterIntake, setWaterIntake] = useState(() => loadLocally('ankos_water_intake', 6));
  const [sleepHours, setSleepHours] = useState(() => loadLocally('ankos_sleep_hours', 6.6));
  const [socialBattery, setSocialBattery] = useState(() => loadLocally('ankos_social_battery', 45));
  const [laundryDate, setLaundryDate] = useState(() => loadLocally('ankos_laundry_date', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()));

  // --- RPG & Level States ---
  const [characterXP, setCharacterXP] = useState(() => loadLocally('ankos_xp', 1160)); // Level 12 Focus Monk

  // --- Dynamic Customizable Profile Picture ---
  const [profileAvatar, setProfileAvatar] = useState(() => loadLocally('ankos_profile_avatar', '🦊'));
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(() => loadLocally('ankos_profile_avatar_url', ''));

  // --- Inventory & Logistics States ---
  const [logistics, setLogistics] = useState(() => loadLocally('ankos_logistics', {
    galon: 70, // in percentage
    gas: 40,
    kopi: 85,
    mie: 60
  }));

  // --- Financial States ---
  const [walletAllowance, setWalletAllowance] = useState(() => loadLocally('ankos_allowance', 3500000)); // Rp 3.500.000 allowance
  const [walletExpenses, setWalletExpenses] = useState(() => loadLocally('ankos_expenses', [
    { id: 1, title: 'Warteg Akbar (Makan Siang)', amount: 18000, date: '2026-05-27', category: 'Makan' },
    { id: 2, title: 'Kopi Susu Aren - Warkop Kiri', amount: 22000, date: '2026-05-27', category: 'Kopi' },
    { id: 3, title: 'Gojek ke Stasiun', amount: 18500, date: '2026-05-27', category: 'Transport' },
    { id: 4, title: 'Indomie Kari Ayam 1 Kardus', amount: 112000, date: '2026-05-24', category: 'Logistik' },
    { id: 5, title: 'Kaos Polos Uniqlo (Wishlist)', amount: 199000, date: '2026-05-23', category: 'Makan' },
    { id: 6, title: 'Pembelian Domain Web Portofolio', amount: 149000, date: '2026-05-22', category: 'Tagihan' },
    { id: 7, title: 'Makan Nasi Padang Sederhana', amount: 27000, date: '2026-05-27', category: 'Makan' },
    { id: 8, title: 'Kopi Cold Brew - Kopi Kenangan', amount: 29000, date: '2026-05-27', category: 'Kopi' },
    { id: 9, title: 'Tagihan Token Listrik Kamar', amount: 100000, date: '2026-05-25', category: 'Tagihan' },
    { id: 10, title: 'Indomaret (Cemilan & Sabun)', amount: 84500, date: '2026-05-24', category: 'Logistik' },
    { id: 11, title: 'Uang Kas Angkatan', amount: 20000, date: '2026-05-26', category: 'Makan' },
    { id: 12, title: 'Spotify Premium Student (Auto)', amount: 54990, date: '2026-05-26', category: 'Hiburan' },
    { id: 13, title: 'Bensin Motor & Parkir Kampus', amount: 35000, date: '2026-05-25', category: 'Transport' },
    { id: 14, title: 'Nasi Goreng Gila (Malam)', amount: 25000, date: '2026-05-26', category: 'Makan' },
    { id: 15, title: 'Snack Keripik Singkong', amount: 15000, date: '2026-05-26', category: 'Makan' },
    { id: 16, title: 'Laundry Kilat 3Kg', amount: 24000, date: '2026-05-25', category: 'Logistik' },
    { id: 17, title: 'Langganan Github Copilot', amount: 152010, date: '2026-05-25', category: 'Tagihan' }
  ]));

  // --- Bills/Tokens ---
  const [bills, setBills] = useState(() => loadLocally('ankos_bills', [
    { id: 1, title: 'Uang Kos Bulanan', amount: 800000, daysLeft: 4, category: 'Kos' },
    { id: 2, title: 'Token Listrik Kamar', amount: 100000, daysLeft: 1, category: 'Listrik' },
    { id: 3, title: 'Paket Data Internet (By.U)', amount: 75000, daysLeft: 12, category: 'Internet' },
    { id: 4, title: 'Spotify Premium Student', amount: 29900, daysLeft: 2, category: 'Hiburan' }
  ]));

  // --- Productivity / Academic States ---
  const [deadlines, setDeadlines] = useState(() => loadLocally('ankos_deadlines', [
    { id: 1, title: 'Tugas Praktikum Pemrograman AI (MNIST)', deadline: 'Besok', priority: 'merah', completed: false },
    { id: 2, title: 'Beresin Kamar Kos (Dispenser & Sprei)', deadline: 'Minggu ini', priority: 'kuning', completed: false },
    { id: 3, title: 'Revisi Proposal PKM Kewirausahaan (AI IoT)', deadline: 'Minggu Depan', priority: 'hijau', completed: false },
    { id: 4, title: 'Slicing Web Design Portofolio Neubrutalist', deadline: '3 hari lagi', priority: 'kuning', completed: false }
  ]));

  const [bolosCounters, setBolosCounters] = useState(() => loadLocally('ankos_bolos', [
    { id: 1, subject: 'Matematika Diskrit', skipped: 1, max: 4 },
    { id: 2, subject: 'Pemrograman Web', skipped: 2, max: 4 },
    { id: 3, subject: 'Kecerdasan Buatan', skipped: 0, max: 3 },
    { id: 4, subject: 'Arsitektur Komputer', skipped: 1, max: 3 }
  ]));

  const [quickNotes, setQuickNotes] = useState(() => loadLocally('ankos_quick_notes', [
    { id: 1, text: 'Bayar kas kelas 20 ribu ke ketua tingkat di kampus.', time: 'Hari ini, 15:40' },
    { id: 2, text: 'Warteg Akbar buka jam 8 pagi, gratis es teh tawar kalau hari Jumat.', time: '26 Mei, 18:22' },
    { id: 3, text: 'Token listrik bunyi tit-tit, besok pagi harus langsung isi.', time: 'Kemarin, 21:05' }
  ]));

  const [rewards, setRewards] = useState(() => loadLocally('ankos_rewards_rpg', [
    { id: 1, title: "5 Hari Streak Ambis = Kopi Susu Creamy Toko Sebelah", hoursNeeded: 5, unlocked: false, icon: "☕" },
    { id: 2, title: "10 Jam Fokus = Checkout mechanical switches Tokopedia", hoursNeeded: 10, unlocked: false, icon: "🛍️" },
    { id: 3, title: "20 Jam Fokus = Beli McD Double Cheeseburger Share Box", hoursNeeded: 20, unlocked: false, icon: "🍔" }
  ]));

  // --- Toasts system ---
  const [toasts, setToasts] = useState([]);
  const addToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message }]);
  };
  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- Auto-Save to LocalStorage ---
  useEffect(() => {
    window.localStorage.setItem('ankos_focus_hours', JSON.stringify(focusHours));
  }, [focusHours]);
  useEffect(() => {
    window.localStorage.setItem('ankos_water_intake', JSON.stringify(waterIntake));
  }, [waterIntake]);
  useEffect(() => {
    window.localStorage.setItem('ankos_sleep_hours', JSON.stringify(sleepHours));
  }, [sleepHours]);
  useEffect(() => {
    window.localStorage.setItem('ankos_social_battery', JSON.stringify(socialBattery));
  }, [socialBattery]);
  useEffect(() => {
    window.localStorage.setItem('ankos_laundry_date', JSON.stringify(laundryDate));
  }, [laundryDate]);
  useEffect(() => {
    window.localStorage.setItem('ankos_xp', JSON.stringify(characterXP));
  }, [characterXP]);
  useEffect(() => {
    window.localStorage.setItem('ankos_profile_avatar', JSON.stringify(profileAvatar));
  }, [profileAvatar]);
  useEffect(() => {
    window.localStorage.setItem('ankos_profile_avatar_url', JSON.stringify(profileAvatarUrl));
  }, [profileAvatarUrl]);
  useEffect(() => {
    window.localStorage.setItem('ankos_logistics', JSON.stringify(logistics));
  }, [logistics]);
  useEffect(() => {
    window.localStorage.setItem('ankos_allowance', JSON.stringify(walletAllowance));
  }, [walletAllowance]);
  useEffect(() => {
    window.localStorage.setItem('ankos_expenses', JSON.stringify(walletExpenses));
  }, [walletExpenses]);
  useEffect(() => {
    window.localStorage.setItem('ankos_bills', JSON.stringify(bills));
  }, [bills]);
  useEffect(() => {
    window.localStorage.setItem('ankos_deadlines', JSON.stringify(deadlines));
  }, [deadlines]);
  useEffect(() => {
    window.localStorage.setItem('ankos_bolos', JSON.stringify(bolosCounters));
  }, [bolosCounters]);
  useEffect(() => {
    window.localStorage.setItem('ankos_quick_notes', JSON.stringify(quickNotes));
  }, [quickNotes]);
  useEffect(() => {
    window.localStorage.setItem('ankos_rewards_rpg', JSON.stringify(rewards));
  }, [rewards]);



  // --- Dynamic RPG Parameter Computations ---

  // 1. HP / Energy level
  const totalSleep = Number(sleepHours) || 0;
  let hp = Math.min(Math.max(Math.round(totalSleep * 12.5), 10), 100); // 8 hours sleep = 100% HP
  if (focusHours > 4) {
    hp = Math.max(hp - 15, 10); // focusing heavily drains battery
  }

  // 2. Wallet Balance
  const totalExpenses = walletExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const walletBalance = walletAllowance - totalExpenses;

  // 3. Mental Health / Sanity
  let sanity = 80;
  if (totalSleep < 5) sanity -= 25; // Zombies feel crazy
  if (walletBalance < 200000) sanity -= 30; // Wallet critical drains sanity
  const urgentDeadlines = deadlines.filter(d => d.priority === 'merah' && !d.completed).length;
  sanity -= urgentDeadlines * 15;
  sanity = Math.min(Math.max(sanity, 5), 100);

  let sanityStatus = "Masih Aman 😌";
  if (walletBalance > 1500000 && sanity > 80) {
    sanityStatus = "Bahagia Habis Transferan 💸";
  } else if (sanity < 30) {
    sanityStatus = "Overthinking Jam 2 Pagi 🤯";
  } else if (sanity < 60) {
    sanityStatus = "Butuh Healing 🫠";
  }

  // 4. Level & Character title
  // Calculate level based on XP: Level = floor(XP / 100) + 1
  const characterLevel = Math.floor(characterXP / 100) + 1;
  const xpIntoCurrentLevel = characterXP % 100;
  let characterTitle = "Productivity Neophyte";
  if (characterLevel >= 10) {
    characterTitle = "Focus Monk";
  } else if (characterLevel >= 5) {
    characterTitle = "Remote Builder";
  } else if (characterLevel >= 3) {
    characterTitle = "Deep Work Enthusiast";
  }

  // --- Helper Mutator Actions ---
  const addXP = (amount) => {
    setCharacterXP(prev => {
      const nextXP = prev + amount;
      const prevLevel = Math.floor(prev / 100) + 1;
      const nextLevel = Math.floor(nextXP / 100) + 1;
      if (nextLevel > prevLevel) {
        addToast(`🎉 LEVEL UP! Kamu naik ke Level ${nextLevel} (${characterTitle})!`);
      }
      return nextXP;
    });
  };

  // --- NLP Quick-Add action dispatcher ---
  const addExpenseFromNLP = (parsed) => {
    if (!parsed || !parsed.amount) return;
    if (parsed.intent === 'income') {
      setWalletAllowance(prev => prev + parsed.amount);
    } else {
      const entry = {
        id: Date.now(),
        title: parsed.merchant || parsed.description || parsed.rawText,
        amount: parsed.amount,
        date: parsed.date || new Date().toISOString().split('T')[0],
        category: parsed.category,
        source: 'nlp',
        rawText: parsed.rawText,
      };
      setWalletExpenses(prev => [...prev, entry]);
    }
    addXP(3);
  };

  // --- Auto-save daily snapshot for Insight Engine (passive tracking) ---
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayExpenses = walletExpenses
      .filter(e => e.date === today)
      .reduce((sum, e) => sum + e.amount, 0);
    const coffeeToday = walletExpenses
      .filter(e => e.date === today && e.category === 'Kopi')
      .length;

    saveTodaySnapshot({
      sleepHours: Number(sleepHours) || 0,
      focusHours: Number(focusHours) || 0,
      hp,
      sanity,
      walletBalance,
      dailySpending: todayExpenses,
      coffeeCount: coffeeToday,
      productivityScore: Math.min(
        Math.round((Number(focusHours) / 8) * 100 + (sanity > 60 ? 20 : 0)),
        100
      ),
    });
  }, [sleepHours, focusHours, walletBalance, walletExpenses]);

  return (
    <CharacterContext.Provider value={{
      // Core states
      focusHours, setFocusHours,
      waterIntake, setWaterIntake,
      sleepHours, setSleepHours,
      socialBattery, setSocialBattery,
      laundryDate, setLaundryDate,
      profileAvatar, setProfileAvatar,
      profileAvatarUrl, setProfileAvatarUrl,
      characterXP, setCharacterXP,
      logistics, setLogistics,
      walletAllowance, setWalletAllowance,
      walletExpenses, setWalletExpenses,
      bills, setBills,
      deadlines, setDeadlines,
      bolosCounters, setBolosCounters,
      quickNotes, setQuickNotes,
      rewards, setRewards,
      toasts, removeToast, addToast,



      // Calculated values
      hp,
      sanity,
      sanityStatus,
      walletBalance,
      totalExpenses,
      characterLevel,
      xpIntoCurrentLevel,
      characterTitle,

      // Action dispatchers
      addXP,
      addExpenseFromNLP,
    }}>
      {children}
    </CharacterContext.Provider>
  );
}

export function useCharacter() {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within CharacterProvider');
  }
  return context;
}
