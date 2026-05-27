import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Wifi, WifiOff, Zap, MessageCircle, Clock, CheckCheck, Sparkles } from 'lucide-react';
import { DUMMY_BOT_HISTORY, BOT_QUICK_REPLIES, BOT_AUTO_RESPONSES } from '../../data/dummyAutomation';
import { parseInput, generateBotReply, formatRupiah } from '../../hooks/useNLPParser';
import { useCharacter } from '../../context/CharacterContext';

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 justify-start">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white text-xs shrink-0">
        <Bot className="w-3.5 h-3.5" />
      </div>
      <div className="bg-white/80 border border-white/60 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400"
              style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGE BUBBLE ───────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const isUser = msg.from === 'user';

  return (
    <div className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'} ${isNew ? 'animate-slide-up' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center text-white text-xs shrink-0 mb-0.5">
          <Bot className="w-3.5 h-3.5" />
        </div>
      )}

      <div className={`max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`
          px-3.5 py-2.5 text-[11px] font-medium leading-relaxed whitespace-pre-line shadow-sm
          ${isUser
            ? 'bg-slate-900 text-white rounded-2xl rounded-br-sm'
            : 'bg-white/90 border border-white/70 text-slate-800 rounded-2xl rounded-bl-sm'
          }
        `}>
          {msg.emoji && !isUser && (
            <span className="text-base mr-1">{msg.emoji}</span>
          )}
          {msg.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 text-[8px] text-slate-400 font-mono ${isUser ? 'flex-row-reverse' : ''}`}>
          <span>{msg.time}</span>
          {isUser && <CheckCheck className="w-2.5 h-2.5 text-brand-500" />}
        </div>
      </div>

      {isUser && (
        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-base shrink-0 mb-0.5">
          🤖
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function BotSimulator() {
  const { walletBalance, setWalletExpenses, setWalletAllowance, addXP, addToast } = useCharacter();

  const [messages, setMessages] = useState(DUMMY_BOT_HISTORY);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isBotOnline] = useState(true);
  const [parsedPreview, setParsedPreview] = useState(null);
  const [messageCount, setMessageCount] = useState(0);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Live NLP preview
  useEffect(() => {
    if (inputText.length >= 3) {
      const parsed = parseInput(inputText);
      if (parsed && parsed.amount) {
        setParsedPreview(parsed);
      } else {
        setParsedPreview(null);
      }
    } else {
      setParsedPreview(null);
    }
  }, [inputText]);

  const getBotAutoResponse = (text) => {
    const lower = text.toLowerCase();
    for (const [key, fn] of Object.entries(BOT_AUTO_RESPONSES)) {
      if (lower.includes(key)) return fn(walletBalance);
    }

    // Try NLP parse for expense/income
    const parsed = parseInput(text);
    if (parsed && parsed.amount) {
      const reply = generateBotReply(parsed, walletBalance);

      // Apply to CharacterContext
      if (parsed.intent === 'income') {
        setWalletAllowance(prev => prev + parsed.amount);
      } else {
        setWalletExpenses(prev => [...prev, {
          id: Date.now(),
          title: parsed.merchant || parsed.description || parsed.rawText,
          amount: parsed.amount,
          date: parsed.date,
          category: parsed.category,
          source: 'bot_sim',
        }]);
      }
      addXP(3);

      return reply.text;
    }

    return '🤔 Hmm, kurang ngerti. Coba: "makan 18k", "kopi 25rb", atau "transferan 500k".\nAtau ketik "berapa duit gw?" untuk cek saldo.';
  };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const userMsg = {
      id: Date.now(),
      from: 'user',
      text,
      time: timeStr,
      isNew: true,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setParsedPreview(null);
    setMessageCount(c => c + 1);

    // Bot typing delay
    setIsTyping(true);
    const delay = 600 + Math.random() * 800;

    setTimeout(() => {
      const botText = getBotAutoResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        from: 'bot',
        emoji: parsedPreview ? undefined : undefined,
        text: botText,
        time: timeStr,
        isNew: true,
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuickReply = (command) => {
    setInputText(command);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {/* ── HEADER ── */}
      <div className="glass-card p-4 mb-0 rounded-b-none border-b border-white/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Bot avatar */}
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-500 flex items-center justify-center shadow-glow">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {isBotOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-800">@KosanAmbisBot</h3>
                <span className="text-[8px] px-1.5 py-0.5 bg-brand-500/10 border border-brand-500/20 text-brand-600 rounded font-black font-mono uppercase tracking-wider">BOT</span>
              </div>
              <p className="text-[9px] text-emerald-600 font-bold font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                {isBotOnline ? 'Online · Siap menerima input' : 'Offline'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Messages</div>
              <div className="text-sm font-black text-slate-800">{messages.length}</div>
            </div>
            {isBotOnline
              ? <Wifi className="w-4 h-4 text-emerald-500" />
              : <WifiOff className="w-4 h-4 text-amber-500" />
            }
          </div>
        </div>

        {/* Quick replies */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {BOT_QUICK_REPLIES.map(qr => (
            <button
              key={qr.label}
              onClick={() => handleQuickReply(qr.command)}
              className="px-2.5 py-1.5 bg-white/70 border border-slate-200/70 rounded-xl text-[9px] font-bold text-slate-600 hover:border-brand-400 hover:text-brand-700 hover:bg-brand-50/40 active:scale-95 transition-all cursor-pointer"
            >
              {qr.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CHAT WINDOW ── */}
      <div className="flex-grow overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white/60 border-x border-white/40 px-4 py-4 flex flex-col gap-3 min-h-[380px] max-h-[480px]">
        {/* Date separator */}
        <div className="flex items-center gap-3 my-1">
          <div className="flex-grow h-px bg-slate-200/60" />
          <span className="text-[8px] text-slate-400 font-mono font-bold uppercase tracking-widest shrink-0 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> Riwayat Percakapan
          </span>
          <div className="flex-grow h-px bg-slate-200/60" />
        </div>

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} isNew={msg.isNew} />
        ))}

        {isTyping && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      {/* ── INPUT AREA ── */}
      <div className="glass-card rounded-t-none border-t border-white/40 p-4">
        {/* NLP Preview strip */}
        {parsedPreview && (
          <div className="mb-3 px-3 py-2 bg-brand-50/70 border border-brand-200/60 rounded-xl flex items-center gap-2 text-[10px]">
            <Sparkles className="w-3 h-3 text-brand-500 shrink-0" />
            <span className="text-brand-700 font-semibold">
              Terdeteksi: <strong>{parsedPreview.category}</strong>
              {parsedPreview.merchant ? ` · ${parsedPreview.merchant}` : ''}
              {' — '}
              <strong className={parsedPreview.intent === 'income' ? 'text-emerald-700' : 'text-rose-700'}>
                {parsedPreview.intent === 'income' ? '+' : '-'}{formatRupiah(parsedPreview.amount)}
              </strong>
            </span>
            <span className="ml-auto text-brand-500 font-mono">{Math.round((parsedPreview.confidence || 0) * 100)}%</span>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Kirim pesan: 'makan 18k', 'gofood 45rb', 'berapa duit gw?'"
            className="flex-grow bg-white/80 border border-slate-200/80 rounded-2xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-brand-400 transition-colors placeholder:text-slate-400"
          />
          <button
            onClick={sendMessage}
            disabled={!inputText.trim()}
            className="w-10 h-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[8px] text-slate-400 font-mono mt-2 text-center">
          Simulasi Telegram Bot · Tekan Enter untuk kirim · Data tersimpan ke dashboard
        </p>
      </div>
    </div>
  );
}
