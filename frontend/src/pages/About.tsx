import React from 'react';
import { PageId } from '../types/api';
import {
  GraduationCap,
  Users,
  BookOpen,
  FileText,
  Lightbulb,
  ExternalLink,
  Award,
  Sparkles,
  Compass,
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: PageId) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-400">
            Academic Project Overview
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-brand-500/10 text-brand-300 border border-brand-500/20">
            SFIT Mumbai
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white mt-1">
          About PromptIQ
        </h1>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
          Deep Learning-Based Prompt Quality Assessment and Improvement System developed for the Deep Learning Mini Project curriculum.
        </p>
      </div>

      {/* Institutional & Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Project Meta */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Project Identity & Institution</h2>
          </div>

          <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div>
              <span className="text-slate-400 text-xs block">Full Academic Title:</span>
              <strong className="text-white text-base">
                Deep Learning-Based Prompt Quality Assessment and Improvement System
              </strong>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Institution:</span>
              <span className="text-slate-200">
                St. Francis Institute of Technology (SFIT), Mount Poinsur, Borivali (W), Mumbai
              </span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Academic Course:</span>
              <span className="text-slate-200">Deep Learning Mini Project</span>
            </div>

            <div>
              <span className="text-slate-400 text-xs block">Primary Academic Domain:</span>
              <span className="text-cyan-300 font-mono text-xs">
                Artificial Intelligence → Natural Language Processing → Deep Learning
              </span>
            </div>

            <div className="pt-2">
              <span className="text-slate-400 text-xs block">Project Guide:</span>
              <span className="font-bold text-white text-sm">Prof. Joanne Gomes</span>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Project Engineering Team</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-cyan-400">Roll No. 54</span>
              <div className="text-base font-bold text-white">Kennan</div>
              <p className="text-[11px] text-slate-400">Team Member</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-cyan-400">Roll No. 55</span>
              <div className="text-base font-bold text-white">Neel</div>
              <p className="text-[11px] text-slate-400">Team Member</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-cyan-400">Roll No. 56</span>
              <div className="text-base font-bold text-white">Noslen</div>
              <p className="text-[11px] text-slate-400">Team Member</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-cyan-400">Roll No. 63</span>
              <div className="text-base font-bold text-white">Riwan</div>
              <p className="text-[11px] text-slate-400">Team Member</p>
            </div>
          </div>

          {/* SDG Mapping */}
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>SDG 4 Alignment (Quality Education):</strong> Enhances AI literacy among students and researchers by providing instant, objective feedback on prompt composition.
            </div>
          </div>
        </div>
      </div>

      {/* Research Background: Literature Papers */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-6 shadow-card-dark">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Research Background & Foundation Papers</h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
          The theoretical framework of PromptIQ is grounded in established peer-reviewed literature bridging prompt engineering taxonomies with neural automated essay scoring (AES).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paper 1 */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                Paper 1 • Taxonomy & Design
              </span>
              <span className="text-xs text-slate-400">2024</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications
            </h3>
            <p className="text-xs text-slate-400">
              Sahoo et al., 2024 • arXiv:2402.07927
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              <strong>Theoretical Role:</strong> Establishes the taxonomy of structural prompt elements (role specification, task verbs, constraints, and output formats) that distinguish effective prompts from vague instructions.
            </p>
          </div>

          {/* Paper 2 */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/20">
                Paper 2 • Recurrent Regression
              </span>
              <span className="text-xs text-slate-400">EMNLP 2016</span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              A Neural Approach to Automated Essay Scoring
            </h3>
            <p className="text-xs text-slate-400">
              Taghipour & Ng, 2016 • EMNLP 2016 • DOI: 10.18653/v1/D16-1193
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              <strong>Theoretical Role:</strong> Pioneers recurrent neural networks (LSTMs) for automated text evaluation without manual feature extraction, proving that BiLSTM architectures can capture sequential essay and prompt quality.
            </p>
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 space-y-4 shadow-card-dark">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Future Scope & Research Trajectory</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white">Multi-Task Sub-Rubric Scoring</h4>
            <p className="text-slate-400 leading-relaxed">
              Extend the single-head regression layer to a multi-output head predicting individual PELS dimensions (C1–C6: Foundations, Design, Output, Domain, Ethics, Metacognition).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white">Transformer Attention Explainability</h4>
            <p className="text-slate-400 leading-relaxed">
              Incorporate attention weight visualizers or Integrated Gradients to highlight exactly which tokens contributed most positively or negatively to the score.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-white">Cross-Domain Dataset Scaling</h4>
            <p className="text-slate-400 leading-relaxed">
              Expand the training dataset beyond 1,665 records to incorporate multi-lingual prompts and code-generation instruction sets.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
