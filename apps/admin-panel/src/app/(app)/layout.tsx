import { AppShell } from '@/widgets/app-shell/AppShell';
import { AdminProtectedRoute } from '@/shared/components/admin-protected-route';

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AdminProtectedRoute>
      <AppShell>{children}</AppShell>
    </AdminProtectedRoute>
  );
}
