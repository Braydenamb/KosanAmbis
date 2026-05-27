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
  const { activeTheme, selectTheme, focusMode, setFocusMode, uiMode, toggleUiMode, particleMode } = useAtmosphere();
  const { unreadCount } = useNotifications();
  const rainActive = activeTheme === 'rainy-night' || activeTheme === 'storm-mode';

  // --- Grid & OS Collapsible Sidebar state ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- OS Live Clock ---
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- Category Tabs Navigation ---
  const [activeCategory, setActiveCategory] = useState('overview');

  // --- Mobile Drawer Toggles ---
  const [showLeftDrawer, setShowLeftDrawer] = useState(false);
  const [showRightDrawer, setShowRightDrawer] = useState(false);

  return (
    <div className={`min-h-screen text-slate-700 flex flex-col relative select-none pb-28 overflow-hidden ${uiMode === 'neubrutalist' ? 'mode-neubrutalist' : 'mode-liquid'}`}>
      
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
          {/* Mobile drawer toggle */}
          <button 
            onClick={() => {
              setShowLeftDrawer(true);
              setShowRightDrawer(false);
            }}
            className="xl:hidden p-2.5 hover:bg-slate-100/60 border border-white/50 rounded-xl transition-all text-slate-600 cursor-pointer animate-pulse"
            aria-label="Open Side Menu"
          >
            <Menu className="w-4 h-4" />
          </button>

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

          {/* Quick stats right drawer toggle for mobile */}
          <button 
            onClick={() => {
              setShowRightDrawer(true);
              setShowLeftDrawer(false);
            }}
            className="xl:hidden p-2.5 hover:bg-slate-100/60 rounded-xl transition-all text-brand-600 border border-white/50 cursor-pointer"
            aria-label="Open Stats Menu"
          >
            <Grid className="w-4 h-4" />
          </button>
        </div>

      </header>

      {/* 5. MAIN CENTRAL CONTENT LAYOUT CONTAINER */}
      <div className="max-w-[1680px] w-full mx-auto px-4 py-6 md:px-6 md:py-8 flex flex-col xl:flex-row gap-6 relative z-10 flex-grow">
        
        {/* ================= COLUMN 1: SIDEBAR (DESKTOP / MOBILE DRAWER) ================= */}
        <div className={[
          /* ── Mobile drawer: fixed full-height panel ── */
          'fixed inset-y-0 left-0 w-72 bg-white/80 backdrop-blur-2xl p-6 z-[120] border-r border-white/60 shadow-2xl',
          'transition-transform duration-300 ease-out transform',
          showLeftDrawer ? 'translate-x-0' : '-translate-x-full',
          /* ── Desktop: switch to static column ── */
          focusMode
            ? 'xl:hidden'
            : [
                'xl:relative xl:inset-auto xl:translate-x-0 xl:bg-transparent xl:p-0 xl:h-auto xl:shadow-none xl:z-auto xl:border-r-0 xl:backdrop-blur-none xl:block',
                'xl:overflow-hidden xl:shrink-0 xl:transition-[width] xl:duration-300 xl:ease-in-out',
                sidebarCollapsed ? 'xl:w-[72px]' : 'xl:w-72',
              ].join(' ')
        ].join(' ')}>

          {/* Mobile close header */}
          <div className="xl:hidden flex justify-between items-center mb-6">
            <span className="font-extrabold text-slate-800 text-xs tracking-wider font-mono">INTELLIGENCE STATS</span>
            <button 
              onClick={() => setShowLeftDrawer(false)}
              className="p-1.5 hover:bg-slate-200 border border-slate-300/30 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <Sidebar collapsed={sidebarCollapsed} />
        </div>

        {/* ================= COLUMN 2: CENTER HUB ================= */}
        <div className={`flex-1 min-w-0 flex flex-col gap-4 transition-all duration-300 ease-in-out ${focusMode ? 'xl:max-w-5xl mx-auto w-full' : ''}`}>


          {/* ═══ PAGE CONTENT AREA (full-width, dock handles nav) ═══ */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">

            {/* ── OVERVIEW ── */}
            {activeCategory === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                <div className="col-span-1 lg:col-span-12"><QuickAddBar /></div>
                <div className="col-span-1 lg:col-span-12"><RPGHeader /></div>
                <div className="col-span-1 lg:col-span-12"><InsightPanel /></div>
                <div className="col-span-1 lg:col-span-12"><EcosystemCommandCenter rainActive={rainActive} /></div>
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

      {/* ══════════════════════════════════════════════════════════════
           FLOATING BOTTOM DOCK  —  Dash-to-Dock style
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[200]"
        id="floating-dock"
      >
        <div className="flex items-end gap-1 px-3 py-2.5
                        bg-white/30 backdrop-blur-2xl
                        border border-white/60
                        rounded-2xl shadow-2xl shadow-slate-900/15
                        dock-container">
          {[
            { id: 'overview',      emoji: '🌐', label: 'Overview' },
            { id: 'tapestry',      emoji: '🖼️', label: 'Life Tapestry' },
            { id: 'productivity',  emoji: '⚡', label: 'Productivity' },
            { id: 'financials',    emoji: '💸', label: 'Financials' },
            { id: 'survival',      emoji: '🍲', label: 'Survival' },
            { id: 'automation',    emoji: '🤖', label: 'Automation' },
            { id: 'analytics',     emoji: '🔮', label: 'AI Analyst' },
            { id: 'notifications', emoji: '🔔', label: 'Inbox' },
          ].map((cat, idx, arr) => (
            <React.Fragment key={cat.id}>
              {/* Separator before Inbox */}
              {cat.id === 'notifications' && (
                <div className="w-px h-8 bg-white/40 mx-0.5 self-center shrink-0" />
              )}
              <button
                id={`dock-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                title={cat.label}
                className="dock-item group relative flex flex-col items-center cursor-pointer select-none"
              >
                {/* Tooltip */}
                <div className="dock-tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                                bg-slate-900/90 text-white text-[9px] font-black font-mono
                                px-2 py-1 rounded-lg whitespace-nowrap
                                opacity-0 group-hover:opacity-100
                                -translate-y-1 group-hover:translate-y-0
                                transition-all duration-150 pointer-events-none
                                border border-white/10 backdrop-blur-sm">
                  {cat.label}
                  {cat.id === 'notifications' && unreadCount > 0 && (
                    <span className="ml-1 text-rose-400">({unreadCount})</span>
                  )}
                </div>

                {/* Icon pill */}
                <div className={`dock-icon relative flex items-center justify-center
                                  w-10 h-10 rounded-xl transition-all duration-200
                                  ${activeCategory === cat.id
                                    ? 'bg-slate-900 shadow-lg shadow-slate-900/30 scale-110'
                                    : 'bg-white/50 hover:bg-white/80'
                                  }`}>
                  <span className="text-xl leading-none select-none">{cat.emoji}</span>

                  {/* Unread badge */}
                  {cat.id === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5
                                     rounded-full bg-rose-500 text-white text-[7px]
                                     font-black font-mono flex items-center justify-center
                                     border border-white shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </div>

                {/* Active dot */}
                <div className={`mt-1 w-1 h-1 rounded-full transition-all duration-200
                                  ${activeCategory === cat.id
                                    ? 'bg-brand-500 scale-100 opacity-100'
                                    : 'scale-0 opacity-0'
                                  }`} />
              </button>
            </React.Fragment>
          ))}

          {/* ── Separator + Ambient Controls ── */}
          <div className="w-px h-8 bg-white/40 mx-0.5 self-center shrink-0" />

          {/* Rain Toggle */}
          <button
            onClick={() => {
              const nextTheme = activeTheme === 'sunny-day' ? 'rainy-night' : 'sunny-day';
              selectTheme(nextTheme);
              addToast(nextTheme === 'sunny-day' ? "☀️ Cuaca cerah!" : "🌧️ Rain chill on.");
            }}
            title={rainActive ? 'Clear Sky' : 'Rain Chill'}
            className="dock-item group relative flex flex-col items-center cursor-pointer select-none"
          >
            <div className="dock-tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                            bg-slate-900/90 text-white text-[9px] font-black font-mono
                            px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                            -translate-y-1 group-hover:translate-y-0 transition-all duration-150 pointer-events-none
                            border border-white/10 backdrop-blur-sm">
              {rainActive ? 'Clear Sky' : 'Rain Chill'}
            </div>
            <div className={`dock-icon flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                              ${rainActive ? 'bg-brand-500/20 text-brand-600' : 'bg-white/50 text-slate-500 hover:bg-white/80'}`}>
              <CloudRain className="w-5 h-5" />
            </div>
            <div className="mt-1 w-1 h-1 rounded-full opacity-0" />
          </button>

          {/* UI Mode Toggle */}
          <button
            onClick={() => { toggleUiMode(); addToast(uiMode === 'liquid' ? "🦖 Neubrutalist!" : "🌊 Liquid OS!"); }}
            title={uiMode === 'neubrutalist' ? 'Switch to Liquid OS' : 'Switch to Neubrutalist'}
            className="dock-item group relative flex flex-col items-center cursor-pointer select-none"
          >
            <div className="dock-tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                            bg-slate-900/90 text-white text-[9px] font-black font-mono
                            px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                            -translate-y-1 group-hover:translate-y-0 transition-all duration-150 pointer-events-none
                            border border-white/10 backdrop-blur-sm">
              {uiMode === 'neubrutalist' ? '→ Liquid OS' : '→ Neubrutalist'}
            </div>
            <div className={`dock-icon flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                              ${uiMode === 'neubrutalist' ? 'bg-amber-500/20 text-amber-600' : 'bg-white/50 text-slate-500 hover:bg-white/80'}`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="mt-1 w-1 h-1 rounded-full opacity-0" />
          </button>

          {/* Focus Mode Toggle */}
          <button
            onClick={() => {
              const nextState = !focusMode;
              setFocusMode(nextState);
              if (nextState) { selectTheme('rainy-night'); setActiveCategory('productivity'); addToast("🧘 Focus mode aktif!"); }
              else { addToast("😌 Keluar focus mode."); }
            }}
            title={focusMode ? 'Exit Focus Mode' : 'Study Focus Mode'}
            className="dock-item group relative flex flex-col items-center cursor-pointer select-none"
          >
            <div className="dock-tooltip absolute bottom-full mb-2 left-1/2 -translate-x-1/2
                            bg-slate-900/90 text-white text-[9px] font-black font-mono
                            px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100
                            -translate-y-1 group-hover:translate-y-0 transition-all duration-150 pointer-events-none
                            border border-white/10 backdrop-blur-sm">
              {focusMode ? 'Exit Focus' : 'Study Focus'}
            </div>
            <div className={`dock-icon flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                              ${focusMode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/50 text-slate-500 hover:bg-white/80'}`}>
              <Brain className="w-5 h-5" />
            </div>
            <div className={`mt-1 w-1 h-1 rounded-full transition-all duration-200 ${focusMode ? 'bg-indigo-500 opacity-100' : 'scale-0 opacity-0'}`} />
          </button>

        </div>
      </div>

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
