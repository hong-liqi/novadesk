import { PortfolioClient } from '../client';

export class ChatApiClient {
  constructor(private readonly client: PortfolioClient) {}

  async getStatus() {
    return this.client.get<{ service: string; status: string }>('/api/v1/chat/status');
  }
}

export function createChatApiClient(client: PortfolioClient): ChatApiClient {
  return new ChatApiClient(client);
}
