import React, { useRef, useState, useEffect } from 'react';
import { generateYearlyData } from '../../utils/heatmapMockGenerator';
import JournalDetailModal from './JournalDetailModal';
import KineticCounter from './KineticCounter';
import { useCharacter } from '../../context/CharacterContext';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { 
  Palette, LayoutGrid, Compass, Wind, Sun, CloudSnow, 
  Leaf, Sliders, Info, Eye, Download, Keyboard, EyeOff,
  Flame, Moon, Droplet, Smile, ShieldAlert, Award
} from 'lucide-react';

export default function LifeHeatmapCanvas() {
  const { uiMode } = useAtmosphere();

  // --- 1. CONFIG & SYSTEM STATE ---
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // Data State: Initialize procedurally
  const [yearData, setYearData] = useState(() => generateYearlyData('2026-05-26'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Interactive View States
  const [layout, setLayout] = useState('grid'); // 'grid' | 'radial' | 'ribbon'
  const visualMode = uiMode; // Map globally to Adaptive OS state
  const [seasonFilter, setSeasonFilter] = useState('spring'); // 'spring' | 'summer' | 'autumn' | 'winter'
  const [zoomScale, setZoomScale] = useState(1);
  const [colorblindMode, setColorblindMode] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeKeyIndex, setActiveKeyIndex] = useState(-1); // Keyboard focus cell index

  // Screen Reader Accessibility Log
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // Offscreen sizing state
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 700, height: 420 });

  // --- 2. CALCULATE HISTORICAL REFLECTION STATISTICS ---
  const [stats, setStats] = useState({
    totalFocusHours: 0,
    averageMood: 0,
    averageSleep: 0,
    habitConsistency: 0,
    stressLevel: 0
  });

  useEffect(() => {
    if (yearData.length === 0) return;

    let focusTotal = 0;
    let moodSum = 0;
    let sleepSum = 0;
    let habitsDone = 0;
    let stressSum = 0;

    yearData.forEach(d => {
      focusTotal += d.focusMinutes || 0;
      moodSum += d.mood || 0;
      sleepSum += d.sleep || 0;
      habitsDone += d.habits?.length || 0;
      stressSum += d.stress || 0;
    });

    const focusHours = (focusTotal / 60).toFixed(1);
    const avgMood = Math.round((moodSum / yearData.length) * 100);
    const avgSleep = (sleepSum / yearData.length).toFixed(1);
    // Habit consistency relative to a max possible 8 habits daily
    const habitPercent = Math.round((habitsDone / (yearData.length * 8)) * 100);
    const avgStress = Math.round((stressSum / yearData.length) * 100);

    setStats({
      totalFocusHours: focusHours,
      averageMood: avgMood,
      averageSleep: avgSleep,
      habitConsistency: habitPercent,
      stressLevel: avgStress
    });
  }, [yearData]);

  // Update canvas size on container resize
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        let height = 450;
        if (layout === 'radial') height = 500;
        else if (layout === 'ribbon') height = 350;
        // Restrict sizing boundaries to keep grids compact and pretty
        setCanvasDimensions({ width: Math.max(width, 600), height });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [layout]);

  // Handle saving reflection log from modal
  const handleSaveJournalSnippet = (dateStr, text) => {
    setYearData(prev => prev.map(d => {
      if (d.date === dateStr) {
        return { ...d, journalSnippet: text };
      }
      return d;
    }));
  };

  // --- 3. VECTOR COLOR BLENDING FORMULAS ---
  const calculateCompositeColor = (day) => {
    const m = day.mood;
    const p = day.productivity;
    const s = Math.min(day.sleep / 9.0, 1.0); 
    const h = day.hydration / 12.0;
    const e = day.social;
    const st = day.stress;

    const anchors = {
      productive: [16, 185, 129],  // Emerald Green
      calm: [89, 158, 255],       // Ice Blue
      creative: [139, 92, 246],    // Violet Purple
      energetic: [249, 115, 22],    // Vibrant Orange
      stressed: [239, 68, 68],      // Intense Muted Red
      exhausted: [113, 113, 122]    // Desaturated Gray
    };

    const wStressed = st * (1.0 - s);
    const wProductive = p * m;
    const wCalm = s * (1.0 - st);
    const wCreative = p * (1.0 - e) * m;
    const wEnergetic = e * m;
    const wExhausted = (1.0 - s) * (1.0 - p) * (1.0 - m);

    const sumWeights = wStressed + wProductive + wCalm + wCreative + wEnergetic + wExhausted || 1;

    const r = Math.round(
      (wStressed * anchors.stressed[0] +
       wProductive * anchors.productive[0] +
       wCalm * anchors.calm[0] +
       wCreative * anchors.creative[0] +
       wEnergetic * anchors.energetic[0] +
       wExhausted * anchors.exhausted[0]) / sumWeights
    );

    const g = Math.round(
      (wStressed * anchors.stressed[1] +
       wProductive * anchors.productive[1] +
       wCalm * anchors.calm[1] +
       wCreative * anchors.creative[1] +
       wEnergetic * anchors.energetic[1] +
       wExhausted * anchors.exhausted[1]) / sumWeights
    );

    const b = Math.round(
      (wStressed * anchors.stressed[2] +
       wProductive * anchors.productive[2] +
       wCalm * anchors.calm[2] +
       wCreative * anchors.creative[2] +
       wEnergetic * anchors.energetic[2] +
       wExhausted * anchors.exhausted[2]) / sumWeights
    );

    const alpha = 0.5 + h * 0.5;

    return { r, g, b, alpha };
  };

  const toRgbaStr = (color, alphaOverride = null) => {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${alphaOverride !== null ? alphaOverride : color.alpha})`;
  };

  const cachedPositions = useRef([]);

  const computeLayoutCoordinates = (width, height) => {
    const coords = [];
    const count = yearData.length;

    if (layout === 'grid') {
      const cols = 53;
      const cellGap = 5 * zoomScale;
      const hPadding = 30;
      const availableWidth = width - hPadding * 2;
      const cellSize = Math.min((availableWidth - (cols - 1) * cellGap) / cols, 14) * zoomScale;

      const totalGridWidth = cols * cellSize + (cols - 1) * cellGap;
      const startX = (width - totalGridWidth) / 2;
      const startY = (height - (7 * cellSize + 6 * cellGap)) / 2 + 15;

      for (let i = 0; i < count; i++) {
        const col = Math.floor(i / 7);
        const row = i % 7;
        const x = startX + col * (cellSize + cellGap) + cellSize / 2;
        const y = startY + row * (cellSize + cellGap) + cellSize / 2;

        coords.push({ index: i, x, y, size: cellSize });
      }
    } else if (layout === 'radial') {
      const cx = width / 2;
      const cy = height / 2;
      const innerRadius = 30 * zoomScale;
      const spiralGap = 1.1 * zoomScale;
      const angleSpacing = 0.15;

      for (let i = 0; i < count; i++) {
        const angle = i * angleSpacing;
        const radius = innerRadius + i * spiralGap;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const size = Math.max(8 * zoomScale, 5);

        coords.push({ index: i, x, y, size });
      }
    } else if (layout === 'ribbon') {
      const cellGap = 16 * zoomScale;
      const totalWidth = count * cellGap;
      const startX = width / 2 - totalWidth / 2 + 20;
      const cy = height / 2;
      const amp = 70 * zoomScale;

      for (let i = 0; i < count; i++) {
        const x = startX + i * cellGap;
        const y = cy + Math.sin(i * 0.12) * amp + Math.cos(i * 0.05) * (amp * 0.3);
        const size = Math.max(9 * zoomScale, 6);

        coords.push({ index: i, x, y, size });
      }
    }

    cachedPositions.current = coords;
    return coords;
  };

  // --- 4. DYNAMIC GPU CANVAS RENDER LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const coords = computeLayoutCoordinates(width, height);

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.fillRect(0, 0, width, height);

    const timeTick = Date.now() * 0.002;

    if (layout === 'ribbon' || layout === 'radial') {
      ctx.beginPath();
      ctx.lineWidth = visualMode === 'neubrutalist' ? 1.5 : 1.0;
      ctx.strokeStyle = visualMode === 'neubrutalist' ? 'rgba(0,0,0,0.15)' : 'rgba(89, 158, 255, 0.16)';
      
      coords.forEach((coord, i) => {
        if (i === 0) ctx.moveTo(coord.x, coord.y);
        else ctx.lineTo(coord.x, coord.y);
      });
      ctx.stroke();
    }

    coords.forEach((coord, i) => {
      const day = yearData[i];
      const color = calculateCompositeColor(day);
      const isHovered = hoveredDay && hoveredDay.index === i;
      const isFocused = activeKeyIndex === i;

      const pulseFactor = layout === 'radial' || layout === 'ribbon'
        ? 1.0 + Math.sin(timeTick + i * 0.1) * 0.08
        : 1.0;

      const size = coord.size * pulseFactor * (isHovered || isFocused ? 1.35 : 1.0);

      ctx.save();

      if (visualMode === 'liquid') {
        ctx.fillStyle = toRgbaStr(color);
        
        if (isHovered || isFocused) {
          ctx.shadowColor = toRgbaStr(color, 0.7);
          ctx.shadowBlur = 18;
        } else {
          const restingGlow = Math.min((day.habits?.length || 0) * 3, 10);
          if (restingGlow > 0) {
            ctx.shadowColor = toRgbaStr(color, 0.4);
            ctx.shadowBlur = restingGlow;
          }
        }

        ctx.beginPath();
        if (layout === 'grid') {
          ctx.roundRect(coord.x - size / 2, coord.y - size / 2, size, size, size * 0.35);
        } else {
          ctx.arc(coord.x, coord.y, size / 2, 0, Math.PI * 2);
        }
        ctx.fill();

      } else {
        ctx.fillStyle = toRgbaStr(color, 1.0); 
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = isHovered || isFocused ? 2.5 : 1.5;

        if (isHovered || isFocused) {
          ctx.shadowColor = '#0f172a';
          ctx.shadowOffsetX = 3;
          ctx.shadowOffsetY = 3;
        }

        ctx.beginPath();
        if (layout === 'grid') {
          ctx.rect(coord.x - size / 2, coord.y - size / 2, size, size);
        } else {
          ctx.arc(coord.x, coord.y, size / 2, 0, Math.PI * 2);
        }
        ctx.fill();
        ctx.stroke();
      }

      if (colorblindMode) {
        ctx.clip(); 
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.0;
        ctx.beginPath();

        if (day.stress > 0.6) {
          for (let k = -20; k < 20; k += 4) {
            ctx.moveTo(coord.x - size + k, coord.y - size);
            ctx.lineTo(coord.x + size + k, coord.y + size);
          }
          ctx.stroke();
        } else if (day.productivity > 0.7) {
          for (let k = -20; k < 20; k += 5) {
            ctx.moveTo(coord.x + k, coord.y - size);
            ctx.lineTo(coord.x + k, coord.y + size);
            ctx.moveTo(coord.x - size, coord.y + k);
            ctx.lineTo(coord.x + size, coord.y + k);
          }
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    if (layout === 'grid') {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      
      const cols = 53;
      const cellGap = 5 * zoomScale;
      const hPadding = 30;
      const availableWidth = width - hPadding * 2;
      const cellSize = Math.min((availableWidth - (cols - 1) * cellGap) / cols, 14) * zoomScale;
      const totalGridWidth = cols * cellSize + (cols - 1) * cellGap;
      const startX = (width - totalGridWidth) / 2;
      const gridTopY = (height - (7 * cellSize + 6 * cellGap)) / 2;

      // Mathematically determine exact columns where months start to prevent drift and misalignment
      const monthPositions = [];
      const seenMonths = new Set();
      
      yearData.forEach((day, i) => {
        const parts = day.date.split('-');
        const monthIdx = parseInt(parts[1], 10) - 1;
        const dayNum = parseInt(parts[2], 10);
        
        if (i === 0 || dayNum === 1) {
          if (!seenMonths.has(monthIdx)) {
            seenMonths.add(monthIdx);
            const col = Math.floor(i / 7);
            monthPositions.push({
              name: monthNames[monthIdx],
              col: col
            });
          }
        }
      });

      monthPositions.forEach(pos => {
        const xPos = startX + pos.col * (cellSize + cellGap) + cellSize / 2;
        ctx.fillText(pos.name, xPos, gridTopY - 6);
      });
      ctx.restore();
    }

    applySeasonalFilter(ctx, width, height);
    applyGrainTexture(ctx, width, height);

  }, [yearData, layout, visualMode, seasonFilter, zoomScale, colorblindMode, hoveredDay, activeKeyIndex]);

  const applySeasonalFilter = (ctx, w, h) => {
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';

    let grad = ctx.createRadialGradient(w/2, h/2, 50, w/2, h/2, Math.max(w, h));
    
    if (seasonFilter === 'spring') {
      grad.addColorStop(0, 'rgba(255, 224, 231, 0.06)');
      grad.addColorStop(1, 'rgba(254, 243, 199, 0.03)');
    } else if (seasonFilter === 'summer') {
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.06)');
      grad.addColorStop(1, 'rgba(249, 115, 22, 0.02)');
    } else if (seasonFilter === 'autumn') {
      grad.addColorStop(0, 'rgba(217, 119, 6, 0.06)');
      grad.addColorStop(1, 'rgba(120, 53, 4, 0.03)');
    } else if (seasonFilter === 'winter') {
      grad.addColorStop(0, 'rgba(186, 230, 253, 0.05)');
      grad.addColorStop(1, 'rgba(30, 58, 138, 0.04)');
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  };

  const applyGrainTexture = (ctx, w, h) => {
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';

    const grainSize = 1;
    for (let x = 0; x < w; x += 4) {
      for (let y = 0; y < h; y += 4) {
        if (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1 > 0.95) {
          ctx.fillRect(x, y, grainSize, grainSize);
        }
      }
    }
    ctx.restore();
  };

  // --- 5. CURSOR COLLISION DETECTOR ---
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let closest = null;
    let minDistance = Infinity;

    cachedPositions.current.forEach((coord) => {
      const dist = Math.hypot(coord.x - x, coord.y - y);
      const clickTolerance = Math.max(coord.size * 1.6, 12);
      
      if (dist < clickTolerance && dist < minDistance) {
        minDistance = dist;
        closest = coord;
      }
    });

    if (closest) {
      const day = yearData[closest.index];
      setHoveredDay({ ...closest, day });
      setTooltipPos({
        x: closest.x,
        y: closest.y - 12
      });
    } else {
      setHoveredDay(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const handleCanvasClick = () => {
    if (hoveredDay) {
      setSelectedDay(hoveredDay.day);
      setIsModalOpen(true);
    }
  };

  // Keyboard Traverser
  const handleKeyDown = (e) => {
    let nextIndex = activeKeyIndex;
    const columnsCount = 7;

    if (e.key === 'ArrowRight') {
      nextIndex = Math.min(activeKeyIndex + 1, yearData.length - 1);
    } else if (e.key === 'ArrowLeft') {
      nextIndex = Math.max(activeKeyIndex - 1, 0);
    } else if (e.key === 'ArrowDown') {
      nextIndex = Math.min(activeKeyIndex + columnsCount, yearData.length - 1);
    } else if (e.key === 'ArrowUp') {
      nextIndex = Math.max(activeKeyIndex - columnsCount, 0);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (activeKeyIndex >= 0) {
        setSelectedDay(yearData[activeKeyIndex]);
        setIsModalOpen(true);
      }
      return;
    } else if (e.key === 'Escape') {
      setActiveKeyIndex(-1);
      return;
    } else {
      return;
    }

    e.preventDefault();
    if (activeKeyIndex === -1) nextIndex = 0;

    setActiveKeyIndex(nextIndex);
    const day = yearData[nextIndex];
    setSrAnnouncement(
      `Fokus sel hari ${day.date}. Mood ${Math.round(day.mood*100)}%, Produktivitas ${Math.round(day.productivity*100)}%. Selesai ${day.habits.length} kebiasaan.`
    );
  };

  // Get dynamic box-shadow class based on season for organic ambient aura light
  const getAmbientAuraClass = () => {
    if (seasonFilter === 'spring') return 'shadow-[0_20px_50px_rgba(255,224,231,0.35)]';
    if (seasonFilter === 'summer') return 'shadow-[0_20px_50px_rgba(251,191,36,0.28)]';
    if (seasonFilter === 'autumn') return 'shadow-[0_20px_50px_rgba(217,119,6,0.25)]';
    return 'shadow-[0_20px_50px_rgba(186,230,253,0.32)]';
  };

  // --- 6. HIGH-RESOLUTION PRINT POSTER EXPORTER SYSTEM ---
  const handleExportPoster = () => {
    const exportWidth = 2400;
    const exportHeight = 3200;
    const eCanvas = document.createElement('canvas');
    eCanvas.width = exportWidth;
    eCanvas.height = exportHeight;
    const eCtx = eCanvas.getContext('2d');
    if (!eCtx) return;

    eCtx.imageSmoothingEnabled = true;
    eCtx.imageSmoothingQuality = 'high';

    eCtx.fillStyle = '#fafaf9';
    eCtx.fillRect(0, 0, exportWidth, exportHeight);

    eCtx.strokeStyle = 'rgba(15, 23, 42, 0.08)';
    eCtx.lineWidth = 15;
    eCtx.strokeRect(60, 60, exportWidth - 120, exportHeight - 120);

    eCtx.fillStyle = '#0f172a';
    eCtx.font = 'black 110px "Fredoka", sans-serif';
    eCtx.textAlign = 'center';
    eCtx.fillText("A YEAR OF HUMAN EXPERIENCE", exportWidth / 2, 340);

    eCtx.font = 'semibold italic 45px "Quicksand", sans-serif';
    eCtx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    eCtx.fillText("Procedural Emotional Map & Generative Life Canvas", exportWidth / 2, 420);

    eCtx.strokeStyle = 'rgba(15, 23, 42, 0.15)';
    eCtx.lineWidth = 3;
    eCtx.beginPath();
    eCtx.moveTo(350, 480);
    eCtx.lineTo(exportWidth - 350, 480);
    eCtx.stroke();

    const coords = [];
    const count = yearData.length;

    if (layout === 'grid') {
      const cols = 53;
      const cellGap = 16;
      const gridW = cols * 32 + (cols - 1) * cellGap;
      const startX = (exportWidth - gridW) / 2;
      const startY = 850;

      for (let i = 0; i < count; i++) {
        const col = Math.floor(i / 7);
        const row = i % 7;
        const x = startX + col * (32 + cellGap) + 16;
        const y = startY + row * (32 + cellGap) + 16;
        coords.push({ index: i, x, y, size: 32 });
      }
    } else if (layout === 'radial') {
      const cx = exportWidth / 2;
      const cy = exportHeight / 2 - 100;
      const innerRadius = 120;
      const spiralGap = 4.0;
      const angleSpacing = 0.15;

      for (let i = 0; i < count; i++) {
        const angle = i * angleSpacing;
        const radius = innerRadius + i * spiralGap;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        coords.push({ index: i, x, y, size: 24 });
      }
    } else {
      const cellGap = 50;
      const gridW = count * cellGap;
      const startX = exportWidth / 2 - gridW / 2 + 100;
      const cy = exportHeight / 2 - 100;

      for (let i = 0; i < count; i++) {
        const x = startX + i * cellGap;
        const y = cy + Math.sin(i * 0.12) * 250 + Math.cos(i * 0.05) * 80;
        coords.push({ index: i, x, y, size: 28 });
      }
    }

    if (layout !== 'grid') {
      eCtx.beginPath();
      eCtx.lineWidth = 4;
      eCtx.strokeStyle = 'rgba(89, 158, 255, 0.22)';
      coords.forEach((coord, i) => {
        if (i === 0) eCtx.moveTo(coord.x, coord.y);
        else eCtx.lineTo(coord.x, coord.y);
      });
      eCtx.stroke();
    }

    coords.forEach((coord, i) => {
      const day = yearData[i];
      const color = calculateCompositeColor(day);

      eCtx.save();
      if (visualMode === 'liquid') {
        eCtx.fillStyle = toRgbaStr(color, 0.95);
        eCtx.shadowColor = toRgbaStr(color, 0.45);
        eCtx.shadowBlur = 15;

        eCtx.beginPath();
        if (layout === 'grid') {
          eCtx.roundRect(coord.x - coord.size / 2, coord.y - coord.size / 2, coord.size, coord.size, coord.size * 0.3);
        } else {
          eCtx.arc(coord.x, coord.y, coord.size / 2, 0, Math.PI * 2);
        }
        eCtx.fill();
      } else {
        eCtx.fillStyle = toRgbaStr(color, 1.0);
        eCtx.strokeStyle = '#0f172a';
        eCtx.lineWidth = 4.5;
        eCtx.shadowColor = '#0f172a';
        eCtx.shadowOffsetX = 6;
        eCtx.shadowOffsetY = 6;

        eCtx.beginPath();
        if (layout === 'grid') {
          eCtx.rect(coord.x - coord.size / 2, coord.y - coord.size / 2, coord.size, coord.size);
        } else {
          eCtx.arc(coord.x, coord.y, coord.size / 2, 0, Math.PI * 2);
        }
        eCtx.fill();
        eCtx.stroke();
      }
      eCtx.restore();
    });

    if (layout === 'grid') {
      eCtx.fillStyle = 'rgba(15, 23, 42, 0.55)';
      eCtx.font = 'bold 24px "JetBrains Mono", monospace';
      eCtx.textAlign = 'center';
      
      const monthNames = ['JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI', 'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER'];
      
      const cols = 53;
      const cellGap = 16;
      const gridW = cols * 32 + (cols - 1) * cellGap;
      const startX = (exportWidth - gridW) / 2;
      const gridTopY = 850;

      // Mathematically determine exact columns where months start to prevent drift and misalignment in high-res exports
      const monthPositions = [];
      const seenMonths = new Set();
      
      yearData.forEach((day, i) => {
        const parts = day.date.split('-');
        const monthIdx = parseInt(parts[1], 10) - 1;
        const dayNum = parseInt(parts[2], 10);
        
        if (i === 0 || dayNum === 1) {
          if (!seenMonths.has(monthIdx)) {
            seenMonths.add(monthIdx);
            const col = Math.floor(i / 7);
            monthPositions.push({
              name: monthNames[monthIdx],
              col: col
            });
          }
        }
      });

      monthPositions.forEach(pos => {
        const xPos = startX + pos.col * (32 + cellGap) + 16;
        eCtx.fillText(pos.name, xPos, gridTopY - 24);
      });
    }

    eCtx.save();
    eCtx.globalCompositeOperation = 'overlay';
    let grad = eCtx.createRadialGradient(exportWidth/2, exportHeight/2, 200, exportWidth/2, exportHeight/2, exportWidth);
    
    if (seasonFilter === 'spring') {
      grad.addColorStop(0, 'rgba(255, 224, 231, 0.08)');
      grad.addColorStop(1, 'rgba(254, 243, 199, 0.04)');
    } else if (seasonFilter === 'summer') {
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
      grad.addColorStop(1, 'rgba(249, 115, 22, 0.03)');
    } else if (seasonFilter === 'autumn') {
      grad.addColorStop(0, 'rgba(217, 119, 6, 0.08)');
      grad.addColorStop(1, 'rgba(120, 53, 4, 0.05)');
    } else {
      grad.addColorStop(0, 'rgba(186, 230, 253, 0.07)');
      grad.addColorStop(1, 'rgba(30, 58, 138, 0.06)');
    }
    eCtx.fillStyle = grad;
    eCtx.fillRect(0, 0, exportWidth, exportHeight);
    eCtx.restore();

    eCtx.fillStyle = '#0f172a';
    eCtx.textAlign = 'left';
    eCtx.font = 'bold 36px "JetBrains Mono", monospace';
    
    eCtx.fillText("YEAR INTERVAL : 2025 - 2026", 180, exportHeight - 240);
    eCtx.fillText("ATMOSPHERE    : " + seasonFilter.toUpperCase() + " WAVE", 180, exportHeight - 180);
    eCtx.fillText("CANVAS STYLE  : " + visualMode.toUpperCase() + " ABSTRACT", 180, exportHeight - 120);

    eCtx.textAlign = 'right';
    eCtx.fillText("KOSANAMBIS ARTWORK LABS ©", exportWidth - 180, exportHeight - 240);
    eCtx.fillText("SIGNATURE: 0x98A1EF8", exportWidth - 180, exportHeight - 180);
    eCtx.fillText("DIGITAL VERIFICATION: AUTHENTIC", exportWidth - 180, exportHeight - 120);

    eCanvas.toBlob((blob) => {
      const link = document.createElement('a');
      link.download = `kosanambis-life-poster-${seasonFilter}-${layout}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
    }, 'image/png');
  };

  return (
    <div className="w-full flex flex-col gap-6" ref={containerRef}>
      
      {/* Screen Reader Log */}
      <div className="sr-only" aria-live="assertive" role="log">
        {srAnnouncement}
      </div>

      {/* Main 2-Column Responsive Studio Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* ================= LEFT COLUMN: ART GALLERY TAPESTRY (xl:col-span-8) ================= */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          <div className="glass-card-no-hover p-6 md:p-8 flex flex-col gap-6 border border-white/85">
            
            {/* Gallery Info Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black text-slate-405 uppercase tracking-widest font-mono block">Museum Frame Gallery</span>
                <h3 className="text-base md:text-lg font-black text-slate-800 flex items-center gap-2 mt-1 uppercase tracking-wide font-sans">
                  <Palette className="w-5 h-5 text-indigo-500" />
                  Personal Life Tapestry Canvas
                </h3>
              </div>
              <kbd className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-[9px] font-black text-slate-400 bg-white/60 border border-slate-200 rounded-lg font-mono">
                <Keyboard className="w-3 h-3" /> Keyboard Nav
              </kbd>
            </div>

            {/* Immersive interactive Canvas Viewport Frame */}
            <div className="flex flex-col gap-4">
              <div 
                className={`w-full bg-white/35 border border-white/65 rounded-[2rem] relative overflow-hidden flex items-center justify-center min-h-[350px] transition-all duration-500 ease-out select-none ${getAmbientAuraClass()}`}
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
                  style={{ 
                    width: canvasDimensions.width, 
                    height: canvasDimensions.height 
                  }}
                />

                {/* RICH HOVER INTERACTIVE TOOLTIP */}
                {hoveredDay && (
                  <div 
                    className="absolute z-[150] pointer-events-none bg-white/95 border rounded-2xl p-4 shadow-premium text-xs text-slate-800 max-w-[240px] transform -translate-x-1/2 -translate-y-full transition-all duration-200 ease-out flex flex-col gap-2.5"
                    style={{ 
                      left: tooltipPos.x, 
                      top: tooltipPos.y,
                      borderColor: toRgbaStr(calculateCompositeColor(hoveredDay.day), 0.5),
                      backdropFilter: 'blur(16px)',
                      boxShadow: `0 15px 30px -10px ${toRgbaStr(calculateCompositeColor(hoveredDay.day), 0.15)}`
                    }}
                  >
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5 shrink-0">
                      <span className="font-extrabold text-slate-850 font-mono tracking-tight">{hoveredDay.day.date}</span>
                      <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase tracking-widest font-mono">
                        Day {hoveredDay.index + 1}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-550 leading-relaxed">
                      <div className="flex justify-between">
                        <span>😊 Mood:</span>
                        <strong className="text-slate-800">{Math.round(hoveredDay.day.mood*100)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>⚡ Ambis:</span>
                        <strong className="text-slate-800">{Math.round(hoveredDay.day.productivity*100)}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>🌙 Sleep:</span>
                        <strong className="text-slate-800">{hoveredDay.day.sleep}j</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>💧 Hydr:</span>
                        <strong className="text-slate-800">{hoveredDay.day.hydration}gls</strong>
                      </div>
                    </div>

                    {hoveredDay.day.journalSnippet && (
                      <p className="text-[9px] leading-relaxed text-slate-500 italic border-t border-slate-100 pt-2 shrink-0 line-clamp-2">
                        "{hoveredDay.day.journalSnippet}"
                      </p>
                    )}

                    <div className="text-[7.5px] font-bold text-center text-slate-400 tracking-wider uppercase font-mono mt-0.5">
                      Click fragment to reflect
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Spectral Legend Row */}
            <div className="flex flex-col gap-3.5 bg-white/40 p-4 border border-white/60 rounded-3xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Generative HSL Spectral blend Anchors:</span>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span>Ambis Mode</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 shadow-[0_0_8px_rgba(89,158,255,0.4)]" />
                  <span>Calm & Focus</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.4)]" />
                  <span>Deep Work</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                  <span>Social Battery</span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 col-span-2 sm:col-span-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
                  <span>Burnout / Stress</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ================= RIGHT COLUMN: COMMAND & ANALYTICS COCKPIT (xl:col-span-4) ================= */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          
          {/* 1. STUDIO CONTROLS DECK */}
          <div className="glass-card p-6 flex flex-col gap-6 border border-white/85">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest font-sans flex items-center gap-2">
                <Palette className="w-4 h-4 text-indigo-500" />
                Studio Controls
              </h4>
              <span className="text-[8px] font-black font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-650 border border-brand-500/20 uppercase tracking-widest">
                ACTIVE
              </span>
            </div>

            {/* Layout selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Select Canvas Layout</span>
              <div className="flex gap-1.5">
                {[
                  { id: 'grid', label: 'Grid', icon: LayoutGrid },
                  { id: 'radial', label: 'Radial', icon: Compass },
                  { id: 'ribbon', label: 'Ribbon', icon: Wind }
                ].map(l => {
                  const Icon = l.icon;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id)}
                      className={`flex-grow py-2.5 px-3 rounded-2xl border text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${layout === l.id ? 'bg-slate-900 border-slate-950 text-white shadow-lg shadow-slate-950/20' : 'bg-white/60 border-slate-200/50 text-slate-500 hover:text-slate-800 hover:bg-white'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Operating style visual modes */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Visual Design Style</span>
              <div className="flex gap-2">
                {[
                  { id: 'liquid', label: 'Liquid Fluid' },
                  { id: 'neubrutalist', label: 'Neubrutalist' }
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setUiMode(m.id)}
                    className={`flex-grow py-2.5 px-3 rounded-2xl border text-[10px] font-black uppercase tracking-wider font-mono transition-all active:scale-95 cursor-pointer ${visualMode === m.id ? 'bg-slate-900 border-slate-950 text-white shadow-lg' : 'bg-white/60 border-slate-200/50 text-slate-500 hover:text-slate-800 hover:bg-white'}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Seasonal Filters sync dials */}
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Seasonal Light Sync</span>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'spring', label: 'Spring', icon: Leaf, color: 'text-emerald-500 bg-emerald-500/10' },
                  { id: 'summer', label: 'Summer', icon: Sun, color: 'text-amber-500 bg-amber-500/10' },
                  { id: 'autumn', label: 'Autumn', icon: Wind, color: 'text-orange-500 bg-orange-500/10' },
                  { id: 'winter', label: 'Winter', icon: CloudSnow, color: 'text-sky-500 bg-sky-500/10' }
                ].map(s => {
                  const Icon = s.icon;
                  const isActive = seasonFilter === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSeasonFilter(s.id)}
                      title={`Atmospheric theme: ${s.label}`}
                      className={`py-3 flex flex-col justify-center items-center rounded-2xl border transition-all cursor-pointer active:scale-90 gap-1 ${isActive ? `${s.color} border-slate-800/25 shadow-sm` : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'}`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[8px] font-black uppercase tracking-widest font-mono">{s.id.slice(0,3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Zoom Slider and Pattern Assist */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100 items-center">
              
              {/* Zoom Slider */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Zoom Scale</span>
                <input 
                  type="range" 
                  min="0.7" 
                  max="1.8" 
                  step="0.1"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(parseFloat(e.target.value))}
                  className="w-full accent-slate-900 cursor-ew-resize h-1 bg-slate-200 rounded-lg appearance-none"
                  title="Scale Grid Viewport"
                />
              </div>

              {/* Colorblind toggle */}
              <button 
                onClick={() => setColorblindMode(!colorblindMode)}
                className={`py-2 px-3 rounded-2xl border text-[9px] font-black uppercase tracking-wider font-mono transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${colorblindMode ? 'bg-indigo-100 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-100'}`}
              >
                {colorblindMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {colorblindMode ? 'Pattern ON' : 'Pattern OFF'}
              </button>

            </div>

          </div>

          {/* 2. PREMIUM REFLECTION ANALYTICS DECK */}
          <div className="glass-card p-6 flex flex-col gap-4 border border-white/85">
            
            <h4 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest font-sans flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-4 h-4 text-emerald-500 animate-bounce" />
              Yearly Reflection analytics
            </h4>

            <div className="grid grid-cols-2 gap-3.5">
              
              {/* Stat 1: Focus Hours */}
              <div className="p-3 bg-white/45 border border-white/60 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
                  <span>Deep Work</span>
                  <Flame className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500/10" />
                </div>
                <div className="text-sm font-black text-slate-800 leading-none mt-1">
                  <KineticCounter value={stats.totalFocusHours} /> <span className="text-[9px] font-semibold text-slate-400">Hrs</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 block">Tapestry Deep Focus</span>
              </div>

              {/* Stat 2: Habit consistency */}
              <div className="p-3 bg-white/45 border border-white/60 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
                  <span>Habit consistency</span>
                  <Award className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="text-sm font-black text-slate-800 leading-none mt-1">
                  <KineticCounter value={stats.habitConsistency} />%
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 block">Routine Integrity</span>
              </div>

              {/* Stat 3: Avg Sleep */}
              <div className="p-3 bg-white/45 border border-white/60 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
                  <span>Average sleep</span>
                  <Moon className="w-3.5 h-3.5 text-indigo-550" />
                </div>
                <div className="text-sm font-black text-slate-800 leading-none mt-1">
                  <KineticCounter value={stats.averageSleep} /> <span className="text-[9px] font-semibold text-slate-400">Hrs</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 block">Avg Sleep Rest</span>
              </div>

              {/* Stat 4: Mood Index */}
              <div className="p-3 bg-white/45 border border-white/60 rounded-2xl flex flex-col gap-1 shadow-sm">
                <div className="flex justify-between items-center text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
                  <span>Mood stability</span>
                  <Smile className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-sm font-black text-slate-800 leading-none mt-1">
                  <KineticCounter value={stats.averageMood} />% <span className="text-[9px] font-semibold text-slate-400">Good</span>
                </div>
                <span className="text-[8px] font-bold text-slate-400 mt-1 block">Sanity Index</span>
              </div>

            </div>

            {/* Quick summary advisory */}
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl text-[9px] font-semibold text-slate-500 leading-normal flex items-start gap-2">
              <span className="text-base select-none">💡</span>
              <p>
                Rangkuman tapestri menunjukkan tingkat konsistensi ambismu mencapai <strong>{stats.habitConsistency}%</strong> dengan durasi belajar total <strong>{stats.totalFocusHours} jam</strong>. Pastikan seimbangkan dengan tidur (avg {stats.averageSleep} jam) untuk menjaga stabilitas mental index!
              </p>
            </div>

          </div>

          {/* 3. PREMIUM POSTER EXPORT TRIGGER */}
          <button 
            onClick={handleExportPoster}
            className="w-full p-4 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl text-xs font-black uppercase tracking-wider font-mono transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shadow-md relative overflow-hidden group"
          >
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-full left-[-50%] transition-all duration-700 ease-out" />
            <Download className="w-4 h-4 text-brand-400 animate-bounce" />
            Export High-Res Gallery Poster
          </button>

        </div>

      </div>

      {/* EXPANDED DRILLDOWN DIALOG NOTE */}
      <JournalDetailModal
        dayData={selectedDay}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDay(null);
        }}
        onSaveJournal={handleSaveJournalSnippet}
      />

    </div>
  );
}
