import { PortfolioClient } from '../client';
import { HelpdeskClient } from './helpdesk.client';

describe('HelpdeskClient', () => {
  it('calls list workspaces endpoint', async () => {
    const client = new PortfolioClient({
      baseUrl: 'https://api.example.com',
      fetchFn: jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [
              {
                id: 'ws-1',
                organizationId: 'org-1',
                name: 'Support',
                slug: 'support',
                isActive: true,
                createdAt: '2026-07-03T12:00:00.000Z',
                updatedAt: '2026-07-03T12:00:00.000Z',
              },
            ],
            meta: { requestId: 'req-1' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
      retries: 0,
    });

    const helpdesk = new HelpdeskClient(client);
    const workspaces = await helpdesk.listWorkspaces();

    expect(workspaces).toHaveLength(1);
    expect(workspaces[0]?.slug).toBe('support');
  });
});
