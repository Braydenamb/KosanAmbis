import React, { useState, useEffect } from 'react';
import {
  Heart, Footprints, Droplets, Moon, Flame, Activity,
  Zap, RefreshCw, Wind, CheckCircle, AlertTriangle, Wifi, WifiOff
} from 'lucide-react';
import {
  DUMMY_HEALTH_TODAY, DUMMY_HEALTH_WEEK, DUMMY_HEALTH_INSIGHTS,
  DUMMY_HEALTH_PROVIDERS, HEALTH_XP_RULES
} from '../../data/dummyAutomation';
import { useCharacter } from '../../context/CharacterContext';
import KineticCounter from '../ui/KineticCounter';

// ─── RING CHART (SVG) ─────────────────────────────────────────────────────────
function RingChart({ value, max, color, size = 80, strokeWidth = 9, label, sublabel }) {
  const pct = Math.min(value / max, 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct);
  const cx = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx={cx} cy={cx} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={strokeWidth} />
          {/* Progress */}
          <circle
            cx={cx} cy={cx} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-slate-800 leading-none">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-[9px] font-black text-slate-600 leading-tight">{label}</div>
        <div className="text-[8px] text-slate-400 font-mono">{sublabel}</div>
      </div>
    </div>
  );
}

// ─── WEEKLY MINI CHART ────────────────────────────────────────────────────────
function WeeklyChart({ data, valueKey, color = '#6366f1', unit = '' }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((d, i) => {
        const pct = Math.round((d[valueKey] / max) * 100);
        const isToday = i === data.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '36px' }}>
              <div
                className="w-full rounded-t-md transition-all duration-700"
                style={{
                  height: `${Math.max(pct, 6)}%`,
                  backgroundColor: isToday ? color : `${color}60`,
                  outline: isToday ? `2px solid ${color}` : 'none',
                  outlineOffset: '-1px',
                }}
                title={`${d.day}: ${d[valueKey]}${unit}`}
              />
            </div>
            <span className={`text-[7px] font-mono ${isToday ? 'text-slate-700 font-black' : 'text-slate-400'}`}>
              {d.day}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
function MetricCard({ icon: Icon, iconColor, label, value, unit, sublabel, target, achieved, progress, bg, borderColor }) {
  return (
    <div className={`glass-card p-4 border ${borderColor || 'border-white/60'} ${bg || ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${iconColor}`} />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">{label}</span>
        </div>
        {achieved !== undefined && (
          achieved
            ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
        <span className="text-[10px] text-slate-400 font-mono">{unit}</span>
      </div>
      {sublabel && <p className="text-[9px] text-slate-500 mt-1 font-semibold">{sublabel}</p>}
      {progress !== undefined && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(progress, 100)}%`,
                backgroundColor: progress >= 100 ? '#10b981' : progress >= 70 ? '#6366f1' : '#f59e0b',
              }}
            />
          </div>
          {target && <span className="text-[8px] text-slate-400 font-mono shrink-0">{target}</span>}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function HealthSyncDashboard() {
  const { addXP, addToast, setSleepHours, setWaterIntake } = useCharacter();
  const [healthData, setHealthData] = useState(DUMMY_HEALTH_TODAY);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('5 menit lalu');
  const [activeProvider, setActiveProvider] = useState('samsung');
  const [xpGained, setXpGained] = useState([]);

  // Simulate live step counter
  useEffect(() => {
    const ticker = setInterval(() => {
      setHealthData(prev => ({
        ...prev,
        steps: {
          ...prev.steps,
          value: Math.min(prev.steps.value + Math.floor(Math.random() * 8), prev.steps.target + 500),
        },
        heartRate: {
          ...prev.heartRate,
          current: 72 + Math.floor(Math.random() * 12),
        },
      }));
    }, 4000);
    return () => clearInterval(ticker);
  }, []);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      // Simulate fresh data from device
      const freshSteps = DUMMY_HEALTH_TODAY.steps.value + Math.floor(Math.random() * 1200);
      const freshSleep = (6.8 + Math.random() * 1.5).toFixed(1);
      const freshHydration = (1.5 + Math.random() * 0.7).toFixed(1);

      const newData = {
        ...DUMMY_HEALTH_TODAY,
        steps: { ...DUMMY_HEALTH_TODAY.steps, value: freshSteps },
        sleep: { ...DUMMY_HEALTH_TODAY.sleep, hours: parseFloat(freshSleep) },
        hydration: { ...DUMMY_HEALTH_TODAY.hydration, liters: parseFloat(freshHydration) },
        heartRate: {
          ...DUMMY_HEALTH_TODAY.heartRate,
          current: 70 + Math.floor(Math.random() * 15),
          resting: 68 + Math.floor(Math.random() * 8),
        },
      };

      setHealthData(newData);
      setIsSyncing(false);
      setLastSync('Baru saja');

      // Apply effects to CharacterContext
      setSleepHours(parseFloat(freshSleep));
      setWaterIntake(parseFloat(freshHydration));

      // Calculate XP from health data
      const earnedXP = HEALTH_XP_RULES
        .filter(rule => rule.condition(newData))
        .map(rule => ({ xp: rule.xp, label: rule.label }));

      if (earnedXP.length > 0) {
        const totalXP = earnedXP.reduce((sum, r) => sum + r.xp, 0);
        addXP(totalXP);
        setXpGained(earnedXP);
        addToast(`💚 Health sync selesai! +${totalXP} XP dari ${earnedXP.length} health goals!`);
        setTimeout(() => setXpGained([]), 5000);
      } else {
        addToast('🔄 Health data diperbarui dari Samsung Health.');
      }
    }, 1800);
  };

  const steps = healthData.steps;
  const stepsProgress = Math.round((steps.value / steps.target) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* ── HEADER: Provider + Sync ── */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono flex items-center gap-2 mb-2">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              HEALTH SYNC DASHBOARD
            </h3>
            <div className="flex flex-wrap gap-2">
              {DUMMY_HEALTH_PROVIDERS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setActiveProvider(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[9px] font-bold border transition-all cursor-pointer ${
                    p.connected
                      ? activeProvider === p.id
                        ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-700'
                        : 'bg-emerald-50/60 border-emerald-200/60 text-emerald-600 hover:border-emerald-400'
                      : 'bg-slate-50/60 border-slate-200/60 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {p.icon}
                  <span className="hidden sm:inline">{p.name}</span>
                  {p.connected
                    ? <Wifi className="w-2.5 h-2.5 text-emerald-500" />
                    : <WifiOff className="w-2.5 h-2.5 text-slate-300" />
                  }
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <span className="text-[8px] text-slate-400 font-mono">
              {isSyncing ? 'Mengambil data dari device...' : `Last sync: ${lastSync}`}
            </span>
          </div>
        </div>

        {/* XP Gained notification */}
        {xpGained.length > 0 && (
          <div className="mt-3 p-3 bg-emerald-50/80 border border-emerald-200/60 rounded-xl animate-slide-up">
            <p className="text-[9px] font-black text-emerald-700 mb-1.5">🎉 Health Goals Achieved!</p>
            <div className="flex flex-wrap gap-1.5">
              {xpGained.map((item, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-100 border border-emerald-200 text-emerald-700 text-[8px] font-bold rounded-lg font-mono">
                  +{item.xp} XP — {item.label}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── RING CHARTS ROW ── */}
      <div className="glass-card p-5">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-5 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-brand-500" />
          Today's Health Rings
        </h4>
        <div className="flex justify-around flex-wrap gap-4">
          <RingChart
            value={healthData.steps.value}
            max={healthData.steps.target}
            color="#10b981"
            label="Steps"
            sublabel={`${healthData.steps.value.toLocaleString('id-ID')} / ${healthData.steps.target.toLocaleString('id-ID')}`}
          />
          <RingChart
            value={healthData.sleep.hours}
            max={8}
            color="#6366f1"
            label="Sleep"
            sublabel={`${healthData.sleep.hours}h · ${healthData.sleep.quality}`}
          />
          <RingChart
            value={healthData.hydration.liters}
            max={healthData.hydration.target}
            color="#3b82f6"
            label="Hydration"
            sublabel={`${healthData.hydration.liters}L / ${healthData.hydration.target}L`}
          />
          <RingChart
            value={healthData.activeMinutes.value}
            max={healthData.activeMinutes.target}
            color="#f59e0b"
            label="Active"
            sublabel={`${healthData.activeMinutes.value} / ${healthData.activeMinutes.target} min`}
          />
          <RingChart
            value={100 - healthData.stress.level}
            max={100}
            color="#ec4899"
            label="Calmness"
            sublabel={`Stres: ${healthData.stress.level}% ${healthData.stress.label}`}
          />
        </div>
      </div>

      {/* ── METRIC CARDS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <MetricCard
          icon={Footprints}
          iconColor="text-emerald-600"
          label="Steps Today"
          value={healthData.steps.value.toLocaleString('id-ID')}
          unit="langkah"
          sublabel={`Target: ${healthData.steps.target.toLocaleString()} langkah`}
          progress={stepsProgress}
          achieved={stepsProgress >= 100}
          bg="bg-emerald-50/30"
          borderColor="border-emerald-100/60"
        />
        <MetricCard
          icon={Heart}
          iconColor="text-rose-500"
          label="Heart Rate"
          value={healthData.heartRate.current}
          unit="bpm"
          sublabel={`Resting: ${healthData.heartRate.resting} bpm · ${healthData.heartRate.zone}`}
          achieved={healthData.heartRate.resting < 75}
          bg="bg-rose-50/30"
          borderColor="border-rose-100/60"
        />
        <MetricCard
          icon={Moon}
          iconColor="text-indigo-600"
          label="Sleep Quality"
          value={healthData.sleep.hours}
          unit="jam"
          sublabel={`Deep: ${healthData.sleep.deepSleep}h · REM: ${healthData.sleep.remSleep}h`}
          progress={Math.round((healthData.sleep.hours / 8) * 100)}
          achieved={healthData.sleep.hours >= 7}
          bg="bg-indigo-50/30"
          borderColor="border-indigo-100/60"
        />
        <MetricCard
          icon={Droplets}
          iconColor="text-blue-600"
          label="Hydration"
          value={healthData.hydration.liters}
          unit="L"
          sublabel={`Target: ${healthData.hydration.target}L/hari`}
          progress={Math.round((healthData.hydration.liters / healthData.hydration.target) * 100)}
          achieved={healthData.hydration.liters >= healthData.hydration.target}
          bg="bg-blue-50/30"
          borderColor="border-blue-100/60"
        />
        <MetricCard
          icon={Flame}
          iconColor="text-amber-600"
          label="Calories Burned"
          value={healthData.calories.burned.toLocaleString('id-ID')}
          unit="kal"
          sublabel={`Intake: ${healthData.calories.intake.toLocaleString()} kal`}
          progress={Math.round((healthData.calories.burned / healthData.calories.intake) * 100)}
          achieved={healthData.calories.burned >= 1800}
          bg="bg-amber-50/30"
          borderColor="border-amber-100/60"
        />
        <MetricCard
          icon={Wind}
          iconColor="text-teal-600"
          label="SpO2"
          value={healthData.oxygenSat.value}
          unit="%"
          sublabel={healthData.oxygenSat.value >= 95 ? '✅ Normal' : '⚠️ Perlu perhatian'}
          achieved={healthData.oxygenSat.value >= 95}
          bg="bg-teal-50/30"
          borderColor="border-teal-100/60"
        />
      </div>

      {/* ── WEEKLY TRENDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
            <Footprints className="w-3.5 h-3.5 text-emerald-500" />
            Weekly Steps
          </h4>
          <WeeklyChart data={DUMMY_HEALTH_WEEK} valueKey="steps" color="#10b981" unit=" langkah" />
        </div>
        <div className="glass-card p-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
            <Moon className="w-3.5 h-3.5 text-indigo-500" />
            Weekly Sleep
          </h4>
          <WeeklyChart data={DUMMY_HEALTH_WEEK} valueKey="sleep" color="#6366f1" unit="h" />
        </div>
      </div>

      {/* ── HEALTH INSIGHTS ── */}
      <div className="glass-card p-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          Health Intelligence Insights
        </h4>
        <div className="flex flex-col gap-3">
          {DUMMY_HEALTH_INSIGHTS.map((insight, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-all">
              <div className="w-8 h-8 rounded-xl bg-white/80 border border-white/60 flex items-center justify-center text-base shrink-0">
                {insight.icon}
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-700">{insight.title}</div>
                <div className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">{insight.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RPG STAT EFFECTS ── */}
      <div className="glass-card p-4 bg-gradient-to-br from-brand-50/40 to-indigo-50/40 border border-brand-100/50">
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-brand-500" />
          Health → RPG Stat Effects
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {HEALTH_XP_RULES.map((rule, i) => {
            const achieved = rule.condition(healthData);
            return (
              <div key={i} className={`flex items-center gap-2 p-2.5 rounded-xl border text-[9px] font-semibold ${
                achieved
                  ? 'bg-emerald-50/80 border-emerald-200/60 text-emerald-700'
                  : 'bg-slate-50/60 border-slate-200/40 text-slate-400'
              }`}>
                {achieved
                  ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  : <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                }
                <span>{rule.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
