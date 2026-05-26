import React, { useState } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import Sidebar from './components/Sidebar';
import PanelRight from './components/PanelRight';
import RPGHeader from './components/dashboard/RPGHeader';
import FinanceModule from './components/finance/FinanceModule';
import SurvivalModule from './components/survival/SurvivalModule';
import ProductivityModule from './components/productivity/ProductivityModule';
import SocialModule from './components/social/SocialModule';
import RainCanvas from './components/ui/RainCanvas';
import Toast from './components/Toast';
import EcosystemCommandCenter from './components/dashboard/EcosystemCommandCenter';
import LifeHeatmapCanvas from './components/ui/LifeHeatmapCanvas';
import { Menu, X, Grid, CloudRain, Shield, BookOpen, Brain, Sparkles } from 'lucide-react';
import './App.css';
import { useAtmosphere } from './context/AtmosphereContext';
import AmbientSoundscapePlayer from './components/ui/AmbientSoundscapePlayer';


function MainAppHub() {
  const { toasts, removeToast, addToast } = useCharacter();
  const { activeTheme, selectTheme, focusMode, setFocusMode, uiMode, toggleUiMode } = useAtmosphere();


  // --- Category Tabs Navigation ---
  const [activeCategory, setActiveCategory] = useState('overview');

  // --- Theme / Weather Toggles ---
  const rainActive = activeTheme === 'rainy-night' || activeTheme === 'storm-mode';

  // --- Mobile Drawer Toggles ---
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  return (
    <div className={`min-h-screen text-slate-700 flex flex-col relative select-none pb-12 overflow-hidden ${uiMode === 'neubrutalist' ? 'mode-neubrutalist' : 'mode-liquid'}`}>
      
      {/* 1. DYNAMIC PASTEL LIQUID AURORA MESHES */}
      <div className="liquid-mesh-aurora"></div>
      <div className="liquid-mesh-aurora-two"></div>

      {/* 2. ANIMATED CANVAS RAIN OVERLAY */}
      <RainCanvas active={rainActive} />

      {/* 3. TOAST SYSTEM CONTAINER */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* 4. MOBILE RESPONSIVE HEADER BAR */}
      <header className="xl:hidden flex items-center justify-between p-4 bg-white/45 border-b border-white/60 sticky top-0 z-[100] backdrop-blur-xl">
        <button 
          onClick={() => {
            setShowLeftDrawer(true);
            setShowRightDrawer(false);
          }}
          className="p-2.5 hover:bg-slate-100/60 rounded-xl transition-all text-slate-600 border border-white/50 cursor-pointer"
          aria-label="Open Side Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 font-mono">
          <Shield className="w-4 h-4 text-brand-600" />
          <span className="text-[10px] font-black text-slate-800 tracking-widest uppercase">KOSANAMBIS CORE</span>
        </div>

        <button 
          onClick={() => {
            setShowRightDrawer(true);
            setShowLeftDrawer(false);
          }}
          className="p-2.5 hover:bg-slate-100/60 rounded-xl transition-all text-brand-600 border border-white/50 cursor-pointer"
          aria-label="Open Stats Menu"
        >
          <Grid className="w-5 h-5" />
        </button>
      </header>

      {/* 5. MAIN CENTRAL CONTENT LAYOUT CONTAINER */}
      <div className="max-w-[1600px] w-full mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col xl:flex-row gap-6 relative z-10 flex-grow">
        
        {/* ================= COLUMN 1: SIDEBAR (DESKTOP / MOBILE DRAWER) ================= */}
        <div className={`
          ${focusMode ? 'xl:hidden' : 'xl:block'} xl:relative xl:translate-x-0 xl:bg-transparent xl:p-0 xl:w-80 xl:h-auto xl:shadow-none xl:z-auto
          fixed inset-y-0 left-0 w-80 bg-slate-100/95 p-6 z-[120] border-r border-white/60 transition-all duration-300 ease-out transform backdrop-blur-2xl
          ${showLeftDrawer ? 'translate-x-0 shadow-premium' : '-translate-x-full xl:translate-x-0'}
        `}>

          <div className="xl:hidden flex justify-between items-center mb-6">
            <span className="font-extrabold text-slate-800 text-xs tracking-wider font-mono">INTELLIGENCE STATS</span>
            <button 
              onClick={() => setShowLeftDrawer(false)}
              className="p-1.5 hover:bg-slate-200 border border-slate-300/30 rounded-lg text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Sidebar />
        </div>

        {/* ================= COLUMN 2: CENTER HUB (RPG STATUS & MODULES) ================= */}
        <div className={`flex-grow flex flex-col gap-6 min-w-0 ${focusMode ? 'xl:max-w-4xl mx-auto w-full transition-all duration-500' : 'xl:max-w-4xl transition-all duration-500'}`}>

          
          {/* Weather & Music Controller Bar */}
          <div className="glass-card-no-hover p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border border-white/80">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping"></span>
              <span className="font-extrabold text-slate-600 font-mono tracking-wider text-[9px] uppercase">Ambient Weather Controller</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const nextTheme = activeTheme === 'sunny-day' ? 'rainy-night' : 'sunny-day';
                  selectTheme(nextTheme);
                  addToast(nextTheme === 'sunny-day' ? "☀️ Hujan reda. Cuaca kamar kosan cerah!" : "🌧️ Awan mendung datang. Hujan lofi mulai turun.");
                }}
                className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${rainActive ? 'bg-brand-500/10 border-brand-500 text-brand-600 shadow-glow' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                {rainActive ? 'Clear Sky' : 'Rain Chill'}
              </button>

              {/* Dynamic OS Style Switcher */}
              <button 
                onClick={() => {
                  toggleUiMode();
                  addToast(uiMode === 'liquid' 
                    ? "🦖 Mode Neubrutalisme Aktif! Garis hitam tegas & ketukan fisik raw terpasang!" 
                    : "🌊 Mode Liquid Fluid Aktif! Frosted glassmorphism & pendaran cahaya kembali bersinar."
                  );
                }}
                className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${uiMode === 'neubrutalist' ? 'bg-amber-500/10 border-amber-600 text-amber-700 shadow-glow' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                {uiMode === 'neubrutalist' ? 'NEUBRUTALIST' : 'LIQUID OS'}
              </button>

              {/* Study Focus Mode Switch */}
              <button 
                onClick={() => {
                  const nextState = !focusMode;
                  setFocusMode(nextState);
                  if (nextState) {
                    selectTheme('rainy-night');
                    setActiveCategory('productivity');
                    addToast("🧘 Mode Belajar Ambis Aktif! Sidebar ciut, musik rain chill on, selamat produktif!");
                  } else {
                    addToast("😌 Keluar dari Mode Ambis. Selamat bersantai!");
                  }
                }}
                className={`px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${focusMode ? 'bg-indigo-650 border-indigo-600 text-white shadow-glow' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
              >
                <Brain className="w-3.5 h-3.5 animate-pulse" />
                {focusMode ? 'Focus Active' : 'Study Focus'}
              </button>
            </div>

          </div>

          {/* ================= CATEGORY COCKPIT NAVIGATION BAR ================= */}
          <div className="glass-card-no-hover p-3 flex gap-3 border border-white/85 overflow-x-auto whitespace-nowrap scrollbar-thin select-none">
            {[
              { id: 'overview', label: '🌐 Overview' },
              { id: 'tapestry', label: '🖼️ Life Tapestry' },
              { id: 'productivity', label: '⚡ Productivity' },
              { id: 'financials', label: '💸 Financials' },
              { id: 'survival', label: '🍲 Survival & Socials' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                }}
                className={`px-6 py-3 rounded-2xl text-xs md:text-sm font-extrabold uppercase tracking-wider font-sans cursor-pointer transition-all active:scale-95 duration-300 ${
                  activeCategory === cat.id 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-950/20' 
                    : 'bg-white/50 border border-slate-200/40 text-slate-500 hover:text-slate-800 hover:bg-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ================= CONDITIONAL CATEGORIZED TABS CONTENT ================= */}
          {activeCategory === 'overview' && (
            <div className="flex flex-col gap-8">
              {/* RPG Profile & Interactive bars */}
              <RPGHeader />
              {/* Device & Market Ecosystem Simulation Command Center */}
              <EcosystemCommandCenter rainActive={rainActive} />
            </div>
          )}

          {activeCategory === 'tapestry' && (
            <div className="flex flex-col gap-8">
              <LifeHeatmapCanvas />
            </div>
          )}

          {activeCategory === 'productivity' && (
            <div className="flex flex-col gap-8">
              {/* Core modules tabs/grid */}
              <ProductivityModule />
            </div>
          )}

          {activeCategory === 'financials' && (
            <div className="flex flex-col gap-8">
              {/* Debt Matrices and Patungan Invoicing */}
              <FinanceModule />
            </div>
          )}

          {activeCategory === 'survival' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Domestic Logistics */}
              <SurvivalModule />
              {/* Social Battery and Laundry trackers */}
              <SocialModule />
            </div>
          )}

        </div>

        {/* ================= COLUMN 3: PANEL RIGHT (STATS & DOMESTIC MODULES) ================= */}
        <div className={`
          ${focusMode ? 'xl:hidden' : 'xl:block'} xl:relative xl:translate-x-0 xl:bg-transparent xl:p-0 xl:w-80 xl:h-auto xl:shadow-none xl:z-auto
          fixed inset-y-0 right-0 w-80 bg-slate-100/95 p-6 z-[120] border-l border-white/60 transition-all duration-300 ease-out transform backdrop-blur-2xl
          ${showRightDrawer ? 'translate-x-0 shadow-premium' : 'translate-x-full xl:translate-x-0'}
        `}>

          <div className="xl:hidden flex justify-between items-center mb-6">
            <span className="font-extrabold text-slate-800 text-xs tracking-wider font-mono">ANALYTICS & STREAKS</span>
            <button 
              onClick={() => setShowRightDrawer(false)}
              className="p-1.5 hover:bg-slate-200 border border-slate-300/30 rounded-lg text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col gap-8">
            <PanelRight />
          </div>
        </div>

      </div>

      {/* Backdrop overlay for drawers */}
      {(showLeftDrawer || showRightDrawer) && (
        <div 
          onClick={() => {
            setShowLeftDrawer(false);
            setShowRightDrawer(false);
          }}
          className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[110] xl:hidden"
        />
      )}

      {/* ── Floating Ambient Soundscape Player ── */}
      <AmbientSoundscapePlayer />
    </div>
  );
}

export default function App() {
  return (
    <CharacterProvider>
      <MainAppHub />
    </CharacterProvider>
  );
}
