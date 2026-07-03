import { validateConfig, baseConfigSchema } from './index';

describe('validateConfig', () => {
  it('should parse valid base config', () => {
    const config = validateConfig(baseConfigSchema, {
      NODE_ENV: 'development',
      LOG_LEVEL: 'info',
      PORT: '3001',
      SERVICE_NAME: 'auth-service',
    });

    expect(config.SERVICE_NAME).toBe('auth-service');
    expect(config.PORT).toBe(3001);
  });

  it('should throw on invalid config', () => {
    expect(() => validateConfig(baseConfigSchema, {})).toThrow('Invalid configuration');
  });
});
