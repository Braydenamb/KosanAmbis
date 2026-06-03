import React from 'react';
import { ShieldAlert, Zap } from 'lucide-react';

export default function BehavioralAlerts({ behavioralAlerts }) {
  if (!behavioralAlerts || behavioralAlerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 font-mono">ACTIVE BEHAVIORAL RISKS & WARNINGS</span>
      <div className="flex flex-col gap-3.5">
        {behavioralAlerts.map(alert => (
          <div 
            key={alert.id}
            className={`glass-card p-4.5 border border-l-[6px] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70
              ${alert.type === 'danger' ? 'border-rose-400 border-l-rose-500 bg-rose-500/5' : 
                alert.type === 'warning' ? 'border-amber-400 border-l-amber-500 bg-amber-500/5' : 
                'border-indigo-400 border-l-indigo-500 bg-indigo-500/5'}`}
          >
            <div className="flex gap-3 min-w-0">
              <div className={`p-2 rounded-xl border self-start
                ${alert.type === 'danger' ? 'bg-rose-500/10 border-rose-300 text-rose-500' : 
                  alert.type === 'warning' ? 'bg-amber-500/10 border-amber-300 text-amber-500' : 
                  'bg-indigo-500/10 border-indigo-300 text-indigo-500'}`}>
                <ShieldAlert className="w-4 h-4 shrink-0" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-slate-800 leading-tight tracking-wider font-mono">{alert.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{alert.desc}</p>
                <p className="text-[10px] font-bold text-slate-600 mt-2 font-mono flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Advice: {alert.advice}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
