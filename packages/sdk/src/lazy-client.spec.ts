import { createLazyClient } from './lazy-client';

describe('createLazyClient', () => {
  it('defers client construction until a method is called', () => {
    const factory = jest.fn(() => ({
      ping: () => 'pong',
      value: 42,
    }));

    const client = createLazyClient(factory);
    expect(factory).not.toHaveBeenCalled();

    expect(client.ping()).toBe('pong');
    expect(client.value).toBe(42);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('returns undefined for symbol properties and missing keys', () => {
    const client = createLazyClient(() => ({
      ping: () => 'pong',
    }));

    expect(client[Symbol.toStringTag]).toBeUndefined();
    expect(client.missing).toBeUndefined();
  });
});
