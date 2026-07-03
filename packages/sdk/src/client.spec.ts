import { PortfolioClient } from './client';
import { SdkError } from './errors';
import { bearerTokenInterceptor } from './interceptors';

describe('PortfolioClient', () => {
  const baseUrl = 'https://api.example.com';

  it('performs GET requests and unwraps ApiResponse', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: { ok: true },
          meta: { requestId: 'req-1' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new PortfolioClient({ baseUrl, fetchFn, retries: 0 });
    const result = await client.get<{ ok: boolean }>('/health');

    expect(result.data.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('maps API errors to SdkError', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Invalid token',
            status: 401,
            requestId: 'req-2',
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new PortfolioClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.get('/protected')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      status: 401,
      requestId: 'req-2',
    });
  });

  it('applies request interceptors', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ data: {}, meta: { requestId: 'req-3' } }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new PortfolioClient({
      baseUrl,
      fetchFn,
      retries: 0,
      requestInterceptors: [bearerTokenInterceptor('token-abc')],
    });

    await client.get('/me');

    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer token-abc',
    });
  });
});

describe('SdkError', () => {
  it('creates timeout errors', () => {
    const error = SdkError.timeout();
    expect(error.code).toBe('TIMEOUT');
    expect(error.status).toBe(408);
  });
});
