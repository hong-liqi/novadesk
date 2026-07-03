import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('renders named icon', () => {
    render(<Icon name="check" aria-label="check" />);
    expect(screen.getByLabelText('check')).toBeInTheDocument();
  });
});
