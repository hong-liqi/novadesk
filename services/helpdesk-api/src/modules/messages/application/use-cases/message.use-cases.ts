import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  TICKET_REPOSITORY,
  type TicketRepositoryPort,
} from '@modules/tickets/application/ports/ticket.repository.port';
import type { CreateMessageDto, MessageResponseDto } from '../dto/message.dto';
import { MESSAGE_REPOSITORY, type MessageRepositoryPort } from '../ports/message.repository.port';
import type { MessageEntity } from '../../domain/entities/message.entity';

@Injectable()
export class ListMessagesUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepositoryPort,
    @Inject(TICKET_REPOSITORY)
    private readonly tickets: TicketRepositoryPort,
  ) {}

  async execute(workspaceId: string, ticketId: string): Promise<MessageResponseDto[]> {
    const ticket = await this.tickets.findById(workspaceId, ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const items = await this.repository.findByTicket(workspaceId, ticketId);
    return items.map(mapMessage);
  }
}

@Injectable()
export class GetMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepositoryPort,
  ) {}

  async execute(workspaceId: string, id: string): Promise<MessageResponseDto> {
    const message = await this.repository.findById(workspaceId, id);
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return mapMessage(message);
  }
}

@Injectable()
export class CreateMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly repository: MessageRepositoryPort,
    @Inject(TICKET_REPOSITORY)
    private readonly tickets: TicketRepositoryPort,
  ) {}

  async execute(
    workspaceId: string,
    ticketId: string,
    authorId: string | undefined,
    dto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const ticket = await this.tickets.findById(workspaceId, ticketId);
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    const message = await this.repository.create({
      ticketId,
      authorId,
      body: dto.body,
      type: dto.type,
    });
    return mapMessage(message);
  }
}

function mapMessage(message: MessageEntity): MessageResponseDto {
  return {
    id: message.id,
    ticketId: message.ticketId,
    authorId: message.authorId,
    body: message.body,
    type: message.type,
    createdAt: message.createdAt.toISOString(),
    updatedAt: message.updatedAt.toISOString(),
  };
}
