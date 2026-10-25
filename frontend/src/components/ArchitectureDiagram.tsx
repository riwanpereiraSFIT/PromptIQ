import React, { useState } from 'react';
import {
  ArrowDown,
  Layers,
  Binary,
  Cpu,
  ShieldAlert,
  Hash,
  Activity,
  Sparkles,
  Info,
} from 'lucide-react';

interface ArchitectureNode {
  title: string;
  category: string;
  shape: string;
  params: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
}

export const ArchitectureDiagram: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const nodes: ArchitectureNode[] = [
    {
      title: 'Raw Input String',
      category: 'Input Layer',
      shape: '(batch_size, 1)',
      params: '0 parameters (String Tensor)',
      description: 'Accepts raw natural language prompt text directly from user without external tokenization.',
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      gradient: 'from-cyan-950/40 to-slate-900 border-cyan-800/40',
    },
    {
      title: 'TextVectorization',
      category: 'Keras Preprocessing Layer',
      shape: '(batch_size, 120)',
      params: 'Vocabulary: 5,000 adapted tokens',
      description: 'Standardizes case, strips punctuation, splits whitespace, and maps words to integer indices up to 120 sequence tokens. Embedded within saved model.',
      icon: <Binary className="w-5 h-5 text-indigo-400" />,
      gradient: 'from-indigo-950/40 to-slate-900 border-indigo-800/40',
    },
    {
      title: 'Embedding Layer',
      category: 'Dense Vector Representation',
      shape: '(batch_size, 120, 64)',
      params: '320,000 trainable weights (5000 × 64)',
      description: 'Projects discrete token integers into a continuous 64-dimensional geometric semantic vector space.',
      icon: <Layers className="w-5 h-5 text-brand-400" />,
      gradient: 'from-brand-950/40 to-slate-900 border-brand-800/40',
    },
    {
      title: 'Bidirectional LSTM',
      category: 'Recurrent Sequence Encoding',
      shape: '(batch_size, 64) [32 Fwd + 32 Bwd]',
      params: '24,832 weights (Forward & Backward LSTM cells)',
      description: 'Two LSTM streams process tokens from left-to-right and right-to-left simultaneously, learning syntactic dependencies and context.',
      icon: <Cpu className="w-5 h-5 text-violet-400" />,
      gradient: 'from-violet-950/50 to-slate-900 border-violet-700/50 shadow-glow-violet',
    },
    {
      title: 'Dropout Layer (rate = 0.3)',
      category: 'Regularization',
      shape: '(batch_size, 64)',
      params: '0 parameters (Stochastic zeroing during training)',
      description: 'Randomly sets 30% of unit activations to zero during training iterations to discourage co-adaptation and avoid overfitting.',
      icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
      gradient: 'from-amber-950/40 to-slate-900 border-amber-800/40',
    },
    {
      title: 'Dense Linear Output',
      category: 'Regression Head',
      shape: '(batch_size, 1)',
      params: '65 parameters (64 weights + 1 bias)',
      description: 'Single linear neuron computing the final continuous scalar quality score matching PELS scoring scale.',
      icon: <Hash className="w-5 h-5 text-emerald-400" />,
      gradient: 'from-emerald-950/40 to-slate-900 border-emerald-800/40',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                End-to-End Pipeline
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 font-mono">
                TensorFlow / Keras 3
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              BiLSTM Neural Network Dataflow Architecture
            </h3>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>Click any layer block to inspect tensor shapes & hyperparameters</span>
          </div>
        </div>

        {/* Diagram Flow */}
        <div className="flex flex-col items-center space-y-3 max-w-2xl mx-auto">
          {nodes.map((node, index) => {
            const isSelected = selectedNode === index;
            return (
              <React.Fragment key={index}>
                <div
                  onClick={() => setSelectedNode(isSelected ? null : index)}
                  className={`w-full p-4 rounded-xl border cursor-pointer transition-all duration-200 bg-gradient-to-r ${node.gradient} hover:scale-[1.02] ${
                    isSelected ? 'ring-2 ring-brand-400 border-brand-400 shadow-glow-violet' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                        {node.icon}
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          {node.category}
                        </div>
                        <h4 className="text-sm font-bold text-white">{node.title}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-xs font-semibold text-cyan-300">
                        {node.shape}
                      </div>
                      <div className="text-[11px] text-slate-400">{node.params}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed animate-fadeIn">
                      {node.description}
                    </div>
                  )}
                </div>

                {index < nodes.length - 1 && (
                  <div className="flex flex-col items-center py-0.5">
                    <ArrowDown className="w-4 h-4 text-slate-600 animate-pulse" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Total Summary Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Total Parameters</div>
            <div className="text-lg font-mono font-bold text-white">344,897</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Trainable Weights</div>
            <div className="text-lg font-mono font-bold text-brand-300">344,897</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Loss Objective</div>
            <div className="text-lg font-mono font-bold text-cyan-300">MSE</div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="text-xs text-slate-400">Optimization</div>
            <div className="text-lg font-mono font-bold text-emerald-400">Adam (1e-3)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
