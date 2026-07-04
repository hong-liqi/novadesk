# Storybook (foundation)

Storybook is not wired in CI for M0. Use this layout when enabling visual docs:

```
.storybook/
  main.ts       # @storybook/react-vite
  preview.ts    # imports ../src/styles/tokens.css
src/components/
  Button.stories.tsx
```

Recommended packages:

```bash
pnpm add -D storybook @storybook/react-vite @storybook/react --filter @novadesk/ui
```

Run locally:

```bash
pnpm --filter @novadesk/ui exec storybook dev -p 6006
```
