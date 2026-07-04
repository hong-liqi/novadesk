import type { MessageType } from '@generated/prisma';

export interface MessageEntity {
  id: string;
  ticketId: string;
  authorId: string | null;
  body: string;
  type: MessageType;
  createdAt: Date;
  updatedAt: Date;
}
