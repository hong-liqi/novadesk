import type { ZodEffects, ZodTypeAny } from 'zod';
import { ConfigValidationError } from './errors';
import type { ConfigOf, CreateConfigOptions } from './types';

export function createConfig<TSchema extends ZodTypeAny>(
  schema: TSchema,
  env: NodeJS.ProcessEnv,
  options: CreateConfigOptions = {},
): ConfigOf<TSchema> {
  const parsed = schema.safeParse(env);
  if (!parsed.success) {
    const issueSummary = parsed.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new ConfigValidationError(
      options.sourceName
        ? `Invalid configuration for ${options.sourceName}: ${issueSummary}`
        : `Invalid configuration: ${issueSummary}`,
      {
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
      },
    );
  }

  return parsed.data as ConfigOf<TSchema>;
}

export function loadConfig<TSchema extends ZodTypeAny>(
  schema: TSchema,
  env: NodeJS.ProcessEnv = process.env,
  options?: CreateConfigOptions,
): ConfigOf<TSchema> {
  return createConfig(schema, env, options);
}

export function withDefaults<TSchema extends ZodTypeAny>(
  schema: TSchema,
  defaults: Record<string, unknown>,
): ZodEffects<TSchema> {
  return schema.transform((value: unknown) => ({
    ...defaults,
    ...(typeof value === 'object' && value !== null ? value : {}),
  }));
}

export function stringToBoolean(value: unknown): boolean | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  if (['true', '1', 'yes', 'on'].includes(value.toLowerCase())) {
    return true;
  }

  if (['false', '0', 'no', 'off'].includes(value.toLowerCase())) {
    return false;
  }

  return undefined;
}

export function commaSeparatedList(value: unknown): string[] | undefined {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return undefined;
  }

  return value
    .split(/[,\n]+/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}
