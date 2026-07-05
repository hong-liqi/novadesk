'use client';

import { useAuth } from '@novadesk/auth/client';
import { formatAuthError } from '@novadesk/sdk';
import { Button, Input, Stack } from '@novadesk/ui';
import { AuthLayout } from '@novadesk/ui/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { routes } from '@/shared/lib/routes';
import { authClient } from '@/shared/services';

const PASSWORD_HINT =
  'Use at least 8 characters with one uppercase letter, one lowercase letter, and one number.';

export function RegisterForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const tokens = await authClient.register({
        email,
        password,
        name: name.trim() || undefined,
      });
      await login(tokens);
      router.replace(routes.dashboard);
    } catch (err) {
      setError(formatAuthError(err, 'Account creation failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Access your analytics workspace">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
      >
        <Stack gap="md">
          <Input
            label="Full name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
            }}
          />
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
            autoComplete="new-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
            }}
            required
          />
          <p className="text-sm text-neutral-500">{PASSWORD_HINT}</p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
          <p className="text-center text-sm text-neutral-600">
            Already have an account?{' '}
            <Link href={routes.login} className="font-medium text-violet-700 hover:underline">
              Sign in
            </Link>
          </p>
        </Stack>
      </form>
    </AuthLayout>
  );
}
