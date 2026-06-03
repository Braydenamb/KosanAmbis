import React from 'react';
import { RefreshCw } from 'lucide-react';
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

  return (
    <div className="flex flex-col gap-6 w-full animate-slide-up select-none pb-8" key={refreshKey}>
      
      {/* ─── TITLE HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/40 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>🔮</span> CROSS-METRIC PREDICTIVE INTELLIGENCE
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-1">AI ANALYTICS ENGINE & LIFESTYLE CAUSE-EFFECT PREDICTIONS</p>
        </div>
        <button
          onClick={handleRegenerate}
          className="btn-premium-secondary text-[11px] self-start md:self-auto py-2 px-4 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Regenerate Event Logs
        </button>
      </div>

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
