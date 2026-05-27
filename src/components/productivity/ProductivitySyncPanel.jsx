import React, { useState } from 'react';
import {
  GitCommit, GitBranch, Zap, Code2, FileText, BookOpen,
  TrendingUp, Clock, Star, Activity, Terminal, Flame, Plus
} from 'lucide-react';
import {
  DUMMY_GITHUB, DUMMY_VSCODE_SESSIONS, DUMMY_OBSIDIAN_NOTES,
  DUMMY_FOCUS_SESSIONS, COMMIT_XP_RULES
} from '../../data/dummyAutomation';
import { useCharacter } from '../../context/CharacterContext';
import KineticCounter from '../ui/KineticCounter';

// ─── LANGUAGE COLOR DOTS ─────────────────────────────────────────────────────
const LANG_COLORS = {
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  'HTML/CSS': '#e34c26',
  Other: '#94a3b8',
};

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
function MiniBarChart({ data, valueKey, labelKey, color = 'bg-brand-500', maxVal }) {
  const max = maxVal || Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div className="flex items-end gap-1 h-14">
      {data.map((d, i) => {
        const pct = Math.round((d[valueKey] / max) * 100);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '44px' }}>
              <div
                className={`w-full rounded-t-md transition-all duration-500 ${color} ${pct === 0 ? 'opacity-20' : ''}`}
                style={{ height: `${Math.max(pct, 4)}%` }}
                title={`${d[labelKey]}: ${d[valueKey]}`}
              />
            </div>
            <span className="text-[7px] text-slate-400 font-mono">{d[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── COMMIT ITEM ──────────────────────────────────────────────────────────────
function CommitItem({ commit, isNew }) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl border border-white/60 bg-white/30 hover:bg-white/50 transition-all ${isNew ? 'ring-1 ring-emerald-400/40 bg-emerald-50/30' : ''}`}>
      <div className="w-7 h-7 rounded-lg bg-slate-900/90 flex items-center justify-center shrink-0 mt-0.5">
        <GitCommit className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-[11px] font-semibold text-slate-700 leading-tight truncate">{commit.message}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[9px] font-bold text-brand-600 bg-brand-50 border border-brand-100 px-1.5 py-0.5 rounded font-mono">
            {commit.repo}
          </span>
          <span className="text-[9px] text-slate-400 font-mono flex items-center gap-0.5">
            <GitBranch className="w-2.5 h-2.5" />{commit.branch}
          </span>
          <span className="text-[9px] text-emerald-600 font-mono">+{commit.additions}</span>
          <span className="text-[9px] text-rose-500 font-mono">-{commit.deletions}</span>
        </div>
      </div>
      <div className="text-right shrink-0">
        <span className="text-[8px] text-slate-400 font-mono block">{commit.time}</span>
        <span className="text-[8px] text-slate-300 font-mono">{commit.sha}</span>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProductivitySyncPanel() {
  const { addXP, addToast, focusHours } = useCharacter();
  const [commits, setCommits] = useState(DUMMY_GITHUB.recentCommits);
  const [streak, setStreak] = useState(DUMMY_GITHUB.currentStreak);
  const [totalCommits, setTotalCommits] = useState(DUMMY_GITHUB.totalCommits);
  const [activeTab, setActiveTab] = useState('github');

  const handleSimulateCommit = () => {
    const msgs = [
      'feat: add smart spending category auto-detection',
      'fix: resolve hydration reminder duplicate trigger',
      'refactor: extract NLP utils to separate module',
      'style: improve QuickAddBar animation smoothness',
      'docs: update README with Phase 3 integration guide',
      'perf: optimize insight engine memoization strategy',
    ];
    const repos = ['KosanAmbis', 'tugas-ai-praktikum', 'portofolio-web'];
    const isLateNight = new Date().getHours() >= 23;

    const newCommit = {
      id: `sim_${Date.now()}`,
      repo: repos[Math.floor(Math.random() * repos.length)],
      branch: 'main',
      message: msgs[Math.floor(Math.random() * msgs.length)],
      time: 'Baru saja',
      additions: Math.floor(Math.random() * 200) + 10,
      deletions: Math.floor(Math.random() * 50),
      sha: Math.random().toString(16).slice(2, 9),
    };

    setCommits(prev => [newCommit, ...prev]);
    setTotalCommits(c => c + 1);
    setStreak(s => s + (Math.random() > 0.7 ? 1 : 0));

    const xp = COMMIT_XP_RULES.perCommit + (isLateNight ? COMMIT_XP_RULES.lateNightPenalty : 0);
    addXP(Math.max(xp, 1));
    addToast(isLateNight
      ? `⚡ Commit push! +${xp} XP. Tapi jam segini coding? Istirahat dulu.`
      : `🔥 Commit push! +${xp} XP. Streak ${streak + 1} hari!`
    );
  };

  const tabs = [
    { id: 'github', label: '⚡ GitHub', icon: GitCommit },
    { id: 'vscode', label: '💻 VSCode', icon: Code2 },
    { id: 'obsidian', label: '📝 Obsidian', icon: BookOpen },
    { id: 'focus', label: '🎯 Focus', icon: Activity },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* ── HEADER STATS ROW ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Commits', value: totalCommits, icon: GitCommit, color: 'text-emerald-600', bg: 'bg-emerald-50/60 border-emerald-100' },
          { label: 'Current Streak', value: `${streak} hari 🔥`, icon: Flame, color: 'text-amber-600', bg: 'bg-amber-50/60 border-amber-100' },
          { label: 'Coding Today', value: DUMMY_VSCODE_SESSIONS[0].duration, icon: Clock, color: 'text-brand-600', bg: 'bg-brand-50/60 border-brand-100' },
          { label: 'Notes Edited', value: DUMMY_OBSIDIAN_NOTES.length, icon: BookOpen, color: 'text-indigo-600', bg: 'bg-indigo-50/60 border-indigo-100' },
        ].map(stat => (
          <div key={stat.label} className={`glass-card p-4 border ${stat.bg}`}>
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">{stat.label}</span>
            </div>
            <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* ── TABS ── */}
      <div className="glass-card p-1 flex gap-1">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 px-3 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === t.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── GITHUB TAB ── */}
      {activeTab === 'github' && (
        <div className="flex flex-col gap-4">
          {/* User info + simulate button */}
          <div className="glass-card p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-xl">
                {DUMMY_GITHUB.avatar}
              </div>
              <div>
                <div className="font-extrabold text-slate-800 text-sm">@{DUMMY_GITHUB.username}</div>
                <div className="flex items-center gap-2 text-[9px] text-slate-400 font-mono mt-0.5">
                  <span className="text-amber-600 font-black">⭐ Longest streak: {DUMMY_GITHUB.longestStreak} hari</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleSimulateCommit}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-wider font-mono flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Simulate Commit +5 XP
            </button>
          </div>

          {/* Weekly commit chart */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-brand-500" />
                Weekly Commit Activity
              </h4>
              <span className="text-[8px] text-slate-400 font-mono">{DUMMY_GITHUB.weeklyCommits.reduce((a,b) => a+b,0)} commits / minggu</span>
            </div>
            <MiniBarChart
              data={DUMMY_GITHUB.weeklyCommits.map((c, i) => ({
                val: c,
                day: ['Sen','Sel','Rab','Kam','Jum','Sab','Min'][i]
              }))}
              valueKey="val"
              labelKey="day"
              color="bg-emerald-500"
            />
          </div>

          {/* Language breakdown */}
          <div className="glass-card p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-brand-500" />
              Language Breakdown
            </h4>
            <div className="flex gap-1 rounded-xl overflow-hidden h-3 mb-3">
              {DUMMY_GITHUB.languageBreakdown.map(l => (
                <div
                  key={l.lang}
                  style={{ width: `${l.pct}%`, backgroundColor: l.color }}
                  title={`${l.lang}: ${l.pct}%`}
                  className="transition-all duration-500"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              {DUMMY_GITHUB.languageBreakdown.map(l => (
                <div key={l.lang} className="flex items-center gap-1.5 text-[9px] text-slate-600 font-mono">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.lang} <span className="font-black">{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent commits */}
          <div className="glass-card p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-3 flex items-center gap-2">
              <GitCommit className="w-3.5 h-3.5 text-brand-500" />
              Recent Commits
            </h4>
            <div className="flex flex-col gap-2">
              {commits.slice(0, 5).map((c, i) => (
                <CommitItem key={c.id} commit={c} isNew={i === 0 && c.id.toString().startsWith('sim_')} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── VSCODE TAB ── */}
      {activeTab === 'vscode' && (
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-brand-500" />
              Coding Sessions (Dummy Data)
            </h4>
            <div className="flex flex-col gap-3">
              {DUMMY_VSCODE_SESSIONS.map((s, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                    <Code2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-bold text-[11px] text-slate-700">{s.project}</div>
                    <div className="flex items-center gap-3 text-[9px] text-slate-400 font-mono mt-0.5">
                      <span>{s.files} files changed</span>
                      <span>⌨️ {s.keystrokes.toLocaleString('id-ID')} keystrokes</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-brand-600">{s.duration}</div>
                    <div className="text-[8px] text-slate-400 font-mono">{s.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── OBSIDIAN TAB ── */}
      {activeTab === 'obsidian' && (
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-4 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-brand-500" />
              Obsidian Vault — Recent Notes
            </h4>
            <div className="flex flex-col gap-3">
              {DUMMY_OBSIDIAN_NOTES.map((note, i) => (
                <div key={i} className="p-3 bg-white/40 border border-white/60 rounded-xl hover:bg-white/60 transition-all">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <h5 className="text-[11px] font-bold text-slate-700 truncate">{note.title}</h5>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {note.tags.map(tag => (
                          <span key={tag} className="text-[8px] px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded font-mono font-bold">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-indigo-600">{note.words.toLocaleString()} words</div>
                      <div className="text-[8px] text-slate-400 font-mono">{note.edited}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FOCUS TAB ── */}
      {activeTab === 'focus' && (
        <div className="flex flex-col gap-4">
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-brand-500" />
                Focus Sessions This Week
              </h4>
              <span className="text-[8px] text-slate-400 font-mono">
                {DUMMY_FOCUS_SESSIONS.reduce((a, d) => a + d.minutes, 0)} menit total
              </span>
            </div>
            <MiniBarChart
              data={DUMMY_FOCUS_SESSIONS}
              valueKey="minutes"
              labelKey="date"
              color="bg-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {DUMMY_FOCUS_SESSIONS.filter(d => d.sessions > 0).map(d => (
              <div key={d.date} className="glass-card p-3">
                <div className="text-xs font-black text-slate-700">{d.date}</div>
                <div className="text-lg font-black text-brand-600 mt-1">
                  {Math.floor(d.minutes / 60)}j {d.minutes % 60}m
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-grow bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${d.score}%` }}
                    />
                  </div>
                  <span className="text-[8px] font-black text-slate-500 font-mono">{d.score}</span>
                </div>
                <div className="text-[8px] text-slate-400 font-mono mt-1">{d.sessions} sesi</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
