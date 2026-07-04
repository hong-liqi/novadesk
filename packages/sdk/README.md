# @novadesk/sdk

Reusable HTTP client foundation for NovaDesk.

## Purpose

This package provides a typed fetch wrapper with:

- Timeout support
- Retry policy
- Request and response interceptors
- Consistent API and transport error mapping
- Request ID propagation

It intentionally avoids domain-specific endpoint clients.

## Public API

- `NovaDeskClient`
- `createSdkClient`
- `SdkError`
- `withRetry`
- `applyRequestInterceptors`
- `applyResponseInterceptors`
- `bearerTokenInterceptor`
- `requestIdInterceptor`
- `HttpMethod`
- `NovaDeskClientOptions`
- `RequestOptions`
- `RequestContext`
- `ResponseContext`
- `RequestInterceptor`
- `ResponseInterceptor`

## Installation

```bash
pnpm add @novadesk/sdk
```

## Usage

```ts
import { NovaDeskClient, bearerTokenInterceptor } from '@novadesk/sdk';

const client = new NovaDeskClient({
  baseUrl: 'https://api.example.com',
  requestInterceptors: [bearerTokenInterceptor(() => 'access-token')],
});

const response = await client.get<{ ok: boolean }>('/health');
```

## Error handling

```ts
import { SdkError } from '@novadesk/sdk';

try {
  await client.get('/protected');
} catch (error) {
  if (error instanceof SdkError && error.code === 'UNAUTHORIZED') {
    // refresh or redirect
  }
}
```

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | TypeScript build              |
| `pnpm test`      | Jest tests with coverage      |
| `pnpm lint`      | ESLint against `src/`         |
| `pnpm typecheck` | TypeScript no-emit validation |

## Notes

- The client expects API responses to use the `@novadesk/shared` envelope.
- Domain-specific clients should live in application packages once business endpoints exist.
