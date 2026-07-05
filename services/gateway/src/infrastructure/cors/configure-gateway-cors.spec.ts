import type { ConfigService } from '@nestjs/config';
import { configureGatewayCors, resolveCorsOrigins } from './configure-gateway-cors';

function createConfigService(values: Record<string, unknown>): ConfigService {
  return {
    get: <T>(key: string, defaultValue?: T) => {
      const value = values[key];
      return (value === undefined ? defaultValue : value) as T;
    },
  } as ConfigService;
}

describe('resolveCorsOrigins', () => {
  it('returns configured origins when set', () => {
    const configService = createConfigService({
      CORS_ORIGINS: ['https://helpdesk.example.com'],
      NODE_ENV: 'production',
    });

    expect(resolveCorsOrigins(configService)).toEqual(['https://helpdesk.example.com']);
  });

  it('falls back to localhost origins in development', () => {
    const configService = createConfigService({
      CORS_ORIGINS: [],
      NODE_ENV: 'development',
    });

    expect(resolveCorsOrigins(configService)).toContain('http://localhost:3010');
  });

  it('returns empty list in production when unset', () => {
    const configService = createConfigService({
      CORS_ORIGINS: [],
      NODE_ENV: 'production',
    });

    expect(resolveCorsOrigins(configService)).toEqual([]);
  });
});

describe('configureGatewayCors', () => {
  it('enables cors when origins are configured', () => {
    const enableCors = jest.fn();
    const app = { enableCors } as never;
    const configService = createConfigService({
      CORS_ORIGINS: ['https://helpdesk.example.com'],
      NODE_ENV: 'production',
    });

    configureGatewayCors(app, configService);

    expect(enableCors).toHaveBeenCalledTimes(1);
    const corsOptions = enableCors.mock.calls[0]?.[0] as {
      origin: string[];
      credentials: boolean;
      allowedHeaders: string[];
    };

    expect(corsOptions.origin).toEqual(['https://helpdesk.example.com']);
    expect(corsOptions.credentials).toBe(true);
    expect(corsOptions.allowedHeaders).toEqual(
      expect.arrayContaining(['x-tenant-id', 'Authorization']),
    );
  });

  it('skips cors when production has no origins', () => {
    const enableCors = jest.fn();
    const app = { enableCors } as never;
    const configService = createConfigService({
      CORS_ORIGINS: [],
      NODE_ENV: 'production',
    });

    configureGatewayCors(app, configService);

    expect(enableCors).not.toHaveBeenCalled();
  });
});
