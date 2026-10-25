import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { ModelComparisonRecord } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import { ArrowDownRight, ArrowUpRight, Award, BarChart3, Info } from 'lucide-react';

interface ModelChartProps {
  records: ModelComparisonRecord[];
}

type MetricKey = 'mae' | 'mse' | 'rmse' | 'r2';

export const ModelChart: React.FC<ModelChartProps> = ({ records }) => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('mae');
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const metricConfigs: Record<
    MetricKey,
    { label: string; fullName: string; better: 'lower' | 'higher'; description: string }
  > = {
    mae: {
      label: 'MAE',
      fullName: 'Mean Absolute Error',
      better: 'lower',
      description: 'Average magnitude of residual errors. Lower values indicate closer numerical fidelity to true scores.',
    },
    mse: {
      label: 'MSE',
      fullName: 'Mean Squared Error',
      better: 'lower',
      description: 'Penalizes larger outliers more heavily by squaring errors. Lower is better.',
    },
    rmse: {
      label: 'RMSE',
      fullName: 'Root Mean Squared Error',
      better: 'lower',
      description: 'Square root of MSE, expressed directly in the same units as the 1.0–9.35 score. Lower is better.',
    },
    r2: {
      label: 'R²',
      fullName: 'Coefficient of Determination (Goodness-of-Fit)',
      better: 'higher',
      description: 'Proportion of variance explained by the model compared to a horizontal mean baseline. Higher is better (maximum 1.0). NOT classification accuracy.',
    },
  };

  const currentConfig = metricConfigs[activeMetric];

  // Prepare chart dataset
  const chartData = records.map((rec) => ({
    name: rec.model,
    value: Number(rec[activeMetric].toFixed(4)),
    isBiLSTM: rec.model.toLowerCase().includes('bilstm'),
  }));

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Comparative Model Benchmark</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Recorded experimental regression metrics on 250 held-out test prompts
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800">
          {(['mae', 'mse', 'rmse', 'r2'] as MetricKey[]).map((key) => {
            const isActive = activeMetric === key;
            return (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {/* Metric Context Pill */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <strong className="text-white">{currentConfig.fullName} ({currentConfig.label})</strong>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{currentConfig.description}</span>
        </div>

        <div className="flex items-center gap-1 font-semibold">
          {currentConfig.better === 'lower' ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
              <ArrowDownRight className="w-3.5 h-3.5" />
              Lower is Better
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              <ArrowUpRight className="w-3.5 h-3.5" />
              Higher is Better
            </span>
          )}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
            <XAxis
              dataKey="name"
              stroke={isLight ? '#475569' : '#64748b'}
              fontSize={12}
              tickLine={false}
              dy={8}
            />
            <YAxis
              stroke={isLight ? '#475569' : '#64748b'}
              fontSize={12}
              tickLine={false}
              dx={-5}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-700 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {data.name}
                        {data.isBiLSTM && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-brand-500/20 text-brand-300">
                            Selected
                          </span>
                        )}
                      </div>
                      <div className="text-slate-300 font-mono">
                        {currentConfig.label}: <strong className="text-cyan-300">{data.value}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {currentConfig.better === 'lower' ? 'Lower is superior' : 'Higher is superior'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isBiLSTM
                      ? '#8b5cf6' // Bright violet highlight for BiLSTM
                      : (isLight ? '#94a3b8' : '#334155') // Contrasting bar for each theme
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Highlight Box */}
      <div className="p-4 rounded-xl bg-brand-950/30 border border-brand-800/40 flex items-start gap-3 text-xs">
        <Award className="w-5 h-5 text-brand-400 flex-shrink-0 mt-0.5" />
        <div className="text-slate-300 leading-relaxed">
          <strong className="text-white">Empirical Finding:</strong> The Bidirectional LSTM (BiLSTM) model achieved the lowest recorded test MAE of <strong>0.6584</strong>, outperforming SimpleRNN, unidirection LSTM, GRU, and the Dummy Mean Regressor baseline (~59.6% error reduction over mean baseline).
        </div>
      </div>
    </div>
  );
};
