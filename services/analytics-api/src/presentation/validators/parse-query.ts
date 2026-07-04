import { BadRequestException } from '@nestjs/common';
import type { ZodSchema } from 'zod';

export function parseQuery<T>(schema: ZodSchema<T>, query: unknown): T {
  const result = schema.safeParse(query);
  if (!result.success) {
    throw new BadRequestException(result.error.flatten());
  }
  return result.data;
}
