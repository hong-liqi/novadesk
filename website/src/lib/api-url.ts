declare global {
  var __NOVADESK_API_URL__: string | undefined;
}

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key]?.trim();
    if (value) {
      return value;
    }
  }

  return undefined;
}

function readInjectedApiUrl(): string | undefined {
  if (typeof globalThis === 'undefined') {
    return undefined;
  }

  const value = globalThis.__NOVADESK_API_URL__?.trim();
  return value?.length ? value : undefined;
}

function resolveGatewayApiUrl(): string | undefined {
  const gateway = readEnv('NOVADESK_GATEWAY_URL', 'NEXT_PUBLIC_GATEWAY_URL');
  if (!gateway) {
    return undefined;
  }

  return `${gateway.replace(/\/$/, '')}/api/v1`;
}

/** Resolves API base URL from runtime injection, server env, or local default. */
export function getApiBaseUrl(): string {
  const injected = readInjectedApiUrl();
  if (injected) {
    return injected;
  }

  return readEnv('NOVADESK_API_URL', 'NEXT_PUBLIC_API_URL') ?? resolveGatewayApiUrl() ?? '/api/v1';
}

export function serializeRuntimeApiUrlScript(apiUrl: string): string {
  return `globalThis.__NOVADESK_API_URL__=${JSON.stringify(apiUrl)};`;
}
