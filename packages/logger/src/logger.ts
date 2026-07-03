import pino, { type Logger, type LoggerOptions } from 'pino';
import { getRequestContext } from './context';
import { redactPaths } from './redact';

export interface CreateLoggerOptions {
  service: string;
  level?: string;
  pretty?: boolean;
}

export function createLogger(options: CreateLoggerOptions): Logger {
  const isDev = process.env.NODE_ENV === 'development';
  const pinoOptions: LoggerOptions = {
    level: options.level ?? process.env.LOG_LEVEL ?? 'info',
    redact: { paths: redactPaths, censor: '[REDACTED]' },
    base: { service: options.service },
    mixin() {
      const ctx = getRequestContext();
      if (!ctx) return {};
      return {
        requestId: ctx.requestId,
        ...(ctx.userId ? { userId: ctx.userId } : {}),
        ...(ctx.tenantId ? { tenantId: ctx.tenantId } : {}),
      };
    },
    ...(options.pretty ?? isDev
      ? {
          transport: {
            target: 'pino-pretty',
            options: { colorize: true, translateTime: 'SYS:standard' },
          },
        }
      : {}),
  };

  return pino(pinoOptions);
}

export function createChildLogger(parent: Logger, module: string): Logger {
  return parent.child({ module });
}
