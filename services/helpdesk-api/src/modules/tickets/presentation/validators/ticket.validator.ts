import { TicketPriority, TicketStatus } from '@generated/prisma';
import { z } from 'zod';

export const createTicketSchema = z.object({
  subject: z.string().min(1).max(500),
  customerId: z.string().uuid().optional(),
  contactId: z.string().uuid().optional(),
  priority: z.nativeEnum(TicketPriority).optional(),
  channelId: z.string().uuid().optional(),
});

export const updateTicketSchema = z
  .object({
    subject: z.string().min(1).max(500).optional(),
    customerId: z.string().uuid().nullable().optional(),
    contactId: z.string().uuid().nullable().optional(),
    priority: z.nativeEnum(TicketPriority).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export const updateTicketStatusSchema = z.object({
  status: z.nativeEnum(TicketStatus),
});

export const assignTicketSchema = z.object({
  assigneeId: z.string().uuid().nullable(),
  teamId: z.string().uuid().nullable().optional(),
});

export const listTicketsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  status: z.nativeEnum(TicketStatus).optional(),
  statuses: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) {
        return undefined;
      }

      const parsed = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      return parsed.length > 0 ? z.array(z.nativeEnum(TicketStatus)).parse(parsed) : undefined;
    }),
});
