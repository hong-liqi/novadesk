import {
  getApiBaseUrl,
  getGatewayOrigin,
  resolveRequestOrigin,
  serializeRuntimeApiUrlScript,
} from './api-base-url';

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

  it('resolves browser origin when location is available', () => {
    const originalLocation = (globalThis as { location?: { origin?: string } }).location;
    (globalThis as { location?: { origin?: string } }).location = {
      origin: 'https://helpdesk.example.com',
    };

    expect(resolveRequestOrigin()).toBe('https://helpdesk.example.com');

    if (originalLocation === undefined) {
      delete (globalThis as { location?: { origin?: string } }).location;
    } else {
      (globalThis as { location?: { origin?: string } }).location = originalLocation;
    }
  });

  it('derives gateway origin from absolute API URL', () => {
    globalThis.__NOVADESK_API_URL__ = 'https://api.example.com/api/v1';

    expect(getGatewayOrigin()).toBe('https://api.example.com');
  });

  it('falls back to request origin for relative API URL', () => {
    delete globalThis.__NOVADESK_API_URL__;
    delete process.env.NOVADESK_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getGatewayOrigin()).toBe('http://localhost');
  });

  it('uses NEXT_PUBLIC_GATEWAY_URL when gateway env is unset', () => {
    process.env.NEXT_PUBLIC_GATEWAY_URL = 'https://gateway.example.com/';
    delete process.env.NOVADESK_GATEWAY_URL;
    delete process.env.NOVADESK_API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;

    expect(getApiBaseUrl()).toBe('https://gateway.example.com/api/v1');
  });
});
