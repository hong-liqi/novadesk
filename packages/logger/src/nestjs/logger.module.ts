import {
  Global,
  Injectable,
  Module,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import type { Logger } from 'pino';
import { REQUEST_ID_HEADER } from '@portfolio/shared';
import { createLogger } from '../logger';
import { runWithContext } from '../context';

export const LOGGER = Symbol('LOGGER');

@Injectable()
export class LoggerService {
  constructor(private readonly logger: Logger) {}

  getLogger(): Logger {
    return this.logger;
  }
}

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const request = http.getRequest<{
      headers: Record<string, string | undefined>;
      method: string;
      url: string;
    }>();
    const response = http.getResponse<{ statusCode: number }>();

    const requestId = request.headers[REQUEST_ID_HEADER] ?? randomUUID();
    const service = process.env.SERVICE_NAME ?? 'unknown';
    const start = Date.now();

    return new Observable((subscriber) => {
      runWithContext({ requestId, service }, () => {
        this.loggerService.getLogger().info(
          { method: request.method, path: request.url },
          'request started',
        );

        next
          .handle()
          .pipe(
            tap({
              next: () => {
                this.loggerService.getLogger().info(
                  {
                    method: request.method,
                    path: request.url,
                    status: response.statusCode,
                    duration: Date.now() - start,
                  },
                  'request completed',
                );
              },
              error: (err: Error) => {
                this.loggerService.getLogger().error(
                  {
                    method: request.method,
                    path: request.url,
                    duration: Date.now() - start,
                    err,
                  },
                  'request failed',
                );
              },
            }),
          )
          .subscribe(subscriber);
      });
    });
  }
}

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: () => createLogger({ service: process.env.SERVICE_NAME ?? 'nestjs-app' }),
    },
    {
      provide: LoggerService,
      useFactory: (logger: Logger) => new LoggerService(logger),
      inject: [LOGGER],
    },
    LoggerInterceptor,
  ],
  exports: [LOGGER, LoggerService, LoggerInterceptor],
})
export class LoggerModule {}
