# @portfolio/auth

Authentication foundation for Portfolio OS.

## Purpose

This package provides reusable building blocks for future authentication and authorization flows:

- JWT and refresh token types
- RBAC and permission metadata
- NestJS guards and decorators
- Middleware to normalize request identity
- Helpers for token parsing and claim handling

It does not implement the final authentication product.

## Public API

- `JwtPayload`
- `AuthUser`
- `AuthRequest`
- `AuthStrategyConfig`
- `RefreshTokenRecord`
- `JwtAuthGuard`
- `RolesGuard`
- `PermissionsGuard`
- `AuthContextMiddleware`
- `Public`
- `Roles`
- `Permissions`
- `CurrentUser`
- `parseBearerToken`
- `normalizeRoles`
- `normalizePermissions`
- `extractRequestIdentity`

## Installation

```bash
pnpm add @portfolio/auth
```

## Usage

```ts
import { CurrentUser, JwtAuthGuard, Roles } from '@portfolio/auth';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  @Get()
  @Roles('admin')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
```

## Strategy support

Prepared for:

- JWT access tokens
- Refresh token rotation
- RBAC
- Permission-based authorization

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | TypeScript build              |
| `pnpm test`      | Jest tests with coverage      |
| `pnpm lint`      | ESLint against `src/`         |
| `pnpm typecheck` | TypeScript no-emit validation |

## Notes

- Guards are intentionally lightweight and infrastructure agnostic.
- JWT verification is deferred to the future Auth Service implementation.
- The package expects gateway-injected identity headers or a populated `request.user`.
