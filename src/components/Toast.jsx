import React, { useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';

export default function Toast({ toasts, removeToast }) {
  const safeToasts = Array.isArray(toasts) ? toasts : [];
  return (
    <div className="fixed bottom-5 right-5 z-[999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {safeToasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onClose={() => removeToast && removeToast(toast.id)} 
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="pointer-events-auto bg-darkbg-900/90 border border-zinc-800/80 rounded-xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md flex items-center justify-between gap-3 text-xs font-semibold text-slate-100 transition-all duration-300 animate-slide-in hover:border-brand-500/30">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-brand-400 shrink-0" />
        <span>{toast.message}</span>
      </div>
      <button 
        onClick={onClose} 
        className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-lg hover:bg-zinc-800"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
