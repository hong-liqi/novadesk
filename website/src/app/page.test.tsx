import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './page';

vi.mock('@/components/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HomePage', () => {
  it('shows Portfolio OS branding and main sections', () => {
    render(<HomePage />);
    expect(screen.getAllByText('Portfolio OS').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', { name: 'Integrated engineering ecosystem' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Portfolio OS modules' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Case studies' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Get in touch' })).toBeInTheDocument();
  });

  it('links to platform apps', () => {
    render(<HomePage />);
    expect(screen.getAllByRole('link', { name: /HelpDesk SaaS/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Analytics/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('link', { name: /Admin Portal/i }).length).toBeGreaterThan(0);
  });
});
