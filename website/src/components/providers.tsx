'use client';

import { ThemeProvider, ThemeScript } from '@portfolio/ui';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultMode="dark">
      <ThemeScript defaultMode="dark" />
      {children}
    </ThemeProvider>
  );
}
