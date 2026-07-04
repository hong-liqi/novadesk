import { Inject, Injectable } from '@nestjs/common';
import type { DashboardStatsResponseDto } from '../dto/dashboard.dto';
import {
  DASHBOARD_REPOSITORY,
  type DashboardRepositoryPort,
} from '../ports/dashboard.repository.port';

@Injectable()
export class GetDashboardStatsUseCase {
  constructor(
    @Inject(DASHBOARD_REPOSITORY)
    private readonly repository: DashboardRepositoryPort,
  ) {}

  execute(workspaceId: string): Promise<DashboardStatsResponseDto> {
    return this.repository.getStats(workspaceId);
  }
}
