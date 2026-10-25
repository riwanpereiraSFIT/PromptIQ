import React, { useState } from 'react';
import { PromptAnalysis } from '../types/api';
import {
  Lightbulb,
  Check,
  X,
  Copy,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileCode,
} from 'lucide-react';

interface SuggestionPanelProps {
  suggestions: string[];
  analysis?: PromptAnalysis;
  suggestedTemplate?: string;
  onApplyTemplate?: (template: string) => void;
  onSendToImprove?: (template: string) => void;
}

export const SuggestionPanel: React.FC<SuggestionPanelProps> = ({
  suggestions,
  analysis,
  suggestedTemplate,
  onApplyTemplate,
  onSendToImprove,
}) => {
  const [copiedTemplate, setCopiedTemplate] = useState(false);

  const handleCopyTemplate = () => {
    if (suggestedTemplate) {
      navigator.clipboard.writeText(suggestedTemplate);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggestions Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Suggestions to Improve Your Prompt</h3>
        </div>

        {/* Mandatory Specification Disclaimer */}
        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          Writing suggestions are generated using general prompt-engineering guidelines. The numerical score is predicted independently by the trained Deep Learning model.
        </p>

        {/* Suggestions List */}
        <div className="space-y-3">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-sm text-slate-200"
            >
              <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-300 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="leading-snug">{item}</p>
            </div>
          ))}
        </div>

        {/* Structural Indicators Checklist */}
        {analysis && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Structural Elements Detected
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                Breadth: {analysis.structural_breadth}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_task_instruction ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_task_instruction ? 'text-slate-200' : 'text-slate-500'}>
                  Explicit Task
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_audience ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_audience ? 'text-slate-200' : 'text-slate-500'}>
                  Target Audience
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_format_specification ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_format_specification ? 'text-slate-200' : 'text-slate-500'}>
                  Output Format
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_role_or_context ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_role_or_context ? 'text-slate-200' : 'text-slate-500'}>
                  Role / Context
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_constraints ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_constraints ? 'text-slate-200' : 'text-slate-500'}>
                  Scope Constraints
                </span>
              </div>

              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/60">
                {analysis.has_examples_request ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <X className="w-4 h-4 text-slate-500" />
                )}
                <span className={analysis.has_examples_request ? 'text-slate-200' : 'text-slate-500'}>
                  Examples Request
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic mt-3">
              Note: Surface checklist is rule-based and does NOT represent sub-rubric regression scores from the BiLSTM network.
            </p>
          </div>
        )}
      </div>

      {/* Suggested Rewrite Template Helper */}
      {suggestedTemplate && (
        <div className="rounded-2xl border border-indigo-900/50 bg-indigo-950/20 p-6 shadow-card-dark">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-bold text-indigo-200">
                Suggested rewrite template — review and customize before using
              </h4>
            </div>
            <button
              onClick={handleCopyTemplate}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-900/40 hover:bg-indigo-900/70 text-indigo-200 border border-indigo-800/60 transition-colors"
            >
              {copiedTemplate ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTemplate ? 'Copied' : 'Copy Template'}</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 mb-3">
            Drafted by local heuristic helper to demonstrate structural scaffolding. Not generated by BiLSTM (which predicts scores only).
          </p>

          <pre className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {suggestedTemplate}
          </pre>

          <div className="mt-4 flex flex-wrap gap-3">
            {onApplyTemplate && (
              <button
                onClick={() => onApplyTemplate(suggestedTemplate)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand-600 hover:bg-brand-500 text-white transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replace in Editor</span>
              </button>
            )}
            {onSendToImprove && (
              <button
                onClick={() => onSendToImprove(suggestedTemplate)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-900/50 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 transition-colors"
              >
                <span>Open in Improvement Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
