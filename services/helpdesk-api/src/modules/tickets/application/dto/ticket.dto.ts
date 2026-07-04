import type { TicketPriority, TicketStatus } from '@generated/prisma';

export interface CreateTicketDto {
  subject: string;
  customerId?: string;
  contactId?: string;
  priority?: TicketPriority;
  channelId?: string;
}

export interface UpdateTicketDto {
  subject?: string;
  customerId?: string | null;
  contactId?: string | null;
  priority?: TicketPriority;
}

export interface UpdateTicketStatusDto {
  status: TicketStatus;
}

export interface AssignTicketDto {
  assigneeId: string | null;
  teamId?: string | null;
}

export interface ListTicketsQueryDto {
  page?: number;
  limit?: number;
  status?: TicketStatus;
}

export interface TicketResponseDto {
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
  createdAt: string;
  updatedAt: string;
}
