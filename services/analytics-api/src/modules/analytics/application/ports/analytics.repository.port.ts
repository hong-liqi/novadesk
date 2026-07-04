import type { KpisResponseDto, TrendsResponseDto } from '../dto/analytics.dto';

export const ANALYTICS_REPOSITORY = Symbol('ANALYTICS_REPOSITORY');

export interface AnalyticsRepositoryPort {
  getKpis(workspaceId: string): Promise<KpisResponseDto>;
  getTrends(workspaceId: string, days: number): Promise<TrendsResponseDto>;
  exportCsv(workspaceId: string): Promise<string>;
}
