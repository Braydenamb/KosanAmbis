import React from 'react';
import { useCharacter } from '../context/CharacterContext';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area } from 'recharts';
import { Grid, BarChart3, Info, Heart, Zap, CheckSquare, Award, Moon, Wallet } from 'lucide-react';
import { contributionPixels, weeklyEnergyData } from '../data/dummyData';

export default function PanelRight() {
  const {
    focusHours,
    sleepHours,
    sanity,
    walletExpenses,
    totalExpenses
  } = useCharacter();

  // --- Calculate total weekly focus ---
  const initialWeeklyHours = weeklyEnergyData.reduce((acc, cur) => acc + cur.hours, 0);
  const totalWeeklyFocus = initialWeeklyHours + (focusHours > 0 ? focusHours : 0);

  // --- Pixel Color Map (Liquid Blue) ---
  const getPixelBg = (level) => {
    switch (level) {
      case 3: return 'bg-brand-500 hover:bg-brand-400 shadow-[0_0_10px_rgba(89,158,255,0.4)]';
      case 2: return 'bg-brand-300 hover:bg-brand-200';
      case 1: return 'bg-brand-100 hover:bg-brand-200/50 border border-brand-200/20';
      default: return 'bg-slate-200/50 hover:bg-slate-200 border border-slate-300/30';
    }
  };

  const getCellColor = (hours) => {
    return hours >= 3.5 ? '#599eff' : '#f87171'; // Blue vs Soft Red
  };

  // --- Custom Tooltip ---
  const CustomChartTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 border border-slate-250 p-2.5 rounded-xl text-[10px] font-bold shadow-2xl text-slate-800">
          <span className="font-bold text-slate-900 block mb-0.5">{payload[0].payload.day}</span>
          <span className={`font-semibold ${payload[0].value >= 3.5 ? 'text-brand-600' : 'text-rose-600'}`}>
            ⚡ {payload[0].value.toFixed(1)} Jam Fokus
          </span>
        </div>
      );
    }
    return null;
  };

  // --- Sleep & Mood Data Fills ---
  const sleepMoodData = [
    { day: 'Sen', sleep: 5.5, mood: 60 },
    { day: 'Sel', sleep: 7.0, mood: 78 },
    { day: 'Rab', sleep: 4.5, mood: 45 },
    { day: 'Kam', sleep: 8.0, mood: 90 },
    { day: 'Jum', sleep: 6.0, mood: 70 },
    { day: 'Sab', sleep: Number(sleepHours) || 7, mood: Number(sanity) || 80 }
  ];

  // --- Grouped Expenses Category Data for Chart ---
  const categorizedExpenses = walletExpenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category || 'Lainnya', value: curr.amount });
    }
    return acc;
  }, []);

  return (
    <aside className="w-full lg:w-80 flex flex-col gap-6">
      {/* 1. PIXEL PRODUKTIVITAS */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Grid className="w-4 h-4 text-brand-500" />
            AMBIS PIXEL MATRICES
          </h3>
          <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Menunjukkan konsistensi ambis 30 hari terakhir" />
        </div>

        {/* Pixel contribution grid */}
        <div className="grid grid-cols-6 gap-2.5 p-3 bg-white/40 border border-white/60 rounded-2xl justify-items-center">
          {contributionPixels.map((pixel, i) => (
            <div 
              key={i}
              className={`w-7 h-7 rounded-md transition-all duration-200 cursor-pointer ${getPixelBg(pixel.level)} relative group flex items-center justify-center font-bold text-[9px]`}
            >
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white border border-slate-200 text-[10px] text-slate-800 font-bold px-2 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                {pixel.date} <br/>
                <span className="text-brand-600">{pixel.hours} Jam Fokus ({pixel.status})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-[8px] text-slate-400 font-black uppercase tracking-widest font-mono px-1">
          <span>Rebahan</span>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded bg-slate-200 border border-slate-350" />
            <div className="w-2.5 h-2.5 rounded bg-brand-100" />
            <div className="w-2.5 h-2.5 rounded bg-brand-300" />
            <div className="w-2.5 h-2.5 rounded bg-brand-500" />
          </div>
          <span>Ambis</span>
        </div>
      </div>

      {/* 2. WEEKLY ENERGY CHART */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest font-mono">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          WEEKLY FOCUS METRICS
        </h3>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyEnergyData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(15,23,42,0.02)' }} />
              <Bar dataKey="hours" radius={[3, 3, 0, 0]}>
                {weeklyEnergyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCellColor(entry.hours)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. SLEEP & MOOD CORRELATION CHART */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest font-mono">
          <Moon className="w-4 h-4 text-indigo-500" />
          SLEEP & SANITY INDEX
        </h3>

        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sleepMoodData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <defs>
                <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#599eff" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#599eff" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={9} tickLine={false} axisLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-[10px] font-bold shadow-xl text-slate-800">
                      <span className="text-slate-900 block mb-0.5">{payload[0].payload.day}</span>
                      <span className="text-brand-600 block">🌙 Tidur: {payload[0].value} Jam</span>
                      <span className="text-purple-600 block">🧠 Sanity: {payload[1].value}%</span>
                    </div>
                  );
                }
                return null;
              }} />
              <Area type="monotone" dataKey="sleep" stroke="#599eff" fillOpacity={1} fill="url(#colorSleep)" strokeWidth={2} />
              <Area type="monotone" dataKey="mood" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorMood)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. FINANCIAL SPENDING CHART */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest font-mono">
          <Wallet className="w-4 h-4 text-brand-500" />
          SPENDING CATEGORY DESTRUCTS
        </h3>

        <div className="h-32 w-full">
          {categorizedExpenses.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorizedExpenses} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={8} tickLine={false} axisLine={false} />
                <Tooltip content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl text-[10px] font-bold shadow-xl text-slate-800">
                        <span className="text-slate-900 block">{payload[0].payload.name}</span>
                        <span className="text-yellow-600 block mt-0.5 font-bold">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(payload[0].value)}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="value" fill="#599eff" radius={[3, 3, 0, 0]}>
                  {categorizedExpenses.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={idx % 2 === 0 ? '#599eff' : '#8b5cf6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[9px] text-slate-400 font-extrabold uppercase italic text-center font-mono">
              no expenditures logged.
            </div>
          )}
        </div>
      </div>

      {/* 5. MINI STATS CARD */}
      <div className="glass-card p-5 flex flex-col gap-3">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-1 uppercase tracking-widest font-mono">
          <Award className="w-4 h-4 text-brand-500" />
          SYSTEM INTEGRITY TOTALS
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/40 border border-white/60 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
              <Zap className="w-3.5 h-3.5 text-brand-500" />
              WEEKLY FOCUS
            </div>
            <div className="text-sm font-extrabold text-slate-850 mt-1 leading-none">
              {totalWeeklyFocus.toFixed(1)} <span className="text-[8px] font-normal text-slate-400">Hrs</span>
            </div>
          </div>

          <div className="p-3 bg-white/40 border border-white/60 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
              <CheckSquare className="w-3.5 h-3.5 text-indigo-500" />
              POMODORO
            </div>
            <div className="text-sm font-extrabold text-slate-850 mt-1 leading-none">
              {Math.round(focusHours / 0.41)} <span className="text-[8px] font-normal text-slate-400">Ses</span>
            </div>
          </div>

          <div className="p-3 bg-white/40 border border-white/60 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              AVG SLEEP
            </div>
            <div className="text-xs font-extrabold text-slate-850 mt-1 uppercase leading-none font-mono">
              {sleepHours} Hrs
            </div>
          </div>

          <div className="p-3 bg-white/40 border border-white/60 rounded-2xl">
            <div className="flex items-center gap-1 text-slate-400 text-[8px] font-black uppercase tracking-widest font-mono">
              <Wallet className="w-3.5 h-3.5 text-brand-500" />
              TOTAL EXPENSE
            </div>
            <div className="text-[10px] font-extrabold text-slate-850 mt-1 leading-none truncate font-mono">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalExpenses)}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
