import { ProtectedRoute } from '@/shared/components/protected-route';

export default function AuthenticatedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoute>
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 p-6">{children}</div>
    </ProtectedRoute>
  );
}
