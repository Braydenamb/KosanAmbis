import React, { useState, useEffect } from 'react';
import { CharacterProvider, useCharacter } from './context/CharacterContext';
import Sidebar from './components/Sidebar';
import PanelRight from './components/PanelRight';
import RPGHeader from './components/dashboard/RPGHeader';
import FinanceModule from './components/finance/FinanceModule';
import SurvivalModule from './components/survival/SurvivalModule';
import ProductivityModule from './components/productivity/ProductivityModule';
import SocialModule from './components/social/SocialModule';
import AtmosphereCanvas from './components/ui/AtmosphereCanvas';
import Toast from './components/Toast';
import EcosystemCommandCenter from './components/dashboard/EcosystemCommandCenter';
import LifeHeatmapCanvas from './components/ui/LifeHeatmapCanvas';
import { Menu, X, Grid, CloudRain, Shield, Brain, Sparkles, Zap, Bot, Heart, GitCommit } from 'lucide-react';
import FloatingDock from './components/ui/FloatingDock';
import './App.css';
import { useAtmosphere } from './context/AtmosphereContext';
import AmbientSoundscapePlayer from './components/ui/AmbientSoundscapePlayer';
import { useNotifications } from './context/NotificationContext';
import NotificationHub from './components/ui/NotificationHub';
import QuickAddBar from './components/automation/QuickAddBar';
import InsightPanel from './components/insights/InsightPanel';
import SyncStatusBadge from './components/ui/SyncStatusBadge';
import BotSimulator from './components/automation/BotSimulator';
import ProductivitySyncPanel from './components/productivity/ProductivitySyncPanel';
import HealthSyncDashboard from './components/health/HealthSyncDashboard';
import PredictiveIntelligenceHub from './components/analytics/PredictiveIntelligenceHub';


