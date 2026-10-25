import React from 'react';
import { PageId } from '../types/api';
import {
  Sparkles,
  Cpu,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  SlidersHorizontal,
  Layers,
  BarChart2,
  Database,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-16 text-center">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs font-semibold text-brand-300 shadow-glow-violet">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Trained BiLSTM Deep Learning Model • PELS Dataset</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Stop Guessing.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Start Writing Better Prompts.
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Evaluate your AI prompts using a Deep Learning model trained to recognize patterns associated with prompt quality.
          </p>

          {/* Call-to-actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('evaluator')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:via-indigo-500 hover:to-cyan-400 shadow-glow-violet hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              <span>Evaluate Your Prompt</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('explained')}
              className="w-full sm:w-auto px-7 py-4 rounded-xl font-semibold text-sm sm:text-base text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-brand-400" />
              <span>Explore the Model</span>
            </button>
          </div>

          {/* Abstract Neural Network Processing Illustration */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Cpu className="w-3.5 h-3.5" />
                  BiLSTM Neural Processing Architecture
                </span>
                <span>Seq Length: 120 Tokens</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-brand-400">01. INGESTION</div>
                  <div className="text-sm font-bold text-white">Prompt String</div>
                  <div className="text-xs text-slate-400">Raw text tokenized to integer sequences</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-indigo-400">02. RECURRENT ENCODING</div>
                  <div className="text-sm font-bold text-white">Bidirectional LSTM</div>
                  <div className="text-xs text-slate-400">Forward + Backward sequential context</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-mono text-cyan-400">03. REGRESSION</div>
                  <div className="text-sm font-bold text-white">Continuous Score</div>
                  <div className="text-xs text-slate-400">Observed 1.0–9.35 quality scale</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Engineered for Prompt Literacy & Evaluation
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Combining real neural network regression with transparent, actionable prompt engineering heuristics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-brand-500/40 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">AI-Powered Prompt Scoring</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Evaluate prompt quality using a trained Bidirectional LSTM model with embedded vectorization, capturing contextual cues across word sequences.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-indigo-500/40 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Actionable Writing Tips</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Get transparent, rule-based suggestions to make prompts more specific and structured — without fabricating sub-rubric regression scores.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-cyan-500/40 transition-all duration-200 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Before & After Comparison</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Compare the predicted scores of original and revised prompts side-by-side to objectively measure prompt improvement.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works (Horizontal Three-Step Illustration) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Workflow Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            How PromptIQ Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm">
              1
            </div>
            <h4 className="text-base font-bold text-white">Write or paste your prompt</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Input any natural language prompt into the evaluator or test one of the baseline samples.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-brand-400 font-mono font-bold flex items-center justify-center text-sm">
              2
            </div>
            <h4 className="text-base font-bold text-white">The BiLSTM model processes and scores it</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The neural network executes forward and backward recurrent passes to predict a continuous quality rating.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-emerald-400 font-mono font-bold flex items-center justify-center text-sm">
              3
            </div>
            <h4 className="text-base font-bold text-white">Review the score, improve, & re-evaluate</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Study actionable recommendations, refine your text in the workspace, and verify numerical gains.
            </p>
          </div>
        </div>
      </section>

      {/* Model Experimental Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950 p-8 sm:p-12 shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Verified Experimental Results
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Trained BiLSTM Benchmark Highlights
              </h2>
            </div>
            <div className="text-xs text-slate-400 max-w-sm">
              Recorded experimental test metrics on held-out PELS test data, rather than performance guarantees on arbitrary inputs.
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs text-slate-400">Architecture</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">BiLSTM</div>
              <div className="text-[11px] text-slate-500 mt-1">32 units/dir (64 total)</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs text-slate-400">Unique Records</div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">1,665</div>
              <div className="text-[11px] text-slate-500 mt-1">AIKosh PELS Dataset</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs text-slate-400">Test MAE</div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1">
                0.6584
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Lowest error among all models</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <div className="text-xs text-slate-400">Test R² (Goodness of Fit)</div>
              <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono mt-1">
                0.8051
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Regression R² metric (not accuracy)</div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1.5 transition-colors"
            >
              <span>View full model comparison table and research analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
