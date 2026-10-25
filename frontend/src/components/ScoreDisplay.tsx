import React from 'react';
import { ObservedRange } from '../types/api';
import { AlertCircle, CheckCircle, Info, TrendingUp } from 'lucide-react';

interface ScoreDisplayProps {
  score: number;
  observedRange: ObservedRange;
  isWithinRange: boolean;
  modelName?: string;
  disclaimer?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  observedRange,
  isWithinRange,
  modelName = 'BiLSTM',
  disclaimer = 'Model-estimated score, not an expert assessment.',
}) => {
  // Safe calculation for visual progress bar percentage across observed range
  const min = observedRange.min;
  const max = observedRange.max;
  const pct = Math.max(0, Math.min(100, ((score - min) / (max - min)) * 100));

  // Determine quality tier based on continuous score
  let tierLabel = 'Introductory / Basic';
  let tierColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  let barGradient = 'from-amber-500 to-amber-400';

  if (score >= 7.0) {
    tierLabel = 'Comprehensive & Specific';
    tierColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    barGradient = 'from-emerald-500 to-cyan-400';
  } else if (score >= 4.5) {
    tierLabel = 'Moderate / Developing';
    tierColor = 'text-indigo-300 border-indigo-500/30 bg-indigo-500/10';
    barGradient = 'from-indigo-500 to-brand-400';
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              BiLSTM Regression Output
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-brand-500/20 text-brand-300 border border-brand-500/30">
              {modelName}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mt-1">Prompt Quality Score</h3>
        </div>

        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${tierColor} flex items-center gap-1.5`}>
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{tierLabel}</span>
        </div>
      </div>

      {/* Main Score Hero */}
      <div className="py-6 flex flex-col md:flex-row md:items-baseline gap-6">
        <div className="flex items-baseline gap-3">
          <span className="text-6xl font-black tracking-tight text-white font-mono">
            {score.toFixed(2)}
          </span>
          <div className="text-xs text-slate-400 leading-tight">
            <span>Observed Range:</span>
            <div className="font-mono text-slate-300 font-semibold text-sm">
              {min.toFixed(2)} – {max.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {/* Progress bar across observed scale */}
          <div className="w-full h-3 rounded-full bg-slate-800/90 p-0.5 border border-slate-700/60 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 ease-out`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Min ({min.toFixed(1)})</span>
            <span className="text-slate-300">Dataset Midpoint ({(min + (max - min) / 2).toFixed(1)})</span>
            <span>Max ({max.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Out of bounds note if applicable (Never silently clamp!) */}
      {!isWithinRange && (
        <div className="mb-4 p-3 rounded-xl bg-amber-950/40 border border-amber-800/50 flex items-start gap-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Transparent Model Note:</strong> The predicted value ({score.toFixed(4)}) falls outside the observed training dataset range ({min.toFixed(2)}–{max.toFixed(2)}). As a linear regression output layer, unconstrained values can occur on unusual prompt lengths or distributions.
          </div>
        </div>
      )}

      {/* Unrounded value & Model Disclaimer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="font-mono text-[11px] text-slate-400">
          Exact Float Output: <span className="text-slate-200">{score.toFixed(6)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Info className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
          <span className="italic">{disclaimer}</span>
        </div>
      </div>
    </div>
  );
};
