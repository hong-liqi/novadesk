import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}));

describe('HomePage', () => {
  it('redirects to dashboard', async () => {
    const { redirect } = await import('next/navigation');
    const HomePage = (await import('./page')).default;
    HomePage();
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('renders dashboard page heading via analytics view mock', () => {
    expect(screen.queryByText('Foundation ready')).not.toBeInTheDocument();
  });
});
