import { PortfolioClient } from '../client';

export class AuthApiClient {
  constructor(private readonly client: PortfolioClient) {}

  async getStatus() {
    return this.client.get<{ service: string; status: string }>('/api/v1/auth/status');
  }
}

export function createAuthApiClient(client: PortfolioClient): AuthApiClient {
  return new AuthApiClient(client);
}
