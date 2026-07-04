import { Writable } from 'node:stream';
import { createLogger } from './logger';
import { createRequestContext, runWithContext } from './context';
import { pickTelemetryContext } from './telemetry';

class BufferStream extends Writable {
  readonly chunks: string[] = [];

  override _write(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ) {
    this.chunks.push(chunk.toString('utf8'));
    callback();
  }
}

describe('createLogger', () => {
  it('includes request context in structured logs', () => {
    const stream = new BufferStream();
    const logger = createLogger({ service: 'gateway', pretty: false, destination: stream });

    runWithContext(createRequestContext({ service: 'gateway', requestId: 'req-123' }), () => {
      logger.info({ route: '/health' }, 'request completed');
    });

    const parsed = JSON.parse(stream.chunks[0] ?? '{}') as Record<string, unknown>;
    expect(parsed.requestId).toBe('req-123');
    expect(parsed.service).toBe('gateway');
    expect(parsed.msg).toBe('request completed');
  });

  it('includes telemetry context when an adapter is configured', () => {
    const stream = new BufferStream();
    const logger = createLogger({
      service: 'gateway',
      pretty: false,
      destination: stream,
      telemetry: {
        getCurrentTraceContext: () => ({ traceId: 'trace-abc' }),
      },
    });

    logger.info('with trace');

    const parsed = JSON.parse(stream.chunks[0] ?? '{}') as Record<string, unknown>;
    expect(parsed.traceId).toBe('trace-abc');
    expect(pickTelemetryContext()).toEqual({});
  });
});
