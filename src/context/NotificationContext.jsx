import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAtmosphere } from './AtmosphereContext';

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: '1',
    title: '⚠️ URGENT DEADLINE APPROACHING',
    message: 'Tugas Kuliah Praktikum AI harus dikumpulkan dalam waktu 1 jam lagi! Buka PKM sekarang.',
    category: 'productivity',
    priority: 'critical',
    time: '5 menit lalu',
    read: false,
    archived: false,
    details: 'Praktikum 8 tentang Artificial Intelligence Agent. Nilai memiliki bobot 15% dari nilai akhir semester.'
  },
  {
    id: '2',
    title: '🚨 LIQUIDITY WARNING',
    message: 'Saldo tabungan Kosan Anda berada di bawah Rp 200.000! Survival mode aktif.',
    category: 'financial',
    priority: 'critical',
    time: '12 menit lalu',
    read: false,
    archived: false,
    details: 'Total pengeluaran minggu ini melonjak karena tagihan token listrik dan warkop. Pertimbangkan menunda checkout wishlist Tokopedia.'
  },
  {
    id: '3',
    title: '💬 Mentions in #laundry-invoicing',
    message: 'Budi: "Uang kas laundry sprei kasur belum dibayar ya bro? Kas mau ditutup sore ini."',
    category: 'social',
    priority: 'important',
    time: '25 menit lalu',
    read: false,
    archived: false,
    details: 'Tagihan patungan kas laundry sprei sebesar Rp 15.000 jatuh tempo hari ini.'
  },
  {
    id: '4',
    title: '💧 Hydration Check Alert',
    message: 'Anda baru meminum 2 gelas hari ini. Otak Anda butuh hidrasi agar tetap fokus ambis!',
    category: 'health',
    priority: 'info',
    time: '45 menit lalu',
    read: false,
    archived: false,
    details: 'Membiasakan minum 8 gelas air per hari meningkatkan daya ingat jangka pendek hingga 15%.'
  },
  {
    id: '5',
    title: '🧠 AI Cognitive Health Insight',
    message: 'Kami mendeteksi 14 interrupsi mikro selama deep work. Fokus rata-rata Anda menyusut 18%.',
    category: 'ai',
    priority: 'info',
    time: '1 jam lalu',
    read: true,
    archived: false,
    details: 'Buka notifikasi berulang di HP memecah konsentrasi. Kami merekomendasikan menyalakan Study Focus Mode.'
  },
  {
    id: '6',
    title: '🧘 Posture Integrity Reminder',
    message: 'Tegakkan punggung Anda, tarik bahu ke belakang, dan rilekskan otot leher.',
    category: 'health',
    priority: 'ambient',
    time: '2 jam lalu',
    read: true,
    archived: false,
    details: 'Postur membungkuk menekan paru-paru dan membatasi suplai oksigen ke otak sebesar 20%.'
  },
  {
    id: '7',
    title: '☁️ Kosan Workspace Synced',
    message: 'Konfigurasi repo lokal KosanAmbis berhasil disinkronisasi ke server remote git.',
    category: 'system',
    priority: 'ambient',
    time: '3 jam lalu',
    read: true,
    archived: false,
    details: 'Commit Hash: bd14868c57affc197873feab48f12d2c0412110b pushed successfully to origin/main.'
  }
];

export function NotificationProvider({ children }) {
  const { focusMode } = useAtmosphere();
  const [notifications, setNotifications] = useState(() => {
    const local = window.localStorage.getItem('ankos_notifications');
    return local ? JSON.parse(local) : initialNotifications;
  });

  // Sync to LocalStorage
  useEffect(() => {
    window.localStorage.setItem('ankos_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Focus Mode silent batching trigger
  useEffect(() => {
    if (focusMode) {
      // Transition non-critical alerts to silent digest mode
      setNotifications(prev => prev.map(noti => {
        if (noti.priority !== 'critical' && !noti.read) {
          return { ...noti, read: true }; // Batch silently
        }
        return noti;
      }));
    }
  }, [focusMode]);

  // Action: Clear / Dismiss
  const dismissNotification = (id) => {
    setNotifications(prev => prev.map(noti => {
      if (noti.id === id) {
        return { ...noti, archived: true };
      }
      return noti;
    }));
  };

  // Action: Mark Read/Unread
  const toggleRead = (id) => {
    setNotifications(prev => prev.map(noti => {
      if (noti.id === id) {
        return { ...noti, read: !noti.read };
      }
      return noti;
    }));
  };

  // Action: Snooze
  const snoozeNotification = (id, durationMinutes = 15) => {
    setNotifications(prev => prev.map(noti => {
      if (noti.id === id) {
        return { ...noti, archived: true }; // Hide now, reappear later
      }
      return noti;
    }));

    // Re-queue notification after timer
    setTimeout(() => {
      setNotifications(prev => prev.map(noti => {
        if (noti.id === id) {
          return { ...noti, archived: false, time: 'Just now (Snooze expired)' };
        }
        return noti;
      }));
    }, durationMinutes * 60 * 1000);
  };

  // Action: Clear All
  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(noti => ({ ...noti, archived: true })));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        dismissNotification,
        toggleRead,
        snoozeNotification,
        clearAllNotifications,
        unreadCount: notifications.filter(n => !n.read && !n.archived).length
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
