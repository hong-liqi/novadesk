import { createCursor, parseCursor } from './pagination';

describe('pagination utils', () => {
  it('should encode and decode cursor', () => {
    const id = 'ticket-123';
    const cursor = createCursor(id);
    expect(parseCursor(cursor)).toBe(id);
  });
});
