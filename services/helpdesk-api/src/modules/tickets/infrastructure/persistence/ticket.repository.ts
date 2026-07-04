import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import { toPaginatedResult, type PaginatedResult } from '@shared/types/pagination';
import type { TicketEntity } from '../../domain/entities/ticket.entity';
import type {
  AssignTicketInput,
  CreateTicketInput,
  ListTicketsInput,
  TicketRepositoryPort,
  UpdateTicketInput,
} from '../../application/ports/ticket.repository.port';
import type { TicketStatus } from '@generated/prisma';

@Injectable()
export class TicketRepository implements TicketRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(input: ListTicketsInput): Promise<PaginatedResult<TicketEntity>> {
    const where = {
      workspaceId: input.workspaceId,
      ...(input.status ? { status: input.status } : {}),
    };
    const skip = (input.page - 1) * input.limit;

    const [items, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: input.limit,
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return toPaginatedResult(items, total, input.page, input.limit);
  }

  findById(workspaceId: string, id: string): Promise<TicketEntity | null> {
    return this.prisma.ticket.findFirst({ where: { id, workspaceId } });
  }

  create(input: CreateTicketInput): Promise<TicketEntity> {
    return this.prisma.ticket.create({ data: input });
  }

  async update(workspaceId: string, id: string, input: UpdateTicketInput): Promise<TicketEntity> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      throw new Error('Ticket not found');
    }
    return this.prisma.ticket.update({ where: { id }, data: input });
  }

  async updateStatus(workspaceId: string, id: string, status: TicketStatus): Promise<TicketEntity> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      throw new Error('Ticket not found');
    }
    return this.prisma.ticket.update({ where: { id }, data: { status } });
  }

  async assign(workspaceId: string, id: string, input: AssignTicketInput): Promise<TicketEntity> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      throw new Error('Ticket not found');
    }
    return this.prisma.ticket.update({
      where: { id },
      data: {
        assigneeId: input.assigneeId,
        teamId: input.teamId ?? null,
      },
    });
  }

  async delete(workspaceId: string, id: string): Promise<void> {
    const existing = await this.findById(workspaceId, id);
    if (!existing) {
      return;
    }
    await this.prisma.ticket.delete({ where: { id } });
  }
}
