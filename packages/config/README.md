# @portfolio/config

Zod-based environment configuration schemas for Portfolio OS services.

## Exports

- `validateConfig` — parse and validate env vars
- `baseConfigSchema`, `redisConfigSchema`, `authConfigSchema`, etc.

## Usage

Import schemas in service bootstrap and call `validateConfig(schema, process.env)`.
