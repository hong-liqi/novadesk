import { z } from 'zod';
import { TICKET_PRIORITY_LIST } from '../enums/ticket-priority';
import { TICKET_STATUS_LIST } from '../enums/ticket-status';

export const ticketSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  status: z.enum(TICKET_STATUS_LIST as [string, ...string[]]),
  priority: z.enum(TICKET_PRIORITY_LIST as [string, ...string[]]),
  assigneeId: z.string().uuid().nullable().optional(),
  customerId: z.string().uuid().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type TicketSchema = z.infer<typeof ticketSchema>;

export const createTicketSchema = ticketSchema.pick({
  workspaceId: true,
  title: true,
  description: true,
  priority: true,
  customerId: true,
});

export type CreateTicketSchema = z.infer<typeof createTicketSchema>;
