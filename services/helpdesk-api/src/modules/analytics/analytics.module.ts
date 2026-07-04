import { Module } from '@nestjs/common';
import { AnalyticsController } from './presentation/controllers/analytics.controller';
import { AnalyticsRepository } from './infrastructure/persistence/analytics.repository';
import { ANALYTICS_REPOSITORY } from './application/ports/analytics.repository.port';

@Module({
  controllers: [AnalyticsController],
  providers: [
    {
      provide: ANALYTICS_REPOSITORY,
      useClass: AnalyticsRepository,
    },
  ],
  exports: [ANALYTICS_REPOSITORY],
})
export class AnalyticsModule {}
