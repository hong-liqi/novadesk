# @portfolio/eslint-config

Shared ESLint flat config presets for Portfolio OS.

## Exports

- `@portfolio/eslint-config`
- `@portfolio/eslint-config/base`
- `@portfolio/eslint-config/node`
- `@portfolio/eslint-config/react`
- `@portfolio/eslint-config/nestjs`

## Purpose

This package centralizes linting rules so all packages share the same baseline for TypeScript, Node, React and NestJS projects.

## Usage

```js
import eslintConfig from '@portfolio/eslint-config/react';

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
