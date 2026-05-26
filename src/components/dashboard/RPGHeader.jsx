import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Shield, Activity, Wallet, Camera, X, Check, Globe, Sparkles, RefreshCw } from 'lucide-react';
import KineticCounter from '../ui/KineticCounter';

export default function RPGHeader() {
  const {
    hp,
    sanity,
    sanityStatus,
    walletBalance,
    characterLevel,
    xpIntoCurrentLevel,
    characterTitle,
    profileAvatar,
    setProfileAvatar,
    profileAvatarUrl,
    setProfileAvatarUrl,
    addToast,
    addXP
  } = useCharacter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(profileAvatarUrl || '');
  const [popTrigger, setPopTrigger] = useState(false);
  const [isRolling, setIsRolling] = useState(false);

  const presets = ['🤖', '🐱', '☕', '🦊', '🌟', '🦁', '🦉', '🎓', '🦄', '🎯'];
  
  const emojiPool = [
    '🤖', '🐱', '☕', '🦊', '🌟', '🦁', '🦉', '🎓', '🦄', '🎯',
    '🦕', '🐼', '🍕', '🎮', '🚀', '🔮', '🧸', '🍣', '🍩', '🥑',
    '🎃', '🪐', '🎨', '🛹', '🍿', '🎧', '🎸', '🧬', '👻', '🔥',
    '🌈', '🏆', '💎', '🏝️', '🍀', '💡'
  ];

  const formattedWallet = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(walletBalance);

  // --- Dynamic Color Styles for Bars ---
  const hpColor = hp < 40 ? 'bg-gradient-to-r from-rose-400 to-red-500 shadow-[0_0_12px_rgba(239,68,68,0.2)]' : hp < 70 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-blue-400 to-blue-500';
  const sanityColor = sanity < 40 ? 'bg-gradient-to-r from-purple-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-400 to-indigo-650';
  const walletStatusColor = walletBalance < 200000 ? 'text-rose-600 bg-rose-50/50 border-rose-200/60 shadow-glow-red animate-pulse' : 'text-slate-800 bg-white/40 border-white/60';

  const handleSelectPreset = (emoji) => {
    setProfileAvatar(emoji);
    setProfileAvatarUrl('');
    setTempUrl('');
    setPopTrigger(true);
    setTimeout(() => setPopTrigger(false), 400);
    addToast(`👤 Avatar diperbarui: Preset Emojicon ${emoji}`);
  };

  const handleRollRandom = () => {
    if (isRolling) return;
    setIsRolling(true);
    addXP(5);
    
    let counter = 0;
    const interval = setInterval(() => {
      const randomEmoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
      setProfileAvatar(randomEmoji);
      setProfileAvatarUrl('');
      setTempUrl('');
      counter++;
      if (counter > 8) {
        clearInterval(interval);
        setIsRolling(false);
        setPopTrigger(true);
        setTimeout(() => setPopTrigger(false), 400);
        addToast("🎲 Roll selesai! Menemukan avatar baru & mendapat +5 XP!");
      }
    }, 80);
  };

  const handleSaveCustomUrl = (e) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      setProfileAvatarUrl(tempUrl.trim());
      setPopTrigger(true);
      setTimeout(() => setPopTrigger(false), 400);
      addToast('🖼️ Avatar diperbarui: Custom Image URL berhasil dipasang!');
    } else {
      setProfileAvatarUrl('');
      addToast('❌ Tautan URL kosong!');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* 1. CHARACTER PROFILE AVATAR BLOCK */}
      <div className="glass-card-no-hover p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative overflow-hidden transition-all duration-300">
        <div className="flex items-center gap-5 w-full">
          {/* Arc-browser style avatar card with camera overlay on hover */}
          <div className="relative shrink-0 group">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-300 to-indigo-300 p-[1.5px] shadow-[0_8px_24px_rgba(89,158,255,0.25)] relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer block"
              title="Ganti Foto Profil"
            >
              <div className="w-full h-full bg-slate-50/80 backdrop-blur-xl rounded-[14px] flex items-center justify-center text-3xl select-none overflow-hidden relative">
                {profileAvatarUrl ? (
                  <img 
                    src={profileAvatarUrl} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                    onError={() => {
                      setProfileAvatarUrl('');
                      addToast('⚠️ Gagal memuat custom avatar URL. Mengembalikan ke emoji.');
                    }}
                  />
                ) : (
                  profileAvatar
                )}
                
                {/* Camera Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-300">
                  <Camera className="w-5 h-5 drop-shadow" />
                </div>
              </div>
            </button>
            
            <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg border border-white/50 select-none font-mono">
              Lvl <KineticCounter value={characterLevel} />
            </div>
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight leading-none">Anak Kos Alpha</h2>
              <span className="bg-brand-500/10 border border-brand-500/25 text-brand-600 font-bold px-1.5 py-0.5 rounded-md text-[8px] tracking-wider uppercase font-mono leading-none">ACTIVE USER</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500 mt-2 block uppercase tracking-widest leading-none font-mono">
              {characterTitle}
            </span>
            
            {/* XP Bar */}
            <div className="mt-3 flex items-center gap-2">
              <div className="w-48 bg-slate-200/60 rounded-full h-1.5 overflow-hidden p-[1px] border border-white/50">
                <div 
                  className="bg-brand-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpIntoCurrentLevel}%` }}
                />
              </div>
              <span className="text-[8px] font-black text-slate-500 select-none font-mono">XP <KineticCounter value={xpIntoCurrentLevel} />/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. STATS ROW BARS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* HP / ENERGY BAR */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              INTELLIGENCE ENERGY
            </span>
            <span className="text-slate-800"><KineticCounter value={hp} />%</span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden p-[1px] border border-white/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${hpColor}`}
              style={{ width: `${hp}%` }}
            />
          </div>
          <span className="text-[8px] text-slate-400 font-extrabold select-none uppercase tracking-wider font-mono">
            {hp < 40 ? "⚠️ DANGER: CHARGE SLEEP" : "⚡ OPTIMAL LIFE STATE"}
          </span>
        </div>

        {/* SANITY / MENTAL HEALTH BAR */}
        <div className="glass-card p-5 rounded-2xl flex flex-col gap-2.5">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              SANITY INDEX
            </span>
            <span className="text-slate-800"><KineticCounter value={sanity} />%</span>
          </div>
          <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden p-[1px] border border-white/50">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${sanityColor}`}
              style={{ width: `${sanity}%` }}
            />
          </div>
          <span className="text-[8px] text-slate-400 font-extrabold select-none uppercase tracking-wider font-mono">
            STATUS: <span className="text-indigo-600 font-black">{sanityStatus}</span>
          </span>
        </div>

        {/* CASH / WALLET STATUS */}
        <div className={`glass-card p-5 rounded-2xl flex flex-col justify-between transition-all ${walletStatusColor}`}>
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest opacity-85 font-mono">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5" />
              LIQUIDITY INDEX
            </span>
            <span className="text-[8px] font-bold">ALLOWANCE</span>
          </div>
          
          <div className="text-base font-black text-slate-800 tracking-tight leading-none mt-2">
            <KineticCounter value={formattedWallet} />
          </div>

          <span className="text-[8px] opacity-80 font-black select-none uppercase tracking-wider font-mono mt-1">
            {walletBalance < 200000 
              ? "🔴 LIQUIDITY CRITICAL: SURVIVAL ACTIVE" 
              : walletBalance < 500000 
              ? "🟡 ECONOMY SAVING STATE" 
              : "💚 FINANCIAL HEALTH OPTIMAL"}
          </span>
        </div>
      </div>

      {/* --- SPECTACULAR CHUBBY PASTEL PROFILE EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[999] flex items-center justify-center p-4">
          <div className="bg-white/95 border border-white/80 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-fade-in relative transition-all duration-300">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full active:scale-90 transition-all cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4 select-none">
              <Camera className="w-5 h-5 text-brand-500" />
              Sesuaikan Foto Profil
            </h3>

            {/* Giant Live Preview Circle */}
            <div className="flex flex-col items-center justify-center mb-6 pt-2">
              <div className="relative">
                {/* Glowing Aura backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-300 to-indigo-300 rounded-full blur-xl opacity-30 animate-pulse" />
                
                {/* Big Preview Box */}
                <div className={`w-28 h-28 rounded-3xl bg-gradient-to-tr from-brand-300 to-indigo-300 p-[2px] shadow-xl relative overflow-hidden transition-all duration-300 ${popTrigger ? 'animate-pop-spring' : ''}`}>
                  <div className="w-full h-full bg-slate-50/90 backdrop-blur-xl rounded-[22px] flex items-center justify-center text-5xl select-none overflow-hidden relative">
                    {profileAvatarUrl ? (
                      <img 
                        src={profileAvatarUrl} 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover"
                        onError={() => {
                          setProfileAvatarUrl('');
                          addToast('⚠️ Tautan gambar tidak valid. Mengembalikan ke emoji.');
                        }}
                      />
                    ) : (
                      <span className={isRolling ? 'animate-bounce-slow inline-block' : ''}>{profileAvatar}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <span className="text-[9px] font-black text-slate-400 font-mono mt-3 uppercase tracking-widest select-none">
                {profileAvatarUrl ? 'Custom Image Live View' : isRolling ? 'Rolling Avatar...' : 'Current Profile Avatar'}
              </span>
            </div>

            {/* Presets Grid */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block select-none">Cute Presets Emojicons</span>
                <button
                  onClick={handleRollRandom}
                  disabled={isRolling}
                  className={`px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-[10px] font-bold tracking-wider font-mono active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer select-none ${isRolling ? 'animate-pulse' : ''}`}
                >
                  <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isRolling ? 'animate-spin' : ''}`} />
                  <span>🎲 Roll Random (+5 XP)</span>
                </button>
              </div>

              <div className="grid grid-cols-5 gap-3">
                {presets.map((emoji) => (
                  <button
                    key={emoji}
                    disabled={isRolling}
                    onClick={() => handleSelectPreset(emoji)}
                    className={`h-12 rounded-2xl border text-2xl flex items-center justify-center transition-all duration-300 relative cursor-pointer hover:-translate-y-1 hover:shadow-md active:translate-y-0.5 active:scale-95 ${
                      profileAvatar === emoji && !profileAvatarUrl
                        ? 'border-brand-500 bg-brand-50/80 text-brand-600 scale-105 shadow-glow ring-2 ring-brand-500/20'
                        : 'border-slate-200/85 hover:border-slate-350 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {emoji}
                    {profileAvatar === emoji && !profileAvatarUrl && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-brand-500 text-white flex items-center justify-center border border-white p-[1px] shadow-sm animate-pop-spring">
                        <Check className="w-2.5 h-2.5 stroke-[4px]" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom URL Input */}
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono block mb-3 select-none">Custom Image URL Link</span>
              <form onSubmit={handleSaveCustomUrl} className="flex gap-2">
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={tempUrl}
                  onChange={(e) => {
                    setTempUrl(e.target.value);
                    // Live preview custom image URL when user types/pastes a valid image URL
                    if (e.target.value.trim().match(/\.(jpeg|jpg|gif|png|webp)/i) || e.target.value.includes('unsplash.com')) {
                      setProfileAvatarUrl(e.target.value.trim());
                    }
                  }}
                  className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors"
                />
                <button 
                  type="submit"
                  className="px-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-xs font-bold active:scale-95 transition-all flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Apply
                </button>
              </form>
              <p className="text-[8px] text-slate-400 mt-2 font-mono select-none">Tautan Unsplash, Imgur, Pinterest, dll. akan terpantau live!</p>
            </div>

            {/* Save Close Action */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
