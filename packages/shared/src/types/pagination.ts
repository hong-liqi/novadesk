export interface PaginationMeta {
  cursor?: string;
  hasMore: boolean;
  total?: number;
  pageSize?: number;
}

export interface CursorPage<T> {
  items: T[];
  meta: PaginationMeta;
}
