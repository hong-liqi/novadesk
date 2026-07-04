export interface StoredTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
  tokenType: 'Bearer';
}

export interface TokenManagerOptions {
  refreshBufferMs?: number;
  storageKey?: string;
  onTokensUpdated?: (tokens: StoredTokens | null) => void;
}

export type RefreshHandler = (refreshToken: string) => Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: 'Bearer';
}>;

const DEFAULT_REFRESH_BUFFER_MS = 60_000;
const DEFAULT_STORAGE_KEY = 'portfolio.auth.tokens';

export class TokenManager {
  private readonly options: Required<Pick<TokenManagerOptions, 'refreshBufferMs' | 'storageKey'>> &
    TokenManagerOptions;
  private tokens: StoredTokens | null = null;
  private refreshHandler: RefreshHandler | null = null;
  private refreshPromise: Promise<StoredTokens | null> | null = null;

  constructor(options: TokenManagerOptions = {}) {
    this.options = {
      refreshBufferMs: DEFAULT_REFRESH_BUFFER_MS,
      storageKey: DEFAULT_STORAGE_KEY,
      ...options,
    };
    this.tokens = this.readFromStorage();
  }

  setRefreshHandler(handler: RefreshHandler): void {
    this.refreshHandler = handler;
  }

  getAccessToken(): string | null {
    return this.tokens?.accessToken ?? null;
  }

  getTokens(): StoredTokens | null {
    return this.tokens;
  }

  setTokens(input: {
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    tokenType: 'Bearer';
  }): StoredTokens {
    const tokens: StoredTokens = {
      accessToken: input.accessToken,
      refreshToken: input.refreshToken ?? this.tokens?.refreshToken,
      expiresAt: Date.now() + input.expiresIn * 1000,
      tokenType: input.tokenType,
    };

    this.tokens = tokens;
    this.persist(tokens);
    this.options.onTokensUpdated?.(tokens);
    return tokens;
  }

  clearTokens(): void {
    this.tokens = null;
    this.persist(null);
    this.options.onTokensUpdated?.(null);
  }

  isAccessTokenExpired(): boolean {
    if (!this.tokens) {
      return true;
    }

    return Date.now() >= this.tokens.expiresAt - this.options.refreshBufferMs;
  }

  async ensureAccessToken(): Promise<string | null> {
    if (!this.tokens) {
      return null;
    }

    if (!this.isAccessTokenExpired()) {
      return this.tokens.accessToken;
    }

    return this.refreshAccessToken();
  }

  async refreshAccessToken(): Promise<string | null> {
    if (!this.tokens?.refreshToken || !this.refreshHandler) {
      return this.tokens?.accessToken ?? null;
    }

    this.refreshPromise ??= this.runRefresh().finally(() => {
      this.refreshPromise = null;
    });

    const tokens = await this.refreshPromise;
    return tokens?.accessToken ?? null;
  }

  private async runRefresh(): Promise<StoredTokens | null> {
    const refreshToken = this.tokens?.refreshToken;
    if (!refreshToken || !this.refreshHandler) {
      return this.tokens;
    }

    try {
      const next = await this.refreshHandler(refreshToken);
      return this.setTokens(next);
    } catch {
      this.clearTokens();
      return null;
    }
  }

  private readFromStorage(): StoredTokens | null {
    if (typeof globalThis.localStorage === 'undefined') {
      return null;
    }

    const raw = globalThis.localStorage.getItem(this.options.storageKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredTokens;
    } catch {
      return null;
    }
  }

  private persist(tokens: StoredTokens | null): void {
    if (typeof globalThis.localStorage === 'undefined') {
      return;
    }

    if (!tokens) {
      globalThis.localStorage.removeItem(this.options.storageKey);
      return;
    }

    globalThis.localStorage.setItem(this.options.storageKey, JSON.stringify(tokens));
  }
}

export function createTokenManager(options?: TokenManagerOptions): TokenManager {
  return new TokenManager(options);
}
