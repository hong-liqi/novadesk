import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { TicketStatus } from '@generated/prisma';
import type { DashboardStats } from '../../domain/entities/dashboard.entity';
import type { DashboardRepositoryPort } from '../../application/ports/dashboard.repository.port';

@Injectable()
export class DashboardRepository implements DashboardRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(workspaceId: string): Promise<DashboardStats> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      openTickets,
      pendingTickets,
      resolvedToday,
      closedTickets,
      totalCustomers,
      totalTickets,
    ] = await Promise.all([
      this.prisma.ticket.count({ where: { workspaceId, status: TicketStatus.OPEN } }),
      this.prisma.ticket.count({ where: { workspaceId, status: TicketStatus.PENDING } }),
      this.prisma.ticket.count({
        where: {
          workspaceId,
          status: TicketStatus.RESOLVED,
          updatedAt: { gte: startOfDay },
        },
      }),
      this.prisma.ticket.count({ where: { workspaceId, status: TicketStatus.CLOSED } }),
      this.prisma.customer.count({ where: { workspaceId } }),
      this.prisma.ticket.count({ where: { workspaceId } }),
    ]);

    return {
      openTickets,
      pendingTickets,
      resolvedToday,
      closedTickets,
      totalCustomers,
      totalTickets,
    };
  }
}
