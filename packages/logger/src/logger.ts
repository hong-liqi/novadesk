import pino, { type DestinationStream, type Logger, type LoggerOptions } from 'pino';
import { getRequestContext } from './context';
import type { TelemetryAdapter } from './telemetry';
import { pickTelemetryContext } from './telemetry';

export interface CreateLoggerOptions {
  service: string;
  level?: LoggerOptions['level'];
  pretty?: boolean;
  redactPaths?: string[];
  telemetry?: TelemetryAdapter;
  base?: Record<string, unknown>;
  destination?: DestinationStream;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const pretty =
    options.pretty ?? (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test');

  const destination: DestinationStream | undefined =
    options.destination ??
    (pretty
      ? (pino.transport({
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }) as DestinationStream)
      : undefined);

  return pino(
    {
      level: options.level ?? process.env.LOG_LEVEL ?? 'info',
      base: {
        service: options.service,
        ...options.base,
      },
      redact: options.redactPaths ?? [
        'password',
        'token',
        'accessToken',
        'refreshToken',
        'authorization',
        'secret',
        'apiKey',
      ],
      mixin(): Record<string, unknown> {
        const context = getRequestContext();
        return {
          ...context,
          ...pickTelemetryContext(options.telemetry),
        };
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    },
    destination,
  );
}
