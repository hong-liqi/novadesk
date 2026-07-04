import { z } from 'zod';

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
});

export const updateCustomerSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
