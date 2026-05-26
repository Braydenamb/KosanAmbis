import React, { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { CheckSquare, Plus, Minus, Trash2, ShieldAlert, BookOpen, Coffee, Maximize2, Minimize2, Play, Square } from 'lucide-react';

export default function ProductivityModule() {
  const {
    deadlines,
    setDeadlines,
    bolosCounters,
    setBolosCounters,
    quickNotes,
    setQuickNotes,
    focusHours,
    setFocusHours,
    setSleepHours,
    addToast,
    addXP
  } = useCharacter();

  // --- Task Input ---
  const [taskInput, setTaskInput] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium'); // Medium -> kuning, High -> merah, Low -> hijau

  // --- Quick Note Input ---
  const [noteInput, setNoteInput] = useState('');

  // --- Pomodoro States ---
  const [timerMode, setTimerMode] = useState('Focus'); // Focus (25m), Chill (5m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Synced audio state for Zen Room ---
  const [ambientAudio, setAmbientAudio] = useState({
    active: false,
    audioContext: null,
    source: null,
    gainNode: null
  });

  // --- Handle Timer countdown ---
  useEffect(() => {
    let interval = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleTimerComplete = () => {
    setTimerActive(false);
    if (timerMode === 'Focus') {
      const added = Number((25 / 60).toFixed(2));
      setFocusHours(prev => Number((prev + added).toFixed(2)));
      addToast("🏆 Sesi Ambis Sukses! Sel-sel otak Anda tumbuh pesat (+25m fokus).");
      addXP(40);
      
      // Recharge sleepHours slightly as active energy recovery
      setSleepHours(prev => Math.min(prev + 0.5, 24));

      // Reset to chill session
      setTimerMode('Chill');
      setTimeLeft(5 * 60);
    } else {
      addToast("☕ Istirahat selesai. Mari bersiap bertarung di medan akademik!");
      setTimerMode('Focus');
      setTimeLeft(25 * 60);
    }
  };

  const handleToggleTimer = () => {
    setTimerActive(!timerActive);
    addToast(timerActive ? "⏸️ Sesi fokus ditangguhkan sementara." : "▶️ Sesi fokus dimulai. Singkirkan gadget Anda!");
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setTimeLeft(timerMode === 'Focus' ? 25 * 60 : 5 * 60);
    addToast("🔄 Timer fokus diatur ulang ke kondisi awal.");
  };

  // --- Synth Sound Engine for Chill Atmosphere ---
  const handleToggleZenAudio = () => {
    if (ambientAudio.active) {
      if (ambientAudio.source) {
        try { ambientAudio.source.stop(); } catch(e){}
      }
      setAmbientAudio(prev => ({ ...prev, active: false, source: null }));
      addToast("🔇 Ambient sound dinonaktifkan.");
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = ambientAudio.audioContext || new AudioCtx();
      
      // Synthesize pink/brown relaxing noise programmatically
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Amplify slightly
      }
      
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = noiseBuffer;
      noiseNode.loop = true;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
      
      noiseNode.connect(gainNode);
      gainNode.connect(ctx.destination);
      noiseNode.start();
      
      setAmbientAudio({
        active: true,
        audioContext: ctx,
        source: noiseNode,
        gainNode: gainNode
      });
      addToast("🔊 Suara rintik hujan sintetis aktif di Zen Room.");
    } catch(e) {
      console.error(e);
      addToast("❌ Perangkat audio tidak didukung.");
    }
  };

  // --- Task Actions ---
  const handleAddTask = () => {
    if (!taskInput.trim()) return;
    
    // Map visual selector to internal Indonesian names of CharacterContext
    let internalPriority = 'kuning';
    if (taskPriority === 'High') internalPriority = 'merah';
    if (taskPriority === 'Low') internalPriority = 'hijau';

    const newDeadline = {
      id: Date.now(),
      title: taskInput,
      deadline: 'Segera',
      priority: internalPriority,
      completed: false
    };

    setDeadlines(prev => [newDeadline, ...prev]);
    setTaskInput('');
    addToast("📝 Tugas berhasil ditambahkan ke matriks ambis.");
    addXP(10);
  };

  const handleToggleTask = (id) => {
    setDeadlines(prev => prev.map(d => {
      if (d.id === id) {
        const nextState = !d.completed;
        if (nextState) {
          addToast("✅ Tugas selesai! XP meningkat.");
          addXP(20);
        }
        return { ...d, completed: nextState };
      }
      return d;
    }));
  };

  const handleDeleteTask = (id) => {
    setDeadlines(prev => prev.filter(d => d.id !== id));
    addToast("🗑️ Tugas dihapus dari matriks.");
  };

  // --- Absensi Actions ---
  const handleModifyAbsen = (subject, change) => {
    setBolosCounters(prev => prev.map(item => {
      if (item.subject === subject) {
        const newSkipped = item.skipped + change;
        const capped = newSkipped < 0 ? 0 : newSkipped > item.max ? item.max : newSkipped;
        
        if (change > 0) {
          addToast(`⚠️ Bolos tercatat pada matkul ${subject}. Hati-hati drop out!`);
        } else {
          addToast(`💚 Pulihkan absensi matkul ${subject}.`);
        }
        return { ...item, skipped: capped };
      }
      return item;
    }));
  };

  // --- Note Actions ---
  const handleAddNote = () => {
    if (!noteInput.trim()) return;
    const timeNow = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const newNote = {
      id: Date.now(),
      text: noteInput,
      time: timeNow
    };
    setQuickNotes(prev => [newNote, ...prev]);
    setNoteInput('');
    addToast("🧠 Memo tersimpan di otak cadangan.");
    addXP(5);
  };

  const handleDeleteNote = (id) => {
    setQuickNotes(prev => prev.filter(n => n.id !== id));
    addToast("🗑️ Memo dihapus.");
  };

  const formatTimer = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. DEADLINE MATRIX */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
          <CheckSquare className="w-4 h-4 text-brand-500" />
          ACADEMIC TASK MATRICES (LINEAR)
        </h3>

        {/* Input Bar */}
        <div className="flex gap-2.5 mb-4">
          <input 
            type="text" 
            placeholder="Tulis tugas baru disini..."
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            className="flex-1 bg-white/50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
          />
          
          <select 
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="bg-white/50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button 
            onClick={handleAddTask}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Task lists */}
        <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
          {deadlines && deadlines.map(task => {
            const isHigh = task.priority === 'merah' || task.priority === 'High';
            const isMedium = task.priority === 'kuning' || task.priority === 'Medium';
            const badgeColor = isHigh ? 'bg-rose-50 border-rose-200 text-rose-600' : isMedium ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-slate-100 border-slate-200 text-slate-600';
            const visualLabel = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';

            return (
              <div 
                key={task.id}
                className="p-3 bg-white/40 border border-white/60 hover:bg-white/70 hover:border-slate-300 rounded-2xl flex items-center justify-between gap-3 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-4 h-4 rounded border-slate-300 text-brand-500 focus:ring-brand-400 cursor-pointer"
                  />
                  <span className={`text-xs font-bold transition-all ${task.completed ? 'line-through text-slate-400 opacity-60' : 'text-slate-800'}`}>
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[8px] font-black border uppercase px-1.5 py-0.5 rounded font-mono ${badgeColor}`}>
                    {visualLabel}
                  </span>
                  
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    aria-label="Delete Task"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. ABSENSI BUFFER CONTROL */}
        <div className="glass-card p-5">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
            <ShieldAlert className="w-4 h-4 text-brand-500" />
            CLASS SKIPS BUFFER LIMITS
          </h3>

          <div className="flex flex-col gap-3">
            {bolosCounters && bolosCounters.map(item => {
              const bolosLeft = item.max - item.skipped;
              const isDanger = bolosLeft <= 1;
              const statusTheme = isDanger ? 'border-rose-100 bg-rose-50/20 text-rose-700 animate-pulse' : 'border-white/50 bg-white/20 text-slate-700';

              return (
                <div 
                  key={item.subject} 
                  className={`p-3.5 rounded-2xl border flex flex-col gap-2.5 transition-colors ${statusTheme}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{item.subject}</h4>
                      <span className="text-[8px] text-slate-400 font-extrabold uppercase font-mono block mt-1 tracking-wider">
                        SKIP BUFFER: <strong className="text-slate-600">{bolosLeft} / {item.max} slots left</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-white/80 border border-slate-100 rounded-xl p-0.5 scale-90">
                      <button 
                        onClick={() => handleModifyAbsen(item.subject, -1)}
                        disabled={item.skipped === 0}
                        className="p-1 hover:bg-slate-100 rounded text-slate-400 active:scale-95 disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-[10px] font-bold text-slate-700 w-6 text-center font-mono">{item.skipped}</span>
                      <button 
                        onClick={() => handleModifyAbsen(item.subject, 1)}
                        disabled={item.skipped >= item.max}
                        className="p-1 hover:bg-slate-100 rounded text-rose-500 active:scale-95 disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. SECOND BRAIN NOTEPAD (LIST OF STICKY NOTES) */}
        <div className="glass-card p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
              <BookOpen className="w-4 h-4 text-brand-500" />
              SECOND BRAIN QUICK NOTEPAD
            </h3>
            
            {/* Note input bar */}
            <div className="flex gap-2 mb-3">
              <input 
                type="text" 
                placeholder="Catatan utang, ide absurd..."
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="flex-1 bg-white/50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
              />
              <button 
                onClick={handleAddNote}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
              >
                Simpan
              </button>
            </div>

            {/* List notes */}
            <div className="flex flex-col gap-2 max-h-36 overflow-y-auto pr-1">
              {quickNotes && quickNotes.map(note => (
                <div key={note.id} className="p-3 bg-white/50 border border-white/80 rounded-xl flex justify-between items-start gap-2 text-xs">
                  <div>
                    <p className="text-slate-700 font-medium leading-relaxed">{note.text}</p>
                    <span className="text-[8px] font-mono text-slate-400 mt-1 block font-bold">{note.time}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-400 hover:text-rose-500 p-0.5 rounded cursor-pointer"
                    aria-label="Delete Note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. POMODORO UPGRADE ZEN FOCUS */}
      <div className="glass-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <Coffee className="w-4 h-4 text-brand-500" />
            POMODORO INTEL ZEN ENGINE
          </h3>
          
          <button 
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            aria-label="Fullscreen Zen Mode"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center py-6">
          <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest font-mono mb-2">
            CURRENT SESSION: {timerMode.toUpperCase()}
          </span>

          <div className="text-5xl font-black text-slate-800 tracking-tight font-mono mb-6 select-none">
            {formatTimer(timeLeft)}
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={handleToggleTimer}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-[10px] uppercase tracking-wider font-mono active:scale-95 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              {timerActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {timerActive ? 'Pause' : 'Start'}
            </button>
            
            <button 
              onClick={handleResetTimer}
              className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:text-slate-800 font-bold rounded-2xl text-[10px] uppercase tracking-wider font-mono active:scale-95 transition-all cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ================= POMODORO FULLSCREEN OVERLAY ================= */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-slate-100/95 backdrop-blur-3xl z-[999] flex flex-col items-center justify-between p-8 animate-fade-in">
          
          {/* Header row */}
          <div className="w-full max-w-4xl flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-mono">
              ⚡ KOSAN ZEN ROOM FULLSCREEN ACTIVE
            </span>
            <button 
              onClick={() => setIsFullscreen(false)}
              className="p-2.5 hover:bg-slate-200 rounded-2xl text-slate-500 hover:text-slate-700 transition-all border border-slate-200/50 cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Center focus area */}
          <div className="flex flex-col items-center">
            <span className="text-xs font-black text-brand-600 uppercase tracking-widest font-mono mb-4 animate-pulse">
              🧘 {timerMode === 'Focus' ? 'KEEP FOCUSING: DO NOT OPEN TIKTOK' : 'RELAX SESSION: TAKE A DEEP BREATH'}
            </span>
            
            <div className="text-9xl font-black text-slate-850 tracking-tighter font-mono select-none my-4">
              {formatTimer(timeLeft)}
            </div>

            <div className="flex items-center gap-4 mt-8">
              <button 
                onClick={handleToggleTimer}
                className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider font-mono active:scale-95 transition-all cursor-pointer flex items-center gap-2 shadow-lg"
              >
                {timerActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {timerActive ? 'Pause Session' : 'Start Focus'}
              </button>
              
              <button 
                onClick={handleResetTimer}
                className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold rounded-2xl text-xs uppercase tracking-wider font-mono active:scale-95 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Bottom Relax Controls */}
          <div className="w-full max-w-lg bg-white/40 border border-white/60 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-black text-slate-800 font-mono">BROWN CHILL SYNTH SOUND</h4>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Binaural relaxing noise synthesized in browser.</p>
            </div>
            
            <button 
              onClick={handleToggleZenAudio}
              className={`px-4 py-2 rounded-2xl text-[10px] font-bold border uppercase tracking-wider font-mono transition-all active:scale-95 cursor-pointer ${ambientAudio.active ? 'bg-brand-500 text-white shadow-glow border-brand-500' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'}`}
            >
              {ambientAudio.active ? 'Ambient Active' : 'Start Synth Noise'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
