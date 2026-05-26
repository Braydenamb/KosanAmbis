import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Shirt, Battery, MessageCircle, RefreshCw } from 'lucide-react';

export default function SocialModule() {
  const {
    laundryDate,
    setLaundryDate,
    socialBattery,
    setSocialBattery,
    addToast,
    addXP
  } = useCharacter();

  // --- Sarcastic unread chats simulator state ---
  const [unreadChats, setUnreadChats] = useState(12);

  // --- Calculate days since last laundry ---
  const lastDate = new Date(laundryDate);
  const diffTime = Math.abs(new Date() - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) - 1;

  // --- Visual clothing status ---
  let laundryStatus = {
    desc: "Aman! Lemari penuh baju harum setrikaan.",
    mound: "🧺 BERSIH & WANGI",
    color: "border-brand-200 bg-brand-50/20 text-brand-700"
  };

  if (diffDays >= 7) {
    laundryStatus = {
      desc: "GUNUNG BAJU KOTOR MELETUS! Aroma kosan tak tertolong lagi.",
      mound: "🌋 CRITICAL LAUNDRY AURA",
      color: "border-rose-200 bg-rose-50/20 text-rose-600 animate-pulse"
    };
  } else if (diffDays >= 3) {
    laundryStatus = {
      desc: "Waspada! Kursi belajar mulai tertumpuk hoodie kotor.",
      mound: "👕 KURSI BELAJAR TERSELIMUTI",
      color: "border-amber-200 bg-amber-50/20 text-amber-600"
    };
  }

  const handleWashLaundry = () => {
    setLaundryDate(new Date().toISOString());
    addToast("🧺 Baju dicuci bersih! Kamar kembali menyebarkan keharuman Downy.");
    addXP(30);
  };

  const handleSocialBatteryChange = (change) => {
    setSocialBattery(prev => {
      const val = prev + change;
      const capped = val < 0 ? 0 : val > 100 ? 100 : val;
      
      if (change > 0) {
        addToast("🔋 Baterai introvert pulih berkat hibernasi marathon anime.");
        addXP(5);
      } else {
        addToast("🪫 Baterai introvert terkuras akibat interaksi manusia.");
      }
      return capped;
    });
  };

  // --- Color scale for introvert battery ---
  const batteryColor = socialBattery < 30 ? 'bg-rose-500 shadow-glow-red animate-pulse' : socialBattery < 60 ? 'bg-amber-500' : 'bg-brand-500';

  return (
    <div className="flex flex-col gap-6">
      {/* 1. LAUNDRY MOUNDS TIMER */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
          <Shirt className="w-4 h-4 text-brand-500" />
          DOMESTIC LAUNDRY MONITOR
        </h3>

        <div className={`p-4 rounded-2xl border flex flex-col gap-3.5 transition-all ${laundryStatus.color}`}>
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest font-mono">LAUNDRY STAGES</span>
              <h4 className="text-xs font-black text-slate-800 mt-1">{laundryStatus.mound}</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                {laundryStatus.desc}
              </p>
            </div>
            
            <div className="text-right shrink-0">
              <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest font-mono">DAYS DIRTY</span>
              <span className="text-lg font-black text-slate-800">{diffDays} Days</span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-slate-200/50 my-1"></div>

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <span className="text-[8px] text-slate-400 font-extrabold uppercase font-mono">
              *SYSTEM AUTO-WARNS AFTER 7 DAYS.
            </span>
            
            <button 
              onClick={handleWashLaundry}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider font-mono transition-all active:scale-95 flex items-center gap-1.5 self-start sm:self-center cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Wash Clothes
            </button>
          </div>
        </div>
      </div>

      {/* 2. SOCIAL ENERGY INTROVERT BATTERY */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
          <Battery className="w-4 h-4 text-brand-500" />
          INTROVERT SOCIAL MATRIX BATTERIES
        </h3>

        <div className="flex flex-col gap-4">
          <div className="bg-white/40 p-4 rounded-2xl border border-white/60 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span>Baterai Introvert</span>
              <span className={socialBattery < 30 ? 'text-rose-500 font-black animate-pulse' : ''}>{socialBattery}%</span>
            </div>

            <div className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden p-[1px] border border-white/50">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${batteryColor}`}
                style={{ width: `${socialBattery}%` }}
              />
            </div>

            <div className="flex items-center justify-between gap-2.5 mt-1">
              <button 
                onClick={() => handleSocialBatteryChange(-15)}
                className="flex-1 py-1.5 bg-slate-900 text-white text-[9px] font-bold rounded-lg hover:bg-slate-800 transition-all active:scale-95 cursor-pointer text-center"
              >
                Go Nongkrong
              </button>
              <button 
                onClick={() => handleSocialBatteryChange(15)}
                className="flex-1 py-1.5 bg-white border border-slate-200 text-slate-600 text-[9px] font-bold rounded-lg hover:bg-slate-50 transition-all active:scale-95 cursor-pointer text-center"
              >
                Solo Rebahan
              </button>
            </div>
          </div>

          {/* Sarcastic chat simulator */}
          <div className="p-3.5 bg-white/40 border border-white/60 rounded-2xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-500">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-700 leading-none">Unanswered Chat Limit</h4>
                <p className="text-[9px] text-slate-400 mt-1 font-semibold">Doswal, kurir paket, & grup kkn...</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-rose-600 animate-pulse font-mono">
                {unreadChats}
              </span>
              
              <button 
                onClick={() => {
                  setUnreadChats(0);
                  addToast("🧹 Semua chat diarsipkan. Dunia damai seketika.");
                  addXP(10);
                }}
                disabled={unreadChats === 0}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:opacity-40 text-[9px] font-bold rounded-lg transition-all cursor-pointer"
              >
                Archive All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
