import { Module } from '@nestjs/common';
import { AnalyticsRepository } from './infrastructure/persistence/analytics.repository';
import { ANALYTICS_REPOSITORY } from './application/ports/analytics.repository.port';
import {
  ExportCsvUseCase,
  GetKpisUseCase,
  GetTrendsUseCase,
} from './application/use-cases/analytics.use-cases';
import { AnalyticsController } from './presentation/controllers/analytics.controller';

@Module({
  controllers: [AnalyticsController],
  providers: [
    GetKpisUseCase,
    GetTrendsUseCase,
    ExportCsvUseCase,
    {
      provide: ANALYTICS_REPOSITORY,
      useClass: AnalyticsRepository,
    },
  ],
})
export class AnalyticsModule {}
