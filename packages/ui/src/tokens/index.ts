export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    500: '#64748b',
    700: '#334155',
    900: '#0f172a',
  },
  success: '#16a34a',
  warning: '#ca8a04',
  danger: '#dc2626',
} as const;

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
} as const;

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, ui-monospace, monospace',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const radii = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px rgba(15, 23, 42, 0.08)',
  md: '0 4px 12px rgba(15, 23, 42, 0.12)',
} as const;

export const designTokens = {
  colors,
  spacing,
  typography,
  radii,
  shadows,
} as const;

export type ThemeMode = 'light' | 'dark';

export const themes = {
  light: {
    background: colors.neutral[50],
    foreground: colors.neutral[900],
    muted: colors.neutral[500],
    border: colors.neutral[200],
    accent: colors.primary[600],
  },
  dark: {
    background: colors.neutral[900],
    foreground: colors.neutral[50],
    muted: colors.neutral[500],
    border: colors.neutral[700],
    accent: colors.primary[500],
  },
} as const;
