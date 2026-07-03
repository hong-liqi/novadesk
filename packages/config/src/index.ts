import { z, type ZodType } from 'zod';

export function validateConfig<T extends ZodType>(
  schema: T,
  env: NodeJS.ProcessEnv = process.env,
): z.output<T> {
  const result = schema.safeParse(env);
  if (!result.success) {
    const formatted = result.error.flatten().fieldErrors;
    throw new Error(`Invalid configuration: ${JSON.stringify(formatted)}`);
  }
  const data = result.data as z.output<T>;
  return data;
}

export { baseConfigSchema } from './base.config';
export { databaseConfigSchema } from './database.config';
export { redisConfigSchema } from './redis.config';
export { authConfigSchema } from './auth.config';
export { observabilityConfigSchema } from './observability.config';
