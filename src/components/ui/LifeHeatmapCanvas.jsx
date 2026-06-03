import React, { useRef, useState, useEffect } from 'react';
import JournalDetailModal from './JournalDetailModal';
import { exportHeatmapPoster } from '../../utils/posterExporter';
import { useHeatmapLogic } from '../../hooks/useHeatmapLogic';
import HeatmapControls from './heatmap/HeatmapControls';

export default function LifeHeatmapCanvas({ uiMode = 'liquid' }) {
  const {
    yearData, selectedDay, setSelectedDay,
    isModalOpen, setIsModalOpen,
    layout, setLayout,
    visualMode,
    seasonFilter, setSeasonFilter,
    zoomScale, setZoomScale,
    colorblindMode, setColorblindMode,
    hoveredDay, setHoveredDay,
    tooltipPos, setTooltipPos,
    activeKeyIndex, setActiveKeyIndex,
    srAnnouncement, setSrAnnouncement,
    canvasDimensions, setCanvasDimensions,
    stats,
    handleSaveJournalSnippet,
    calculateCompositeColor,
    toRgbaStr,
    cachedPositions,
    computeLayoutCoordinates,
    getAmbientAuraClass
  } = useHeatmapLogic(uiMode);

  const canvasRef = useRef(null);

  // ── Keyboard Nav ──
  const handleKeyDown = (e) => {
    if (yearData.length === 0) return;
    let newIdx = activeKeyIndex;
    
    if (e.key === 'ArrowRight') newIdx = Math.min(activeKeyIndex + 1, yearData.length - 1);
    else if (e.key === 'ArrowLeft') newIdx = Math.max(activeKeyIndex - 1, 0);
    else if (e.key === 'ArrowUp' && layout === 'grid') newIdx = Math.max(activeKeyIndex - 7, 0);
    else if (e.key === 'ArrowDown' && layout === 'grid') newIdx = Math.min(activeKeyIndex + 7, yearData.length - 1);
    else if (e.key === 'Enter' && activeKeyIndex >= 0) {
      setSelectedDay(yearData[activeKeyIndex]);
      setIsModalOpen(true);
    }
    
    if (newIdx !== activeKeyIndex) {
      setActiveKeyIndex(newIdx);
      const day = yearData[newIdx];
      setSrAnnouncement(`Tanggal ${day.date}. Mood ${Math.round(day.mood * 100)} persen. Tekan enter untuk detail.`);
      
      const pos = cachedPositions.current.find(p => p.index === newIdx);
      if (pos) {
        setHoveredDay({ index: newIdx, day });
        setTooltipPos({ x: pos.x, y: pos.y });
      }
    }
  };

  const handleExportPoster = () => {
    exportHeatmapPoster({
      yearData, layout, visualMode, seasonFilter, calculateCompositeColor, toRgbaStr
    });
  };

  // ── Rendering Canvas ──
  useEffect(() => {
    const parent = canvasRef.current?.parentElement;
    if (!parent) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        setCanvasDimensions({ width, height });
      }
    });
    resizeObserver.observe(parent);
    return () => resizeObserver.disconnect();
  }, [setCanvasDimensions]);

  const applySeasonalFilter = (ctx, w, h) => {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    let grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, w);
    
    if (seasonFilter === 'spring') {
      grad.addColorStop(0, 'rgba(255, 224, 231, 0.1)');
      grad.addColorStop(1, 'rgba(254, 243, 199, 0.05)');
    } else if (seasonFilter === 'summer') {
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.12)');
      grad.addColorStop(1, 'rgba(249, 115, 22, 0.05)');
    } else if (seasonFilter === 'autumn') {
      grad.addColorStop(0, 'rgba(217, 119, 6, 0.12)');
      grad.addColorStop(1, 'rgba(120, 53, 4, 0.05)');
    } else {
      grad.addColorStop(0, 'rgba(186, 230, 253, 0.1)');
      grad.addColorStop(1, 'rgba(30, 58, 138, 0.05)');
    }
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  const applyGrainTexture = (ctx, w, h) => {
    ctx.save();
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < w; i += 4) {
      for (let j = 0; j < h; j += 4) {
        if (Math.random() > 0.5) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || canvasDimensions.width === 0) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvasDimensions;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.clearRect(0, 0, width, height);
    
    const coords = computeLayoutCoordinates(width, height);
    
    if (layout !== 'grid') {
      ctx.beginPath();
      ctx.lineWidth = 1.5 * zoomScale;
      ctx.strokeStyle = 'rgba(89, 158, 255, 0.2)';
      coords.forEach((coord, i) => {
        if (i === 0) ctx.moveTo(coord.x, coord.y);
        else ctx.lineTo(coord.x, coord.y);
      });
      ctx.stroke();
    }
    
    coords.forEach(coord => {
      const day = yearData[coord.index];
      const color = calculateCompositeColor(day);
      const isHovered = hoveredDay && hoveredDay.index === coord.index;
      const isKeyActive = activeKeyIndex === coord.index;
      const isActive = isHovered || isKeyActive;
      
      ctx.save();
      
      if (isActive) {
        ctx.shadowColor = toRgbaStr(color, 0.8);
        ctx.shadowBlur = 12 * zoomScale;
      }
      
      if (visualMode === 'liquid') {
        ctx.fillStyle = toRgbaStr(color, isActive ? 1.0 : 0.85);
        ctx.beginPath();
        if (layout === 'grid') {
          const r = coord.size * 0.35;
          const rectSize = isActive ? coord.size * 1.15 : coord.size;
          const os = isActive ? (rectSize - coord.size)/2 : 0;
          ctx.roundRect(coord.x - coord.size/2 - os, coord.y - coord.size/2 - os, rectSize, rectSize, r);
        } else {
          ctx.arc(coord.x, coord.y, (isActive ? coord.size * 1.2 : coord.size) / 2, 0, Math.PI * 2);
        }
        ctx.fill();
        
        if (colorblindMode && day.productivity > 0.7) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, coord.size * 0.15, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.fillStyle = toRgbaStr(color, isActive ? 1.0 : 0.9);
        ctx.strokeStyle = isActive ? '#0f172a' : 'rgba(15,23,42,0.1)';
        ctx.lineWidth = isActive ? 2 : 1;
        
        ctx.beginPath();
        if (layout === 'grid') {
          const rectSize = isActive ? coord.size * 1.1 : coord.size * 0.9;
          const os = isActive ? (rectSize - coord.size)/2 : (coord.size - rectSize)/2;
          ctx.rect(coord.x - coord.size/2 - (isActive?os:-os), coord.y - coord.size/2 - (isActive?os:-os), rectSize, rectSize);
        } else {
          ctx.arc(coord.x, coord.y, (isActive ? coord.size * 1.1 : coord.size * 0.9) / 2, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();
      }
      
      if (isActive) {
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (layout === 'grid') {
          ctx.roundRect(coord.x - coord.size/2 - 2, coord.y - coord.size/2 - 2, coord.size + 4, coord.size + 4, 4);
        } else {
          ctx.arc(coord.x, coord.y, coord.size/2 + 4, 0, Math.PI * 2);
        }
        ctx.stroke();
      }
      
      ctx.restore();
    });
    
    applySeasonalFilter(ctx, width, height);
    applyGrainTexture(ctx, width, height);
    
  }, [yearData, layout, visualMode, seasonFilter, zoomScale, colorblindMode, canvasDimensions, hoveredDay, activeKeyIndex, computeLayoutCoordinates, calculateCompositeColor, toRgbaStr]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    let found = null;
    for (let pos of cachedPositions.current) {
      const dx = pos.x - x;
      const dy = pos.y - y;
      if (Math.sqrt(dx*dx + dy*dy) < pos.size) {
        found = pos;
        break;
      }
    }
    
    if (found) {
      setHoveredDay({ index: found.index, day: yearData[found.index] });
      setTooltipPos({ x: found.x, y: found.y });
    } else {
      setHoveredDay(null);
    }
  };

  const handleMouseLeave = () => setHoveredDay(null);
  
  const handleCanvasClick = () => {
    if (hoveredDay) {
      setSelectedDay(hoveredDay.day);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up">
      <div className="sr-only" aria-live="polite">{srAnnouncement}</div>

      <div className="glass-card overflow-hidden border-brand-200/50 shadow-lg bg-white/40 flex flex-col relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none mix-blend-overlay"></div>
        
        <HeatmapControls 
          yearDataLength={yearData.length}
          layout={layout} setLayout={setLayout}
          seasonFilter={seasonFilter} setSeasonFilter={setSeasonFilter}
          zoomScale={zoomScale} setZoomScale={setZoomScale}
          colorblindMode={colorblindMode} setColorblindMode={setColorblindMode}
          onExportPoster={handleExportPoster}
        />

        <div 
          className={`relative w-full bg-white/20 flex items-center justify-center select-none ${getAmbientAuraClass()}`}
          style={{ minHeight: layout === 'ribbon' ? 280 : layout === 'radial' ? 480 : 420 }}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Generative Life Heatmap Canvas. Gunakan tombol panah keyboard untuk menavigasi."
        >
          <canvas 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
            className="w-full h-full cursor-crosshair transition-all duration-300"
            style={{ width: canvasDimensions.width, height: canvasDimensions.height }}
          />

          {hoveredDay && (
            <div 
              className="absolute z-[150] pointer-events-none bg-white/96 border rounded-2xl p-3.5 shadow-2xl text-xs text-slate-800 max-w-[220px] -translate-x-1/2 -translate-y-full flex flex-col gap-2"
              style={{ 
                left: tooltipPos.x, 
                top: tooltipPos.y,
                borderColor: toRgbaStr(calculateCompositeColor(hoveredDay.day), 0.45),
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="font-extrabold text-slate-800 font-mono text-[11px]">{hoveredDay.day.date}</span>
                <span className="text-[7px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest font-mono">Day {hoveredDay.index + 1}</span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-500">
                <div className="flex justify-between"><span>😊 Mood:</span><strong className="text-slate-800">{Math.round(hoveredDay.day.mood * 100)}%</strong></div>
                <div className="flex justify-between"><span>⚡ Ambis:</span><strong className="text-slate-800">{Math.round(hoveredDay.day.productivity * 100)}%</strong></div>
                <div className="flex justify-between"><span>🌙 Sleep:</span><strong className="text-slate-800">{hoveredDay.day.sleep}j</strong></div>
                <div className="flex justify-between"><span>💧 Hydr:</span><strong className="text-slate-800">{hoveredDay.day.hydration}gls</strong></div>
              </div>
              {hoveredDay.day.journalSnippet && (
                <p className="text-[9px] leading-relaxed text-slate-500 italic border-t border-slate-100 pt-1.5 line-clamp-2">
                  "{hoveredDay.day.journalSnippet}"
                </p>
              )}
              <div className="text-[7px] font-bold text-center text-slate-400 tracking-wider uppercase font-mono">Click to reflect</div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t border-slate-100/70">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-widest font-mono shrink-0">Spectrum:</span>
            {[
              { label: 'Ambis',    color: 'bg-emerald-500', glow: 'shadow-[0_0_6px_rgba(16,185,129,0.5)]' },
              { label: 'Focus',    color: 'bg-brand-500',   glow: 'shadow-[0_0_6px_rgba(89,158,255,0.5)]'  },
              { label: 'Deep',     color: 'bg-violet-500',  glow: 'shadow-[0_0_6px_rgba(139,92,246,0.5)]'  },
              { label: 'Social',   color: 'bg-amber-500',   glow: 'shadow-[0_0_6px_rgba(249,115,22,0.5)]'  },
              { label: 'Burnout',  color: 'bg-rose-500',    glow: 'shadow-[0_0_6px_rgba(239,68,68,0.5)]'   },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${l.color} ${l.glow} shrink-0`} />
                <span className="text-[9px] font-bold text-slate-500">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
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
          Tidur rata-rata <strong className="text-slate-800">{stats.averageSleep}j</strong> — pertahankan diatas 7j untuk menjaga mood index tetap di atas 70%.
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

