# @portfolio/sdk

Typed HTTP client for consuming Portfolio OS APIs from apps and services.

## Features

- Fetch-based client with timeout, retry, and interceptors
- Standard `ApiResponse` / `ApiError` mapping from `@portfolio/shared`
- Domain client stubs (`auth`, `helpdesk`, `analytics`, `notification`, `chat`)
- Bearer token and request ID interceptors

## Installation

```bash
pnpm add @portfolio/sdk --filter @portfolio/your-app
```

## Usage

```typescript
import {
  PortfolioClient,
  bearerTokenInterceptor,
  createAuthApiClient,
} from '@portfolio/sdk';

const client = new PortfolioClient({
  baseUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
  requestInterceptors: [bearerTokenInterceptor(accessToken)],
});

const auth = createAuthApiClient(client);
const status = await auth.getStatus();
```

## Error handling

```typescript
import { SdkError } from '@portfolio/sdk';

try {
  await client.get('/resource');
} catch (error) {
  if (error instanceof SdkError && error.code === 'UNAUTHORIZED') {
    // refresh token flow
  }
}
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm build` | Compile TypeScript |
| `pnpm test` | Run unit tests |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript check |

## Foundation scope

This package provides the HTTP foundation only. Business endpoints are added per application milestone.
