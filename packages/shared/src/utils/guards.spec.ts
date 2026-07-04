import { isDefined, isNonEmptyString } from './guards';

describe('guards', () => {
  it('identifies defined values', () => {
    expect(isDefined('value')).toBe(true);
    expect(isDefined(undefined)).toBe(false);
  });

  it('identifies non-empty strings', () => {
    expect(isNonEmptyString('hello')).toBe(true);
    expect(isNonEmptyString('   ')).toBe(false);
  });
});
