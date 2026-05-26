import React, { useState } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { Landmark, Check, Copy, Users, Settings } from 'lucide-react';
import KineticCounter from '../ui/KineticCounter';

export default function FinanceModule() {
  const {
    bills,
    setBills,
    walletExpenses,
    setWalletExpenses,
    addToast,
    addXP
  } = useCharacter();

  // --- Split Bill Calculator States ---
  const [totalBill, setTotalBill] = useState(120000);
  const [peopleCount, setPeopleCount] = useState(3);
  const [presetActive, setPresetActive] = useState('');

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // --- Bill Pay Action ---
  const handlePayBill = (bill) => {
    const newExpense = {
      id: Date.now(),
      title: `Bayar ${bill.title}`,
      amount: bill.amount,
      date: new Date().toISOString().split('T')[0],
      category: 'Tagihan'
    };
    
    setWalletExpenses(prev => [...prev, newExpense]);
    setBills(prev => prev.map(b => b.id === bill.id ? { ...b, daysLeft: 30 } : b));
    
    addToast(`💸 Transaksi Sukses: Membayar ${bill.title}.`);
    addXP(25);
  };

  const applyPreset = (title, amount, people, id) => {
    setTotalBill(amount);
    setPeopleCount(people);
    setPresetActive(id);
    addToast(`📊 Template Terpasang: ${title}`);
  };

  const splitResult = totalBill && peopleCount ? Math.round(totalBill / peopleCount) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. BILL TRACKER ROW */}
      <div className="glass-card p-5 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
              <Landmark className="w-4 h-4 text-brand-500" />
              ACCOUNTS & DEBTS MATRICES
            </h3>
            <span className="text-[8px] font-bold text-slate-400 font-mono">FINTECH CORE</span>
          </div>

          <div className="flex flex-col gap-3">
            {bills.map(bill => {
              let tagColor = 'border-blue-100 bg-blue-50 text-blue-600';
              let borderCard = 'border-white/60 bg-white/30';
              if (bill.daysLeft <= 1) {
                tagColor = 'border-rose-200 bg-rose-50 text-rose-600 animate-pulse';
                borderCard = 'border-rose-100 bg-rose-50/20';
              } else if (bill.daysLeft <= 5) {
                tagColor = 'border-amber-200 bg-amber-50 text-amber-600';
                borderCard = 'border-amber-100 bg-amber-50/20';
              }

              return (
                <div 
                  key={bill.id} 
                  className={`p-3.5 rounded-2xl border flex flex-col md:flex-row justify-between md:items-center gap-4 transition-all duration-300 ${borderCard}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800">{bill.title}</h4>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border uppercase font-mono ${tagColor}`}>
                        {bill.daysLeft <= 1 ? '⚠️ CRITICAL' : bill.daysLeft <= 5 ? '⏳ WARNING' : 'HEALTHY'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2 font-semibold font-mono">
                      <span>AMT: <strong className="text-slate-700"><KineticCounter value={formatCurrency(bill.amount)} /></strong></span>
                      <span>•</span>
                      <span>DUE: <strong className="text-slate-700">{bill.daysLeft} days</strong></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handlePayBill(bill)}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition-all active:scale-95 flex items-center gap-1 shrink-0 cursor-pointer self-start md:self-center"
                  >
                    Clear Bill
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. SPLIT BILL CALCULATOR */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
          <Users className="w-4 h-4 text-brand-500" />
          LIQUIDITY PATUNGAN SHARES
        </h3>

        {/* Quick Presets */}
        <div className="flex gap-2 flex-wrap mb-4">
          <button 
            onClick={() => applyPreset('Netflix Split', 186000, 4, 'netflix')}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${presetActive === 'netflix' ? 'bg-brand-500/10 border-brand-500 text-brand-600' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
          >
            📺 Netflix Lvl 4
          </button>
          <button 
            onClick={() => applyPreset('WiFi Indihome', 360000, 6, 'wifi')}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${presetActive === 'wifi' ? 'bg-brand-500/10 border-brand-500 text-brand-600' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
          >
            🌐 WiFi Indihome
          </button>
          <button 
            onClick={() => applyPreset('Patungan Seblak', 60000, 3, 'seblak')}
            className={`px-2.5 py-1.5 rounded-xl text-[9px] font-bold border transition-all ${presetActive === 'seblak' ? 'bg-brand-500/10 border-brand-500 text-brand-600' : 'bg-white/50 border-slate-200 text-slate-500 hover:text-slate-700'}`}
          >
            🍲 Seblak Sharing
          </button>
        </div>

        {/* Input fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Invoice Amount</label>
            <input 
              type="number" 
              value={totalBill}
              onChange={(e) => {
                setTotalBill(Number(e.target.value));
                setPresetActive('');
              }}
              className="bg-white/50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors w-full"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest font-mono">Total Members</label>
            <input 
              type="number" 
              value={peopleCount}
              onChange={(e) => {
                setPeopleCount(Number(e.target.value));
                setPresetActive('');
              }}
              className="bg-white/50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 transition-colors w-full"
            />
          </div>
        </div>

        {/* Display Output Result */}
        <div className="mt-5 p-4 bg-brand-50/50 border border-brand-200/50 rounded-2xl flex items-center justify-between">
          <div>
            <span className="text-[8px] font-black text-brand-600 uppercase tracking-widest font-mono">SHARE PER MEMBER</span>
            <div className="text-base font-extrabold text-slate-800 mt-1 leading-none">
              <KineticCounter value={formatCurrency(splitResult)} />
            </div>
          </div>
          
          <button 
            onClick={() => {
              addToast(`📤 Tagihan disalin: ${formatCurrency(splitResult)} per orang.`);
              addXP(5);
            }}
            className="p-2.5 bg-brand-500 hover:bg-brand-600 rounded-xl text-white transition-all hover:scale-105 active:scale-95 flex items-center gap-1 text-[10px] font-bold cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            Copy Share
          </button>
        </div>
      </div>
    </div>
  );
}
