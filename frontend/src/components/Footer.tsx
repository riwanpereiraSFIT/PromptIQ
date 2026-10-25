import React from 'react';
import { PageId } from '../types/api';
import { Cpu, GraduationCap, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-base">PromptIQ</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deep Learning-Based Prompt Quality Assessment and Improvement System. Powered by a trained Bidirectional LSTM neural network.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/40 border border-cyan-800/50 text-[11px] text-cyan-300">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>SDG 4: Quality Education</span>
            </div>
          </div>

          {/* Academic Affiliation */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Academic Project
            </h4>
            <p className="text-xs text-slate-400">
              Department of Computer Engineering<br />
              <strong className="text-slate-300">St. Francis Institute of Technology</strong><br />
              Mumbai, India
            </p>
            <p className="text-xs text-slate-400">
              Course: <span className="text-slate-300">Deep Learning Mini Project</span><br />
              Project Guide: <span className="text-slate-300">Joanne Gomes</span>
            </p>
          </div>

          {/* Project Team */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Project Team
            </h4>
            <ul className="text-xs space-y-1 text-slate-400">
              <li>Roll No. 54 — <span className="text-slate-300">Kennan</span></li>
              <li>Roll No. 55 — <span className="text-slate-300">Neel</span></li>
              <li>Roll No. 56 — <span className="text-slate-300">Noslen</span></li>
              <li>Roll No. 63 — <span className="text-slate-300">Riwan</span></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="text-xs space-y-1.5">
              <li>
                <button
                  onClick={() => onNavigate('evaluator')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Prompt Evaluator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('improve')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Improve Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explained')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Model Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Research Metrics & Charts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Literature & Team Info
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Regression estimation system. Predictions reflect trained PELS dataset patterns (observed range 1.0–9.35). Not an expert human grading guarantee.
            </span>
          </p>
          <p>© {new Date().getFullYear()} PromptIQ. Built for college demonstration and research.</p>
        </div>
      </div>
    </footer>
  );
};
