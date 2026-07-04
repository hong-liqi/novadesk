'use client';

import { useAuth } from '@portfolio/auth/client';
import { Button, Input, Stack } from '@portfolio/ui';
import { AuthLayout } from '@portfolio/ui/client';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { authClient } from '@/shared/services';
import { routes } from '@/shared/lib/routes';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const tokens = await authClient.login({ email, password });
      await login(tokens);
      router.replace(routes.dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Sign in" subtitle="Access your analytics workspace">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <Stack gap="md">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" loading={loading} className="w-full">
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
