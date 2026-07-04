export interface TraceContext {
  traceId: string;
  spanId?: string;
  traceFlags?: string;
}

export interface TelemetryAdapter {
  getCurrentTraceContext?: () => TraceContext | undefined;
}

export function pickTelemetryContext(adapter?: TelemetryAdapter): Record<string, string> {
  const context = adapter?.getCurrentTraceContext?.();
  if (!context) {
    return {};
  }

  const telemetry: Record<string, string> = { traceId: context.traceId };
  if (context.spanId) {
    telemetry.spanId = context.spanId;
  }
  if (context.traceFlags) {
    telemetry.traceFlags = context.traceFlags;
  }
  return telemetry;
}
