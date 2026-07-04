import type { TicketPriority } from '../enums/ticket-priority';
import type { TicketStatus } from '../enums/ticket-status';

export interface Ticket {
  id: string;
  workspaceId: string;
  title: string;
  description?: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  assigneeId?: string | null;
  customerId?: string | null;
  createdAt: string;
  updatedAt: string;
}
