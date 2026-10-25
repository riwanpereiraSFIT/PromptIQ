import React, { useState } from 'react';
import {
  Sparkles,
  Trash2,
  Copy,
  Check,
  Send,
  Loader2,
  Bookmark,
  Keyboard,
} from 'lucide-react';

interface PromptEditorProps {
  value: string;
  onChange: (val: string) => void;
  onEvaluate: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  value,
  onChange,
  onEvaluate,
  isLoading,
  disabled = false,
}) => {
  const [copied, setCopied] = useState(false);

  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  const samplePrompts = [
    {
      level: 'Basic',
      text: 'Explain machine learning.',
      color: 'border-slate-700 bg-slate-900/60 hover:border-slate-500',
    },
    {
      level: 'Intermediate',
      text: 'Explain machine learning to beginners with examples.',
      color: 'border-indigo-800/60 bg-indigo-950/30 hover:border-indigo-600',
    },
    {
      level: 'Detailed',
      text: 'Act as a machine learning instructor. Explain supervised and unsupervised learning to first-year engineering students using simple language, two real-world examples, and a comparison table.',
      color: 'border-brand-800/60 bg-brand-950/30 hover:border-brand-600',
    },
  ];

  const handleCopy = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter or Cmd+Enter to evaluate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && value.trim()) {
        onEvaluate();
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-bold text-white uppercase tracking-wider">
            Prompt Input Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          {value && (
            <>
              <button
                type="button"
                onClick={handleCopy}
                disabled={disabled}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy prompt text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => onChange('')}
                disabled={disabled || isLoading}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/60 hover:bg-red-950/50 hover:text-red-300 text-slate-400 border border-slate-700/50 transition-colors"
                title="Clear editor"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || isLoading}
          placeholder="Enter or paste your AI prompt here (e.g. 'Act as a software architect. Explain how Redis caching works to junior developers...')..."
          className="w-full rounded-xl bg-slate-950/80 border border-slate-800 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 p-4 text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-all resize-y font-sans leading-relaxed"
        />

        {/* Counter and shortcut info pill */}
        <div className="flex items-center justify-between mt-2 px-1 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-mono">
              <strong className="text-slate-200">{wordCount}</strong> words
            </span>
            <span>•</span>
            <span className="font-mono">
              <strong className="text-slate-200">{charCount}</strong> characters
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500">
            <Keyboard className="w-3 h-3" />
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
              Ctrl + Enter
            </kbd>
            <span>to evaluate</span>
          </div>
        </div>
      </div>

      {/* Clickable Sample Prompts (Strictly samples, evaluated by real model) */}
      <div className="pt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2.5">
          <Bookmark className="w-3.5 h-3.5 text-cyan-400" />
          <span>Click a sample to test the real model:</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {samplePrompts.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(sample.text)}
              disabled={disabled || isLoading}
              className={`text-left p-3 rounded-xl border text-xs transition-all ${sample.color} group hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-200 group-hover:text-white">
                  {sample.level} Sample
                </span>
                <span className="text-[10px] text-slate-400">Insert →</span>
              </div>
              <p className="text-slate-400 line-clamp-2 leading-relaxed">
                "{sample.text}"
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Evaluate Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onEvaluate}
          disabled={disabled || isLoading || !value.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:via-indigo-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-violet transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing Prompt with BiLSTM Network...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Evaluate Prompt Quality</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
