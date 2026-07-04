import type { ZodTypeAny } from 'zod';

export type ConfigOf<TSchema extends ZodTypeAny> = TSchema['_output'];

export interface CreateConfigOptions {
  sourceName?: string;
}
