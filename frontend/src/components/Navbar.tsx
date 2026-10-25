import React, { useState } from 'react';
import { PageId, HealthResponse } from '../types/api';
import { useTheme } from '../context/ThemeContext';
import {
  Sparkles,
  Cpu,
  SlidersHorizontal,
  BookOpen,
  BarChart3,
  Info,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  health: HealthResponse | null;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, health }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'evaluator', label: 'Evaluator', icon: <Cpu className="w-4 h-4" /> },
    { id: 'improve', label: 'Improve', icon: <SlidersHorizontal className="w-4 h-4" /> },
    { id: 'explained', label: 'Model Architecture', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (id: PageId) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 bg-slate-950/80 border-slate-800 text-slate-100 dark:bg-slate-950/85 dark:border-slate-800/80 light:bg-white/85 light:border-slate-200 light:text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow-violet transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cyan-400 transition-transform group-hover:rotate-12" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-indigo-200 to-cyan-300 dark:from-white dark:via-indigo-200 dark:to-cyan-300 bg-clip-text text-transparent">
                PromptIQ
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20">
                BiLSTM
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-400 dark:text-slate-400">
              Deep Learning Prompt Assessment
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Backend Status & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Health Status Pill */}
          <div
            title={health?.detail || (health?.model_loaded ? 'BiLSTM Model loaded' : 'Checking status...')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              health?.model_loaded
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/60'
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60'
            }`}
          >
            {health?.model_loaded ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden xl:inline">BiLSTM Online</span>
                <CheckCircle2 className="w-3.5 h-3.5 xl:hidden" />
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Model Standby</span>
                <AlertTriangle className="w-3.5 h-3.5" />
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-2">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Model Status:</span>
            <span className={health?.model_loaded ? 'text-emerald-400' : 'text-amber-400'}>
              {health?.model_loaded ? 'BiLSTM Loaded & Ready' : 'Model Pending'}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
