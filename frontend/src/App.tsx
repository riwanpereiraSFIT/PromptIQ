import React, { useState, useEffect, useCallback } from 'react';
import { PageId, HealthResponse } from './types/api';
import { apiService } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Evaluator } from './pages/Evaluator';
import { Improve } from './pages/Improve';
import { ModelExplained } from './pages/ModelExplained';
import { Analytics } from './pages/Analytics';
import { About } from './pages/About';

const pathToPage = (pathname: string): PageId => {
  const clean = pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
  if (clean === 'evaluator') return 'evaluator';
  if (clean === 'improve' || clean === 'workspace') return 'improve';
  if (clean === 'explained' || clean === 'model-architecture' || clean === 'architecture') return 'explained';
  if (clean === 'analytics' || clean === 'metrics') return 'analytics';
  if (clean === 'about') return 'about';
  return 'home';
};

const pageToPath = (page: PageId): string => {
  if (page === 'home') return '/';
  return `/${page}`;
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>(() =>
    pathToPage(window.location.pathname)
  );
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Shared state between Evaluator and Improvement Workspace
  const [workspaceInitialPrompt, setWorkspaceInitialPrompt] = useState<string>(
    'Explain machine learning.'
  );
  const [workspaceInitialScore, setWorkspaceInitialScore] = useState<number | undefined>(undefined);

  // Client-side router navigation handler
  const handleNavigate = useCallback((page: PageId) => {
    const targetPath = pageToPath(page);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(pathToPage(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Initial backend health probe via relative /api URL
    apiService
      .getHealth()
      .then((data) => setHealth(data))
      .catch(() => {
        setHealth({
          status: 'disconnected',
          model_loaded: false,
          model_identifier: 'BiLSTM',
          model_path: 'backend/models/best_pels_bilstm_model.keras',
          detail: 'Backend API unreachable. Please verify PromptIQ server is active.',
        });
      });
  }, []);

  const handleSendToWorkspace = (prompt: string, score: number) => {
    setWorkspaceInitialPrompt(prompt);
    setWorkspaceInitialScore(score);
    handleNavigate('improve');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'evaluator':
        return (
          <Evaluator
            onNavigate={handleNavigate}
            onSendToWorkspace={handleSendToWorkspace}
          />
        );
      case 'improve':
        return (
          <Improve
            initialPrompt={workspaceInitialPrompt}
            initialScore={workspaceInitialScore}
            onNavigate={handleNavigate}
          />
        );
      case 'explained':
        return <ModelExplained onNavigate={handleNavigate} />;
      case 'analytics':
        return <Analytics onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        health={health}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default App;
