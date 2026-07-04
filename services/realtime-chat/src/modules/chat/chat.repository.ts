import { Injectable } from '@nestjs/common';
import { PrismaService } from '@infrastructure/database/prisma.service';
import type { ChatMessageResponse } from './chat.types';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMessagesByTicket(ticketId: string, limit = 50): Promise<ChatMessageResponse[]> {
    const messages = await this.prisma.chatMessage.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return messages.map((message) => ({
      id: message.id,
      ticketId: message.ticketId,
      userId: message.userId,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
    }));
  }

  async createMessage(
    ticketId: string,
    userId: string,
    body: string,
  ): Promise<ChatMessageResponse> {
    const message = await this.prisma.chatMessage.create({
      data: { ticketId, userId, body },
    });

    return {
      id: message.id,
      ticketId: message.ticketId,
      userId: message.userId,
      body: message.body,
      createdAt: message.createdAt.toISOString(),
    };
  }
}
