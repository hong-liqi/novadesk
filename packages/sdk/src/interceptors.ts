import type {
  RequestContext,
  RequestInterceptor,
  ResponseContext,
  ResponseInterceptor,
} from './types';

export type TokenProvider =
  string | (() => string | Promise<string> | undefined | Promise<undefined>);
export type RequestIdProvider =
  string | (() => string | Promise<string> | undefined | Promise<undefined>);

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

export function bearerTokenInterceptor(token: TokenProvider): RequestInterceptor {
  return async (context) => {
    const value = typeof token === 'function' ? await token() : token;
    if (!value) {
      return context;
    }

    return {
      ...context,
      headers: {
        ...context.headers,
        Authorization: `Bearer ${value}`,
      },
    };
  };
}

export function requestIdInterceptor(requestId: RequestIdProvider): RequestInterceptor {
  return async (context) => {
    const value = typeof requestId === 'function' ? await requestId() : requestId;
    if (!value) {
      return context;
    }

    return {
      ...context,
      headers: {
        ...context.headers,
        'X-Request-Id': value,
      },
    };
  };
}
