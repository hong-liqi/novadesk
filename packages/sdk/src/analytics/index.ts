import { PortfolioClient } from '../client';

export class AnalyticsApiClient {
  constructor(private readonly client: PortfolioClient) {}

  async getStatus() {
    return this.client.get<{ service: string; status: string }>('/api/v1/analytics/status');
  }
}

export function createAnalyticsApiClient(client: PortfolioClient): AnalyticsApiClient {
  return new AnalyticsApiClient(client);
}
