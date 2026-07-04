import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import type { RequestContext } from '@portfolio/shared';
import { REQUEST_ID_HEADER } from '@portfolio/shared';

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

export interface RequestContextInput extends Partial<
  Omit<RequestContext, 'requestId' | 'service'>
> {
  requestId?: string;
  service: string;
}

export function createRequestContext(input: RequestContextInput): RequestContext {
  return {
    requestId: input.requestId ?? randomUUID(),
    service: input.service,
    userId: input.userId,
    tenantId: input.tenantId,
    roles: input.roles,
    correlationId: input.correlationId,
  };
}

export function runWithContext<T>(context: RequestContext, callback: () => T): T {
  return requestContextStorage.run(context, callback);
}

export function getRequestContext(): RequestContext | undefined {
  return requestContextStorage.getStore();
}

export function getRequestId(): string {
  return getRequestContext()?.requestId ?? randomUUID();
}

export function requestIdHeaderName(): string {
  return REQUEST_ID_HEADER;
}
