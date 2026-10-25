import React, { useState } from 'react';
import { PageId, PredictResponse } from '../types/api';
import { apiService, ApiError } from '../services/api';
import { PromptEditor } from '../components/PromptEditor';
import { ScoreDisplay } from '../components/ScoreDisplay';
import { SuggestionPanel } from '../components/SuggestionPanel';
import {
  Cpu,
  AlertTriangle,
  SlidersHorizontal,
  Download,
  Share2,
  Check,
  History,
  Trash2,
} from 'lucide-react';

interface EvaluatorProps {
  onNavigate: (page: PageId) => void;
  onSendToWorkspace?: (prompt: string, score: number) => void;
}

export const Evaluator: React.FC<EvaluatorProps> = ({ onNavigate, onSendToWorkspace }) => {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Opt-in local browser history
  const [history, setHistory] = useState<
    { prompt: string; score: number; timestamp: string }[]
  >(() => {
    try {
      const saved = localStorage.getItem('promptiq_eval_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleEvaluate = async () => {
    const trimmed = promptText.trim();
    if (!trimmed) {
      setErrorMessage('Please enter a prompt before evaluating.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await apiService.predict(trimmed);
      setResult(data);

      // Save to optional local history
      const newEntry = {
        prompt: trimmed,
        score: data.predicted_score,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedHistory = [newEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      try {
        localStorage.setItem('promptiq_eval_history', JSON.stringify(updatedHistory));
      } catch {
        // Ignore local storage write errors
      }
    } catch (err: any) {
      setErrorMessage(
        err.message || 'An error occurred while evaluating your prompt with the BiLSTM model.'
      );
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTemplate = (template: string) => {
    setPromptText(template);
  };

  const handleSendToWorkspaceInternal = (template?: string) => {
    const textToPass = template || promptText;
    const scoreToPass = result?.predicted_score || 0;
    if (onSendToWorkspace) {
      onSendToWorkspace(textToPass, scoreToPass);
    }
    onNavigate('improve');
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const reportData = {
      project: 'PromptIQ',
      model: result.model,
      evaluated_at: new Date().toISOString(),
      prompt: result.prompt,
      predicted_score: result.predicted_score,
      observed_range: result.observed_dataset_range,
      analysis: result.analysis,
      suggestions: result.suggestions,
      disclaimer: result.disclaimer,
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptiq-evaluation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('promptiq_eval_history');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
              Interactive Inference
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
              BiLSTM Regressor
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white mt-1">Prompt Evaluator</h1>
          <p className="text-sm text-slate-400 mt-1">
            Submit any prompt string for live neural regression assessment trained on the PELS dataset.
          </p>
        </div>

        {result && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSendToWorkspaceInternal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-glow-violet transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Improve in Workspace</span>
            </button>

            <button
              onClick={handleDownloadReport}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
              title="Download JSON evaluation report"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3 text-sm text-red-200">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-red-300">Model Inference Notice</strong>
            <p className="text-xs text-red-200 leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prompt Input Editor & Local History */}
        <div className="lg:col-span-7 space-y-6">
          <PromptEditor
            value={promptText}
            onChange={setPromptText}
            onEvaluate={handleEvaluate}
            isLoading={isLoading}
          />

          {/* Optional Local Browser History */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Recent Evaluations (Browser-local)</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              <div className="space-y-2">
                {history.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setPromptText(item.prompt)}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/60 cursor-pointer text-xs transition-colors"
                  >
                    <p className="text-slate-300 line-clamp-1 flex-1 mr-3">"{item.prompt}"</p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-mono font-bold text-cyan-300">
                        {item.score.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-500">{item.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Score Display & Suggestions */}
        <div className="lg:col-span-5 space-y-6">
          {result ? (
            <>
              <ScoreDisplay
                score={result.predicted_score}
                observedRange={result.observed_dataset_range}
                isWithinRange={result.is_within_observed_range}
                modelName={result.model}
                disclaimer={result.disclaimer}
              />

              <SuggestionPanel
                suggestions={result.suggestions}
                analysis={result.analysis}
                suggestedTemplate={result.suggested_template}
                onApplyTemplate={handleApplyTemplate}
                onSendToImprove={handleSendToWorkspaceInternal}
              />
            </>
          ) : (
            /* Empty State Guidance */
            <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Awaiting Prompt Submission</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Type your prompt into the editor or pick one of the sample prompts to generate a real Deep Learning quality score from the trained BiLSTM model.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
