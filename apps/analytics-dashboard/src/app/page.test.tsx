import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import HomePage from './page';

describe('HomePage', () => {
  it('shows foundation ready message', () => {
    render(<HomePage />);
    expect(screen.getByText('Foundation ready')).toBeInTheDocument();
  });
});
