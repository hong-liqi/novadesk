import { PortfolioClient } from '../client';

export class NotificationApiClient {
  constructor(private readonly client: PortfolioClient) {}

  async getStatus() {
    return this.client.get<{ service: string; status: string }>('/api/v1/notifications/status');
  }
}

export function createNotificationApiClient(client: PortfolioClient): NotificationApiClient {
  return new NotificationApiClient(client);
}
