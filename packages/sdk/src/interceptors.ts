import type { RequestContext, RequestInterceptor, ResponseContext, ResponseInterceptor } from './types';

export async function applyRequestInterceptors(
  context: RequestContext,
  interceptors: RequestInterceptor[],
): Promise<RequestContext> {
  let current = context;
  for (const interceptor of interceptors) {
    current = await interceptor(current);
  }
  return current;
}

export async function applyResponseInterceptors<T>(
  context: ResponseContext<T>,
  interceptors: ResponseInterceptor[],
): Promise<ResponseContext<T>> {
  let current: ResponseContext<T> = context;
  for (const interceptor of interceptors) {
    current = (await interceptor(current)) as ResponseContext<T>;
  }
  return current;
}

export function bearerTokenInterceptor(token: string): RequestInterceptor {
  return (context) => ({
    ...context,
    headers: {
      ...context.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export function requestIdInterceptor(requestId: string): RequestInterceptor {
  return (context) => ({
    ...context,
    headers: {
      ...context.headers,
      'X-Request-Id': requestId,
    },
  });
}
