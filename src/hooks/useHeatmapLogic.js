import { useState, useEffect } from 'react';
import { generateYearlyData } from '../utils/heatmapMockGenerator';

export const useHeatmapLogic = () => {
  const [yearData, setYearData] = useState(() => generateYearlyData('2026-05-26'));
  const [selectedDay, setSelectedDay] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeMetric, setActiveMetric] = useState('focus'); // 'focus' | 'sleep' | 'mood' | 'hydration'

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

  // Helper to determine intensity level 0-4 for standard heatmap
  const getMetricLevel = (day, metric) => {
    if (metric === 'focus') {
      const mins = day.focusMinutes || 0;
      if (mins === 0) return 0;
      if (mins <= 30) return 1;
      if (mins <= 90) return 2;
      if (mins <= 180) return 3;
      return 4;
    }
    if (metric === 'sleep') {
      const h = day.sleep || 0;
      if (h < 4) return 0; // bad
      if (h < 6) return 1;
      if (h < 7) return 2;
      if (h <= 8) return 4; // ideal
      return 3; // oversleep
    }
    if (metric === 'mood') {
      const m = day.mood || 0;
      if (m < 0.3) return 0;
      if (m < 0.5) return 1;
      if (m < 0.7) return 2;
      if (m < 0.9) return 3;
      return 4;
    }
    if (metric === 'hydration') {
      const gls = day.hydration || 0;
      if (gls === 0) return 0;
      if (gls <= 3) return 1;
      if (gls <= 5) return 2;
      if (gls <= 7) return 3;
      return 4;
    }
    return 0;
  };

  return {
    yearData, setYearData,
    selectedDay, setSelectedDay,
    isModalOpen, setIsModalOpen,
    activeMetric, setActiveMetric,
    stats,
    handleSaveJournalSnippet,
    getMetricLevel
  };
};