// ─── AUTOMATION HUB TAB — Phase 2 + 3 + 4 ────────────────────────────────────
function AutomationHubTab() {
  const [activePanel, setActivePanel] = useState('bot');

  const panels = [
    { id: 'bot',          icon: Bot,       label: '🤖 Bot Telegram',    desc: 'Catat pengeluaran via chat' },
    { id: 'productivity', icon: GitCommit, label: '⚡ Productivity Sync', desc: 'GitHub · VSCode · Obsidian' },
    { id: 'health',       icon: Heart,     label: '💚 Health Sync',       desc: 'Steps · Sleep · HR · Hydration' },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Hub Header */}
      <div className="glass-card p-5 bg-gradient-to-br from-brand-50/60 to-indigo-50/40 border border-brand-100/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-800 text-sm">Zero-Friction Automation Hub</h2>
            <p className="text-[9px] text-slate-500 font-mono mt-0.5">Self-updating life OS · Dummy data mode · Phase 2–4</p>
          </div>
          <div className="ml-auto">
            <SyncStatusBadge compact />
          </div>
        </div>

        {/* Panel tabs */}
        <div className="grid grid-cols-3 gap-2">
          {panels.map(p => (
            <button
              key={p.id}
              onClick={() => setActivePanel(p.id)}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-98 cursor-pointer flex flex-col gap-1 ${
                activePanel === p.id
                  ? 'bg-slate-900 border-slate-800 text-white shadow-lg'
                  : 'bg-white/60 border-slate-200/60 text-slate-600 hover:bg-white hover:border-slate-300'
              }`}
            >
              <p.icon className={`w-4 h-4 mb-0.5 ${activePanel === p.id ? 'text-brand-400' : 'text-slate-400'}`} />
              <span className="text-[10px] font-black leading-tight">{p.label}</span>
              <span className={`text-[8px] font-mono ${activePanel === p.id ? 'text-slate-400' : 'text-slate-400'}`}>
                {p.desc}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      {activePanel === 'bot' && (
        <div className="glass-card overflow-hidden p-0">
          <BotSimulator />
        </div>
      )}
      {activePanel === 'productivity' && <ProductivitySyncPanel />}
      {activePanel === 'health' && <HealthSyncDashboard />}
    </div>
  );
}

function MainAppHub() {
  const { toasts, removeToast, addToast } = useCharacter();
  const { activeTheme, selectTheme, focusMode, setFocusMode, uiMode, toggleUiMode, particleMode, playClick } = useAtmosphere();
  const { unreadCount } = useNotifications();
  const rainActive = activeTheme === 'rainy-night' || activeTheme === 'storm-mode';

  // --- Grid & OS Collapsible Sidebar state ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- Satisfying tactile UI click feedback ---
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target) return;
      const interactiveEl = target.closest('button, a, [role="button"], .cursor-pointer');
      if (interactiveEl) {
        playClick();
      }
    };
    window.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [playClick]);

  // --- OS Live Clock ---
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Category Tabs Navigation ---
  const [activeCategory, setActiveCategory] = useState('overview');

  return (
    <div className={`min-h-screen text-slate-700 flex flex-col relative select-none
      pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-28
      overflow-hidden ${uiMode === 'neubrutalist' ? 'mode-neubrutalist' : 'mode-liquid'}`}>
      
      {/* 1. DYNAMIC PASTEL LIQUID AURORA MESHES */}
      <div className="liquid-mesh-aurora"></div>
      <div className="liquid-mesh-aurora-two"></div>

      {/* 2. ANIMATED CANVAS ATMOSPHERE EFFECTS OVERLAY */}
      <AtmosphereCanvas mode={particleMode} />

      {/* 3. TOAST SYSTEM CONTAINER (SILENCED BY USER DEMAND) */}
      {/* <Toast toasts={toasts} removeToast={removeToast} /> */}

      {/* ── TOP NAVBAR — World Class OS Interface Bar ── */}
      <header className="w-full sticky top-0 z-[110] bg-white/60 border-b border-white/75 backdrop-blur-2xl px-6 py-3 flex items-center justify-between transition-all duration-300">
        
        {/* Left section: Brand & Collapse triggers */}
        <div className="flex items-center gap-4">
          {/* Desktop collapsible toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden xl:flex p-2.5 hover:bg-slate-100/60 border border-slate-200/60 rounded-xl transition-all text-slate-500 hover:text-slate-800 cursor-pointer active:scale-95"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Grid className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-500/10 rounded-lg border border-brand-500/10">
              <Shield className="w-4 h-4 text-brand-600" />
            </div>
            <div>
              <span className="font-extrabold text-xs text-slate-800 tracking-tight leading-none">KosanAmbis</span>
              <span className="text-[8px] text-slate-400 font-extrabold tracking-widest block uppercase font-mono mt-0.5">CORE WORKSPACE</span>
            </div>
          </div>
        </div>

        {/* Center section: Global OS Clock & Info */}
        <div className="hidden md:flex items-center gap-6">
          <div className="bg-slate-50 border border-slate-200/50 px-4 py-1.5 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono">
              {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-mono font-black text-slate-800">
              {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Right section: Global shortcuts & User Profile */}
        <div className="flex items-center gap-3">
          {/* Sync Status Badge */}
          <div className="hidden md:flex">
            <SyncStatusBadge />
          </div>

          {/* Active OS Theme indicator */}
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/40 border border-white/60 rounded-full text-[9px] font-black uppercase font-mono text-slate-500 tracking-wider">
            🎨 {uiMode === 'neubrutalist' ? 'Neubrutalist OS' : 'Liquid Glass OS'}
          </span>

        </div>

      </header>

      {/* 5. MAIN CENTRAL CONTENT LAYOUT CONTAINER */}
      <div className="max-w-[1680px] w-full mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col xl:flex-row gap-6 relative z-10 flex-grow">
        
        {/* ================= COLUMN 1: SIDEBAR (DESKTOP ONLY) ================= */}
        <div className={`hidden xl:block ${focusMode ? 'xl:hidden' : ''} xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] xl:shrink-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'xl:w-0 xl:opacity-0 xl:mr-[-1.5rem]' : 'xl:w-72 xl:opacity-100'}`}>
          <div className="w-72">
            <Sidebar />
          </div>
        </div>

        {/* ================= COLUMN 2: CENTER HUB ================= */}
        <div className={`flex-1 min-w-0 flex flex-col gap-4 transition-all duration-300 ease-in-out ${focusMode ? 'xl:max-w-5xl mx-auto w-full' : ''}`}>


          {/* ═══ PAGE CONTENT AREA (full-width, dock handles nav) ═══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* ── MOBILE HORIZONTAL SIDEBAR (TOP) ── */}
            <div className="xl:hidden w-full overflow-hidden">
              <Sidebar collapsed={false} isMobileMode={true} />
            </div>

            {/* ── OVERVIEW ── */}
            {activeCategory === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><QuickAddBar /></div>
                <div className="col-span-1 lg:col-span-12"><RPGHeader /></div>
                <div className="col-span-1 lg:col-span-12"><InsightPanel /></div>
                <div className="col-span-1 lg:col-span-12"><EcosystemCommandCenter rainActive={rainActive} /></div>
                
                {/* ── MOBILE PANEL RIGHT (BOTTOM) ── */}
                <div className="col-span-1 lg:col-span-12 xl:hidden mt-2">
                  <h3 className="font-extrabold text-slate-800 text-xs tracking-wider font-mono mb-4">ANALYTICS & MODULES</h3>
                  <div className="flex flex-col gap-6">
                    <PanelRight />
                  </div>
                </div>
              </div>
            )}
            {activeCategory === 'tapestry' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><LifeHeatmapCanvas /></div>
              </div>
            )}
            {activeCategory === 'productivity' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><ProductivityModule /></div>
              </div>
            )}
            {activeCategory === 'financials' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><QuickAddBar /></div>
                <div className="col-span-1 lg:col-span-12"><FinanceModule /></div>
              </div>
            )}
            {activeCategory === 'survival' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                <div className="col-span-1 lg:col-span-6"><SurvivalModule /></div>
                <div className="col-span-1 lg:col-span-6"><SocialModule /></div>
              </div>
            )}
            {activeCategory === 'notifications' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><NotificationHub /></div>
              </div>
            )}
            {activeCategory === 'automation' && <AutomationHubTab />}
            {activeCategory === 'analytics' && <PredictiveIntelligenceHub />}

          </div>{/* end PAGE CONTENT */}
        </div>{/* end COLUMN 2 */}

        {/* ================= COLUMN 3: PANEL RIGHT (DESKTOP ONLY) ================= */}
        <div className={`hidden xl:block ${focusMode ? 'xl:hidden' : ''} xl:sticky xl:top-24 xl:self-start xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-80 shrink-0`}>
          <div className="flex flex-col gap-8">
            <PanelRight />
          </div>
        </div>

      </div>

      {/* ── FLOATING BOTTOM DOCK ── */}
      <FloatingDock
        items={[
          // ── Navigation ──
          { id: 'overview',      emoji: '🌐', label: 'Overview',      active: activeCategory === 'overview',      onClick: () => setActiveCategory('overview'),      type: 'nav' },
          { id: 'tapestry',      emoji: '🖼️', label: 'Life Tapestry', active: activeCategory === 'tapestry',      onClick: () => setActiveCategory('tapestry'),      type: 'nav' },
          { id: 'productivity',  emoji: '⚡', label: 'Productivity',  active: activeCategory === 'productivity',  onClick: () => setActiveCategory('productivity'),  type: 'nav' },
          { id: 'financials',    emoji: '💸', label: 'Financials',    active: activeCategory === 'financials',    onClick: () => setActiveCategory('financials'),    type: 'nav' },
          { id: 'survival',      emoji: '🍲', label: 'Survival',      active: activeCategory === 'survival',      onClick: () => setActiveCategory('survival'),      type: 'nav' },
          { id: 'automation',    emoji: '🤖', label: 'Automation',    active: activeCategory === 'automation',    onClick: () => setActiveCategory('automation'),    type: 'nav' },
          { id: 'analytics',     emoji: '🔮', label: 'AI Analyst',    active: activeCategory === 'analytics',     onClick: () => setActiveCategory('analytics'),     type: 'nav' },
          { id: 'notifications', emoji: '🔔', label: 'Inbox',         active: activeCategory === 'notifications', onClick: () => setActiveCategory('notifications'), type: 'nav',
            badge: unreadCount },
          // ── Tools ──
          {
            id: 'rain', icon: <CloudRain />, label: rainActive ? 'Clear Sky' : 'Rain Chill',
            active: rainActive, activeColor: 'rgba(99,102,241,0.18)',
            onClick: () => { const t = activeTheme === 'sunny-day' ? 'rainy-night' : 'sunny-day'; selectTheme(t); addToast(t === 'sunny-day' ? '☀️ Cuaca cerah!' : '🌧️ Rain chill on.'); },
            type: 'tool',
          },
          {
            id: 'uimode', icon: <Sparkles />, label: uiMode === 'neubrutalist' ? '→ Liquid OS' : '→ Neubrutalist',
            active: uiMode === 'neubrutalist', activeColor: 'rgba(245,158,11,0.18)',
            onClick: () => { toggleUiMode(); addToast(uiMode === 'liquid' ? '🦖 Neubrutalist!' : '🌊 Liquid OS!'); },
            type: 'tool',
          },
          {
            id: 'focus', icon: <Brain />, label: focusMode ? 'Exit Focus' : 'Study Focus',
            active: focusMode, activeColor: 'rgba(99,102,241,0.85)',
            onClick: () => { const n = !focusMode; setFocusMode(n); if (n) { selectTheme('rainy-night'); setActiveCategory('productivity'); addToast('🧘 Focus aktif!'); } else addToast('😌 Keluar focus.'); },
            type: 'tool',
          },
        ]}
      />

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
