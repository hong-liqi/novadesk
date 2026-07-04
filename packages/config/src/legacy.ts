/**
 * Backward-compatible aliases for services created before the config API rename.
 * @deprecated Prefer baseEnvSchema, createConfig, etc.
 */
export {
  authEnvSchema as authConfigSchema,
  baseEnvSchema as baseConfigSchema,
  databaseEnvSchema as databaseConfigSchema,
  observabilityEnvSchema as observabilityConfigSchema,
  redisEnvSchema as redisConfigSchema,
} from './schemas';

export { createConfig as validateConfig } from './create-config';
