import { designTokens, themes } from './index';

describe('design tokens', () => {
  it('exposes light and dark themes', () => {
    expect(themes.light.background).toBeDefined();
    expect(themes.dark.background).toBeDefined();
    expect(designTokens.typography.fontFamily.sans).toContain('Space Grotesk');
  });
});
