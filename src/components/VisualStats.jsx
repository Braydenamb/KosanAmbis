import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Award, Zap, Calendar, Heart, Smile } from 'lucide-react';

export default function VisualStats({
  focusHoursToday,
  pomodorosCompleted,
  weeklyFocusData,
  productivityPixels,
  moodScore,
  setMoodScore
}) {
  
  // Hitung total jam minggu ini, menggabungkan data statis + update realtime hari ini
  const currentDayIndex = new Date().getDay(); // 0 = Minggu, 1 = Senin, dst.
  const daysMapping = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const currentDayName = daysMapping[currentDayIndex];

  // Buat data chart dinamis yang menyertakan jam fokus hari ini secara real-time
  const dynamicChartData = weeklyFocusData.map(d => {
    if (d.day === currentDayName) {
      return { ...d, hours: parseFloat((d.hours + focusHoursToday).toFixed(1)) };
    }
    return d;
  });

  const totalFocusHoursThisWeek = dynamicChartData.reduce((acc, curr) => acc + curr.hours, 0).toFixed(1);

  // Cari hari paling produktif
  const peakDay = [...dynamicChartData].sort((a, b) => b.hours - a.hours)[0];

  // Opsi Mood
  const moodOptions = [
    { value: 'ambis', label: '🤩 Ambis', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
    { value: 'chill', label: '😎 Chill', color: 'border-sky-500 bg-sky-500/10 text-sky-400' },
    { value: 'mager', label: '😴 Mager', color: 'border-zinc-700 bg-zinc-800 text-zinc-400' },
    { value: 'mumet', label: '😭 Mumet', color: 'border-rose-500 bg-rose-500/10 text-rose-400' },
    { value: 'stress', label: '🤯 Stress', color: 'border-amber-500 bg-amber-500/10 text-amber-400' }
  ];

  // Custom tooltips untuk Recharts
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-xl text-xs shadow-xl">
          <p className="font-bold text-zinc-200">{payload[0].payload.day}</p>
          <p className="text-emerald-400 mt-0.5 font-mono">{payload[0].value} Jam Fokus</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
      
      {/* 1. PIXEL PRODUKTIVITAS */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-zinc-200">Pixel Produktivitas 🟩</h4>
          <p className="text-xs text-zinc-400">Kontribusi fokus belajarmu selama 30 hari terakhir.</p>
        </div>

        {/* Contribution Grid */}
        <div className="grid grid-cols-6 gap-2 p-3 bg-zinc-950 rounded-xl border border-zinc-900 justify-items-center">
          {productivityPixels.map((pixel, idx) => {
            // Hari ini adalah elemen terakhir dalam array 30 hari (idx === 29)
            // Tampilkan data real-time untuk pixel hari ini
            let currentHours = pixel.hours;
            let currentLevel = pixel.level;

            if (idx === 29) {
              currentHours = focusHoursToday;
              if (focusHoursToday === 0) currentLevel = 'none';
              else if (focusHoursToday <= 2) currentLevel = 'low';
              else if (focusHoursToday <= 4) currentLevel = 'medium';
              else currentLevel = 'high';
            }

            const getPixelColorClass = (lvl) => {
              if (lvl === 'low') return 'bg-emerald-950/80 border border-emerald-800/40 hover:bg-emerald-900';
              if (lvl === 'medium') return 'bg-emerald-700/60 border border-emerald-600/40 hover:bg-emerald-600';
              if (lvl === 'high') return 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] border border-emerald-400 hover:bg-emerald-400';
              return 'bg-zinc-800/60 border border-zinc-700/20 hover:bg-zinc-750';
            };

            return (
              <div 
                key={pixel.date}
                className={`w-9 h-9 rounded-lg transition-all duration-300 relative group cursor-pointer ${getPixelColorClass(currentLevel)}`}
              >
                {/* Tooltip Hover ala Github */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-32 hidden group-hover:block z-30 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-200 rounded-lg p-2 shadow-2xl pointer-events-none text-center font-mono">
                  <span className="font-bold block text-emerald-400">{pixel.dayName}, {pixel.date.split('-').reverse().slice(0, 2).join('/')}</span>
                  <span className="font-semibold">{currentHours.toFixed(1)} Jam Fokus</span>
                  {idx === 29 && <span className="block text-[8px] text-zinc-500 mt-0.5">(Hari Ini)</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono px-1">
          <span>Mager total</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-zinc-800 rounded"></span>
            <span className="w-2.5 h-2.5 bg-emerald-950 border border-emerald-800/40 rounded"></span>
            <span className="w-2.5 h-2.5 bg-emerald-700/60 border border-emerald-600/40 rounded"></span>
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded"></span>
          </div>
          <span>Ambis parah</span>
        </div>
      </div>

      {/* 2. WEEKLY ENERGY CHART */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-zinc-200">Weekly Energy Chart 📊</h4>
          <p className="text-xs text-zinc-400">Total durasi fokus harian dalam seminggu.</p>
        </div>

        <div className="h-48 w-full bg-zinc-950/60 rounded-xl border border-zinc-900/60 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dynamicChartData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#71717a', fontSize: 10, fontWeight: 500 }} 
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(39, 39, 42, 0.2)' }} />
              <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
                {dynamicChartData.map((entry, index) => {
                  // Berikan warna merah gelap jika jam fokus rendah (< 2 jam)
                  // Berikan warna hijau emerald jika tinggi
                  const isLow = entry.hours < 2;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={isLow ? '#991b1b' : '#10b981'} 
                      style={{ filter: isLow ? 'none' : 'drop-shadow(0px 2px 6px rgba(16, 185, 129, 0.2))' }}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. MINI STATS */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
        <div>
          <h4 className="font-bold text-zinc-200">Mini Stats ⚡</h4>
          <p className="text-xs text-zinc-400">Rangkuman performamu minggu ini.</p>
        </div>

        <div className="grid grid-cols-2 gap-3.5">
          {/* Card 1: Total Jam Fokus */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Fokus Week</span>
              <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/10" />
            </div>
            <span className="text-xl font-black text-emerald-400 font-mono tracking-tight">{totalFocusHoursThisWeek}j</span>
            <span className="text-[9px] text-zinc-400 leading-snug">Minggu ini produktif!</span>
          </div>

          {/* Card 2: Pomodoro Selesai */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Pomodoros</span>
              <Award className="w-3.5 h-3.5 text-rose-500" />
            </div>
            <span className="text-xl font-black text-rose-500 font-mono tracking-tight">{pomodorosCompleted}x</span>
            <span className="text-[9px] text-zinc-400 leading-snug">Interval tercapai.</span>
          </div>

          {/* Card 3: Hari Paling Produktif */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Peak Day</span>
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <span className="text-sm font-black text-zinc-200 font-sans tracking-tight">{peakDay ? peakDay.day : '-'}</span>
            <span className="text-[9px] text-zinc-400 leading-snug">({peakDay ? peakDay.hours : 0}j fokus)</span>
          </div>

          {/* Card 4: Mood Selector */}
          <div className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-xl flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Mood Today</span>
              <Smile className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            
            {/* Mood Dropdown Selector */}
            <select
              value={moodScore}
              onChange={(e) => setMoodScore(e.target.value)}
              className="mt-0.5 bg-zinc-950 border border-zinc-800 rounded-lg p-1 text-[11px] font-bold text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="ambis">🤩 Ambis</option>
              <option value="chill">😎 Chill</option>
              <option value="mager">😴 Mager</option>
              <option value="mumet">😭 Mumet</option>
              <option value="stress">🤯 Stress</option>
            </select>
            
            <span className="text-[9px] text-zinc-400 leading-snug">Target tercapai!</span>
          </div>
        </div>
      </div>

    </div>
  );
}
