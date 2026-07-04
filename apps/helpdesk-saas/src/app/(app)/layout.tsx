import { AppShell } from '@/widgets/app-shell/AppShell';
import { ProtectedRoute } from '@/shared/components/protected-route';

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
