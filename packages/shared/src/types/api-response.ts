import type { PaginationMeta } from './pagination';

export interface ApiResponse<T> {
  data: T;
  meta: {
    requestId: string;
    pagination?: PaginationMeta;
  };
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    status: number;
    requestId: string;
    timestamp: string;
    details?: Record<string, unknown>;
  };
}
