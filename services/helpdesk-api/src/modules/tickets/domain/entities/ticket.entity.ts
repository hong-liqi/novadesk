import type { TicketPriority, TicketStatus } from '@generated/prisma';

export interface TicketEntity {
  id: string;
  workspaceId: string;
  customerId: string | null;
  contactId: string | null;
  assigneeId: string | null;
  teamId: string | null;
  channelId: string | null;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}
