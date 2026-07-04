import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type {
  KpisResponseDto,
  TrendPointDto,
  TrendsResponseDto,
} from '../../application/dto/analytics.dto';
import type { AnalyticsRepositoryPort } from '../../application/ports/analytics.repository.port';

const MOCK_OPEN = 42;
const MOCK_RESOLVED = 128;
const MOCK_AVG_RESOLUTION_HOURS = 4.5;

function hashSeed(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function mockDailyPoint(workspaceId: string, date: Date): TrendPointDto {
  const seed = hashSeed(`${workspaceId}:${date.toISOString().slice(0, 10)}`);
  return {
    date: date.toISOString().slice(0, 10),
    openCount: 28 + (seed % 18),
    createdCount: 4 + (seed % 9),
    resolvedCount: 3 + (seed % 7),
  };
}

@Injectable()
export class AnalyticsRepository implements AnalyticsRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getKpis(workspaceId: string): Promise<KpisResponseDto> {
    const snapshot = await this.prisma.workspaceKpiSnapshot.findFirst({
      where: { workspaceId },
      orderBy: { capturedAt: 'desc' },
    });

    if (snapshot) {
      return {
        workspaceId,
        open: snapshot.openTickets,
        resolved: snapshot.resolvedTickets,
        avgResolutionTimeHours: snapshot.avgResolutionTimeHours,
      };
    }

    return {
      workspaceId,
      open: MOCK_OPEN,
      resolved: MOCK_RESOLVED,
      avgResolutionTimeHours: MOCK_AVG_RESOLUTION_HOURS,
    };
  }

  async getTrends(workspaceId: string, days: number): Promise<TrendsResponseDto> {
    const end = new Date();
    end.setUTCHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - (days - 1));

    const metrics = await this.prisma.ticketMetricDaily.findMany({
      where: {
        workspaceId,
        date: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { date: 'asc' },
    });

    if (metrics.length > 0) {
      return {
        workspaceId,
        days,
        points: metrics.map((metric) => ({
          date: metric.date.toISOString().slice(0, 10),
          openCount: metric.openCount,
          createdCount: metric.createdCount,
          resolvedCount: metric.resolvedCount,
        })),
      };
    }

    const points: TrendPointDto[] = [];
    for (let offset = 0; offset < days; offset += 1) {
      const date = new Date(start);
      date.setUTCDate(start.getUTCDate() + offset);
      points.push(mockDailyPoint(workspaceId, date));
    }

    return {
      workspaceId,
      days,
      points,
    };
  }

  async exportCsv(workspaceId: string): Promise<string> {
    const trends = await this.getTrends(workspaceId, 30);
    const header = 'date,open,created,resolved';
    const rows = trends.points.map(
      (point) =>
        `${point.date},${String(point.openCount)},${String(point.createdCount)},${String(point.resolvedCount)}`,
    );

    return [header, ...rows].join('\n');
  }
}
