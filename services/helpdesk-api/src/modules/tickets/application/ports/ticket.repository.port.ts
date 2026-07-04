import type { TicketPriority, TicketStatus } from '@generated/prisma';
import type { PaginatedResult } from '@shared/types/pagination';
import type { TicketEntity } from '../../domain/entities/ticket.entity';

export const TICKET_REPOSITORY = Symbol('TICKET_REPOSITORY');

export interface CreateTicketInput {
  workspaceId: string;
  subject: string;
  customerId?: string;
  contactId?: string;
  priority?: TicketPriority;
  channelId?: string;
}

export interface UpdateTicketInput {
  subject?: string;
  customerId?: string | null;
  contactId?: string | null;
  priority?: TicketPriority;
}

export interface ListTicketsInput {
  workspaceId: string;
  page: number;
  limit: number;
  status?: TicketStatus;
}

export interface AssignTicketInput {
  assigneeId: string | null;
  teamId?: string | null;
}

export interface TicketRepositoryPort {
  findMany(input: ListTicketsInput): Promise<PaginatedResult<TicketEntity>>;
  findById(workspaceId: string, id: string): Promise<TicketEntity | null>;
  create(input: CreateTicketInput): Promise<TicketEntity>;
  update(workspaceId: string, id: string, input: UpdateTicketInput): Promise<TicketEntity>;
  updateStatus(workspaceId: string, id: string, status: TicketStatus): Promise<TicketEntity>;
  assign(workspaceId: string, id: string, input: AssignTicketInput): Promise<TicketEntity>;
  delete(workspaceId: string, id: string): Promise<void>;
}
