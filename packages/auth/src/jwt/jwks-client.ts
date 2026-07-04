export interface JwksClientOptions {
  jwksUrl: string;
  cacheTtlMs?: number;
  fetchFn?: typeof fetch;
}

interface CachedJwks {
  keys: JsonWebKey[];
  expiresAt: number;
}

const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

export class JwksClient {
  private readonly options: Required<Pick<JwksClientOptions, 'cacheTtlMs' | 'fetchFn'>> &
    JwksClientOptions;
  private cache: CachedJwks | null = null;

  constructor(options: JwksClientOptions) {
    this.options = {
      cacheTtlMs: DEFAULT_CACHE_TTL_MS,
      fetchFn: fetch,
      ...options,
    };
  }

  async getKeys(forceRefresh = false): Promise<JsonWebKey[]> {
    if (!forceRefresh && this.cache && this.cache.expiresAt > Date.now()) {
      return this.cache.keys;
    }

    const response = await this.options.fetchFn(this.options.jwksUrl, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${String(response.status)}`);
    }

    const body = (await response.json()) as { keys?: JsonWebKey[] };
    const keys = body.keys ?? [];

    this.cache = {
      keys,
      expiresAt: Date.now() + this.options.cacheTtlMs,
    };

    return keys;
  }

  clearCache(): void {
    this.cache = null;
  }
}

export function createJwksClient(options: JwksClientOptions): JwksClient {
  return new JwksClient(options);
}
