import { pickTelemetryContext } from './telemetry';

describe('telemetry helpers', () => {
  it('returns an empty object when no adapter is provided', () => {
    expect(pickTelemetryContext()).toEqual({});
  });

  it('maps trace context from the adapter', () => {
    expect(
      pickTelemetryContext({
        getCurrentTraceContext: () => ({
          traceId: 'trace-1',
          spanId: 'span-1',
          traceFlags: '01',
        }),
      }),
    ).toEqual({
      traceId: 'trace-1',
      spanId: 'span-1',
      traceFlags: '01',
    });
  });
});
