import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'promptiq_theme';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getInitialTheme = (): Theme => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // Still allow theme switching if browser storage is unavailable.
  }
  return 'dark';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    // Apply to the document, not only the navbar: every page inherits the theme.
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
    document.documentElement.style.colorScheme = theme;
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#020617' : '#f8fafc');
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Storage may be blocked in private browsing; switching still works.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((previous) => previous === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
