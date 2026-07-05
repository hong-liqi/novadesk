declare global {
  var __NOVADESK_API_URL__: string | undefined;
}

function readNonEmpty(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getInjectedApiUrl(): string | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  return readNonEmpty(globalThis.__NOVADESK_API_URL__);
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
