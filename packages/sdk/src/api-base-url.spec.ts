import { getApiBaseUrl, resolveRequestOrigin, serializeRuntimeApiUrlScript } from './api-base-url';

describe('api-base-url', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete globalThis.__NOVADESK_API_URL__;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('prefers injected runtime URL', () => {
    globalThis.__NOVADESK_API_URL__ = 'https://gateway.example.com/api/v1';
    process.env.NOVADESK_API_URL = 'https://ignored.example.com/api/v1';

    expect(getApiBaseUrl()).toBe('https://gateway.example.com/api/v1');
  });

  it('falls back to server env vars and ignores empty strings', () => {
    process.env.NOVADESK_API_URL = '   ';
    process.env.NEXT_PUBLIC_API_URL = 'https://gateway.example.com/api/v1';

    expect(getApiBaseUrl()).toBe('https://gateway.example.com/api/v1');
  });

  it('derives API URL from gateway env', () => {
    process.env.NOVADESK_GATEWAY_URL = 'https://gateway.example.com';
    delete process.env.NOVADESK_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getApiBaseUrl()).toBe('https://gateway.example.com/api/v1');
  });

  it('defaults to /api/v1 when unset', () => {
    delete process.env.NOVADESK_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getApiBaseUrl()).toBe('/api/v1');
  });

  it('serializes runtime config script', () => {
    expect(serializeRuntimeApiUrlScript('https://gateway.example.com/api/v1')).toBe(
      'globalThis.__NOVADESK_API_URL__="https://gateway.example.com/api/v1";',
    );
  });

  it('resolves localhost when location is unavailable', () => {
    expect(resolveRequestOrigin()).toBe('http://localhost');
  });
});
