import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Send, X, Check, ChevronDown, Sparkles, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { useNLPParser, generateBotReply, formatRupiah } from '../../hooks/useNLPParser';
import { useCharacter } from '../../context/CharacterContext';

// ─── SUGGESTED SHORTCUTS ─────────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  { label: '☕ Kopi', template: 'kopi ' },
  { label: '🍽️ Makan', template: 'makan siang ' },
  { label: '🚗 Ojol', template: 'gojek ' },
  { label: '💡 Token', template: 'token listrik ' },
  { label: '💸 Transferan', template: 'transferan ' },
  { label: '🛍️ Belanja', template: 'belanja ' },
];

const CATEGORY_COLORS = {
  Makan: 'bg-amber-50 border-amber-200 text-amber-700',
  Kopi: 'bg-brown-50 border-amber-300 text-amber-800',
  Transport: 'bg-blue-50 border-blue-200 text-blue-700',
  Tagihan: 'bg-red-50 border-red-200 text-red-700',
  Hiburan: 'bg-purple-50 border-purple-200 text-purple-700',
  Belanja: 'bg-pink-50 border-pink-200 text-pink-700',
  Kesehatan: 'bg-green-50 border-green-200 text-green-700',
  Pendidikan: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  Pemasukan: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  Lainnya: 'bg-slate-50 border-slate-200 text-slate-600',
};

