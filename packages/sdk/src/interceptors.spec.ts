import {
  applyRequestInterceptors,
  applyResponseInterceptors,
  bearerTokenInterceptor,
  requestIdInterceptor,
} from './interceptors';

describe('interceptors', () => {
  it('chains request interceptors', async () => {
    const context = await applyRequestInterceptors(
      {
        url: 'https://api.example.com/health',
        method: 'GET',
        headers: {},
      },
      [bearerTokenInterceptor('token-1'), requestIdInterceptor(() => 'req-chain')],
    );

    expect(context.headers).toEqual({
      Authorization: 'Bearer token-1',
      'X-Request-Id': 'req-chain',
    });
  });

  it('skips bearer token when provider returns empty value', async () => {
    const context = await bearerTokenInterceptor(() => undefined)({
      url: 'https://api.example.com/health',
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    expect(context.headers).toEqual({ Accept: 'application/json' });
  });

  it('skips request id when provider returns empty value', async () => {
    const context = await requestIdInterceptor(() => undefined)({
      url: 'https://api.example.com/health',
      method: 'GET',
      headers: {},
    });

    expect(context.headers).toEqual({});
  });

  it('chains response interceptors', async () => {
    const initial = {
      status: 200,
      headers: new Headers(),
      data: { data: { ok: true }, meta: { requestId: 'req-1' } },
      requestId: 'req-1',
    };

    const final = await applyResponseInterceptors(initial, [
      async (context) => ({
        ...context,
        requestId: 'req-2',
      }),
    ]);

    expect(final.requestId).toBe('req-2');
  });
});
