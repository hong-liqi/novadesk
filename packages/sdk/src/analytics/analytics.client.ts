import type { NovaDeskClient } from '../client';

export interface AnalyticsKpis {
  workspaceId: string;
  open: number;
  resolved: number;
  avgResolutionTimeHours: number;
}

export interface AnalyticsTrendPoint {
  date: string;
  openCount: number;
  createdCount: number;
  resolvedCount: number;
}

export interface AnalyticsTrends {
  workspaceId: string;
  days: number;
  points: AnalyticsTrendPoint[];
}

export interface GetTrendsParams {
  workspaceId: string;
  days?: number;
}

export class AnalyticsClient {
  constructor(private readonly client: NovaDeskClient) {}

  getKpis(workspaceId: string): Promise<AnalyticsKpis> {
    return this.client
      .get<AnalyticsKpis>('/analytics/kpis', { params: { workspaceId } })
      .then((response) => response.data);
  }

  getTrends(params: GetTrendsParams): Promise<AnalyticsTrends> {
    return this.client
      .get<AnalyticsTrends>('/analytics/trends', {
        params: {
          workspaceId: params.workspaceId,
          days: params.days,
        },
      })
      .then((response) => response.data);
  }

  exportCsv(workspaceId: string): Promise<string> {
    return this.client.getText('/analytics/export', { params: { workspaceId } });
  }
}

export function createAnalyticsClient(client: NovaDeskClient): AnalyticsClient {
  return new AnalyticsClient(client);
}
