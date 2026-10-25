import React, { useState, useEffect } from 'react';
import { PageId, CompareResponse, PredictResponse } from '../types/api';
import { apiService } from '../services/api';
import { ComparisonPanel } from '../components/ComparisonPanel';
import {
  SlidersHorizontal,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Loader2,
  AlertTriangle,
  ArrowLeftRight,
  FileText,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';

interface ImproveProps {
  initialPrompt?: string;
  initialScore?: number;
  onNavigate: (page: PageId) => void;
}

export const Improve: React.FC<ImproveProps> = ({
  initialPrompt = 'Explain machine learning.',
  initialScore,
  onNavigate,
}) => {
  const [originalPrompt, setOriginalPrompt] = useState(initialPrompt);
  const [revisedPrompt, setRevisedPrompt] = useState(
    initialPrompt.includes('Act as')
      ? initialPrompt
      : `Act as a computer science instructor. ${initialPrompt} Include 2 real-world examples and format the key differences in a markdown table for first-year engineering students.`
  );

  const [isLoading, setIsLoading] = useState(false);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedRevised, setCopiedRevised] = useState(false);

  // If initialScore was not provided, let's auto-evaluate when user lands on page
  const handleRunComparison = async () => {
    if (!originalPrompt.trim() || !revisedPrompt.trim()) {
      setErrorMessage('Please provide both an original and a revised prompt to compare.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await apiService.compare(originalPrompt.trim(), revisedPrompt.trim());
      setComparison(data);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Comparison evaluation failed. Please check backend connection.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Run an initial comparison on mount if prompts are populated
    handleRunComparison();
  }, []);

  const handleSwap = () => {
    const temp = originalPrompt;
    setOriginalPrompt(revisedPrompt);
    setRevisedPrompt(temp);
  };

  const handleReset = () => {
    setOriginalPrompt('Explain machine learning.');
    setRevisedPrompt('Explain machine learning to beginners with examples.');
    setComparison(null);
  };

  const handleCopyRevised = () => {
    navigator.clipboard.writeText(revisedPrompt);
    setCopiedRevised(true);
    setTimeout(() => setCopiedRevised(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Iterative Optimization
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
              Dual Inference Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Prompt Improvement Workspace</h1>
          <p className="text-sm text-slate-400 mt-1">
            Edit your prompt, re-evaluate with the trained BiLSTM, and observe genuine score differences side-by-side.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('evaluator')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Return to Evaluator</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3 text-sm text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-200 leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Original Prompt Editor */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <h3 className="text-base font-bold text-white">Original Prompt (Baseline)</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {originalPrompt.length} chars • {originalPrompt.trim() ? originalPrompt.trim().split(/\s+/).length : 0} words
            </span>
          </div>

          <textarea
            rows={7}
            value={originalPrompt}
            onChange={(e) => setOriginalPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Enter original prompt..."
            className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-slate-600 p-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-y leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Serves as your comparison benchmark</span>
            <button
              onClick={() => setOriginalPrompt('Explain machine learning.')}
              className="text-[11px] text-brand-400 hover:underline"
            >
              Insert basic sample
            </button>
          </div>
        </div>

        {/* Right: Revised Prompt Editor */}
        <div className="rounded-2xl border border-brand-800/50 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Improved Prompt (Revision)</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">
                {revisedPrompt.length} chars • {revisedPrompt.trim() ? revisedPrompt.trim().split(/\s+/).length : 0} words
              </span>
              <button
                onClick={handleCopyRevised}
                className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white"
                title="Copy revised prompt"
              >
                {copiedRevised ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <textarea
            rows={7}
            value={revisedPrompt}
            onChange={(e) => setRevisedPrompt(e.target.value)}
            disabled={isLoading}
            placeholder="Edit and refine your prompt with role, context, format, audience, and constraints..."
            className="w-full rounded-xl bg-slate-950/80 border border-brand-800/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 p-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all resize-y leading-relaxed font-sans"
          />

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Refine using prompt engineering elements</span>
            <button
              onClick={() =>
                setRevisedPrompt(
                  'Act as a machine learning instructor. Explain supervised and unsupervised learning to first-year engineering students using simple language, two real-world examples, and a comparison table.'
                )
              }
              className="text-[11px] text-cyan-400 hover:underline"
            >
              Insert detailed sample
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
        <button
          onClick={handleRunComparison}
          disabled={isLoading || !originalPrompt.trim() || !revisedPrompt.trim()}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-violet transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Evaluating Both Prompts with BiLSTM...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Re-evaluate & Compare Scores</span>
            </>
          )}
        </button>

        <button
          onClick={handleSwap}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-3.5 rounded-xl font-medium text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-1.5"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Swap Inputs</span>
        </button>
      </div>

      {/* Results Comparison Section */}
      {comparison && (
        <ComparisonPanel
          comparison={comparison}
          onReset={handleReset}
          onSwap={handleSwap}
          onReturnToEvaluator={() => onNavigate('evaluator')}
        />
      )}
    </div>
  );
};
