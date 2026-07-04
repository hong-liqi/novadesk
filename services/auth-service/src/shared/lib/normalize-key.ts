export function normalizePemKey(key: string): string {
  return key.includes('\\n') ? key.replace(/\\n/g, '\n') : key;
}
