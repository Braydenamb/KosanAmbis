import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Check, Music, Volume2, Sparkles, RefreshCw, Trophy } from 'lucide-react';
import { ambientSynth } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

export default function ProductivityHub({
  focusHoursToday,
  setFocusHoursToday,
  streak,
  missions,
  setMissions,
  rewards,
  setRewards,
  incrementPomodoroCount
}) {
  
  // --- 1. CLOCK & GREETING STATE ---
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hr = time.getHours();
    if (hr < 11) return "Selamat pagi pejuang subuh, slayer mager! 🌅";
    if (hr < 15) return "Selamat siang pejuang IPK, tetap fokus! ☀️";
    if (hr < 19) return "Selamat sore pejuang deadline, dikit lagi kelar! 🌇";
    return "Selamat malam, jangan biarkan kasur memanggilmu terlalu cepat! 🌌";
  };

  const formatDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return time.toLocaleDateString('id-ID', options);
  };

  // --- 2. POMODORO TIMER STATE ---
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const timerIntervalRef = useRef(null);

  // Audio Ambient State
  const [activeAmbient, setActiveAmbient] = useState(null); // 'lofi' | 'rain' | 'cafe' | null

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(timerMode === 'focus' ? 25 : 5);
    setSeconds(0);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const handleModeChange = (mode) => {
    setIsActive(false);
    setTimerMode(mode);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  useEffect(() => {
    if (isActive) {
      timerIntervalRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (seconds === 0) {
          if (minutes === 0) {
            // Timer Selesai
            setIsActive(false);
            clearInterval(timerIntervalRef.current);
            
            // Konfigurasi alarm bawaan web browser
            playCompletionBeep();
            
            if (timerMode === 'focus') {
              // Menambahkan jam fokus (25 menit = 0.4 jam)
              setFocusHoursToday(prev => prev + 0.4);
              incrementPomodoroCount();
              triggerConfetti("pomodoro");
              showToast("Selamat! 25 menit fokus berhasil diselesaikan. Tambah +0.4 jam produktif!");
              
              // Switch ke break secara otomatis
              setTimerMode('break');
              setMinutes(5);
            } else {
              showToast("Waktu istirahat selesai! Siap gempur tugas lagi?");
              setTimerMode('focus');
              setMinutes(25);
            }
            setSeconds(0);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        }
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isActive, minutes, seconds, timerMode]);

  // Bunyi beep sederhana saat kelar
  const playCompletionBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.value = 523.25; // Note C5
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch(e){}
  };

  // Toggle ambient sound
  const handleAmbientToggle = (ambientType) => {
    if (activeAmbient === ambientType) {
      ambientSynth.stopAll();
      setActiveAmbient(null);
    } else {
      ambientSynth.stopAll();
      if (ambientType === 'lofi') ambientSynth.startLofi();
      if (ambientType === 'rain') ambientSynth.startRain();
      if (ambientType === 'cafe') ambientSynth.startCafe();
      setActiveAmbient(ambientType);
      showToast(`Memutar ambient sound: ${ambientType.toUpperCase()} 🎧`);
    }
  };

  // Bersihkan audio saat unmount
  useEffect(() => {
    return () => {
      ambientSynth.stopAll();
    };
  }, []);

  // --- 3. TOAST STATE ---
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // --- 4. CONFETTI CELEBRATION ---
  const triggerConfetti = (type) => {
    if (type === "pomodoro") {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#34d399', '#f59e0b']
      });
    } else if (type === "reward") {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
    }
  };

  // --- 5. MISSIONS STATE ---
  const [newMissionText, setNewMissionText] = useState("");
  
  const handleAddMission = (e) => {
    e.preventDefault();
    if (!newMissionText.trim()) return;
    const newMission = {
      id: Date.now(),
      text: newMissionText.trim(),
      completed: false
    };
    setMissions([...missions, newMission]);
    setNewMissionText("");
    showToast("Misi baru ditambahkan ke checklist! 🎯");
  };

  const toggleMission = (id) => {
    setMissions(missions.map(m => {
      if (m.id === id) {
        const nextState = !m.completed;
        if (nextState) {
          showToast("Misi berhasil diselesaikan! Good job! ✨");
          // Tambahkan sedikit confetti mini
          confetti({ particleCount: 20, spread: 30, origin: { y: 0.8 }, colors: ['#34d399'] });
        }
        return { ...m, completed: nextState };
      }
      return m;
    }));
  };

  const deleteMission = (id) => {
    setMissions(missions.filter(m => m.id !== id));
    showToast("Misi dihapus.");
  };

  // --- 6. SELF REWARD POOL ---
  const getRewardProgress = (reward) => {
    if (reward.targetType === 'streak') {
      return Math.min((streak / reward.targetValue) * 100, 100);
    } else if (reward.targetType === 'focusHours') {
      // Menghitung jam fokus kumulatif yang dimasukkan ke app
      return Math.min((focusHoursToday / reward.targetValue) * 100, 100);
    }
    return 0;
  };

  const handleClaimReward = (id, title) => {
    setRewards(rewards.map(r => {
      if (r.id === id) {
        return { ...r, unlocked: true };
      }
      return r;
    }));
    triggerConfetti("reward");
    showToast(`🥳 Reward diklaim: "${title}". Selamat menikmati hasil kerja kerasmu!`);
  };

  // --- 7. TAMPARAN PAGI / DAILY QUOTES ---
  const [quote, setQuote] = useState("");
  const quotesList = [
    "Deadline tidak mengenal belas kasihan.",
    "Belajar 25 menit gak bikin meninggal.",
    "Scroll TikTok tidak menyelesaikan skripsi.",
    "Mager sekarang, menangis pas pembagian IPK.",
    "Ingat orang tua di rumah pengen liat kamu wisuda, bukan scroll reels.",
    "IPK tinggi gak menjamin sukses, tapi IPK rendah bikin HRD tersenyum sinis.",
    "Hari ini rebahan, besok keteteran. Pilih mana?",
    "Jangan biarkan kasurmu mengalahkan masa depanmu.",
    "Kerjain sekarang! Gak usah nunggu mood. Mood itu dibangun, bukan ditunggu.",
    "Kopi habis skripsi belum jalan? Masalah besar, Bro!"
  ];

  const rollNewQuote = () => {
    const filtered = quotesList.filter(q => q !== quote);
    const rand = filtered[Math.floor(Math.random() * filtered.length)];
    setQuote(rand);
  };

  useEffect(() => {
    rollNewQuote();
  }, []);

  // Hitung persentase progress lingkar Pomodoro
  const totalDuration = timerMode === 'focus' ? 25 * 60 : 5 * 60;
  const currentRemaining = minutes * 60 + seconds;
  const strokeDashoffset = totalDuration > 0 
    ? (currentRemaining / totalDuration) * 220 
    : 0;

  return (
    <div className="flex-1 flex flex-col gap-6">
      
      {/* TOAST SYSTEM (Lucu & Gen Z style) */}
      {toastMessage && (
        <div className="fixed top-5 right-5 left-5 md:left-auto md:w-96 glass-panel border border-emerald-500/40 p-4 rounded-xl shadow-lg z-50 animate-bounce flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <p className="text-xs font-semibold text-zinc-200">{toastMessage}</p>
        </div>
      )}

      {/* 1. HEADER (Greeting & Realtime Date) */}
      <header className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-zinc-100 font-sans tracking-tight">
            {getGreeting()}
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-1 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ripple"></span>
            {formatDate()}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-zinc-500 block font-mono">JAM SYSTEM</span>
          <span className="text-2xl font-black text-emerald-400 font-mono tracking-wider emerald-glow-text">
            {time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </header>

      {/* 2. POMODORO TIMER */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col lg:flex-row items-center gap-8 bg-zinc-900/60 border border-zinc-800">
        
        {/* Lingkaran Visual Timer */}
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle 
              cx="50" cy="50" r="35" 
              className="stroke-zinc-800" strokeWidth="4.5" fill="transparent"
            />
            {/* Countdown Progress Circle */}
            <circle 
              cx="50" cy="50" r="35" 
              className={`transition-all duration-300 ${timerMode === 'focus' ? 'stroke-emerald-500' : 'stroke-sky-500'}`} 
              strokeWidth="4.5" 
              fill="transparent"
              strokeDasharray="220"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black tracking-tight font-mono text-zinc-100">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 mt-1 font-mono">
              {timerMode === 'focus' ? 'Fokus' : 'Rehat'}
            </span>
          </div>
        </div>

        {/* Kontrol & Ambient Sound */}
        <div className="flex-1 w-full flex flex-col gap-4">
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Pomodoro Timer 🍅</h3>
            <p className="text-xs text-zinc-400">Kerjakan tugas secara berkala untuk membasmi rasa malas.</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 gap-1 self-start">
            <button 
              onClick={() => handleModeChange('focus')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timerMode === 'focus' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Focus Mode (25m)
            </button>
            <button 
              onClick={() => handleModeChange('break')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timerMode === 'break' 
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Short Break (5m)
            </button>
          </div>

          {/* Timer Buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTimer}
              className={`flex-1 md:flex-initial py-2.5 px-6 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all ${
                isActive 
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700' 
                  : 'bg-emerald-500 hover:bg-emerald-600 text-zinc-950 shadow-[0_4px_14px_rgba(16,185,129,0.35)]'
              }`}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-zinc-950" />}
              {isActive ? 'Pause' : 'Mulai Sekarang'}
            </button>
            <button 
              onClick={resetTimer}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-xl border border-zinc-700 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Ambient Sound Synthesizer Controls */}
          <div className="border-t border-zinc-800/80 pt-3">
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block font-mono mb-2">Ambient Sound Generator (100% Offline)</span>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'lofi', label: '🎧 Lofi Synth', color: 'hover:border-purple-500/40 text-purple-400 bg-purple-500/5' },
                { type: 'rain', label: '🌧️ Hujan Deras', color: 'hover:border-blue-500/40 text-blue-400 bg-blue-500/5' },
                { type: 'cafe', label: '☕ Cafe Rumble', color: 'hover:border-amber-500/40 text-amber-400 bg-amber-500/5' }
              ].map(sound => (
                <button
                  key={sound.type}
                  onClick={() => handleAmbientToggle(sound.type)}
                  className={`px-3 py-1.5 text-[11px] font-semibold border rounded-lg transition-all flex items-center gap-1.5 ${sound.color} ${
                    activeAmbient === sound.type 
                      ? 'border-emerald-500/70 bg-emerald-500/10 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.15)] scale-95' 
                      : 'border-zinc-800 text-zinc-400 bg-zinc-950'
                  }`}
                >
                  <Music className={`w-3.5 h-3.5 ${activeAmbient === sound.type ? 'animate-spin' : ''}`} />
                  {sound.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. TOP 3 WEEKLY MISSIONS */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold text-zinc-100">Top Weekly Missions 🎯</h3>
          <p className="text-xs text-zinc-400">Daftar target utama yang wajib dibantai minggu ini.</p>
        </div>

        {/* Input Form Misi Baru */}
        <form onSubmit={handleAddMission} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Tambah misi ambismu disini..." 
            value={newMissionText}
            onChange={(e) => setNewMissionText(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button 
            type="submit"
            className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 rounded-xl flex items-center justify-center shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5 font-bold" />
          </button>
        </form>

        {/* List Misi */}
        <div className="flex flex-col gap-2 mt-1 max-h-60 overflow-y-auto pr-1">
          {missions.map(mission => (
            <div 
              key={mission.id} 
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                mission.completed 
                  ? 'bg-zinc-950/40 border-zinc-900 opacity-60' 
                  : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700/80'
              }`}
            >
              <div className="flex items-center gap-3 flex-1 mr-2 cursor-pointer" onClick={() => toggleMission(mission.id)}>
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  mission.completed 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                    : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500'
                }`}>
                  {mission.completed && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>
                <span className={`text-xs font-medium text-zinc-300 select-none transition-all ${
                  mission.completed ? 'line-through text-zinc-500' : ''
                }`}>
                  {mission.text}
                </span>
              </div>
              <button 
                onClick={() => deleteMission(mission.id)}
                className="p-1.5 hover:bg-zinc-800/80 rounded-lg text-zinc-500 hover:text-rose-500 transition-colors"
                title="Hapus Misi"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          {missions.length === 0 && (
            <div className="text-center py-6 text-xs text-zinc-500 italic">
              Tidak ada misi tersisa. Kosanmu sangat santai sekarang! 🏝️
            </div>
          )}
        </div>
      </section>

      {/* 4. SELF REWARD POOL */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Self Reward Pool 🏆</h3>
            <p className="text-xs text-zinc-400">Janjikan hadiah kecil pada dirimu agar tidak burnout.</p>
          </div>
          <Trophy className="w-6 h-6 text-amber-500 fill-amber-500/10 animate-bounce" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
          {rewards.map(reward => {
            const progress = getRewardProgress(reward);
            const isFinished = progress >= 100;
            
            return (
              <div 
                key={reward.id} 
                className={`p-4 rounded-xl border flex flex-col justify-between gap-3 transition-all ${
                  reward.unlocked 
                    ? 'bg-emerald-950/10 border-emerald-500/20' 
                    : 'bg-zinc-900/40 border-zinc-800'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase rounded font-mono ${
                      reward.unlocked 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {reward.unlocked ? 'Unlocked 🥳' : 'Locked 🔒'}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono text-right">{reward.requirement}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-200 mt-2 line-clamp-1">{reward.title}</h4>
                </div>

                {/* Progress bar */}
                <div className="w-full">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 font-mono mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                    <div 
                      className={`h-full rounded-full transition-all duration-700 ${
                        isFinished ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-zinc-700'
                      }`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Claim Button */}
                {isFinished && !reward.unlocked ? (
                  <button 
                    onClick={() => handleClaimReward(reward.id, reward.title)}
                    className="w-full py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-zinc-950 font-extrabold text-[11px] rounded-lg shadow-[0_0_12px_rgba(245,158,11,0.2)] animate-pulse transition-all"
                  >
                    KLAIM REWARD! 🎁
                  </button>
                ) : reward.unlocked ? (
                  <div className="text-center py-1.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 font-semibold text-[11px] rounded-lg">
                    Telah Dinikmati ✨
                  </div>
                ) : (
                  <button 
                    disabled 
                    className="w-full py-1.5 bg-zinc-800 text-zinc-500 font-semibold text-[11px] rounded-lg cursor-not-allowed border border-zinc-700/50"
                  >
                    Belum Tercapai
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DAILY QUOTE / TAMPARAN PAGI */}
      <section className="glass-panel p-5 rounded-2xl flex flex-col gap-3 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 border border-zinc-800">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <span className="text-[10px] text-rose-500 uppercase tracking-widest font-black font-mono">⚠️ Tamparan Pagi Hari Ini</span>
          <button 
            onClick={rollNewQuote}
            className="p-1 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all active:rotate-180 duration-300"
            title="Quote Baru"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <blockquote className="text-sm font-semibold italic text-zinc-200 pl-3 border-l-2 border-rose-500 py-1 font-sans">
          "{quote}"
        </blockquote>
      </section>

    </div>
  );
}
