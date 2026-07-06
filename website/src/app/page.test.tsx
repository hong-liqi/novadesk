import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './page';

vi.mock('@/components/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('HomePage', () => {
  it('shows branding and main sections', () => {
    render(<HomePage />);
    expect(screen.getAllByText(/Li Hong/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', {
        name: /Production software, documented architecture, live deployment/i,
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'NovaDesk modules' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Repository metrics' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Engineering highlights' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Case studies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Get in touch' })).toBeInTheDocument();
  });

  it('links to platform apps and about page', () => {
    render(<HomePage />);
    expect(screen.getAllByRole('link', { name: /About the Engineer/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Open live demo/i }).length).toBeGreaterThan(0);
  });
});
