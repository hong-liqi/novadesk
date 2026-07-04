export const colors = {
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  emerald: {
    50: '#ecfdf5',
    500: '#10b981',
    600: '#059669',
  },
  amber: {
    50: '#fffbeb',
    500: '#f59e0b',
    600: '#d97706',
  },
  rose: {
    50: '#fff1f2',
    500: '#f43f5e',
    600: '#e11d48',
  },
} as const;

export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
} as const;

export const typography = {
  fontFamily: {
    sans: '"Space Grotesk", "Inter", system-ui, sans-serif',
    display: '"Space Grotesk", "Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "SFMono-Regular", ui-monospace, monospace',
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
} as const;

export const radii = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.06)',
  md: '0 8px 24px rgba(15, 23, 42, 0.12)',
  lg: '0 16px 40px rgba(15, 23, 42, 0.16)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  overlay: 1200,
  modal: 1300,
  toast: 1400,
} as const;

export const motion = {
  duration: {
    fast: '120ms',
    normal: '180ms',
    slow: '240ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasize: 'cubic-bezier(0.2, 0, 0, 1.2)',
  },
} as const;

export const designTokens = {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  zIndex,
  motion,
} as const;

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: {
    background: colors.slate[50],
    surface: '#ffffff',
    foreground: colors.slate[900],
    muted: colors.slate[500],
    border: colors.slate[200],
    accent: colors.blue[600],
    accentMuted: colors.blue[50],
    success: colors.emerald[600],
    warning: colors.amber[600],
    danger: colors.rose[600],
  },
  dark: {
    background: colors.slate[900],
    surface: colors.slate[800],
    foreground: colors.slate[50],
    muted: colors.slate[400],
    border: colors.slate[700],
    accent: colors.blue[400],
    accentMuted: colors.blue[900],
    success: colors.emerald[500],
    warning: colors.amber[500],
    danger: colors.rose[500],
  },
} as const;

export const tokens = {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  zIndex,
  motion,
} as const;
