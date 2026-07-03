export interface PaginationMeta {
  cursor?: string;
  hasMore: boolean;
  total?: number;
}

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
  };
}
