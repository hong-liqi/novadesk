import { Global, Module } from '@nestjs/common';
import type { Logger } from 'pino';
import { createLogger } from '../logger';
import { LoggerInterceptor } from './logger.interceptor';
import { LoggerService } from './logger.service';

export const LOGGER = Symbol('LOGGER');

@Global()
@Module({
  providers: [
    {
      provide: LOGGER,
      useFactory: () =>
        createLogger({
          service: process.env.SERVICE_NAME ?? 'novadesk-service',
          pretty: process.env.NODE_ENV !== 'production',
        }),
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
