'use client';

import { DashboardLayout } from '@novadesk/ui/client';
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <DashboardLayout sidebar={<Sidebar />} header={<Header />}>
      {children}
    </DashboardLayout>
  );
}
