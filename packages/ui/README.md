# @novadesk/ui

Reusable design system foundation for NovaDesk.

## Purpose

This package provides the visual primitives shared by all future frontend applications:

- Design tokens
- Light and dark theme primitives
- Base typography, spacing and color scale
- Small reusable components
- Icon primitives
- Storybook bootstrap structure

It does not contain application-specific screens or business flows.

## Public API

- `designTokens`
- `tokens`
- `themes`
- `ThemeMode`
- `ThemeProvider`
- `useTheme`
- `ThemeScript`
- `Button`
- `Text`
- `Stack`
- `Surface`
- `VisuallyHidden`
- `Icon`
- `IconName`

## Installation

```bash
pnpm add @novadesk/ui react react-dom
```

## Usage

```tsx
import { Button, ThemeProvider, Text } from '@novadesk/ui';

export function Example() {
  return (
    <ThemeProvider defaultMode="dark">
      <Text as="p" tone="muted">
        Shared UI foundation
      </Text>
      <Button variant="primary">Continue</Button>
    </ThemeProvider>
  );
}
```

## Storybook structure

The package includes a minimal `.storybook/` bootstrap so future stories can be added without rethinking the folder structure.

## Scripts

| Script           | Description                   |
| ---------------- | ----------------------------- |
| `pnpm build`     | TypeScript build              |
| `pnpm test`      | Vitest component tests        |
| `pnpm lint`      | ESLint against `src/`         |
| `pnpm typecheck` | TypeScript no-emit validation |

## Notes

- Tokens are exported as plain TypeScript objects for maximum reuse.
- Theme primitives are client-safe and do not require a global store.
- Components prefer semantic class names so consuming apps can style them consistently.
