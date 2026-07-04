'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { themes, type ThemeMode } from '../tokens';

export interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  tokens: (typeof themes)[ThemeMode];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultMode = 'light',
  storageKey = 'portfolio-theme-mode',
}: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedMode = window.localStorage.getItem(storageKey) as ThemeMode | null;
    if (storedMode === 'light' || storedMode === 'dark') {
      setMode(storedMode);
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(storageKey, mode);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode, storageKey]);

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

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

export interface ThemeScriptProps {
  storageKey?: string;
  defaultMode?: ThemeMode;
}

export function ThemeScript({
  storageKey = 'portfolio-theme-mode',
  defaultMode = 'light',
}: ThemeScriptProps) {
  const script = `
    (function() {
      try {
        var key = ${JSON.stringify(storageKey)};
        var storedMode = window.localStorage.getItem(key);
        var mode = storedMode === 'dark' || storedMode === 'light' ? storedMode : ${JSON.stringify(
          defaultMode,
        )};
        document.documentElement.dataset.theme = mode;
        document.documentElement.style.colorScheme = mode;
      } catch (error) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
