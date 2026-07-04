# @novadesk/config

Centralized, typed environment configuration for NovaDesk.

## Purpose

This package provides the canonical Zod schemas used to validate runtime configuration at process startup.

It keeps environment parsing consistent across services and applications without coupling them to application-specific behavior.

## Public API

- `baseEnvSchema`
- `databaseEnvSchema`
- `redisEnvSchema`
- `authEnvSchema`
- `observabilityEnvSchema`
- `clientEnvSchema`
- `serviceEnvSchema`
- `createConfig`
- `loadConfig`
- `type ConfigOf<T>`

## Installation

```bash
pnpm add @novadesk/config
```

## Usage

```ts
import { createConfig, serviceEnvSchema } from '@novadesk/config';

const config = createConfig(serviceEnvSchema, process.env);

console.log(config.PORT);
```

## What it validates

- Required and optional environment variables
- Integer and boolean coercion
- URL and URI formatting
- Cross-field defaults where needed
- Safe failure with a descriptive error

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | Compiles the package          |
| `pnpm test`      | Jest tests with coverage      |
| `pnpm lint`      | ESLint against `src/`         |
| `pnpm typecheck` | TypeScript no-emit validation |

## Notes

- Validation happens before business logic starts.
- Consumers should treat `process.env` as untrusted input.
- This package deliberately avoids application defaults that vary by domain.
