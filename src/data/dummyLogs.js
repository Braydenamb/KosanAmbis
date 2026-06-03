// ─── 30-DAY INTEGRATED LIFESTYLE HISTORICAL LOG GENERATOR ───
export const generateHistoricalLogs = () => {
  const logs = [];
  const start = new Date();
  start.setDate(start.getDate() - 30);

  for (let i = 0; i < 30; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    // Weather simulation: 25% chance of rain
    const isRainy = (i % 4 === 0); 
    
    // Exercise simulation: 45% probability
    const exerciseActive = (i % 3 === 0 || i % 7 === 0) ? 1 : 0; 
    
    // Late night delivery simulation: higher spending on weekends (Friday/Saturday)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 5 || dayOfWeek === 6;
    const lateNightSpend = isWeekend 
      ? Math.round(Math.random() * 85000 + 40000) 
      : Math.round(Math.random() * 25000 + (Math.random() > 0.8 ? 50000 : 0));
    
    // Sleep simulation: late night delivery hurts deep sleep quality by ~15%
    const sleepReduction = lateNightSpend > 60000 ? 15 : 0;
    const baseSleepHours = 7.2 + (exerciseActive * 0.6) - (isWeekend ? 0.5 : 0);
    const sleepHours = Math.max(5.0, Math.min(9.5, baseSleepHours + Math.random() * 1.2 - 0.6));
    const deepSleepQuality = Math.max(40, Math.min(98, 80 - sleepReduction + (exerciseActive * 10) - (sleepHours < 6 ? 12 : 0) + Math.random() * 8));

    // Focus / Productivity minutes: exercise increases productivity next day, focus peaks on rainy days
    const focusBoost = exerciseActive ? 45 : 0;
    const weatherBoost = isRainy ? 60 : 0;
    const focusMinutes = Math.max(30, Math.min(300, 120 + focusBoost + weatherBoost - (sleepHours < 6 ? 50 : 0) + Math.round(Math.random() * 60 - 30)));
    
    // Coding activity peaks during rainy days
    const codingCommits = isRainy ? Math.round(Math.random() * 5 + 3) : Math.round(Math.random() * 2 + 1);

    // Hydration simulation: tracks mood stability
    const hydrationOunces = Math.round(Math.random() * 40 + 40 + (exerciseActive * 30));
    const moodStability = Math.max(1, Math.min(10, Math.round(5 + (hydrationOunces > 70 ? 2.5 : 0) + (sleepHours > 7 ? 1.5 : -1.5) + Math.random() * 2 - 1)));

    logs.push({
      date: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      sleepHours,
      deepSleepQuality,
      lateNightSpend,
      exerciseActive,
      focusMinutes,
      codingCommits,
      hydrationOunces,
      moodStability,
      isRainy
    });
  }
  return logs;
};
