import { NovaDeskClient, createSdkClient } from './client';
import { SdkError } from './errors';
import { bearerTokenInterceptor, requestIdInterceptor } from './interceptors';
import { withRetry } from './retry';

const baseUrl = 'https://api.example.com';

describe('NovaDeskClient', () => {
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

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });
    const result = await client.get<{ ok: boolean }>('/health');

    expect(result.data.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('wraps bare JSON payloads into ApiResponse', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          accessToken: 'token-abc',
          expiresIn: 3600,
          tokenType: 'Bearer',
        }),
        {
          status: 201,
          headers: {
            'Content-Type': 'application/json',
            'x-request-id': 'req-bare',
          },
        },
      ),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });
    const result = await client.post<{ accessToken: string }>('/auth/register', {});

    expect(result.data.accessToken).toBe('token-abc');
    expect(result.meta.requestId).toBe('req-bare');
  });

  it('maps NestJS HTTP exceptions to SdkError with message', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          statusCode: 409,
          message: 'Email already registered',
          error: 'Conflict',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.post('/auth/register', {})).rejects.toMatchObject({
      message: 'Email already registered',
      status: 409,
    });
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

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.get('/protected')).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
      status: 401,
      requestId: 'req-2',
    });
  });

  it('applies request interceptors', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: {}, meta: { requestId: 'req-3' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const client = new NovaDeskClient({
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

  it('times out slow requests', async () => {
    const fetchFn = jest.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
          );
        }),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0, timeoutMs: 1 });

    await expect(client.get('/slow')).rejects.toMatchObject({
      code: 'TIMEOUT',
      status: 408,
    });
  });

  it('creates clients from the factory helper', () => {
    const client = createSdkClient({ baseUrl });
    expect(client).toBeInstanceOf(NovaDeskClient);
  });

  it('supports relative API base URLs', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { ok: true }, meta: { requestId: 'req-rel' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const client = new NovaDeskClient({ baseUrl: '/api/v1', fetchFn, retries: 0 });
    await client.get('/health');

    expect(fetchFn).toHaveBeenCalledWith(
      'http://localhost/api/v1/health',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('supports write methods and query params', async () => {
    const fetchFn = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ data: { id: '1' }, meta: { requestId: 'req-write' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await client.post('/items', { name: 'alpha' });
    await client.put('/items/1', { name: 'beta' });
    await client.patch('/items/1', { active: true });
    await client.delete('/items/1');
    await client.get('/items', { params: { page: 2, active: true } });

    expect(fetchFn).toHaveBeenNthCalledWith(
      5,
      'https://api.example.com/items?page=2&active=true',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('maps non-envelope HTTP failures to SdkError', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response('upstream unavailable', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      }),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.get('/broken')).rejects.toMatchObject({
      code: 'HTTP_ERROR',
      status: 503,
    });
  });

  it('maps network failures to SdkError', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('socket hang up'));
    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.get('/offline')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    });
  });

  it('handles empty response bodies', async () => {
    const fetchFn = jest.fn().mockImplementation(() =>
      Promise.resolve(
        new Response('', {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });
    const result = await client.get('/empty');

    expect(result).toEqual({ data: {}, meta: { requestId: 'unknown' } });
  });

  it('retries server errors before succeeding', async () => {
    const fetchFn = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              error: {
                code: 'INTERNAL_ERROR',
                message: 'temporary',
                status: 503,
                requestId: 'req-retry',
                timestamp: new Date().toISOString(),
              },
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      )
      .mockImplementation(() =>
        Promise.resolve(
          new Response(JSON.stringify({ data: { ok: true }, meta: { requestId: 'req-retry' } }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 1, retryDelayMs: 0 });
    const result = await client.get<{ ok: boolean }>('/flaky');

    expect(result.data.ok).toBe(true);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('returns plain text from getText', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response('col1,col2\n1,2', {
        status: 200,
        headers: { 'Content-Type': 'text/csv' },
      }),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });
    const result = await client.getText('/analytics/export', { params: { workspaceId: 'ws-1' } });

    expect(result).toBe('col1,col2\n1,2');
    expect(fetchFn).toHaveBeenCalledWith(
      'https://api.example.com/analytics/export?workspaceId=ws-1',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Accept: 'text/csv,text/plain,*/*',
        }),
      }),
    );
  });

  it('maps getText API errors to SdkError', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'FORBIDDEN',
            message: 'Denied',
            status: 403,
            requestId: 'req-text',
            timestamp: new Date().toISOString(),
          },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.getText('/export')).rejects.toMatchObject({
      code: 'FORBIDDEN',
      status: 403,
    });
  });

  it('maps getText HTTP failures without envelope to SdkError', async () => {
    const fetchFn = jest.fn().mockResolvedValue(new Response('bad gateway', { status: 502 }));
    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.getText('/export')).rejects.toMatchObject({
      code: 'HTTP_ERROR',
      status: 502,
    });
  });

  it('times out getText requests', async () => {
    const fetchFn = jest.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener(
            'abort',
            () => {
              reject(new DOMException('Aborted', 'AbortError'));
            },
            { once: true },
          );
        }),
    );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0, timeoutMs: 1 });

    await expect(client.getText('/slow-export')).rejects.toMatchObject({
      code: 'TIMEOUT',
      status: 408,
    });
  });

  it('maps getText network failures to SdkError', async () => {
    const fetchFn = jest.fn().mockRejectedValue(new Error('connection reset'));
    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0 });

    await expect(client.getText('/export')).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    });
  });

  it('retries getText server errors before succeeding', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(new Response('unavailable', { status: 503 }))
      .mockResolvedValueOnce(
        new Response('ticketId,status\n1,open', {
          status: 200,
          headers: { 'Content-Type': 'text/csv' },
        }),
      );

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 1, retryDelayMs: 0 });
    const result = await client.getText('/export');

    expect(result).toBe('ticketId,status\n1,open');
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it('rejects requests when the caller signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    const fetchFn = jest.fn((_url: string | URL | Request, init?: RequestInit) => {
      if (init?.signal?.aborted) {
        return Promise.reject(new DOMException('Aborted', 'AbortError'));
      }

      return Promise.resolve(
        new Response(JSON.stringify({ data: {}, meta: { requestId: 'req-abort' } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });

    const client = new NovaDeskClient({ baseUrl, fetchFn, retries: 0, timeoutMs: 60_000 });

    await expect(client.get('/abort-early', { signal: controller.signal })).rejects.toMatchObject({
      code: 'TIMEOUT',
      status: 408,
    });
  });
});

describe('SdkError', () => {
  it('creates timeout errors', () => {
    const error = SdkError.timeout();
    expect(error.code).toBe('TIMEOUT');
    expect(error.status).toBe(408);
  });

  it('creates network errors', () => {
    const error = SdkError.network('offline');
    expect(error.code).toBe('NETWORK_ERROR');
    expect(error.message).toBe('offline');
  });
});

describe('retry helpers', () => {
  it('retries transient failures', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('temporary'), { status: 500 }))
      .mockResolvedValueOnce('ok');

    await expect(withRetry(operation, { retries: 1, delayMs: 0 })).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('applies request id interceptors', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: {}, meta: { requestId: 'req-4' } }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const client = new NovaDeskClient({
      baseUrl,
      fetchFn,
      retries: 0,
      requestInterceptors: [requestIdInterceptor('req-4')],
    });

    await client.get('/health');
    const [, init] = fetchFn.mock.calls[0] as [string, RequestInit];
    expect(init.headers).toMatchObject({
      'X-Request-Id': 'req-4',
    });
  });
});
