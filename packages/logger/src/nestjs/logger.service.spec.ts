import { createLogger } from '../logger';
import { LoggerService } from './logger.service';

describe('LoggerService', () => {
  it('returns the injected pino logger', () => {
    const logger = createLogger({ service: 'test-service', pretty: false });
    const service = new LoggerService(logger);

    expect(service.getLogger()).toBe(logger);
  });
});
