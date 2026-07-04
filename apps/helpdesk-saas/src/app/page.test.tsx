import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('shows helpdesk title', () => {
    render(<HomePage />);
    expect(screen.getByText('Helpdesk SaaS')).toBeInTheDocument();
  });
});
