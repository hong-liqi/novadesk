import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders when open and closes on escape', () => {
    const onClose = vi.fn();

    render(
      <Modal isOpen title="Confirm" onClose={onClose}>
        Body
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
