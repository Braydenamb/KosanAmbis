import React from 'react';
import { Palette, Flame, Moon, Droplet, Smile } from 'lucide-react';

export default function HeatmapControls({
  yearDataLength,
  activeMetric, setActiveMetric
}) {
  const metrics = [
    { id: 'focus', label: 'Focus Hours', icon: Flame, colorClass: 'text-brand-600 bg-brand-50 border-brand-200 hover:bg-brand-100' },
    { id: 'sleep', label: 'Sleep', icon: Moon, colorClass: 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100' },
    { id: 'mood', label: 'Mood', icon: Smile, colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
    { id: 'hydration', label: 'Hydration', icon: Droplet, colorClass: 'text-sky-600 bg-sky-50 border-sky-200 hover:bg-sky-100' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4 px-5 py-3.5 border-b border-slate-100/70">
      
      {/* Title */}
      <div className="flex items-center gap-2 mr-auto">
        <Palette className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="font-black text-slate-800 text-sm tracking-tight">Life Tapestry</span>
        <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest hidden md:inline">
          · {new Date().getFullYear()} · {yearDataLength} days
        </span>
      </div>

      {/* Metric Toggles */}
      <div className="flex gap-1.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {metrics.map(m => {
          const Icon = m.icon;
          const isActive = activeMetric === m.id;
          
          return (
            <button
              key={m.id}
              onClick={() => setActiveMetric(m.id)}
              title={`View ${m.label}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black font-mono uppercase tracking-wide transition-all active:scale-95 cursor-pointer border shrink-0 ${
                isActive
                  ? m.colorClass + ' shadow-sm'
                  : 'bg-white/60 text-slate-500 border-slate-200/70 hover:text-slate-800 hover:bg-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
