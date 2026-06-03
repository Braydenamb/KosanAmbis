import React from 'react';
import { 
  Palette, LayoutGrid, Compass, Wind, Sun, CloudSnow, 
  Leaf, Sliders, Eye, Download, Keyboard, EyeOff 
} from 'lucide-react';

export default function HeatmapControls({
  yearDataLength,
  layout, setLayout,
  seasonFilter, setSeasonFilter,
  zoomScale, setZoomScale,
  colorblindMode, setColorblindMode,
  onExportPoster
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-5 py-3.5 border-b border-slate-100/70">
      
      {/* Title */}
      <div className="flex items-center gap-2 mr-auto">
        <Palette className="w-4 h-4 text-indigo-500 shrink-0" />
        <span className="font-black text-slate-800 text-sm tracking-tight">Life Tapestry</span>
        <span className="text-[8px] font-black text-slate-400 font-mono uppercase tracking-widest hidden md:inline">
          · {new Date().getFullYear()} · {yearDataLength} days
        </span>
      </div>

      {/* Layout pills */}
      <div className="flex gap-1">
        {[
          { id: 'grid',   label: 'Grid',   icon: LayoutGrid },
          { id: 'radial', label: 'Radial', icon: Compass },
          { id: 'ribbon', label: 'Ribbon', icon: Wind },
        ].map(l => {
          const Icon = l.icon;
          return (
            <button
              key={l.id}
              onClick={() => setLayout(l.id)}
              title={`Layout: ${l.label}`}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[9px] font-black font-mono uppercase tracking-wide transition-all active:scale-95 cursor-pointer border ${
                layout === l.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white/60 text-slate-500 border-slate-200/70 hover:text-slate-800 hover:bg-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span className="hidden sm:inline">{l.label}</span>
            </button>
          );
        })}
      </div>

      {/* Season pills */}
      <div className="flex gap-1">
        {[
          { id: 'spring', icon: Leaf,      color: 'text-emerald-600 bg-emerald-50  border-emerald-200' },
          { id: 'summer', icon: Sun,       color: 'text-amber-600   bg-amber-50    border-amber-200'   },
          { id: 'autumn', icon: Wind,      color: 'text-orange-600  bg-orange-50   border-orange-200'  },
          { id: 'winter', icon: CloudSnow, color: 'text-sky-600     bg-sky-50      border-sky-200'     },
        ].map(s => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setSeasonFilter(s.id)}
              title={`Season: ${s.id}`}
              className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-90 ${
                seasonFilter === s.id ? s.color : 'bg-white/60 border-slate-200/70 text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
            </button>
          );
        })}
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-1.5 hidden md:flex">
        <Sliders className="w-3 h-3 text-slate-400 shrink-0" />
        <input
          type="range" min="0.7" max="1.8" step="0.1"
          value={zoomScale}
          onChange={e => setZoomScale(parseFloat(e.target.value))}
          className="w-20 accent-slate-800 cursor-ew-resize h-1 bg-slate-200 rounded-lg appearance-none"
          title="Zoom"
        />
      </div>

      {/* Pattern toggle */}
      <button
        onClick={() => setColorblindMode(!colorblindMode)}
        title={colorblindMode ? 'Pattern ON' : 'Pattern OFF'}
        className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
          colorblindMode
            ? 'bg-indigo-100 border-indigo-200 text-indigo-700'
            : 'bg-white/60 border-slate-200/70 text-slate-400 hover:text-slate-600'
        }`}
      >
        {colorblindMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>

      {/* Export button */}
      <button
        onClick={onExportPoster}
        title="Export Gallery Poster"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[9px] font-black font-mono uppercase tracking-wide border border-slate-900 shadow-md hover:bg-slate-800 active:scale-95 cursor-pointer transition-all group overflow-hidden relative"
      >
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-full left-[-50%] transition-all duration-500" />
        <Download className="w-3.5 h-3.5 text-brand-400" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {/* Keyboard hint */}
      <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-1 text-[8px] font-black text-slate-400 bg-white/60 border border-slate-200 rounded-lg font-mono">
        <Keyboard className="w-3 h-3" /> Nav
      </kbd>
    </div>
  );
}
