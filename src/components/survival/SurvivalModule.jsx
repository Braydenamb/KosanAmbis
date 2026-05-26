import React from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { ChefHat, Check, Plus, Minus, Package } from 'lucide-react';

export default function SurvivalModule() {
  const {
    logistics,
    setLogistics,
    walletExpenses,
    setWalletExpenses,
    addToast,
    addXP
  } = useCharacter();

  // --- Dynamic Eats Recommendation based on Date ---
  const todayDate = new Date().getDate();
  
  let eatsMode = {
    title: "Gourmet Liquidity 👑",
    desc: "Makan di cafe, order Gofood premium, checkout wishlist kopi susu.",
    menu: "Chicken Katsu Curry + Iced Latte",
    cost: 58000,
    icon: "🍛",
    color: "border-brand-200 bg-brand-50/20 text-brand-700"
  };

  if (todayDate > 20) {
    eatsMode = {
      title: "Critical Survival Mode 💀",
      desc: "Menu andalan penunda rasa lapar, diperkaya doa restu orang tua.",
      menu: "Indomie Soto Polos + Promag + Air Dispenser hangat",
      cost: 6000,
      icon: "🍜",
      color: "border-rose-200 bg-rose-50/20 text-rose-600 animate-pulse"
    };
  } else if (todayDate > 10) {
    eatsMode = {
      title: "Dispenser Moderate 💧",
      desc: "Lauk bergizi warteg langganan, nasi diporsi double biar kenyang.",
      menu: "Nasi Rames + Telur Dadar + Orek Tempe",
      cost: 18000,
      icon: "🍱",
      color: "border-amber-200 bg-amber-50/20 text-amber-600"
    };
  }

  const handleMakan = () => {
    const makanExpense = {
      id: Date.now(),
      title: `Konsumsi: ${eatsMode.menu}`,
      amount: eatsMode.cost,
      date: new Date().toISOString().split('T')[0],
      category: 'Makanan'
    };

    setWalletExpenses(prev => [...prev, makanExpense]);
    
    if (todayDate > 20) {
      setLogistics(prev => ({
        ...prev,
        mie: Math.max(prev.mie - 15, 0),
        galon: Math.max(prev.galon - 5, 0)
      }));
    } else {
      setLogistics(prev => ({
        ...prev,
        galon: Math.max(prev.galon - 8, 0)
      }));
    }

    addToast(`😋 Sukses mencatat pengeluaran konsumsi: ${eatsMode.menu}.`);
    addXP(15);
  };

  const updateLogistics = (item, change) => {
    setLogistics(prev => {
      const newVal = prev[item] + change;
      const capped = newVal < 0 ? 0 : newVal > 100 ? 100 : newVal;
      
      if (change > 0) {
        addToast(`📦 Restock Sukses: Logistik ${item.toUpperCase()} ditambahkan.`);
        addXP(10);
      } else {
        addToast(`🔋 Logistik ${item.toUpperCase()} berkurang.`);
      }
      return { ...prev, [item]: capped };
    });
  };

  const getLogisticsStatus = (item, level) => {
    if (level < 20) {
      switch (item) {
        case 'galon': return 'Water Level Critical 🥵';
        case 'gas': return 'Gas Cylinder Depleted ☠️';
        case 'kopi': return 'Caffeine Depleted 💤';
        default: return 'Instant Noodle Stock Critical 🚨';
      }
    }
    return 'Stock Normal';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. SURVIVAL EATS RECOMENDER */}
      <div className="glass-card p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono">
            <ChefHat className="w-4 h-4 text-brand-500" />
            NUTRITION INTELLIGENCE ENGINE
          </h3>
          <span className="text-[8px] font-bold text-slate-400 font-mono">DATE: {todayDate}</span>
        </div>

        <div className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between gap-4 transition-all ${eatsMode.color}`}>
          <div className="flex items-start gap-3">
            <span className="text-3xl shrink-0 select-none mt-1">{eatsMode.icon}</span>
            <div>
              <h4 className="text-xs font-black uppercase tracking-widest font-mono opacity-80">{eatsMode.title}</h4>
              <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed">
                {eatsMode.desc}
              </p>
              <div className="mt-3.5 bg-white/60 px-3 py-1.5 rounded-xl border border-white/80 inline-block">
                <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest font-mono">REC. MENU:</span>
                <span className="text-xs font-bold text-slate-700">{eatsMode.menu}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between items-start md:items-end gap-3 shrink-0">
            <div className="text-right">
              <span className="text-[8px] font-black text-slate-400 block uppercase tracking-widest font-mono">ESTIMATED COST</span>
              <span className="text-sm font-black text-slate-800">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(eatsMode.cost)}
              </span>
            </div>
            
            <button 
              onClick={handleMakan}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-xl text-[10px] uppercase tracking-wider font-mono transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Eat Menu
            </button>
          </div>
        </div>
      </div>

      {/* 2. LOGISTICS STOCK INVENTORY */}
      <div className="glass-card p-5">
        <h3 className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-widest font-mono mb-4">
          <Package className="w-4 h-4 text-brand-500" />
          KOS ROOM LOGISTICS INVENTORIES
        </h3>

        <div className="flex flex-col gap-4">
          {Object.entries(logistics).map(([item, val]) => {
            const isLow = val < 20;
            const progressColor = isLow ? 'bg-gradient-to-r from-rose-400 to-rose-500 shadow-glow-red animate-pulse' : val < 50 ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-blue-400 to-blue-500';
            const cardTheme = isLow ? 'border-rose-100 bg-rose-50/10' : 'border-white/50 bg-white/20';

            return (
              <div key={item} className={`p-3 rounded-2xl border flex flex-col gap-2.5 transition-colors ${cardTheme}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-base select-none">
                      {item === 'galon' ? '💧' : item === 'gas' ? '🔥' : item === 'kopi' ? '☕' : '🍜'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider font-mono">
                      {item === 'galon' ? 'Water Canister' : item === 'gas' ? 'Portable Gas Cylinder' : item === 'kopi' ? 'Coffee Sachet Stack' : 'Instant Noodle Storage'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 bg-white/80 border border-slate-100 rounded-xl p-0.5 scale-90">
                    <button 
                      onClick={() => updateLogistics(item, -10)}
                      className="p-1 hover:bg-slate-100 rounded text-rose-500 active:scale-90"
                      aria-label="Decrease Stock"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-bold text-slate-600 w-8 text-center font-mono">{val}%</span>
                    <button 
                      onClick={() => updateLogistics(item, 10)}
                      className="p-1 hover:bg-slate-100 rounded text-brand-600 active:scale-90"
                      aria-label="Increase Stock"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden border border-white/50">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${progressColor}`}
                    style={{ width: `${val}%` }}
                  />
                </div>

                {/* Subtitle Warning */}
                <div className="flex justify-between items-center text-[8px] font-bold font-mono">
                  <span className={isLow ? 'text-rose-500 font-black animate-pulse' : 'text-slate-400'}>
                    {getLogisticsStatus(item, val)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
