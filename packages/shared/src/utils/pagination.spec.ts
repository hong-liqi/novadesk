import { ValidationError } from '../errors';
import { createCursor, normalizePageSize, parseCursor } from './pagination';

describe('pagination utils', () => {
  it('encodes and decodes cursors', () => {
    const id = 'ticket-123';
    expect(parseCursor(createCursor(id))).toBe(id);
  });

  it('rejects empty cursors', () => {
    expect(() => parseCursor('')).toThrow(ValidationError);
  });

  it('rejects invalid cursors', () => {
    expect(() => parseCursor('not-a-valid-cursor')).toThrow(ValidationError);
  });

  it('normalizes page size within bounds', () => {
    expect(normalizePageSize()).toBe(20);
    expect(normalizePageSize(0)).toBe(20);
    expect(normalizePageSize(-1)).toBe(20);
    expect(normalizePageSize(250)).toBe(100);
    expect(normalizePageSize(10)).toBe(10);
  });
});
