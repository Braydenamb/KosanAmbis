import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { 
  Bell, Shield, Sparkles, Clock, Check, BellOff, Search, 
  Filter, Trash2, Heart, Award, Zap, Brain, Volume2, Info, RotateCcw
} from 'lucide-react';
import KineticCounter from './KineticCounter';

export default function NotificationHub() {
  const { 
    notifications, 
    dismissNotification, 
    toggleRead, 
    snoozeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const { focusMode } = useAtmosphere();

  // --- Filtering & Search States ---
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'priority' | 'archived'
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'productivity' | 'financial' | 'health' | 'ai'

  // --- Procedural Sound Synthesis ---
  const playSoftChime = (type = 'success') => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(740, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      } else if (type === 'clear') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(220, ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);
    } catch (e) {}
  };

  // --- Card priority layout styles ---
  const priorityStyles = {
    critical: 'border-rose-500 bg-rose-50/40 text-rose-800 shadow-[0_0_12px_rgba(244,63,94,0.06)] dark:bg-rose-950/20 animate-pulse-critical',
    important: 'border-amber-500 bg-amber-50/30 text-amber-800 dark:bg-amber-950/20',
    info: 'border-blue-500 bg-blue-50/20 text-blue-800 dark:bg-blue-950/20',
    ambient: 'border-emerald-500 bg-emerald-50/15 text-emerald-800 dark:bg-emerald-950/20'
  };

  // --- Computed Notifications Filtering ---
  const filteredNotis = notifications.filter(noti => {
    // 1. Search Query Match
    const matchesSearch = noti.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          noti.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          noti.priority.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          noti.category.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Active Tab Filter Match
    let matchesFilter = true;
    if (activeFilter === 'unread') matchesFilter = !noti.read && !noti.archived;
    else if (activeFilter === 'priority') matchesFilter = (noti.priority === 'critical' || noti.priority === 'important') && !noti.archived;
    else if (activeFilter === 'archived') matchesFilter = noti.archived;
    else matchesFilter = !noti.archived; // Default: hide archived items

    // 3. Category Filter Match
    let matchesCategory = true;
    if (activeCategory !== 'all') matchesCategory = noti.category === activeCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  const priorityInbox = filteredNotis.filter(n => n.priority === 'critical' || n.priority === 'important');
  const silentDigests = filteredNotis.filter(n => n.priority === 'info' || n.priority === 'ambient');

  const activeUnreadCount = filteredNotis.filter(n => !n.read && !n.archived).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in duration-500">
      
      {/* ── 1. GLOBAL NOTIFICATION TOOLBAR & SEARCH ── */}
      <div className="glass-card-no-hover p-4 flex flex-col md:flex-row items-center justify-between gap-4 border border-white/80">
        
        {/* Search Command input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search notifications... (try 'critical' or 'is:unread')"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/40 border border-slate-200 focus:border-brand-500 focus:outline-none rounded-xl text-xs font-semibold text-slate-800"
          />
        </div>

        {/* Toolbar action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              clearAllNotifications();
              playSoftChime('clear');
            }}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
          
          <button
            onClick={() => playSoftChime('success')}
            className="p-2 bg-white/50 border border-slate-200 rounded-xl hover:bg-white text-slate-500 hover:text-slate-800 cursor-pointer"
            title="Test acoustic chime"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ── 2. QUICK FILTER BUTTONS MATRIX ── */}
      <div className="glass-card-no-hover p-3 flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {[
          { id: 'all', label: '📥 All Streams' },
          { id: 'unread', label: '🔔 Unread Alerts' },
          { id: 'priority', label: '🔥 Priority Inbox' },
          { id: 'archived', label: '🗄️ Archived History' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              playSoftChime('success');
            }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono cursor-pointer transition-all active:scale-95 ${
              activeFilter === filter.id 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'bg-white/50 border border-slate-250/20 text-slate-500 hover:text-slate-800 hover:bg-white'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap px-1">
        {[
          { id: 'all', label: 'All Categories' },
          { id: 'productivity', label: '⚡ Productivity' },
          { id: 'financial', label: '💸 Financial' },
          { id: 'health', label: '🍲 Health & Wellness' },
          { id: 'ai', label: '🧠 AI Insights' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              playSoftChime('success');
            }}
            className={`px-3 py-1.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer ${
              activeCategory === cat.id 
                ? 'bg-brand-500/10 border-brand-500 text-brand-600 font-extrabold' 
                : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── 3. MAIN DASHBOARD GRID MATRIX ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
        
        {/* LEFT STREAM: PRIORITY INBOX & RECENT TIMELINE (Span 8) */}
        <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
          
          {/* Priority Inbox section */}
          <div className="glass-card p-5">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center justify-between mb-4 uppercase tracking-widest font-mono">
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                Priority Inbox (Important & Critical)
              </span>
              <span className="text-[8px] font-bold text-slate-400">
                ACTIVE ALERTS: <KineticCounter value={priorityInbox.length} />
              </span>
            </h3>

            <div className="flex flex-col gap-3">
              {priorityInbox.length > 0 ? (
                priorityInbox.map(noti => (
                  <div
                    key={noti.id}
                    className={`p-4 border-l-3 rounded-2xl transition-all duration-300 ${priorityStyles[noti.priority]}`}
                  >
                    <div className="flex justify-between items-center gap-3">
                      <div className="flex items-center gap-2">
                        {noti.read ? null : <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-ping"></span>}
                        <h4 className="text-xs font-bold leading-none">{noti.title}</h4>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">{noti.time}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{noti.message}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1.5 bg-white/30 p-2 rounded-xl border border-white/40">{noti.details}</p>

                    <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-slate-200/20">
                      <button
                        onClick={() => {
                          toggleRead(noti.id);
                          playSoftChime('success');
                        }}
                        className="text-[9px] font-mono text-brand-600 hover:underline cursor-pointer"
                      >
                        {noti.read ? 'MARK UNREAD' : 'MARK READ'}
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            snoozeNotification(noti.id, 15);
                            playSoftChime('clear');
                          }}
                          className="px-2.5 py-1 bg-white/60 hover:bg-white text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg text-[9px] font-bold transition-all cursor-pointer"
                        >
                          Snooze 15m
                        </button>
                        <button
                          onClick={() => {
                            dismissNotification(noti.id);
                            playSoftChime('clear');
                          }}
                          className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-xs font-bold text-slate-400 italic bg-white/30 border border-white/60 rounded-2xl font-mono uppercase">
                  no priority alerts inside inbox.
                </div>
              )}
            </div>
          </div>

          {/* Recent Activity stream timeline */}
          <div className="glass-card p-5">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest font-mono">
              <Clock className="w-4 h-4 text-brand-500" />
              Chronological Activity Timeline
            </h3>

            <div className="relative border-l border-slate-200/60 ml-3 pl-5 flex flex-col gap-6">
              {filteredNotis.length > 0 ? (
                filteredNotis.map(noti => (
                  <div key={noti.id} className="relative group">
                    {/* Timeline bullet dot */}
                    <div className="absolute -left-[26px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white group-hover:bg-brand-500 transition-colors"></div>
                    
                    <div>
                      <span className="text-[9px] font-mono text-slate-400 block">{noti.time}</span>
                      <h4 className="text-xs font-bold text-slate-800 mt-1">{noti.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{noti.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[10px] font-bold text-slate-400 italic font-mono uppercase">
                  timeline empty.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT STREAM: AI INSIGHTS & SILENT DIGESTS (Span 4) */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
          
          {/* AI Insights Card */}
          <div className="glass-card p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-3 uppercase tracking-widest font-mono">
              <Brain className="w-4 h-4 text-indigo-500" />
              AI Cognitive Health Insights
            </h3>

            <div className="flex flex-col gap-4">
              <div className="bg-white/50 border border-indigo-150 p-3 rounded-2xl flex items-center gap-3">
                <Zap className="w-8 h-8 text-indigo-500 fill-indigo-200 shrink-0" />
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">Cognitive State</span>
                  <p className="text-[11px] font-bold text-slate-800 leading-snug mt-0.5">
                    {focusMode ? 'Focus Digest active. 14 minor alerts silenced.' : 'Attention scattered by constant notifications.'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white/40 rounded-2xl border border-white/60">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 font-mono">Interruption warning</span>
                <p className="text-xs text-indigo-700 font-bold mt-1 leading-relaxed">
                  "Kualitas produktivitas Anda turun 15% setiap Anda membalas chat atau membersihkan tagihan selama timer fokus aktif."
                </p>
              </div>

              {/* Cognitive statistics */}
              <div className="grid grid-cols-2 gap-3.5 mt-1">
                <div className="p-3 bg-white/60 border border-slate-100 rounded-2xl text-center">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono leading-none">BURNOUT RISK</div>
                  <div className="text-sm font-extrabold text-rose-600 mt-1 leading-none font-mono">MEDIUM</div>
                </div>
                <div className="p-3 bg-white/60 border border-slate-100 rounded-2xl text-center">
                  <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono leading-none">SILENT DIGESTS</div>
                  <div className="text-sm font-extrabold text-indigo-600 mt-1 leading-none font-mono">
                    <KineticCounter value={silentDigests.length} /> Items
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Silent Digests section */}
          <div className="glass-card p-5">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 mb-4 uppercase tracking-widest font-mono">
              <BellOff className="w-4 h-4 text-emerald-500" />
              Silent Digests (Ambient & Info)
            </h3>

            <div className="flex flex-col gap-3">
              {silentDigests.length > 0 ? (
                silentDigests.map(noti => (
                  <div
                    key={noti.id}
                    className={`p-3.5 border-l-3 rounded-xl transition-all duration-300 ${priorityStyles[noti.priority]}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{noti.title}</h4>
                        <p className="text-[11px] text-slate-650 mt-1 leading-normal">{noti.message}</p>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 shrink-0 mt-0.5">{noti.time}</span>
                    </div>

                    <div className="flex justify-end gap-1.5 mt-2.5 pt-1.5 border-t border-slate-200/10">
                      <button
                        onClick={() => {
                          dismissNotification(noti.id);
                          playSoftChime('clear');
                        }}
                        className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-bold cursor-pointer active:scale-95 transition-all"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-[10px] font-bold text-slate-400 italic font-mono uppercase border border-slate-200/40 rounded-xl">
                  silent digests empty.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
