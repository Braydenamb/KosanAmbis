import { useState, useEffect, useRef } from 'react';
import { generateYearlyData } from '../utils/heatmapMockGenerator';

export const useHeatmapLogic = (uiMode) => {
  const [yearData, setYearData] = useState(() => generateYearlyData('2026-05-26'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [layout, setLayout] = useState('grid'); // 'grid' | 'radial' | 'ribbon'
  const visualMode = uiMode; 
  const [seasonFilter, setSeasonFilter] = useState('spring'); // 'spring' | 'summer' | 'autumn' | 'winter'
  const [zoomScale, setZoomScale] = useState(1);
  const [colorblindMode, setColorblindMode] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [activeKeyIndex, setActiveKeyIndex] = useState(-1); 
  const [srAnnouncement, setSrAnnouncement] = useState('');
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 700, height: 420 });

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

  const handleSaveJournalSnippet = (dateStr, text) => {
    setYearData(prev => prev.map(d => {
      if (d.date === dateStr) {
        return { ...d, journalSnippet: text };
      }
      return d;
    }));
  };

  const calculateCompositeColor = (day) => {
    const m = day.mood;
    const p = day.productivity;
    const s = Math.min(day.sleep / 9.0, 1.0); 
    const h = day.hydration / 12.0;
    const e = day.social;
    const st = day.stress;

    const anchors = {
      productive: [16, 185, 129],  
      calm: [89, 158, 255],       
      creative: [139, 92, 246],    
      energetic: [249, 115, 22],    
      stressed: [239, 68, 68],      
      exhausted: [113, 113, 122]    
    };

    const wStressed = st * (1.0 - s);
    const wProductive = p * m;
    const wCalm = s * (1.0 - st);
    const wCreative = p * (1.0 - e) * m;
    const wEnergetic = e * m;
    const wExhausted = (1.0 - s) * (1.0 - p) * (1.0 - m);

    const sumWeights = wStressed + wProductive + wCalm + wCreative + wEnergetic + wExhausted || 1;

    const r = Math.round(
      (wStressed * anchors.stressed[0] + wProductive * anchors.productive[0] +
       wCalm * anchors.calm[0] + wCreative * anchors.creative[0] +
       wEnergetic * anchors.energetic[0] + wExhausted * anchors.exhausted[0]) / sumWeights
    );

    const g = Math.round(
      (wStressed * anchors.stressed[1] + wProductive * anchors.productive[1] +
       wCalm * anchors.calm[1] + wCreative * anchors.creative[1] +
       wEnergetic * anchors.energetic[1] + wExhausted * anchors.exhausted[1]) / sumWeights
    );

    const b = Math.round(
      (wStressed * anchors.stressed[2] + wProductive * anchors.productive[2] +
       wCalm * anchors.calm[2] + wCreative * anchors.creative[2] +
       wEnergetic * anchors.energetic[2] + wExhausted * anchors.exhausted[2]) / sumWeights
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

  const getAmbientAuraClass = () => {
    if (seasonFilter === 'spring') return 'shadow-[0_20px_50px_rgba(255,224,231,0.35)]';
    if (seasonFilter === 'summer') return 'shadow-[0_20px_50px_rgba(251,191,36,0.28)]';
    if (seasonFilter === 'autumn') return 'shadow-[0_20px_50px_rgba(217,119,6,0.25)]';
    return 'shadow-[0_20px_50px_rgba(186,230,253,0.32)]';
  };

  return {
    yearData, setYearData,
    selectedDay, setSelectedDay,
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
  };
};
