import { safeJsonParse } from './json';

describe('json utils', () => {
  it('parses valid JSON payloads', () => {
    expect(safeJsonParse('{"ok":true}')).toEqual({ ok: true });
  });

  it('returns undefined for invalid JSON payloads', () => {
    expect(safeJsonParse('not-json')).toBeUndefined();
  });
});
