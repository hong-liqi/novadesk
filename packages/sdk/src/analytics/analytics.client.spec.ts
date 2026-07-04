import { PortfolioClient } from '../client';
import { AnalyticsClient, createAnalyticsClient } from './analytics.client';

describe('AnalyticsClient', () => {
  it('calls KPI endpoint with workspace id', async () => {
    const client = new PortfolioClient({
      baseUrl: 'https://api.example.com',
      fetchFn: jest.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: {
              workspaceId: 'ws-1',
              open: 4,
              resolved: 12,
              avgResolutionTimeHours: 2.5,
            },
            meta: { requestId: 'req-kpis' },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
      retries: 0,
    });

    const analytics = new AnalyticsClient(client);
    const kpis = await analytics.getKpis('ws-1');

    expect(kpis.open).toBe(4);
    expect(kpis.workspaceId).toBe('ws-1');
  });

  it('calls trends endpoint with optional days', async () => {
    const fetchFn = jest.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: {
            workspaceId: 'ws-1',
            days: 7,
            points: [],
          },
          meta: { requestId: 'req-trends' },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const client = new PortfolioClient({
      baseUrl: 'https://api.example.com',
      fetchFn,
      retries: 0,
    });

    const analytics = new AnalyticsClient(client);
    await analytics.getTrends({ workspaceId: 'ws-1', days: 7 });

    expect(fetchFn).toHaveBeenCalledWith(
      expect.stringContaining('workspaceId=ws-1'),
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('exports CSV as plain text', async () => {
    const client = new PortfolioClient({
      baseUrl: 'https://api.example.com',
      fetchFn: jest.fn().mockResolvedValue(
        new Response('ticketId,status\n1,open', {
          status: 200,
          headers: { 'Content-Type': 'text/csv' },
        }),
      ),
      retries: 0,
    });

    const analytics = createAnalyticsClient(client);
    const csv = await analytics.exportCsv('ws-1');

    expect(csv).toContain('ticketId,status');
  });
});
