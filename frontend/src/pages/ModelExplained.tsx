import React from 'react';
import { PageId } from '../types/api';
import { ArchitectureDiagram } from '../components/ArchitectureDiagram';
import {
  BookOpen,
  Cpu,
  Brain,
  HelpCircle,
  CheckCircle2,
  AlertOctagon,
  Workflow,
  Sparkles,
  GitMerge,
  ArrowRight,
} from 'lucide-react';

interface ModelExplainedProps {
  onNavigate: (page: PageId) => void;
}

export const ModelExplained: React.FC<ModelExplainedProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Technical Documentation
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
            Deep Learning Architecture
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">Model Architecture & Theory</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Comprehensive explanation of the Bidirectional Long Short-Term Memory (BiLSTM) neural network designed for automated prompt quality scoring.
        </p>
      </div>

      {/* Section 1: What is PromptIQ? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">1. What is PromptIQ?</h2>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          In contemporary generative AI ecosystems, the relevance, accuracy, and utility of model outputs depend directly on the structural quality of user prompts. Vague, under-specified prompts frequently induce hallucinations, irrelevant answers, or incomplete reasoning.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          <strong>PromptIQ</strong> addresses this challenge through automated machine evaluation. Rather than relying on subjective human guesswork or expensive closed-source API calls, PromptIQ hosts a trained deep recurrent neural network capable of predicting a numerical prompt quality score directly from raw input strings.
        </p>
      </section>

      {/* Section 2: How Prompt Evaluation Works (Interactive Diagram) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Workflow className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">2. How Prompt Evaluation Works</h2>
        </div>
        <p className="text-sm text-slate-400 max-w-2xl">
          Below is the verified tensor dataflow implemented in TensorFlow/Keras and deployed on the FastAPI inference backend:
        </p>
        <ArchitectureDiagram />
      </section>

      {/* Section 3: Why BiLSTM? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">3. Why Bidirectional LSTM?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Sequential Memory & Gating
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard feedforward networks discard word order. LSTMs solve the vanishing gradient problem through input, forget, and output gating mechanisms, maintaining cell states over extended prompt sequences (up to 120 tokens).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              Dual-Directional Context
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Prompts frequently contain contextual dependencies where the significance of a token is only revealed by subsequent tokens (e.g., "Act as a..." followed 30 tokens later by "...for beginner students"). BiLSTM runs forward and backward simultaneously, merging both contexts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400" />
              Superior Empirical Performance
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              In benchmark tests across SimpleRNN, unidirection LSTM, and GRU, BiLSTM achieved the lowest test Mean Absolute Error (MAE: 0.6584) and highest coefficient of determination (R²: 0.8051).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Compact Efficiency
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              With 344,897 parameters and a 4.2 MB archive footprint, the BiLSTM runs with low latency CPU inference, making it practical for real-time interactive web deployment without dedicated GPU hosting.
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Which Features Are Used? */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">4. Which Features Are Used by the Model?</h2>
        </div>

        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-300 space-y-3 leading-relaxed">
          <p>
            The model receives strictly <strong>one input feature</strong>: the raw string of the prompt text.
          </p>
          <p>
            It does not receive hand-crafted manual features or separate sub-rubric ratings. The neural network automatically learns latent representations of syntactic structure, token co-occurrence, and semantic indicators associated with quality scores.
          </p>
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200">
            <strong>Crucial Scientific Distinction:</strong> While prompt attributes like clarity, audience targeting, and formatting constraints correlate with higher scores, these are <em>learned patterns in the weights</em>, NOT separately predicted or calculated rubric sub-scores. The BiLSTM outputs a single holistic regression score.
          </div>
        </div>
      </section>

      {/* Section 5: Training Process */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <GitMerge className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">5. Dataset & Training Pipeline</h2>
        </div>

        <ol className="relative border-l border-slate-800 ml-4 space-y-6 text-sm text-slate-300">
          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              1
            </span>
            <h4 className="font-bold text-white">Dataset Ingestion & Exploration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Loaded the Prompt Engineering Literacy Scale (PELS) dataset from AIKosh (Excel file: <code>PELS_Final_Justification.xlsx</code>, sheet <code>PELS_Dataset</code>) containing 1,674 raw entries with target continuous column <code>Final\nScore</code>.
            </p>
          </li>

          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              2
            </span>
            <h4 className="font-bold text-white">Deduplication to Prevent Data Leakage</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Identified and eliminated duplicate prompt texts, yielding 1,665 unique prompt entries to guarantee zero text leakage across dataset partitions.
            </p>
          </li>

          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              3
            </span>
            <h4 className="font-bold text-white">Deterministic Train / Val / Test Partitioning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Partitioned using seed 42 into 70% Training (1,165 samples), 15% Validation (250 samples), and 15% held-out Test (250 samples).
            </p>
          </li>

          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              4
            </span>
            <h4 className="font-bold text-white">Embedded TextVectorization Layer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adapted a vocabulary of 5,000 tokens strictly on the training set, configured for a maximum sequence length of 120 integer tokens.
            </p>
          </li>

          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              5
            </span>
            <h4 className="font-bold text-white">Comparative Training with Early Stopping</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trained BiLSTM, SimpleRNN, LSTM, and GRU networks with Adam optimizer (learning rate 0.001), batch size 16, maximum 35 epochs, and early stopping patience of 5 on validation loss.
            </p>
          </li>

          <li className="ml-6 space-y-1">
            <span className="absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-400">
              6
            </span>
            <h4 className="font-bold text-white">Model Selection & Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              BiLSTM proved superior with test MAE of 0.6584 and was serialized to <code>best_pels_bilstm_model.keras</code> for web deployment.
            </p>
          </li>
        </ol>
      </section>

      {/* Section 6: Limitations */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">6. Academic Limitations & Boundary Conditions</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            For rigorous academic reporting, the following constraints must be noted:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400">
            <li>
              <strong>Dataset Sample Size:</strong> The training dataset consists of 1,165 records. Performance may vary on highly specialized domain jargon not represented in the training vocabulary.
            </li>
            <li>
              <strong>Not a Generative LLM:</strong> The system does not generate responses, execute code, or probe commercial APIs like ChatGPT. It is strictly an evaluation regressor.
            </li>
            <li>
              <strong>No Sub-Rubric Breakdown:</strong> The network predicts a single holistic continuous score. It does not independently predict the six PELS sub-rubrics (C1–C6).
            </li>
            <li>
              <strong>Statistical Estimate:</strong> Numerical predictions are mathematical approximations from trained weights, not certified human expert evaluations.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
