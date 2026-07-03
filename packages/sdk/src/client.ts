import type { ApiError, ApiResponse } from '@portfolio/shared';
import { SdkError } from './errors';
import { applyRequestInterceptors, applyResponseInterceptors } from './interceptors';
import { withRetry } from './retry';
import type {
  HttpMethod,
  PortfolioClientOptions,
  RequestContext,
  RequestOptions,
  ResponseContext,
} from './types';

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY_MS = 300;

export class PortfolioClient {
  private readonly options: Required<
    Pick<PortfolioClientOptions, 'timeoutMs' | 'retries' | 'retryDelayMs'>
  > &
    PortfolioClientOptions & { fetchFn: typeof fetch };

  constructor(options: PortfolioClientOptions) {
    this.options = {
      timeoutMs: DEFAULT_TIMEOUT_MS,
      retries: DEFAULT_RETRIES,
      retryDelayMs: DEFAULT_RETRY_DELAY_MS,
      defaultHeaders: {},
      requestInterceptors: [],
      responseInterceptors: [],
      fetchFn: fetch,
      ...options,
    };
  }

  async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    requestOptions: RequestOptions = {},
  ): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, requestOptions.params);
    const timeoutMs = requestOptions.timeoutMs ?? this.options.timeoutMs;
    const retries = requestOptions.retries ?? this.options.retries;

    return withRetry(
      async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
          controller.abort();
        }, timeoutMs);
        const signal = requestOptions.signal ?? controller.signal;

        try {
          const initialContext: RequestContext = {
            url,
            method,
            headers: {
              Accept: 'application/json',
              ...this.options.defaultHeaders,
              ...requestOptions.headers,
            },
            body,
            signal,
          };

          const context = await applyRequestInterceptors(initialContext, [
            ...(this.options.requestInterceptors ?? []),
          ]);

          const headers = { ...context.headers };
          let serializedBody: string | undefined;
          if (context.body !== undefined) {
            headers['Content-Type'] = headers['Content-Type'] ?? 'application/json';
            serializedBody = JSON.stringify(context.body);
          }

          const response = await this.options.fetchFn(context.url, {
            method: context.method,
            headers,
            body: serializedBody,
            signal: context.signal,
          });

          const responseBody = await this.parseBody(response);
          const requestId =
            response.headers.get('x-request-id') ??
            (isApiResponse(responseBody) ? responseBody.meta.requestId : undefined);

          if (!response.ok) {
            if (isApiError(responseBody)) {
              throw SdkError.fromApiError(responseBody);
            }
            throw new SdkError(
              `Request failed with status ${String(response.status)}`,
              'HTTP_ERROR',
              response.status,
              requestId,
            );
          }

          const responseContext: ResponseContext<ApiResponse<T>> = {
            status: response.status,
            headers: response.headers,
            data: responseBody as ApiResponse<T>,
            requestId,
          };

          const finalContext = await applyResponseInterceptors(
            responseContext,
            this.options.responseInterceptors ?? [],
          );

          return finalContext.data;
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            throw SdkError.timeout();
          }
          if (error instanceof SdkError) {
            throw error;
          }
          throw SdkError.network(error instanceof Error ? error.message : 'Network request failed');
        } finally {
          clearTimeout(timeout);
        }
      },
      {
        retries,
        delayMs: this.options.retryDelayMs,
        shouldRetry: (error) => error instanceof SdkError && (error.status ?? 0) >= 500,
      },
    );
  }

  private buildUrl(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const base = this.options.baseUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = new URL(`${base}${normalizedPath}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private async parseBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) {
      return {};
    }

    try {
      return JSON.parse(text) as unknown;
    } catch {
      return { message: text };
    }
  }
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    'data' in value &&
    'meta' in value &&
    typeof (value as ApiResponse<unknown>).meta === 'object'
  );
}

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as ApiError).error === 'object'
  );
}
