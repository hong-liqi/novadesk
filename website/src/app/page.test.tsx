import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './page';

vi.mock('@/components/providers', () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

describe('HomePage', () => {
  it('shows NovaDesk branding and main sections', () => {
    render(<HomePage />);
    expect(screen.getAllByText('NovaDesk').length).toBeGreaterThan(0);
    expect(
      screen.getByRole('heading', { name: 'Integrated engineering ecosystem' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'NovaDesk modules' })).toBeInTheDocument();
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
