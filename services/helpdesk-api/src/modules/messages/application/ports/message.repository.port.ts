import type { MessageType } from '@generated/prisma';
import type { MessageEntity } from '../../domain/entities/message.entity';

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');

export interface CreateMessageInput {
  ticketId: string;
  authorId?: string;
  body: string;
  type?: MessageType;
}

export interface MessageRepositoryPort {
  findByTicket(workspaceId: string, ticketId: string): Promise<MessageEntity[]>;
  findById(workspaceId: string, id: string): Promise<MessageEntity | null>;
  create(input: CreateMessageInput): Promise<MessageEntity>;
}
