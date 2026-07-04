import {
  createRequestContext,
  getRequestContext,
  getRequestId,
  requestIdHeaderName,
  runWithContext,
} from './context';

describe('logger context', () => {
  it('creates request context with a generated request id', () => {
    const context = createRequestContext({ service: 'gateway' });
    expect(context.service).toBe('gateway');
    expect(context.requestId).toHaveLength(36);
  });

  it('stores context within async local storage', () => {
    const context = createRequestContext({ service: 'gateway', requestId: 'req-1' });

    runWithContext(context, () => {
      expect(getRequestContext()).toEqual(context);
    });
  });

  it('falls back to generated request ids outside context', () => {
    expect(getRequestId()).toHaveLength(36);
    expect(requestIdHeaderName()).toBe('x-request-id');
  });
});
