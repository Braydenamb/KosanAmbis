import React, { useState, useEffect } from 'react';
import { X, Smile, Zap, Moon, Droplet, Users, Calendar, CheckSquare, FileText, Save } from 'lucide-react';

export default function JournalDetailModal({ dayData, isOpen, onClose, onSaveJournal }) {
  const [noteText, setNoteText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (dayData) {
      setNoteText(dayData.journalSnippet || '');
    }
  }, [dayData]);

  if (!isOpen || !dayData) return null;

  // Format date into human-readable Indonesian style
  const formatDateIndo = (dateStr) => {
    try {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const d = new Date(dateStr);
      return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  // Helper for progress colors
  const getProgressColor = (val, type) => {
    if (type === 'stress') {
      return val > 0.7 ? 'bg-rose-500 shadow-rose-550' : val > 0.4 ? 'bg-amber-500 shadow-amber-550' : 'bg-emerald-500 shadow-emerald-550';
    }
    return val > 0.7 ? 'bg-emerald-500 shadow-emerald-550' : val > 0.4 ? 'bg-brand-500 shadow-brand-550' : 'bg-slate-400 shadow-slate-500';
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onSaveJournal(dayData.date, noteText);
      setIsSaving(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop glass */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/25 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div className="w-full max-w-xl bg-white/75 backdrop-filter backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-premium relative z-10 overflow-hidden transform transition-all duration-300 scale-100 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <header className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 text-brand-600 rounded-2xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Memory Fragment</span>
              <h3 className="text-sm md:text-base font-extrabold text-slate-800 leading-tight mt-1">
                {formatDateIndo(dayData.date)}
              </h3>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2.5 hover:bg-slate-100/60 rounded-xl transition-all text-slate-400 hover:text-slate-650 cursor-pointer active:scale-95"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow scrollbar-thin">
          
          {/* Section 1: Core Metrics Grid */}
          <div className="grid grid-cols-2 gap-4">
            
            {/* Mood Meter */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Mood index</span>
                <Smile className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {Math.round(dayData.mood * 100)}%
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className={`h-full rounded-full ${getProgressColor(dayData.mood, 'mood')}`} style={{ width: `${dayData.mood * 100}%` }} />
              </div>
            </div>

            {/* Productivity Meter */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Productivity</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {Math.round(dayData.productivity * 100)}%
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className={`h-full rounded-full ${getProgressColor(dayData.productivity, 'prod')}`} style={{ width: `${dayData.productivity * 100}%` }} />
              </div>
            </div>

            {/* Sleep Hours */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Sleep hours</span>
                <Moon className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {dayData.sleep} <span className="text-[10px] font-normal text-slate-400">Hrs</span>
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min((dayData.sleep / 10) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Hydration glasses */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Hydration</span>
                <Droplet className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {dayData.hydration} <span className="text-[10px] font-normal text-slate-400">/ 12 gls</span>
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((dayData.hydration / 12) * 100, 100)}%` }} />
              </div>
            </div>

            {/* Stress level */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Stress index</span>
                <Users className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {Math.round(dayData.stress * 100)}%
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className={`h-full rounded-full ${getProgressColor(dayData.stress, 'stress')}`} style={{ width: `${dayData.stress * 100}%` }} />
              </div>
            </div>

            {/* Social battery */}
            <div className="bg-white/40 border border-white/60 p-4 rounded-3xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-slate-500 text-[10px] font-black tracking-wider uppercase font-mono">
                <span>Social Battery</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-lg font-black text-slate-800 leading-none">
                {Math.round(dayData.social * 100)}%
              </div>
              <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden border border-white/50">
                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${dayData.social * 100}%` }} />
              </div>
            </div>

          </div>

          {/* Section 2: Completed Habits */}
          <div className="bg-white/40 border border-white/60 p-5 rounded-3xl space-y-3">
            <h4 className="text-[10px] font-black text-slate-550 flex items-center gap-2 uppercase tracking-widest font-mono">
              <CheckSquare className="w-4 h-4 text-brand-600" />
              Completed Habits ({dayData.habits?.length || 0})
            </h4>

            {dayData.habits && dayData.habits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dayData.habits.map((habit, idx) => (
                  <span 
                    key={idx}
                    className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 font-extrabold text-[10px] uppercase rounded-full font-sans tracking-wide"
                  >
                    ✓ {habit}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-bold italic font-sans py-1">
                No habits completed on this day.
              </div>
            )}
          </div>

          {/* Section 3: Reflection Journal */}
          <div className="bg-white/40 border border-white/60 p-5 rounded-3xl space-y-3">
            <h4 className="text-[10px] font-black text-slate-550 flex items-center gap-2 uppercase tracking-widest font-mono">
              <FileText className="w-4 h-4 text-brand-650" />
              Daily Reflection Journal
            </h4>
            
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Bagaimana harimu berjalan? Tulis catatan refleksi pribadimu di sini..."
              rows={4}
              className="w-full bg-white/80 border border-slate-200/70 focus:border-brand-500 rounded-2xl p-4 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500/25 leading-relaxed resize-none transition-all"
            />
          </div>

        </div>

        {/* Footer actions */}
        <footer className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-white border border-slate-250 text-slate-650 hover:bg-slate-100 rounded-2xl text-xs font-bold cursor-pointer transition-all active:scale-95"
          >
            Cancel
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl text-xs font-black uppercase tracking-wider font-mono transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-brand-400" />
                Save Fragment
              </>
            )}
          </button>
        </footer>

      </div>
    </div>
  );
}
