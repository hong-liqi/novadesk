import { Test } from '@nestjs/testing';
import { LOGGER, LoggerModule } from './logger.module';
import { LoggerService } from './logger.service';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerModule', () => {
  it('registers logger providers', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [LoggerModule],
    }).compile();

    expect(moduleRef.get(LOGGER)).toBeDefined();
    expect(moduleRef.get(LoggerService).getLogger()).toBe(moduleRef.get(LOGGER));
    expect(moduleRef.get(LoggerInterceptor)).toBeInstanceOf(LoggerInterceptor);
  });
});
