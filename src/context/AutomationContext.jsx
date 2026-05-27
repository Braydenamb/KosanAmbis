import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveTodaySnapshot } from '../hooks/useInsightEngine';

const AutomationContext = createContext();

// ─── CONNECTION STATUS DEFAULTS ───────────────────────────────────────────────
const DEFAULT_CONNECTIONS = {
  telegram: { connected: false, botUsername: '', chatId: '', lastMessage: null },
  github: { connected: false, username: '', webhookActive: false, lastCommit: null },
  health: { connected: false, provider: null, lastSync: null },
  fileWatcher: { active: false, watchedPaths: [], lastEvent: null },
};

export function AutomationProvider({ children }) {
  // ── Online/Offline state ──
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'error' | 'offline'
  const [lastSyncAt, setLastSyncAt] = useState(() => {
    const stored = localStorage.getItem('zf_last_sync');
    return stored ? new Date(stored) : null;
  });

  // ── Connection states ──
  const [connections, setConnections] = useState(() => {
    try {
      const stored = localStorage.getItem('zf_connections');
      return stored ? { ...DEFAULT_CONNECTIONS, ...JSON.parse(stored) } : DEFAULT_CONNECTIONS;
    } catch { return DEFAULT_CONNECTIONS; }
  });

  // ── Event queue (offline buffer) ──
  const [pendingEvents, setPendingEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('zf_pending_events');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // ── Recent processed events ──
  const [recentEvents, setRecentEvents] = useState(() => {
    try {
      const stored = localStorage.getItem('zf_recent_events');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // ── Dashboard mode state ──
  const [dashboardMode, setDashboardMode] = useState('normal'); // 'normal' | 'fatigue' | 'budget_alert' | 'focus'

  // ─── ONLINE/OFFLINE MONITORING ────────────────────────────────────────────
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      flushPendingEvents();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ─── PERSIST TO LOCALSTORAGE ──────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('zf_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('zf_pending_events', JSON.stringify(pendingEvents));
  }, [pendingEvents]);

  useEffect(() => {
    localStorage.setItem('zf_recent_events', JSON.stringify(recentEvents.slice(0, 100)));
  }, [recentEvents]);

  // ─── EVENT PROCESSING ─────────────────────────────────────────────────────
  const processEvent = useCallback((event) => {
    const fullEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date().toISOString(),
      processed: false,
      ...event,
    };

    if (!isOnline) {
      // Queue for later
      setPendingEvents(prev => [...prev, fullEvent]);
      return fullEvent;
    }

    // For local-only mode (Phase 1), directly process
    applyEventEffects(fullEvent);
    setRecentEvents(prev => [fullEvent, ...prev].slice(0, 100));
    setLastSyncAt(new Date());
    localStorage.setItem('zf_last_sync', new Date().toISOString());
    
    return { ...fullEvent, processed: true };
  }, [isOnline]);

  const applyEventEffects = (event) => {
    // Apply dashboard mode changes based on event effects
    if (event.effects) {
      const modeEffect = event.effects.find(e => e.type === 'dashboard_mode');
      if (modeEffect) {
        setDashboardMode(modeEffect.value);
      }
    }
  };

  const flushPendingEvents = useCallback(async () => {
    if (pendingEvents.length === 0) {
      setSyncStatus('idle');
      return;
    }
    // In Phase 1 (local only), just mark all as processed
    const processed = pendingEvents.map(e => ({ ...e, processed: true }));
    setRecentEvents(prev => [...processed, ...prev].slice(0, 100));
    setPendingEvents([]);
    setLastSyncAt(new Date());
    setSyncStatus('idle');
  }, [pendingEvents]);

  // ─── SNAPSHOT UPDATER ─────────────────────────────────────────────────────
  /**
   * Call this whenever key CharacterContext values change
   * to build the daily snapshot for insight engine.
   */
  const updateTodaySnapshot = useCallback((data) => {
    saveTodaySnapshot(data);
  }, []);

  // ─── INTEGRATION CONNECTORS ───────────────────────────────────────────────
  const updateConnection = useCallback((provider, data) => {
    setConnections(prev => ({
      ...prev,
      [provider]: { ...prev[provider], ...data },
    }));
  }, []);

  const simulateTelegramMessage = useCallback((text, onResult) => {
    // Simulate a Telegram bot message being received (for demo/testing)
    const event = {
      source: 'telegram',
      category: 'finance',
      rawInput: text,
    };
    const result = processEvent(event);
    if (onResult) onResult(result);
  }, [processEvent]);

  // ─── AUTOMATION STATS ─────────────────────────────────────────────────────
  const automationStats = {
    totalEventsProcessed: recentEvents.length,
    pendingCount: pendingEvents.length,
    connectedIntegrations: Object.values(connections).filter(c => c.connected || c.active).length,
  };

  return (
    <AutomationContext.Provider value={{
      // Status
      isOnline,
      syncStatus,
      lastSyncAt,
      dashboardMode,
      setDashboardMode,

      // Connections
      connections,
      updateConnection,

      // Events
      pendingEvents,
      recentEvents,
      processEvent,
      flushPendingEvents,
      simulateTelegramMessage,

      // Snapshot
      updateTodaySnapshot,

      // Stats
      automationStats,
    }}>
      {children}
    </AutomationContext.Provider>
  );
}

export function useAutomation() {
  const ctx = useContext(AutomationContext);
  if (!ctx) throw new Error('useAutomation must be used within AutomationProvider');
  return ctx;
}
