# @novadesk/shared

Foundation package for contracts, helpers and standardized errors reused by every application in NovaDesk.

## Purpose

This package contains only framework-agnostic primitives:

- Shared types and DTOs
- Zod schemas for cross-package contracts
- Constants used across the monorepo
- Pure helpers and utilities
- Standard error classes for predictable failure handling

It does not contain business rules or application-specific workflows.

## Public API

### Constants

- `REQUEST_ID_HEADER`
- `AUTHORIZATION_HEADER`
- `USER_ID_HEADER`
- `TENANT_ID_HEADER`
- `ROLES_HEADER`
- `PERMISSIONS_HEADER`
- `DEFAULT_PAGE_SIZE`
- `MAX_PAGE_SIZE`
- `ROLES`
- `ROLE_LIST`

### DTOs and types

- `ApiResponse<T>`
- `ApiError`
- `PaginationMeta`
- `CursorPage<T>`
- `RequestContext`

### Schemas

- `eventEnvelopeSchema`

### Errors

- `NovaDeskError`
- `ValidationError`
- `AuthenticationError`
- `AuthorizationError`
- `NotFoundError`
- `ConflictError`
- `RateLimitError`
- `ExternalServiceError`

### Helpers

- `createCursor`
- `parseCursor`
- `normalizePageSize`
- `isDefined`
- `isNonEmptyString`
- `safeJsonParse`

## Installation

```bash
pnpm add @novadesk/shared
```

## Usage

```ts
import {
  AuthenticationError,
  createCursor,
  eventEnvelopeSchema,
  normalizePageSize,
} from '@novadesk/shared';

const cursor = createCursor('ticket-123');
const pageSize = normalizePageSize(250);

const parsed = eventEnvelopeSchema.safeParse({
  eventId: '550e8400-e29b-41d4-a716-446655440000',
  eventType: 'ticket.created',
  timestamp: new Date().toISOString(),
  source: 'helpdesk-api',
  payload: {},
});

if (!parsed.success) {
  throw new AuthenticationError();
}
```

## Scripts

| Script           | Description                                 |
| ---------------- | ------------------------------------------- |
| `pnpm build`     | TypeScript declaration and JavaScript build |
| `pnpm test`      | Jest unit tests with coverage               |
| `pnpm lint`      | ESLint against `src/`                       |
| `pnpm typecheck` | TypeScript no-emit validation               |

## Notes

- Public exports are organized through `src/index.ts`.
- All helpers are pure and deterministic.
- Error classes serialize cleanly with `toJSON()`.
