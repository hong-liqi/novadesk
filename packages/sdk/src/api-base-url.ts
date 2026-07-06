declare global {
  var __NOVADESK_API_URL__: string | undefined;
}

function readNonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed;
}

function getInjectedApiUrl(): string | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return readNonEmpty(globalThis.__NOVADESK_API_URL__);
}

function resolveGatewayApiUrl(): string | undefined {
  const gateway =
    readNonEmpty(process.env.NOVADESK_GATEWAY_URL) ??
    readNonEmpty(process.env.NEXT_PUBLIC_GATEWAY_URL);

  if (!gateway) {
    return undefined;
  }

  return `${gateway.replace(/\/$/, '')}/api/v1`;
}

/** Resolves API base URL from runtime injection, server env, or local default. */
export function getApiBaseUrl(): string {
  const injected = getInjectedApiUrl();
  if (injected) {
    return injected;
  }

  return (
    readNonEmpty(process.env.NOVADESK_API_URL) ??
    readNonEmpty(process.env.NEXT_PUBLIC_API_URL) ??
    resolveGatewayApiUrl() ??
    '/api/v1'
  );
}

export function serializeRuntimeApiUrlScript(apiUrl: string): string {
  return `globalThis.__NOVADESK_API_URL__=${JSON.stringify(apiUrl)};`;
}

export function resolveRequestOrigin(): string {
  if (typeof globalThis !== 'undefined') {
    const location = (globalThis as { location?: { origin?: string } }).location;
    if (location?.origin) {
      return location.origin;
    }
  }

  return 'http://localhost';
}

/** Socket.IO and browser clients should connect to the gateway origin, not the app subdomain. */
export function getGatewayOrigin(): string {
  const apiBaseUrl = getApiBaseUrl();
  if (apiBaseUrl.startsWith('http://') || apiBaseUrl.startsWith('https://')) {
    return new URL(apiBaseUrl).origin;
  }

  return resolveRequestOrigin();
}
