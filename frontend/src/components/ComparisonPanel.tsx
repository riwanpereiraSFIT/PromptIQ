import React, { useState } from 'react';
import { CompareResponse } from '../types/api';
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Copy,
  Check,
  RotateCcw,
  ArrowLeftRight,
  Cpu,
  Sparkles,
  Info,
} from 'lucide-react';

interface ComparisonPanelProps {
  comparison: CompareResponse;
  onReset: () => void;
  onSwap?: () => void;
  onReturnToEvaluator?: () => void;
}

export const ComparisonPanel: React.FC<ComparisonPanelProps> = ({
  comparison,
  onReset,
  onSwap,
  onReturnToEvaluator,
}) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedRevised, setCopiedRevised] = useState(false);

  const diff = comparison.score_diff;
  const isHigher = diff > 0.001;
  const isLower = diff < -0.001;
  const isNeutral = !isHigher && !isLower;

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(comparison.original_prompt);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const handleCopyRevised = () => {
    navigator.clipboard.writeText(comparison.revised_prompt);
    setCopiedRevised(true);
    setTimeout(() => setCopiedRevised(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Delta Banner */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl ${
                isHigher
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : isLower
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {isHigher ? (
                <TrendingUp className="w-7 h-7" />
              ) : isLower ? (
                <TrendingDown className="w-7 h-7" />
              ) : (
                <Minus className="w-7 h-7" />
              )}
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Predicted Score Delta
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-white font-mono">
                  {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  ({diff > 0 ? '+' : ''}{((diff / (comparison.original_score || 1)) * 100).toFixed(1)}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isHigher
                  ? 'The revised prompt achieved a higher predicted score from the BiLSTM model.'
                  : isLower
                  ? 'The revised prompt received a lower predicted score. Review structural guidance to refine further.'
                  : 'No significant difference detected by the model between iterations.'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {onSwap && (
              <button
                onClick={onSwap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Swap original and revised text"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
            )}

            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-red-950/40 hover:text-red-300 text-slate-400 border border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Prompt Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Original Prompt */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Baseline Iteration
              </span>
              <h4 className="text-base font-bold text-white">Original Prompt</h4>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono text-slate-200">
                {comparison.original_score.toFixed(2)}
              </span>
              <button
                onClick={handleCopyOriginal}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Copy original"
              >
                {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-200 font-sans whitespace-pre-wrap min-h-[140px] leading-relaxed">
            {comparison.original_prompt}
          </p>

          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Initial Suggestions:</span>
            <ul className="list-disc list-inside mt-1.5 space-y-1">
              {comparison.original_suggestions.slice(0, 3).map((s, i) => (
                <li key={i} className="line-clamp-1">{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Revised Prompt */}
        <div className="rounded-2xl border border-brand-800/40 bg-slate-900/80 p-6 space-y-4 relative">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Refined Iteration
              </span>
              <h4 className="text-base font-bold text-white">Revised Prompt</h4>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-2xl font-bold font-mono ${
                  isHigher ? 'text-emerald-400' : isLower ? 'text-rose-400' : 'text-slate-200'
                }`}
              >
                {comparison.revised_score.toFixed(2)}
              </span>
              <button
                onClick={handleCopyRevised}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Copy revised"
              >
                {copiedRevised ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <p className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm text-slate-100 font-sans whitespace-pre-wrap min-h-[140px] leading-relaxed">
            {comparison.revised_prompt}
          </p>

          <div className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Revised Analysis:</span>
            <ul className="list-disc list-inside mt-1.5 space-y-1">
              {comparison.revised_suggestions.slice(0, 3).map((s, i) => (
                <li key={i} className="line-clamp-1">{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Scientific Transparency Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>{comparison.disclaimer}</span>
      </div>
    </div>
  );
};
