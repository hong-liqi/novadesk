import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeToggleProbe() {
  const { mode, toggleMode } = useTheme();
  return (
    <button type="button" onClick={toggleMode}>
      mode:{mode}
    </button>
  );
}

describe('ThemeProvider', () => {
  it('toggles between light and dark', () => {
    render(
      <ThemeProvider>
        <ThemeToggleProbe />
      </ThemeProvider>,
    );

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('mode:light');
    fireEvent.click(button);
    expect(button).toHaveTextContent('mode:dark');
  });
});
