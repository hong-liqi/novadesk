export function createCursor(id: string): string {
  return Buffer.from(id).toString('base64url');
}

export function parseCursor(cursor: string): string {
  return Buffer.from(cursor, 'base64url').toString('utf-8');
}
