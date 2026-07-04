import { render, screen } from '@testing-library/react';
import { Text } from './Text';

describe('Text', () => {
  it('renders semantic text with tokens', () => {
    render(
      <Text as="h1" size="2xl" weight="bold" tone="accent">
        Design system
      </Text>,
    );

    expect(screen.getByRole('heading', { name: 'Design system' })).toBeInTheDocument();
  });
});
