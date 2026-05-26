import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, CheckCircle2, Award, Calendar, Quote, Sparkles } from 'lucide-react';
import { quotes } from '../data/quotes';

export default function MainContent({ 
  missions, 
  setMissions, 
  rewards, 
  setRewards, 
  focusHours,
  onAddFocusTime,
  addToast
}) {
  // --- Dates ---
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('id-ID', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- Quote Generator ---
  const [activeQuote, setActiveQuote] = useState(quotes[0]);
  const handleNewQuote = () => {
    let rand = activeQuote;
    while (rand.text === activeQuote.text) {
      rand = quotes[Math.floor(Math.random() * quotes.length)];
    }
    setActiveQuote(rand);
    addToast("💡 Tamparan pagi baru dikirim ke otakmu!");
  };

  // --- Pomodoro Timer ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            onAddFocusTime(0.41); // Add ~25 minutes in decimal hours (25 / 60 = 0.41 hours)
            addToast("🏆 Pomodoro selesai! +0.4 Jam Fokus ditambahkan.");
            triggerConfetti();
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    addToast(isRunning ? "⏸️ Timer di-pause. Jangan kelamaan rebahan!" : "⏱️ Fokus dimulai! Mager slayer mode: ON.");
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
    addToast("🔄 Timer di-reset. Mulai lembaran baru!");
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  // --- Web Audio API Ambient Sound Synthesizer ---
  const [activeSound, setActiveSound] = useState(null); // 'lofi' | 'rain' | 'cafe' | null
  const audioContextRef = useRef(null);
  const soundNodesRef = useRef([]);

  const stopAmbientSound = () => {
    soundNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
    });
    soundNodesRef.current = [];
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      // Just suspend to save resources or close
    }
    setActiveSound(null);
  };

  const playAmbientSound = (type) => {
    stopAmbientSound();
    
    // Create new AudioContext
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    if (type === 'rain') {
      // Synthesize rain using white noise + lowpass filter
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800; // Rain is low/mid frequency

      const gain = ctx.createGain();
      gain.gain.value = 0.15; // Soft volume

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
      soundNodesRef.current.push(whiteNoise);
      setActiveSound('rain');
      addToast("🌧️ Memutar suara hujan ambient. Dingin tapi fokus.");
    } 
    else if (type === 'cafe') {
      // Synthesize cafe using rumble (pink noise) + occasional soft chatter beep
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 * 0.5362;
        output[i] *= 0.11; // estimate pink noise amplitude
        b6 = white * 0.115926;
      }

      const pinkNoise = ctx.createBufferSource();
      pinkNoise.buffer = noiseBuffer;
      pinkNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350; // Low café crowd murmur

      const gain = ctx.createGain();
      gain.gain.value = 0.25;

      pinkNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      pinkNoise.start();
      soundNodesRef.current.push(pinkNoise);
      setActiveSound('cafe');
      addToast("☕ Memutar suasana kedai kopi. Serasa nugas di Starbucks.");
    }
    else if (type === 'lofi') {
      // Synthesize a lofi loop: cozy repeating sinewave chords + crackle vinyl noise
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.value = 146.83; // D3 chord
      
      osc2.type = 'sine';
      osc2.frequency.value = 196.00; // G3 chord

      // Soft crackle noise
      const bufferSize = ctx.sampleRate * 2;
      const crackleBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = crackleBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() < 0.002 ? (Math.random() * 2 - 1) * 0.1 : 0;
      }
      const crackleSource = ctx.createBufferSource();
      crackleSource.buffer = crackleBuffer;
      crackleSource.loop = true;
      
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000;

      gainNode.gain.value = 0.08;

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      crackleSource.connect(filter);
      filter.connect(gainNode);
      
      gainNode.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      crackleSource.start();
      
      soundNodesRef.current.push(osc1, osc2, crackleSource);
      setActiveSound('lofi');
      addToast("🎧 Memutar Lofi Beats ambient. Santai tapi mantap.");
    }
  };

  const toggleSound = (soundType) => {
    if (activeSound === soundType) {
      stopAmbientSound();
      addToast("🔇 Suara ambient dimatikan.");
    } else {
      playAmbientSound(soundType);
    }
  };

  // --- Confetti Canvas Effect ---
  const canvasRef = useRef(null);
  const triggerConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const colors = ['#10b981', '#34d399', '#6ee7b7', '#facc15', '#60a5fa'];
    const particles = Array.from({ length: 80 }).map(() => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 4,
      gravity: 0.2,
      opacity: 1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      particles.forEach(p => {
        if (p.opacity > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.opacity -= 0.015;
          active = true;
        }
      });
      if (active) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    render();
  };

  // --- Weekly Missions ---
  const toggleMission = (id) => {
    setMissions(prev => 
      prev.map(m => {
        if (m.id === id) {
          const completed = !m.completed;
          addToast(completed ? "✅ Misi diselesaikan! Mantap slayer." : "❌ Misi dibatalkan. Ayo fokus lagi.");
          if (completed) triggerConfetti();
          return { ...m, completed };
        }
        return m;
      })
    );
  };

  // --- Self Reward Pool ---
  const unlockReward = (reward) => {
    if (reward.unlocked) {
      addToast("🎁 Reward ini sudah di-unlock sebelumnya!");
      return;
    }
    
    // Check if enough focus hours
    const currentHoursTotal = Math.max(focusHours, 0);
    if (currentHoursTotal >= reward.hoursNeeded) {
      setRewards(prev => prev.map(r => r.id === reward.id ? { ...r, unlocked: true } : r));
      addToast(`🎉 Selamat! Kamu meng-unlock "${reward.text}"!`);
      triggerConfetti();
    } else {
      addToast(`🔒 Belum cukup jam fokus! Butuh ${reward.hoursNeeded} jam (sekarang: ${focusHours.toFixed(1)} jam).`);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-6 relative">
      {/* Canvas for Confetti */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50 rounded-2xl" />

      {/* 1. HEADER */}
      <div className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-none m-0 mb-2">
            Selamat datang kembali, pejuang deadline.
          </h1>
          <p className="text-sm text-zinc-400 font-medium">
            Saatnya bantai kemageran dan kuasai harimu!
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-brand-400">
          <Calendar className="w-4 h-4" />
          {currentDate || "Memuat tanggal..."}
        </div>
      </div>

      {/* TWO COLUMN ROW FOR POMODORO + CHECKLIST */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* 2. POMODORO TIMER */}
        <div className="glass-card p-6 md:col-span-7 flex flex-col items-center justify-between text-center relative">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">POMODORO TIMER</span>
            <div className="flex items-center gap-1.5 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20 text-[10px] text-brand-400 font-bold">
              <Sparkles className="w-3 h-3 animate-spin" />
              25 MIN FOKUS
            </div>
          </div>

          {/* Pomodoro Circle Animation */}
          <div className="relative w-44 h-44 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="88"
                cy="88"
                r="78"
                className="stroke-zinc-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="88"
                cy="88"
                r="78"
                className="stroke-brand-500 transition-all duration-300"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 78}
                strokeDashoffset={2 * Math.PI * 78 * (1 - progressPercent / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white tracking-wider select-none">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase mt-0.5">
                {isRunning ? "ON PROGRESS" : "PAUSED"}
              </span>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={handleStartPause}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-darkbg-950 font-bold rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-glow"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isRunning ? "Pause" : "Mulai"}
            </button>
            <button 
              onClick={handleReset}
              className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Ambient Sounds */}
          <div className="w-full mt-6 pt-4 border-t border-zinc-800/80">
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              Ambient Sound Generator (Offline)
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <button 
                onClick={() => toggleSound('lofi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeSound === 'lofi' ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-glow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
              >
                🎧 Lofi Beat
              </button>
              <button 
                onClick={() => toggleSound('rain')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeSound === 'rain' ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-glow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
              >
                🌧️ Rain Noise
              </button>
              <button 
                onClick={() => toggleSound('cafe')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeSound === 'cafe' ? 'bg-brand-500/15 border-brand-500 text-brand-400 shadow-glow' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
              >
                ☕ Cafe Rumor
              </button>
            </div>
          </div>
        </div>

        {/* 3. TOP 3 WEEKLY MISSIONS */}
        <div className="glass-card p-6 md:col-span-5 flex flex-col justify-between">
          <div className="w-full">
            <h3 className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-500" />
              TOP 3 WEEKLY MISSIONS
            </h3>
            
            <div className="flex flex-col gap-3">
              {missions.map(mission => (
                <div 
                  key={mission.id}
                  onClick={() => toggleMission(mission.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${mission.completed ? 'bg-brand-950/10 border-brand-500/20 text-zinc-500' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700 text-zinc-200'}`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${mission.completed ? 'bg-brand-500 border-brand-500 text-darkbg-950' : 'border-zinc-700'}`}>
                    {mission.completed && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span className={`text-xs font-semibold ${mission.completed ? 'line-through' : ''}`}>
                    {mission.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-[11px] text-zinc-400 text-center italic">
            *Misi mingguan diperbarui otomatis tiap Senin.
          </div>
        </div>
      </div>

      {/* 4. SELF REWARD POOL */}
      <div className="glass-card p-6">
        <h3 className="text-xs font-bold text-zinc-400 tracking-wider uppercase mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-500" />
          SELF REWARD POOL
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewards.map(reward => {
            const hasEnough = focusHours >= reward.hoursNeeded;
            const statusText = reward.unlocked ? "TELAH DIKLAIM" : hasEnough ? "SIAP DI-UNLOCK!" : `BUTUH ${reward.hoursNeeded} JAM`;
            
            return (
              <div 
                key={reward.id}
                className={`glass-card p-4 flex flex-col justify-between gap-4 border transition-all relative ${reward.unlocked ? 'border-brand-500 bg-brand-950/10 opacity-70' : hasEnough ? 'border-yellow-500/50 bg-yellow-950/5 animate-pulse' : 'border-zinc-800'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xl">
                    {reward.icon}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${reward.unlocked ? 'bg-brand-500/20 text-brand-400' : hasEnough ? 'bg-yellow-500/20 text-yellow-400' : 'bg-zinc-800 text-zinc-500'}`}>
                    {statusText}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white mb-1">{reward.text}</h4>
                  <div className="w-full bg-zinc-800/80 rounded-full h-1.5 overflow-hidden my-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${reward.unlocked ? 'bg-brand-500' : 'bg-yellow-500'}`} 
                      style={{ width: `${Math.min((focusHours / reward.hoursNeeded) * 100, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-zinc-500 font-semibold">
                    <span>{focusHours.toFixed(1)} / {reward.hoursNeeded} JAM</span>
                  </div>
                </div>

                <button 
                  onClick={() => unlockReward(reward)}
                  disabled={reward.unlocked}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold transition-all ${reward.unlocked ? 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed' : hasEnough ? 'bg-yellow-500 text-darkbg-950 hover:bg-yellow-400' : 'bg-zinc-800 text-zinc-400 cursor-not-allowed'}`}
                >
                  {reward.unlocked ? "Claimed" : "Unlock Reward"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. DAILY QUOTE / TAMPARAN PAGI */}
      <div className="glass-card p-5 border border-red-500/10 bg-red-950/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="absolute -bottom-8 -right-8 opacity-[0.03] text-white">
          <Quote className="w-36 h-36" />
        </div>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-950/20 border border-red-800/30 text-rose-400 rounded-xl mt-1">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-widest text-rose-400 uppercase">TAMPARAN PAGI</span>
            <p className="text-sm font-semibold text-zinc-200 mt-1 select-none leading-relaxed">
              “{activeQuote.text}”
            </p>
            <div className="text-[10px] font-bold text-zinc-400 mt-1">
              — {activeQuote.author}
            </div>
          </div>
        </div>

        <button 
          onClick={handleNewQuote}
          className="px-4 py-2 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/50 text-rose-400 hover:text-rose-300 font-bold rounded-xl text-xs transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
        >
          Quote Baru
        </button>
      </div>
    </div>
  );
}
