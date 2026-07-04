import { JwksClient } from './jwks-client';

describe('JwksClient', () => {
  it('fetches and caches JWKS keys', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ keys: [{ kty: 'RSA', kid: 'key-1' }] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const client = new JwksClient({
      jwksUrl: 'https://auth.example.com/.well-known/jwks.json',
      fetchFn,
      cacheTtlMs: 60_000,
    });

    const first = await client.getKeys();
    const second = await client.getKeys();

    expect(first).toEqual([{ kty: 'RSA', kid: 'key-1' }]);
    expect(second).toEqual(first);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('refreshes cache when forced', async () => {
    const fetchFn = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [{ kid: 'a' }] }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ keys: [{ kid: 'b' }] }), { status: 200 }),
      );

    const client = new JwksClient({
      jwksUrl: 'https://auth.example.com/.well-known/jwks.json',
      fetchFn,
    });

    await client.getKeys();
    const refreshed = await client.getKeys(true);

    expect(refreshed).toEqual([{ kid: 'b' }]);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });
});
