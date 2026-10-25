import React, { useState, useEffect } from 'react';
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

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Shared state between Evaluator and Improvement Workspace
  const [workspaceInitialPrompt, setWorkspaceInitialPrompt] = useState<string>(
    'Explain machine learning.'
  );
  const [workspaceInitialScore, setWorkspaceInitialScore] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Initial backend health probe
    apiService
      .getHealth()
      .then((data) => setHealth(data))
      .catch(() => {
        setHealth({
          status: 'disconnected',
          model_loaded: false,
          model_identifier: 'BiLSTM',
          model_path: 'backend/models/best_pels_bilstm_model.keras',
          detail: 'Backend server unreachable. Start FastAPI at http://127.0.0.1:8000.',
        });
      });
  }, []);

  const handleSendToWorkspace = (prompt: string, score: number) => {
    setWorkspaceInitialPrompt(prompt);
    setWorkspaceInitialScore(score);
    setCurrentPage('improve');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'evaluator':
        return (
          <Evaluator
            onNavigate={setCurrentPage}
            onSendToWorkspace={handleSendToWorkspace}
          />
        );
      case 'improve':
        return (
          <Improve
            initialPrompt={workspaceInitialPrompt}
            initialScore={workspaceInitialScore}
            onNavigate={setCurrentPage}
          />
        );
      case 'explained':
        return <ModelExplained onNavigate={setCurrentPage} />;
      case 'analytics':
        return <Analytics onNavigate={setCurrentPage} />;
      case 'about':
        return <About onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 transition-colors duration-200">
      <Navbar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        health={health}
      />

      <main className="flex-1">{renderPage()}</main>

      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};

export default App;
