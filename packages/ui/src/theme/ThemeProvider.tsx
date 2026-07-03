'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { themes, type ThemeMode } from '../tokens';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  tokens: (typeof themes)[ThemeMode];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggleMode: () => {
        setMode((current) => (current === 'light' ? 'dark' : 'light'));
      },
      tokens: themes[mode],
    }),
    [mode],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={mode} style={{ colorScheme: mode }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
