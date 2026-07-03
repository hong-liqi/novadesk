import type { ApiError, ApiResponse } from '@portfolio/shared';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type RequestInterceptor = (
  context: RequestContext,
) => RequestContext | Promise<RequestContext>;

export type ResponseInterceptor = (
  context: ResponseContext,
) => ResponseContext | Promise<ResponseContext>;

export interface RequestContext {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface ResponseContext<T = unknown> {
  status: number;
  headers: Headers;
  data: T;
  requestId?: string;
}

export interface PortfolioClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
  defaultHeaders?: Record<string, string>;
  requestInterceptors?: RequestInterceptor[];
  responseInterceptors?: ResponseInterceptor[];
  fetchFn?: typeof fetch;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
  retries?: number;
}

export type ApiResult<T> = ApiResponse<T>;

export type { ApiError };
