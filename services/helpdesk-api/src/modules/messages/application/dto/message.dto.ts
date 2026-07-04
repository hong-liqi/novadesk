import type { MessageType } from '@generated/prisma';

export interface CreateMessageDto {
  body: string;
  type?: MessageType;
}

export interface MessageResponseDto {
  id: string;
  ticketId: string;
  authorId: string | null;
  body: string;
  type: MessageType;
  createdAt: string;
  updatedAt: string;
}
