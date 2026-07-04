import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardRepository } from './infrastructure/persistence/dashboard.repository';
import { DASHBOARD_REPOSITORY } from './application/ports/dashboard.repository.port';
import { GetDashboardStatsUseCase } from './application/use-cases/dashboard.use-cases';

@Module({
  controllers: [DashboardController],
  providers: [
    GetDashboardStatsUseCase,
    {
      provide: DASHBOARD_REPOSITORY,
      useClass: DashboardRepository,
    },
  ],
  exports: [DASHBOARD_REPOSITORY],
})
export class DashboardModule {}
