import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('shows Portfolio OS branding', () => {
    render(<HomePage />);
    expect(screen.getByText('Portfolio OS')).toBeInTheDocument();
  });
});
