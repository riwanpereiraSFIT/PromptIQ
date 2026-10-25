import React, { useState, useEffect } from 'react';
import { PageId, MetricsResponse, ModelComparisonRecord } from '../types/api';
import { apiService } from '../services/api';
import { ModelChart } from '../components/ModelChart';
import {
  BarChart3,
  Award,
  Database,
  PieChart as PieIcon,
  HelpCircle,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AnalyticsProps {
  onNavigate: (page: PageId) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({ onNavigate }) => {
  const [metricsData, setMetricsData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Fallback fixed records if backend is momentarily unreachable
  const defaultRecords: ModelComparisonRecord[] = [
    { model: 'BiLSTM', mae: 0.6584, mse: 0.8712, rmse: 0.9334, r2: 0.8051, rank_by_mae: 1 },
    { model: 'SimpleRNN', mae: 1.5280, mse: 3.7120, rmse: 1.9266, r2: 0.1695, rank_by_mae: 2 },
    { model: 'Baseline (Mean)', mae: 1.6293, mse: 4.4701, rmse: 2.1143, r2: -0.0001, rank_by_mae: 3 },
    { model: 'LSTM', mae: 1.6532, mse: 4.7000, rmse: 2.1680, r2: -0.0516, rank_by_mae: 4 },
    { model: 'GRU', mae: 1.8506, mse: 6.1847, rmse: 2.4869, r2: -0.3837, rank_by_mae: 5 },
  ];

  useEffect(() => {
    apiService
      .getMetrics()
      .then((data) => setMetricsData(data))
      .catch(() => {
        // Fallback to static verified experiment numbers
        setMetricsData({
          records: defaultRecords,
          best_model: 'BiLSTM',
          mae_reduction_vs_baseline_pct: 59.59,
          regression_notes:
            'Recorded regression metrics on the held-out test split (250 samples). R² represents the coefficient of determination (goodness-of-fit), NOT classification accuracy.',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const records = metricsData?.records || defaultRecords;

  // Dataset split donut chart data
  const splitData = [
    { name: 'Training Set (70%)', value: 1165, color: '#8b5cf6' },
    { name: 'Validation Set (15%)', value: 250, color: '#06b6d4' },
    { name: 'Held-out Test Set (15%)', value: 250, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Empirical Results
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
            Held-out Test Set (n = 250)
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          Model Performance & Research Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Recorded experimental evaluation results comparing Bidirectional LSTM against recurrent baselines on the PELS dataset.
        </p>
      </div>

      {/* Top 4 Metric Cards for BiLSTM */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl border border-brand-800/50 bg-gradient-to-br from-brand-950/40 to-slate-900 shadow-glow-violet space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-300 font-semibold uppercase tracking-wider">
            <span>Test MAE</span>
            <span className="px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-200 text-[10px]">Rank #1</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">0.6584</div>
          <p className="text-[11px] text-slate-400">
            Mean Absolute Error • ~59.6% reduction over mean baseline (1.6293)
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Test MSE
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">0.8712</div>
          <p className="text-[11px] text-slate-400">
            Mean Squared Error • Lowest variance penalty across all architectures
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-2">
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Test RMSE
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">0.9334</div>
          <p className="text-[11px] text-slate-400">
            Root Mean Squared Error • Expressed directly in continuous score units
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-cyan-800/40 bg-gradient-to-br from-cyan-950/30 to-slate-900 space-y-2">
          <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold uppercase tracking-wider">
            <span>Test R² (Fit)</span>
            <span className="text-[10px] text-cyan-400">Goodness-of-Fit</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-cyan-300 font-mono">0.8051</div>
          <p className="text-[11px] text-slate-400">
            Coefficient of determination. Regression metric (NOT classification accuracy).
          </p>
        </div>
      </div>

      {/* Interactive Chart Component */}
      <ModelChart records={records} />

      {/* Model Comparison Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-400" />
            <h3 className="text-lg font-bold text-white">Official Model Comparison Benchmark</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Sorted by lowest MAE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-xs uppercase">
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4 text-right">MAE (Lower is Better)</th>
                <th className="py-3 px-4 text-right">MSE</th>
                <th className="py-3 px-4 text-right">RMSE</th>
                <th className="py-3 px-4 text-right">R² (Goodness of Fit)</th>
                <th className="py-3 px-4 text-center">Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {records.map((row, idx) => {
                const isBiLSTM = row.model.toLowerCase().includes('bilstm');
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isBiLSTM
                        ? 'bg-brand-950/30 text-white font-semibold border-l-4 border-brand-500'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans flex items-center gap-2">
                      <span>{row.model}</span>
                      {isBiLSTM && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 font-sans">
                          Best Model (Selected)
                        </span>
                      )}
                    </td>
                    <td className={`py-3.5 px-4 text-right ${isBiLSTM ? 'text-emerald-400 font-bold' : ''}`}>
                      {row.mae.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{row.mse.toFixed(4)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-400">{row.rmse.toFixed(4)}</td>
                    <td className={`py-3.5 px-4 text-right ${row.r2 < 0 ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {row.r2.toFixed(4)}
                    </td>
                    <td className="py-3.5 px-4 text-center font-sans">
                      {isBiLSTM ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                        </span>
                      ) : row.r2 < 0 ? (
                        <span className="text-slate-500 text-xs">Inferior to Mean</span>
                      ) : (
                        <span className="text-slate-400 text-xs">Evaluated</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Breakdown & Donut Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Dataset Specification & Partitioning</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Dataset Name</span>
              <p className="font-bold text-white mt-0.5">PELS (Prompt Engineering Literacy Scale)</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Repository Source</span>
              <p className="font-bold text-white mt-0.5">AIKosh</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Raw File & Sheet</span>
              <p className="font-mono text-slate-300 mt-0.5 truncate">
                PELS_Final_Justification.xlsx (PELS_Dataset)
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400">Target Continuous Feature</span>
              <p className="font-mono text-cyan-300 mt-0.5">Final\nScore (1.0–9.35)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Cleaning & Deduplication Statistics
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Original Rows</div>
                <div className="text-base font-bold text-slate-200">1,674</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Duplicate Prompts</div>
                <div className="text-base font-bold text-amber-400">9 Removed</div>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Unique Modeling Rows</div>
                <div className="text-base font-bold text-emerald-400">1,665</div>
              </div>
            </div>
          </div>
        </div>

        {/* Donut Chart: Train / Val / Test Split */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-card-dark space-y-4">
          <div className="flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Dataset Partitioning</h3>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={splitData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {splitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="p-2 rounded-lg bg-slate-950 border border-slate-700 text-xs">
                          <strong className="text-white">{d.name}</strong>: {d.value} samples
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs">
            {splitData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}</span>
                </div>
                <span className="font-mono font-bold">{item.value} samples</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scientific Notes Alert */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Scientific Regression Notes for Viva & Project Reporting</span>
        </div>
        <p>
          PromptIQ evaluates prompt quality as a <strong>continuous numerical target</strong> (the weighted 1.0–9.35 final quality score). Therefore, regression evaluation metrics (MAE, MSE, RMSE, R²) are the only mathematically valid metrics. Classification accuracy, confusion matrices, precision, and recall are inapplicable.
        </p>
        <p className="text-slate-400 italic">
          <strong>Important:</strong> The R² value of 0.8051 represents the coefficient of determination (explaining 80.51% of variance relative to the mean prediction baseline). It must never be described as "80.51% classification accuracy".
        </p>
      </div>
    </div>
  );
};
