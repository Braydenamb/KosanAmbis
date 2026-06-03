import React, { useState } from 'react';
import { RefreshCw, Info, X } from 'lucide-react';
import { usePredictiveIntelligence } from '../../hooks/usePredictiveIntelligence';
import PredictiveOverview from './predictive/PredictiveOverview';
import BehavioralAlerts from './predictive/BehavioralAlerts';
import CorrelationMatrix from './predictive/CorrelationMatrix';
import SimulatorLab from './predictive/SimulatorLab';

export default function PredictiveIntelligenceHub() {
  const {
    refreshKey,
    handleRegenerate,
    currentWalletBalance,
    spendCutPercentage,
    setSpendCutPercentage,
    extraSleepMinutes,
    setExtraSleepMinutes,
    hydrationIncrease,
    setHydrationIncrease,
    correlations,
    financialForecast,
    behavioralAlerts,
    simulatedRunway,
    simulatedProductivity,
    simulatedMood
  } = usePredictiveIntelligence();

  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up select-none pb-8" key={refreshKey}>
      
      {/* ─── TITLE HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>🔮</span> AI ANALISIS KOSAN
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">MEMPREDIKSI MASA DEPAN DARI KEBIASAAN SEHARI-HARI</p>
        </div>
        <button
          onClick={handleRegenerate}
          className="btn-premium-secondary text-[11px] self-start md:self-auto py-2 px-4 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Perbarui Analisis
        </button>
      </div>

      {/* ─── GUIDE BOX PANDUAN ─── */}
      {showGuide && (
        <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-4 md:p-5 flex gap-4 relative animate-fade-in shadow-sm">
          <div className="bg-indigo-100 text-indigo-500 p-2 rounded-xl shrink-0 self-start">
            <Info className="w-5 h-5" />
          </div>
          <div className="flex-1 pr-6">
            <h3 className="text-sm font-black text-indigo-900 mb-1">Panduan Membaca AI Ini</h3>
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              AI Kosan akan menganalisis hubungan sebab-akibat dari rutinitas Anda. Kami akan memberi tahu <b>kapan uang Anda diprediksi habis</b>, dan apa <b>kebiasaan buruk</b> yang sedang menguras uang atau merusak mood Anda. Coba geser *Simulasi Masa Depan* di bagian bawah untuk melihat efek jika Anda mulai berhemat!
            </p>
          </div>
          <button 
            onClick={() => setShowGuide(false)}
            className="absolute top-4 right-4 text-indigo-300 hover:text-indigo-600 bg-indigo-50/50 hover:bg-indigo-100 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <PredictiveOverview 
        financialForecast={financialForecast} 
        correlations={correlations} 
      />

      <BehavioralAlerts 
        behavioralAlerts={behavioralAlerts} 
      />

      <CorrelationMatrix 
        correlations={correlations} 
        currentWalletBalance={currentWalletBalance} 
        financialForecast={financialForecast} 
      />

      <SimulatorLab 
        spendCutPercentage={spendCutPercentage}
        setSpendCutPercentage={setSpendCutPercentage}
        extraSleepMinutes={extraSleepMinutes}
        setExtraSleepMinutes={setExtraSleepMinutes}
        hydrationIncrease={hydrationIncrease}
        setHydrationIncrease={setHydrationIncrease}
        simulatedRunway={simulatedRunway}
        simulatedProductivity={simulatedProductivity}
        simulatedMood={simulatedMood}
      />

    </div>
  );
}
