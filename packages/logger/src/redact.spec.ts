import { redactPaths } from './redact';

describe('redact paths', () => {
  it('includes nested sensitive field paths', () => {
    expect(redactPaths).toEqual(
      expect.arrayContaining(['password', '*.token', '*.*.authorization']),
    );
  });
});
