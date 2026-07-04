# @novadesk/logger

Structured logging foundation for NovaDesk.

## Purpose

This package wraps `pino` with a request-aware context store, consistent log shape and NestJS integration.

It is designed to work in development and production without changing calling code.

## Public API

- `createLogger`
- `runWithContext`
- `getRequestContext`
- `createRequestContext`
- `getRequestId`
- `LoggerModule`
- `LoggerService`
- `LoggerInterceptor`
- `LOGGER`

## OpenTelemetry readiness

The logger accepts a lightweight telemetry adapter interface so traces can be attached later without refactoring consumers.

## Installation

```bash
pnpm add @novadesk/logger
```

## Usage

```ts
import { createLogger, runWithContext } from '@novadesk/logger';

const logger = createLogger({ service: 'gateway' });

runWithContext({ requestId: 'req-123', service: 'gateway' }, () => {
  logger.info({ route: '/health' }, 'request completed');
});
```

## NestJS usage

```ts
import { LoggerModule } from '@novadesk/logger';

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
```

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | TypeScript build              |
| `pnpm test`      | Jest tests with coverage      |
| `pnpm lint`      | ESLint against `src/`         |
| `pnpm typecheck` | TypeScript no-emit validation |

## Notes

- Development logs can use pretty transport.
- Production logs remain JSON and machine readable.
- Request correlation uses `X-Request-Id` by default.
