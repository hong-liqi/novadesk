# @novadesk/tsconfig

Shared TypeScript configuration presets for NovaDesk.

## Exports

- `@novadesk/tsconfig`
- `@novadesk/tsconfig/base`
- `@novadesk/tsconfig/node`
- `@novadesk/tsconfig/react`
- `@novadesk/tsconfig/nestjs`

## Purpose

This package centralizes compiler settings so every project in the monorepo inherits the same strict baseline.

## Presets

| File          | Purpose                                         |
| ------------- | ----------------------------------------------- |
| `base.json`   | Strict compiler defaults shared by all packages |
| `node.json`   | Node.js libraries and backend services          |
| `react.json`  | React and Next.js applications                  |
| `nestjs.json` | NestJS services with decorators enabled         |

## Validation

The package ships with a lightweight Node-based validation suite that verifies each preset can be read and contains the expected compiler options.

## Scripts

| Script           | Description                 |
| ---------------- | --------------------------- |
| `pnpm build`     | Validates config exports    |
| `pnpm test`      | Node test runner validation |
| `pnpm lint`      | Validates config exports    |
| `pnpm typecheck` | Validates config exports    |
