import { MessageType } from '@generated/prisma';
import { z } from 'zod';

export const createMessageSchema = z.object({
  body: z.string().min(1),
  type: z.nativeEnum(MessageType).optional().default(MessageType.INTERNAL),
});