const CATEGORY_EMOJIS = {
  Makan: '🍽️', Kopi: '☕', Transport: '🚗', Tagihan: '💡',
  Hiburan: '🎮', Belanja: '🛍️', Kesehatan: '💊', Pendidikan: '📚',
  Pemasukan: '💸', Lainnya: '📌',
};

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function loadRecentInputs() {
  try {
    const raw = localStorage.getItem('zf_recent_inputs');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveRecentInput(text) {
  const recents = loadRecentInputs();
  const updated = [text, ...recents.filter(r => r !== text)].slice(0, 8);
  localStorage.setItem('zf_recent_inputs', JSON.stringify(updated));
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function QuickAddBar() {
  const {
    walletBalance,
    walletExpenses,
    setWalletExpenses,
    walletAllowance,
    setWalletAllowance,
    addToast,
    addXP,
  } = useCharacter();

  const { inputText, setInputText, parsed, parse, reset, isProcessing } = useNLPParser();

  const [isExpanded, setIsExpanded] = useState(false);
  const [botReply, setBotReply] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [recentInputs, setRecentInputs] = useState(() => loadRecentInputs());
  const [showRecents, setShowRecents] = useState(false);
  const [successFlash, setSuccessFlash] = useState(false);

  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  // Click outside to collapse
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!showConfirm) {
          setIsExpanded(false);
          setShowRecents(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showConfirm]);

  // Live parse as user types
  const handleInputChange = useCallback((e) => {
    const text = e.target.value;
    setInputText(text);
    setBotReply(null);
    setShowConfirm(false);

    if (text.length >= 3) {
      const result = parse(text);
      if (result && result.amount) {
        setShowConfirm(true);
        const reply = generateBotReply(result, walletBalance);
        setBotReply(reply);
      } else {
        setShowConfirm(false);
      }
    } else {
      setShowConfirm(false);
    }
  }, [parse, walletBalance, setInputText]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && showConfirm) {
      handleConfirm();
    }
    if (e.key === 'Escape') {
      setIsExpanded(false);
      setShowRecents(false);
      reset();
    }
  };

  const handleConfirm = useCallback(() => {
    if (!parsed || !parsed.amount) return;

    const newEntry = {
      id: Date.now(),
      title: parsed.merchant || parsed.description || parsed.rawText,
      amount: parsed.amount,
      date: parsed.date,
      category: parsed.category,
      source: 'quick_add_nlp',
      rawText: parsed.rawText,
    };

    if (parsed.intent === 'income') {
      setWalletAllowance(prev => prev + parsed.amount);
    } else {
      setWalletExpenses(prev => [...prev, newEntry]);
    }

    // XP reward for using NLP quick add
    addXP(3);
    addToast(botReply?.text || `✅ Tercatat: ${parsed.category} ${formatRupiah(parsed.amount)}`);

    saveRecentInput(parsed.rawText);
    setRecentInputs(loadRecentInputs());

    // Success animation
    setSuccessFlash(true);
    setTimeout(() => setSuccessFlash(false), 600);

    // Reset
    reset();
    setBotReply(null);
    setShowConfirm(false);
    setIsExpanded(false);
  }, [parsed, botReply, setWalletExpenses, setWalletAllowance, addToast, addXP, reset]);

  const handleSuggestion = (template) => {
    setInputText(template);
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(template.length, template.length);
      }
    }, 50);
  };

  const handleRecentSelect = (text) => {
    setInputText(text);
    const result = parse(text);
    if (result && result.amount) {
      setShowConfirm(true);
      setBotReply(generateBotReply(result, walletBalance));
    }
    setShowRecents(false);
    inputRef.current?.focus();
  };

  const categoryColorClass = parsed?.category
    ? (CATEGORY_COLORS[parsed.category] || CATEGORY_COLORS['Lainnya'])
    : '';
  const categoryEmoji = parsed?.category
    ? (CATEGORY_EMOJIS[parsed.category] || '📌')
    : '';

  return (
    <div ref={containerRef} className="relative">
      {/* ── MAIN QUICK ADD BAR ── */}
      <div
        className={`
          glass-card transition-all duration-300 ease-out overflow-hidden
          ${successFlash ? 'ring-2 ring-emerald-400/60 bg-emerald-50/30' : ''}
        `}
      >
        {/* Header Row — always visible */}
        <div className="p-4 flex items-center gap-3">
          {/* Icon */}
          <div className={`
            w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300
            ${isExpanded
              ? 'bg-brand-500 text-white shadow-glow'
              : 'bg-brand-500/10 text-brand-600'
            }
          `}>
            <Zap className="w-4 h-4" />
          </div>

          {/* Input field */}
          <div className="flex-grow relative min-w-0">
            {!isExpanded ? (
              // Collapsed placeholder button
              <button
                onClick={() => setIsExpanded(true)}
                className="w-full text-left px-3.5 py-2 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-400 font-medium hover:border-brand-300 hover:bg-white/80 transition-all cursor-text"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                  <span>"makan warteg 18k" atau "transferan 500k"...</span>
                </span>
              </button>
            ) : (
              // Expanded input
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setShowRecents(recentInputs.length > 0 && inputText.length === 0)}
                  placeholder="Ketik: makan siang 18k, kopi 25k, transferan 2jt..."
                  className={`
                    w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800
                    bg-white border transition-all duration-200 focus:outline-none
                    ${showConfirm
                      ? 'border-brand-400 bg-brand-50/30'
                      : 'border-slate-300 focus:border-brand-400 bg-white/90'
                    }
                  `}
                  autoComplete="off"
                  spellCheck={false}
                />
                {inputText && (
                  <button
                    onClick={() => { reset(); setBotReply(null); setShowConfirm(false); }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Label indicator */}
            <span className="hidden sm:block text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">
              QUICK ADD
            </span>

            {/* Confirm button */}
            {showConfirm && (
              <button
                onClick={handleConfirm}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer animate-pop-spring"
              >
                <Check className="w-3 h-3" />
                <span className="hidden sm:inline">Catat</span>
              </button>
            )}

            {/* Expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* ── LIVE PARSE PREVIEW ── */}
        {isExpanded && parsed && parsed.amount && (
          <div className={`mx-4 mb-3 px-3.5 py-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 transition-all duration-200 ${categoryColorClass}`}>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">{categoryEmoji}</span>
              <div className="min-w-0">
                <div className="font-extrabold text-[11px] leading-tight">
                  {parsed.category}{parsed.merchant ? ` · ${parsed.merchant}` : ''}
                </div>
                <div className="text-[9px] opacity-75 font-mono mt-0.5">
                  {parsed.intent === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'} · confidence {Math.round((parsed.confidence || 0) * 100)}%
                </div>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className={`font-black text-sm leading-tight ${parsed.intent === 'income' ? 'text-emerald-700' : ''}`}>
                {parsed.intent === 'income' ? '+' : '-'}{formatRupiah(parsed.amount)}
              </div>
              <div className="text-[9px] opacity-60 font-mono">
                {parsed.intent === 'income' ? (
                  <span className="flex items-center gap-1 justify-end"><TrendingUp className="w-2.5 h-2.5" /> income</span>
                ) : (
                  <span className="flex items-center gap-1 justify-end"><TrendingDown className="w-2.5 h-2.5" /> expense</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── BOT REPLY PREVIEW ── */}
        {isExpanded && botReply && !showRecents && (
          <div className="mx-4 mb-3 px-3.5 py-2.5 bg-slate-900 rounded-xl">
            <p className="text-[10px] font-semibold text-slate-200 leading-relaxed whitespace-pre-line">{botReply.text}</p>
            <p className="text-[8px] text-slate-500 font-mono mt-1">Tekan Enter untuk konfirmasi</p>
          </div>
        )}

        {/* ── RECENT INPUTS DROPDOWN ── */}
        {isExpanded && showRecents && recentInputs.length > 0 && (
          <div className="mx-4 mb-3">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" /> Terakhir dipakai
            </p>
            <div className="flex flex-wrap gap-1.5">
              {recentInputs.map((text, i) => (
                <button
                  key={i}
                  onClick={() => handleRecentSelect(text)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/30 transition-all cursor-pointer"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── QUICK SUGGESTION CHIPS ── */}
        {isExpanded && !inputText && !showRecents && (
          <div className="px-4 pb-4">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Quick shortcuts
            </p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleSuggestion(s.template)}
                  className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-semibold text-slate-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/40 active:scale-95 transition-all cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PROCESSING INDICATOR ── */}
        {isProcessing && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 text-[9px] text-brand-500 font-mono font-bold">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" />
              NLP parsing...
            </div>
          </div>
        )}
      </div>

      {/* ── KEYBOARD HINT ── */}
      {isExpanded && showConfirm && (
        <div className="absolute -bottom-5 right-0 text-[8px] text-slate-400 font-mono select-none">
          ↵ Enter untuk catat · Esc untuk batal
        </div>
      )}
    </div>
  );
}
