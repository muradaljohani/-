import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'light' | 'dim' | 'lights-out';

interface ThemeContextType {
  theme: ThemeMode;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('social_theme') as ThemeMode) || 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dim', 'lights-out', 'dark'); // cleanup
    
    if (theme === 'light') {
        root.classList.add('light');
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f7f9f9');
        root.style.setProperty('--text-primary', '#0f1419');
        root.style.setProperty('--text-secondary', '#536471');
        root.style.setProperty('--border-color', '#eff3f4');
    } else if (theme === 'dim') {
        root.classList.add('dark', 'dim');
        root.style.setProperty('--bg-primary', '#15202b');
        root.style.setProperty('--bg-secondary', '#1e2732');
        root.style.setProperty('--text-primary', '#ffffff');
        root.style.setProperty('--text-secondary', '#8b98a5');
        root.style.setProperty('--border-color', '#38444d');
    } else { // lights-out
        root.classList.add('dark', 'lights-out');
        root.style.setProperty('--bg-primary', '#000000');
        root.style.setProperty('--bg-secondary', '#16181c');
        root.style.setProperty('--text-primary', '#e7e9ea');
        root.style.setProperty('--text-secondary', '#71767b');
        root.style.setProperty('--border-color', '#2f3336');
    }
    
    localStorage.setItem('social_theme', theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dim';
      if (prev === 'dim') return 'lights-out';
      return 'light';
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};