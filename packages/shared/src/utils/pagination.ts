import { ValidationError } from '../errors';
import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants';

export function createCursor(id: string): string {
  return Buffer.from(id, 'utf-8').toString('base64url');
}

export function parseCursor(cursor: string): string {
  if (!cursor) {
    throw new ValidationError('Cursor is required');
  }

  const decoded = Buffer.from(cursor, 'base64url').toString('utf-8');
  if (createCursor(decoded) !== cursor) {
    throw new ValidationError('Cursor is invalid', { cursor });
  }

  return decoded;
}

export function normalizePageSize(pageSize?: number): number {
  if (!pageSize) {
    return DEFAULT_PAGE_SIZE;
  }

  if (pageSize < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(pageSize, MAX_PAGE_SIZE);
}
