import { render, screen } from '@testing-library/react';
import { Surface } from './Surface';

describe('Surface', () => {
  it('renders a padded container', () => {
    render(<Surface variant="raised">Content</Surface>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});
