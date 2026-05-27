import React, { useState } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Zap, ChevronDown, X } from 'lucide-react';
import { useInsightEngine } from '../../hooks/useInsightEngine';
import { useCharacter } from '../../context/CharacterContext';

// ─── SEVERITY CONFIGURATION ────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  high: {
    border: 'border-rose-200/70',
    bg: 'bg-rose-50/60',
    icon: AlertTriangle,
    iconColor: 'text-rose-500',
    badge: 'bg-rose-100 text-rose-700 border-rose-200',
    badgeText: 'PENTING',
    glow: 'shadow-[0_0_12px_rgba(244,63,94,0.12)]',
  },
  medium: {
    border: 'border-amber-200/70',
    bg: 'bg-amber-50/50',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    badgeText: 'PERHATIAN',
    glow: '',
  },
  positive: {
    border: 'border-emerald-200/70',
    bg: 'bg-emerald-50/50',
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    badgeText: 'BAGUS!',
    glow: '',
  },
  info: {
    border: 'border-blue-200/60',
    bg: 'bg-blue-50/40',
    icon: Info,
    iconColor: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200',
    badgeText: 'INFO',
    glow: '',
  },
  low: {
    border: 'border-slate-200/60',
    bg: 'bg-slate-50/50',
    icon: Info,
    iconColor: 'text-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200',
    badgeText: 'TIP',
    glow: '',
  },
};

// ─── SINGLE INSIGHT CARD ──────────────────────────────────────────────────────
function InsightCard({ insight, onDismiss }) {
  const [expanded, setExpanded] = useState(false);
  const config = SEVERITY_CONFIG[insight.severity] || SEVERITY_CONFIG.info;
  const IconComponent = config.icon;

  return (
    <div className={`
      relative rounded-2xl border p-4 transition-all duration-300
      ${config.border} ${config.bg} ${config.glow}
    `}>
      <div className="flex items-start gap-3">
        {/* Emoji + Icon */}
        <div className="shrink-0 w-9 h-9 rounded-xl bg-white/70 border border-white/80 flex items-center justify-center text-base shadow-sm">
          {insight.emoji}
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border font-mono ${config.badge}`}>
              {config.badgeText}
            </span>
            <h4 className="text-xs font-extrabold text-slate-800 leading-tight">{insight.title}</h4>
          </div>
          <p className="text-[10px] text-slate-600 leading-relaxed">{insight.message}</p>

          {/* Suggestion (expandable) */}
          {insight.suggestion && (
            <div className={`overflow-hidden transition-all duration-300 ${expanded ? 'max-h-24 mt-2' : 'max-h-0'}`}>
              <div className="flex items-start gap-1.5 bg-white/60 rounded-xl px-3 py-2 border border-white/80">
                <Zap className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-700 font-semibold leading-relaxed">{insight.suggestion}</p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {onDismiss && (
            <button
              onClick={() => onDismiss(insight.id)}
              className="p-1 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              title="Abaikan"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {insight.suggestion && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              title={expanded ? 'Sembunyikan' : 'Lihat saran'}
            >
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
function InsightEmptyState({ snapshotCount }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-brand-50/80 border border-brand-100 flex items-center justify-center mb-3">
        <Brain className="w-5 h-5 text-brand-500" />
      </div>
      <p className="text-xs font-bold text-slate-600 mb-1">
        {snapshotCount < 3 ? 'Data Masih Terkumpul...' : 'Semua Terlihat Baik! ✨'}
      </p>
      <p className="text-[10px] text-slate-400 max-w-48 leading-relaxed">
        {snapshotCount < 3
          ? `${snapshotCount}/3 hari data terkumpul. Insight akan muncul setelah beberapa hari pemakaian.`
          : 'Tidak ada anomali terdeteksi. Kamu sedang on track!'
        }
      </p>
      {snapshotCount < 3 && (
        <div className="mt-3 flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${i < snapshotCount ? 'bg-brand-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN PANEL ───────────────────────────────────────────────────────────────
export default function InsightPanel() {
  const character = useCharacter();
  const { insights, snapshotCount } = useInsightEngine(character);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('zf_dismissed_insights') || '[]');
    } catch { return []; }
  });
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleDismiss = (id) => {
    const updated = [...dismissed, id];
    setDismissed(updated);
    localStorage.setItem('zf_dismissed_insights', JSON.stringify(updated));
  };

  const visibleInsights = insights.filter(i => !dismissed.includes(i.id));
  const highCount = visibleInsights.filter(i => i.severity === 'high').length;

  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-500/10 rounded-lg border border-brand-500/15">
            <Brain className="w-3.5 h-3.5 text-brand-600" />
          </div>
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2">
              AI LIFE INSIGHTS
              {highCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-500 text-white text-[8px] font-black rounded-full animate-pulse">
                  {highCount}
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[8px] text-slate-400 font-mono">
            {snapshotCount} hari data
          </span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-slate-100/60 rounded-lg transition-all cursor-pointer text-slate-400"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <>
          {visibleInsights.length === 0 ? (
            <InsightEmptyState snapshotCount={snapshotCount} />
          ) : (
            <div className="flex flex-col gap-3">
              {visibleInsights.map(insight => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}

          {/* Stats footer */}
          {visibleInsights.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/60 flex items-center justify-between text-[8px] text-slate-400 font-mono">
              <span>{visibleInsights.length} insight aktif</span>
              <button
                onClick={() => {
                  const allIds = visibleInsights.map(i => i.id);
                  const updated = [...dismissed, ...allIds];
                  setDismissed(updated);
                  localStorage.setItem('zf_dismissed_insights', JSON.stringify(updated));
                }}
                className="hover:text-slate-600 transition-colors cursor-pointer"
              >
                Abaikan semua
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
