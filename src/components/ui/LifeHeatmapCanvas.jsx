import React from 'react';
import JournalDetailModal from './JournalDetailModal';
import { useHeatmapLogic } from '../../hooks/useHeatmapLogic';
import HeatmapControls from './heatmap/HeatmapControls';

export default function LifeHeatmapCanvas() {
  const {
    yearData,
    selectedDay, setSelectedDay,
    isModalOpen, setIsModalOpen,
    activeMetric, setActiveMetric,
    stats,
    handleSaveJournalSnippet,
    getMetricLevel
  } = useHeatmapLogic();

  // Group days into columns (weeks) of 7 days
  const weeks = [];
  for (let i = 0; i < yearData.length; i += 7) {
    weeks.push(yearData.slice(i, i + 7));
  }

  const getLevelClass = (level, metric) => {
    if (level === 0) return 'bg-slate-100/50 border-slate-200/50';
    
    if (metric === 'focus') {
      return ['bg-brand-200 border-brand-300', 'bg-brand-400 border-brand-500', 'bg-brand-500 border-brand-600', 'bg-brand-700 border-brand-800'][level - 1];
    }
    if (metric === 'sleep') {
      return ['bg-indigo-200 border-indigo-300', 'bg-indigo-400 border-indigo-500', 'bg-indigo-500 border-indigo-600', 'bg-indigo-700 border-indigo-800'][level - 1];
    }
    if (metric === 'mood') {
      return ['bg-emerald-200 border-emerald-300', 'bg-emerald-400 border-emerald-500', 'bg-emerald-500 border-emerald-600', 'bg-emerald-700 border-emerald-800'][level - 1];
    }
    if (metric === 'hydration') {
      return ['bg-sky-200 border-sky-300', 'bg-sky-400 border-sky-500', 'bg-sky-500 border-sky-600', 'bg-sky-700 border-sky-800'][level - 1];
    }
    return 'bg-slate-200 border-slate-300';
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up">
      <div className="glass-card overflow-hidden border-brand-200/50 shadow-lg bg-white/40 flex flex-col relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
        
        <HeatmapControls 
          yearDataLength={yearData.length}
          activeMetric={activeMetric} 
          setActiveMetric={setActiveMetric}
        />

        {/* DOM-Based GitHub Style Heatmap Grid */}
        <div className="relative w-full bg-white/30 p-6 sm:p-8 flex items-center justify-start overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex gap-1.5 mx-auto">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1.5">
                {week.map((day, dIdx) => {
                  const level = getMetricLevel(day, activeMetric);
                  const colorClass = getLevelClass(level, activeMetric);
                  
                  return (
                    <div 
                      key={dIdx} 
                      onClick={() => {
                        setSelectedDay(day);
                        setIsModalOpen(true);
                      }}
                      title={`${day.date}: ${activeMetric.toUpperCase()} (Level ${level})`}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border transition-all cursor-pointer hover:scale-125 hover:shadow-md hover:z-10 ${colorClass}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100/70">
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {[
              { emoji: '🔥', val: `${stats.totalFocusHours}h`, label: 'Deep Work' },
              { emoji: '🏅', val: `${stats.habitConsistency}%`, label: 'Habits' },
              { emoji: '🌙', val: `${stats.averageSleep}h`, label: 'Sleep' },
              { emoji: '😊', val: `${stats.averageMood}%`, label: 'Mood' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/55 border border-white/70 rounded-xl shadow-sm">
                <span className="text-sm leading-none">{s.emoji}</span>
                <div>
                  <div className="text-[11px] font-black text-slate-800 leading-none">{s.val}</div>
                  <div className="text-[7.5px] font-black text-slate-400 font-mono uppercase tracking-wide mt-0.5">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card-no-hover px-5 py-3 border border-white/85 flex items-start gap-3">
        <span className="text-lg shrink-0 mt-0.5">💡</span>
        <p className="text-[10px] leading-relaxed text-slate-600 font-semibold">
          Tapestri menunjukkan konsistensi <strong className="text-slate-800">{stats.habitConsistency}%</strong> dengan{' '}
          <strong className="text-slate-800">{stats.totalFocusHours} jam</strong> deep work total.{' '}
          Pilih filter metrik di atas untuk melihat intensitas fokus, jam tidur, hidrasi, atau mood harian Anda secara terpisah.
        </p>
        <div className="ml-auto shrink-0 flex flex-col items-end gap-1">
          <span className="text-[7px] font-black text-brand-600 font-mono uppercase tracking-widest px-2 py-0.5 bg-brand-500/10 rounded-full border border-brand-500/20">AI Insight</span>
        </div>
      </div>

      <JournalDetailModal
        dayData={selectedDay}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedDay(null); }}
        onSaveJournal={handleSaveJournalSnippet}
      />
    </div>
  );
}
