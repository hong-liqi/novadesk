import { Injectable } from '@nestjs/common';
import type { Logger } from 'pino';

@Injectable()
export class LoggerService {
  constructor(private readonly logger: Logger) {}

  getLogger(): Logger {
    return this.logger;
  }
}
