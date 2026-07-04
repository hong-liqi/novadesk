import {
  authEnvSchema,
  baseEnvSchema,
  commaSeparatedList,
  createConfig,
  loadConfig,
  serviceEnvSchema,
  stringToBoolean,
  withDefaults,
} from './index';
import { ConfigValidationError } from './errors';

describe('config package', () => {
  it('parses the base config with defaults', () => {
    const config = createConfig(
      baseEnvSchema,
      {
        APP_NAME: 'novadesk',
        PORT: '3100',
        LOG_LEVEL: 'debug',
      } as NodeJS.ProcessEnv,
      { sourceName: 'base' },
    );

    expect(config.PORT).toBe(3100);
    expect(config.NODE_ENV).toBe('development');
  });

  it('parses a combined service config', () => {
    const config = createConfig(serviceEnvSchema, {
      DATABASE_URL: 'postgresql://db.example.com:5432/novadesk',
      REDIS_URL: 'redis://redis.example.com:6379',
      APP_NAME: 'novadesk',
      PORT: '3000',
      JWT_ISSUER: 'novadesk-auth',
      JWT_AUDIENCE: 'novadesk',
      CORS_ORIGINS: 'https://example.com, https://admin.example.com',
      ENABLE_REQUEST_LOGGING: 'false',
      LOG_PRETTY: 'true',
      DATABASE_SSL: 'true',
    } as NodeJS.ProcessEnv);

    expect(config.REDIS_PREFIX).toBe('novadesk');
    expect(config.ACCESS_TOKEN_TTL).toBe('15m');
    expect(config.CORS_ORIGINS).toEqual(['https://example.com', 'https://admin.example.com']);
    expect(config.ENABLE_REQUEST_LOGGING).toBe(false);
    expect(config.LOG_PRETTY).toBe(true);
    expect(config.DATABASE_SSL).toBe(true);
  });

  it('accepts array cors origins and boolean log pretty values', () => {
    const config = createConfig(serviceEnvSchema, {
      DATABASE_URL: 'postgresql://db.example.com:5432/novadesk',
      REDIS_URL: 'redis://redis.example.com:6379',
      CORS_ORIGINS: ['https://one.example.com'],
      LOG_PRETTY: true,
      DATABASE_SSL: false,
    } as unknown as NodeJS.ProcessEnv);

    expect(config.CORS_ORIGINS).toEqual(['https://one.example.com']);
    expect(config.LOG_PRETTY).toBe(true);
    expect(config.DATABASE_SSL).toBe(false);
  });

  it('applies schema defaults for optional service flags', () => {
    const config = createConfig(serviceEnvSchema, {
      DATABASE_URL: 'postgresql://db.example.com:5432/novadesk',
      REDIS_URL: 'redis://redis.example.com:6379',
    } as NodeJS.ProcessEnv);

    expect(config.CORS_ORIGINS).toEqual([]);
    expect(config.ENABLE_REQUEST_LOGGING).toBe(true);
    expect(config.DATABASE_SSL).toBe(false);
  });

  it('exposes helper coercions', () => {
    expect(stringToBoolean('yes')).toBe(true);
    expect(stringToBoolean('off')).toBe(false);
    expect(stringToBoolean(true)).toBeUndefined();
    expect(stringToBoolean('maybe')).toBeUndefined();
    expect(commaSeparatedList('a, b ,c')).toEqual(['a', 'b', 'c']);
    expect(commaSeparatedList('')).toBeUndefined();
  });

  it('throws ConfigValidationError with source context', () => {
    expect(() =>
      createConfig(baseEnvSchema, { PORT: 'invalid' } as NodeJS.ProcessEnv, {
        sourceName: 'gateway',
      }),
    ).toThrow(/Invalid configuration for gateway: PORT:/);
  });

  it('loads config from process env by default', () => {
    const previous = process.env.APP_NAME;
    process.env.APP_NAME = 'loaded-service';

    try {
      const config = loadConfig(baseEnvSchema);
      expect(config.APP_NAME).toBe('loaded-service');
    } finally {
      if (previous === undefined) {
        delete process.env.APP_NAME;
      } else {
        process.env.APP_NAME = previous;
      }
    }
  });

  it('merges schema defaults through withDefaults', () => {
    const schema = withDefaults(baseEnvSchema.pick({ SERVICE_NAME: true }), {
      SERVICE_NAME: 'worker-service',
    });
    const config = createConfig(schema, {} as NodeJS.ProcessEnv);

    expect(config.SERVICE_NAME).toBe('worker-service');
  });

  it('keeps auth schema optional for key material', () => {
    const config = createConfig(authEnvSchema, {} as NodeJS.ProcessEnv);
    expect(config.JWT_ISSUER).toBe('novadesk-auth');
  });
});
