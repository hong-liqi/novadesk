import { TokenManager } from './token-manager';

describe('TokenManager', () => {
  it('stores and clears tokens', () => {
    const manager = new TokenManager({ storageKey: 'test.tokens' });

    const tokens = manager.setTokens({
      accessToken: 'access-1',
      refreshToken: 'refresh-1',
      expiresIn: 3600,
      tokenType: 'Bearer',
    });

    expect(tokens.accessToken).toBe('access-1');
    expect(manager.getAccessToken()).toBe('access-1');
    expect(manager.isAccessTokenExpired()).toBe(false);

    manager.clearTokens();
    expect(manager.getAccessToken()).toBeNull();
  });

  it('refreshes expired access tokens', async () => {
    const manager = new TokenManager({ refreshBufferMs: 0, storageKey: 'test.refresh' });
    manager.setTokens({
      accessToken: 'expired',
      refreshToken: 'refresh-1',
      expiresIn: -1,
      tokenType: 'Bearer',
    });

    manager.setRefreshHandler(async () => ({
      accessToken: 'fresh',
      refreshToken: 'refresh-2',
      expiresIn: 3600,
      tokenType: 'Bearer',
    }));

    const token = await manager.ensureAccessToken();

    expect(token).toBe('fresh');
    expect(manager.getAccessToken()).toBe('fresh');
  });
});
