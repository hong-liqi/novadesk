import { PortfolioClient } from '../client';

export class HelpdeskApiClient {
  constructor(private readonly client: PortfolioClient) {}

  async getStatus() {
    return this.client.get<{ service: string; status: string }>('/api/v1/helpdesk/status');
  }
}

export function createHelpdeskApiClient(client: PortfolioClient): HelpdeskApiClient {
  return new HelpdeskApiClient(client);
}
