import React from 'react';
import { Wifi, WifiOff, RefreshCw, Clock } from 'lucide-react';
import { useAutomation } from '../../context/AutomationContext';

function formatRelativeTime(date) {
  if (!date) return 'Belum sync';
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);

  if (diffSec < 60) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit lalu`;
  return new Date(date).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export default function SyncStatusBadge({ compact = false }) {
  const { isOnline, syncStatus, lastSyncAt, automationStats } = useAutomation();

  const statusConfig = {
    idle: {
      dot: 'bg-emerald-500',
      text: 'text-slate-500',
      label: isOnline ? 'Sync aktif' : 'Offline',
      ping: false,
    },
    syncing: {
      dot: 'bg-brand-500',
      text: 'text-brand-600',
      label: 'Syncing...',
      ping: true,
    },
    error: {
      dot: 'bg-rose-500',
      text: 'text-rose-600',
      label: 'Sync error',
      ping: false,
    },
    offline: {
      dot: 'bg-amber-500',
      text: 'text-amber-600',
      label: 'Offline mode',
      ping: false,
    },
  };

  const config = statusConfig[syncStatus] || statusConfig.idle;

  if (compact) {
    return (
      <div
        className="flex items-center gap-1.5 cursor-default"
        title={`${config.label} · Last sync: ${formatRelativeTime(lastSyncAt)}`}
        role="status"
        aria-label={`Sync status: ${config.label}`}
      >
        <div className="relative w-2 h-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          {config.ping && (
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${config.dot} animate-ping opacity-75`} />
          )}
        </div>
        {!isOnline && <WifiOff className="w-3 h-3 text-amber-500" />}
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-2.5 py-1.5 bg-white/40 border border-white/60 rounded-xl cursor-default"
      role="status"
      aria-label={`Data sync status: ${config.label}`}
    >
      {/* Status dot */}
      <div className="relative w-1.5 h-1.5 shrink-0">
        <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.ping && (
          <div className={`absolute inset-0 rounded-full ${config.dot} animate-ping opacity-75`} />
        )}
      </div>

      {/* Icon */}
      {syncStatus === 'syncing' ? (
        <RefreshCw className="w-3 h-3 text-brand-500 animate-spin" />
      ) : isOnline ? (
        <Wifi className="w-3 h-3 text-emerald-500" />
      ) : (
        <WifiOff className="w-3 h-3 text-amber-500" />
      )}

      {/* Label */}
      <div className="flex flex-col leading-none">
        <span className={`text-[8px] font-black uppercase tracking-widest font-mono ${config.text}`}>
          {config.label}
        </span>
        {lastSyncAt && (
          <span className="text-[7px] text-slate-400 font-mono flex items-center gap-0.5 mt-0.5">
            <Clock className="w-2 h-2" />
            {formatRelativeTime(lastSyncAt)}
          </span>
        )}
      </div>

      {/* Pending events badge */}
      {automationStats.pendingCount > 0 && (
        <span className="ml-1 px-1 py-0.5 bg-amber-100 border border-amber-200 text-amber-700 text-[7px] font-black rounded font-mono">
          {automationStats.pendingCount} pending
        </span>
      )}
    </div>
  );
}
