import { NovaDeskClient } from '../client';
import { SdkError } from '../errors';
import { AuthClient, unwrapAuthTokens } from './auth.client';

describe('AuthClient', () => {
  it('unwraps enveloped login responses', async () => {
    const client = new NovaDeskClient({
      baseUrl: 'https://api.example.com',
      fetchFn: jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: {
              accessToken: 'token',
              expiresIn: 3600,
              tokenType: 'Bearer',
            },
            meta: { requestId: 'req-1' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
      retries: 0,
    });

    const auth = new AuthClient(client);
    const tokens = await auth.login({ email: 'user@example.com', password: 'secret' });

    expect(tokens.accessToken).toBe('token');
  });

  it('unwraps bare login responses without data/meta envelope', async () => {
    const client = new NovaDeskClient({
      baseUrl: 'https://api.example.com',
      fetchFn: jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            accessToken: 'bare-token',
            expiresIn: 900,
            tokenType: 'Bearer',
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
      retries: 0,
    });

    const auth = new AuthClient(client);
    const tokens = await auth.login({ email: 'user@example.com', password: 'Password1' });

    expect(tokens).toEqual({
      accessToken: 'bare-token',
      expiresIn: 900,
      tokenType: 'Bearer',
    });
  });
});

describe('unwrapAuthTokens', () => {
  it('reads tokens from a double-wrapped payload', () => {
    expect(
      unwrapAuthTokens({
        data: {
          accessToken: 'nested',
          expiresIn: 60,
          tokenType: 'Bearer',
        },
      }),
    ).toEqual({
      accessToken: 'nested',
      expiresIn: 60,
      tokenType: 'Bearer',
    });
  });

  it('throws a clear error when accessToken is missing', () => {
    expect(() => unwrapAuthTokens({ expiresIn: 60, tokenType: 'Bearer' })).toThrow(SdkError);
    expect(() => unwrapAuthTokens({ expiresIn: 60, tokenType: 'Bearer' })).toThrow(
      /did not include an access token/i,
    );
  });
});
