# @novadesk/eslint-config

Shared ESLint flat config presets for NovaDesk.

## Exports

- `@novadesk/eslint-config`
- `@novadesk/eslint-config/base`
- `@novadesk/eslint-config/node`
- `@novadesk/eslint-config/react`
- `@novadesk/eslint-config/nestjs`

## Purpose

This package centralizes linting rules so all packages share the same baseline for TypeScript, Node, React and NestJS projects.

## Usage

```js
import eslintConfig from '@novadesk/eslint-config/react';

export default eslintConfig;
```

## Validation

The package includes a small validation test suite that ensures each preset exports a flat config array and keeps the base rules aligned.

## Scripts

| Script           | Description                 |
| ---------------- | --------------------------- |
| `pnpm build`     | Validates config exports    |
| `pnpm test`      | Node test runner validation |
| `pnpm lint`      | Validates config exports    |
| `pnpm typecheck` | Validates config exports    |
