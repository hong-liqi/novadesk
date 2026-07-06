import { SdkError } from './errors';
import { withRetry } from './retry';

describe('withRetry', () => {
  it('stops retrying when shouldRetry returns false', async () => {
    const operation = jest
      .fn()
      .mockRejectedValue(Object.assign(new Error('bad request'), { status: 400 }));

    await expect(withRetry(operation, { retries: 3, delayMs: 0 })).rejects.toThrow('bad request');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('uses default retry policy for timeout and rate limit statuses', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('timeout'), { status: 408 }))
      .mockResolvedValueOnce('ok');

    await expect(withRetry(operation, { retries: 1, delayMs: 0 })).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('does not retry SdkError client failures by default', async () => {
    const operation = jest.fn().mockRejectedValue(new SdkError('nope', 'BAD_REQUEST', 400));

    await expect(withRetry(operation, { retries: 2, delayMs: 0 })).rejects.toBeInstanceOf(SdkError);
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('retries generic errors by default', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(new Error('network'))
      .mockResolvedValueOnce('ok');

    await expect(withRetry(operation, { retries: 1, delayMs: 0 })).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });

  it('retries server errors by default', async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error('server'), { status: 503 }))
      .mockResolvedValueOnce('ok');

    await expect(withRetry(operation, { retries: 1, delayMs: 0 })).resolves.toBe('ok');
    expect(operation).toHaveBeenCalledTimes(2);
  });
});
