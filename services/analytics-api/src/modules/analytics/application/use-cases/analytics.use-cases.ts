import { Inject, Injectable } from '@nestjs/common';
import type { KpisResponseDto, TrendsResponseDto } from '../dto/analytics.dto';
import {
  ANALYTICS_REPOSITORY,
  type AnalyticsRepositoryPort,
} from '../ports/analytics.repository.port';

@Injectable()
export class GetKpisUseCase {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private readonly repository: AnalyticsRepositoryPort,
  ) {}

  execute(workspaceId: string): Promise<KpisResponseDto> {
    return this.repository.getKpis(workspaceId);
  }
}

@Injectable()
export class GetTrendsUseCase {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private readonly repository: AnalyticsRepositoryPort,
  ) {}

  execute(workspaceId: string, days: number): Promise<TrendsResponseDto> {
    return this.repository.getTrends(workspaceId, days);
  }
}

@Injectable()
export class ExportCsvUseCase {
  constructor(
    @Inject(ANALYTICS_REPOSITORY)
    private readonly repository: AnalyticsRepositoryPort,
  ) {}

  execute(workspaceId: string): Promise<string> {
    return this.repository.exportCsv(workspaceId);
  }
}
