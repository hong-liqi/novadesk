import { z } from 'zod';

export const createContactSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
});

export const updateContactSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    email: z.string().email().nullable().optional(),
    phone: z.string().max(50).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });
