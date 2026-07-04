import { NovaDeskClient } from '../client';
import { AuthClient } from './auth.client';

describe('AuthClient', () => {
  it('calls login endpoint', async () => {
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
});
