import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { MessageEntity } from '../../domain/entities/message.entity';
import type {
  CreateMessageInput,
  MessageRepositoryPort,
} from '../../application/ports/message.repository.port';

@Injectable()
export class MessageRepository implements MessageRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByTicket(workspaceId: string, ticketId: string): Promise<MessageEntity[]> {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id: ticketId, workspaceId },
    });
    if (!ticket) {
      return [];
    }
    return this.prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findById(workspaceId: string, id: string): Promise<MessageEntity | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
      include: { ticket: true },
    });
    if (!message) {
      return null;
    }
    if (message.ticket.workspaceId !== workspaceId) {
      return null;
    }
    const { ticket, ...entity } = message;
    void ticket;
    return entity;
  }

  create(input: CreateMessageInput): Promise<MessageEntity> {
    return this.prisma.message.create({ data: input });
  }
}
