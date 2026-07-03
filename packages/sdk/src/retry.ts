export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: { retries: number; delayMs: number; shouldRetry?: (error: unknown) => boolean },
): Promise<T> {
  const { retries, delayMs, shouldRetry = defaultShouldRetry } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= retries || !shouldRetry(error)) {
        throw error;
      }
      await sleep(delayMs * (attempt + 1));
    }
  }

  throw lastError;
}

function defaultShouldRetry(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status?: number }).status;
    return status === 408 || status === 429 || (status !== undefined && status >= 500);
  }
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
