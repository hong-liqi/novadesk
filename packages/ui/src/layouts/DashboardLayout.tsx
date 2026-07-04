'use client';

import type { ReactNode } from 'react';
import { Surface } from '../components/Surface';

export interface DashboardLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

export function DashboardLayout({ sidebar, header, children }: DashboardLayoutProps) {
  return (
    <div className="ui-dashboard-layout">
      <aside className="ui-dashboard-layout__sidebar">{sidebar}</aside>
      <div className="ui-dashboard-layout__main">
        <header className="ui-dashboard-layout__header">{header}</header>
        <main className="ui-dashboard-layout__content">
          <Surface padding="lg">{children}</Surface>
        </main>
      </div>
    </div>
  );
}
