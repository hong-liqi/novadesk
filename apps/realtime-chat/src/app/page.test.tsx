import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@novadesk/auth/client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@novadesk/auth/client')>();
  return {
    ...actual,
    useAuth: () => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }),
  };
});

import HomePage from './page';

describe('HomePage', () => {
  it('shows sign in required when unauthenticated', () => {
    render(<HomePage />);
    expect(screen.getByText('Sign in required')).toBeInTheDocument();
  });
});
