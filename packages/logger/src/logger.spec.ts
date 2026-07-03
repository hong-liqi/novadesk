import { createLogger } from './logger';

describe('createLogger', () => {
  it('should create a logger with service name', () => {
    const logger = createLogger({ service: 'test-service', pretty: false });
    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
  });
});
