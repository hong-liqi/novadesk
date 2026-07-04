import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('shows admin portal landing content', () => {
    render(<HomePage />);
    expect(screen.getByText('Admin Portal')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Open dashboard' })).toBeInTheDocument();
  });
});
