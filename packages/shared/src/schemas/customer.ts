import { z } from 'zod';

export const customerSchema = z.object({
  id: z.string().uuid(),
  workspaceId: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  company: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type CustomerSchema = z.infer<typeof customerSchema>;

export const createCustomerSchema = customerSchema.pick({
  workspaceId: true,
  email: true,
  name: true,
  company: true,
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
