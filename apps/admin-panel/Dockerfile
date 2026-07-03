# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/admin-panel/package.json ./apps/admin-panel/
RUN pnpm install --frozen-lockfile --filter @portfolio/admin-panel...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/admin-panel ./apps/admin-panel
RUN pnpm turbo run build --filter=@portfolio/admin-panel

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S node -u 1001 -G nodejs
ENV NODE_ENV=production
ENV PORT=3012
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/admin-panel/public ./apps/admin-panel/public
COPY --from=build --chown=node:nodejs /app/apps/admin-panel/.next/standalone ./
COPY --from=build --chown=node:nodejs /app/apps/admin-panel/.next/static ./apps/admin-panel/.next/static
USER node
EXPOSE 3012
CMD ["node", "apps/admin-panel/server.js"]
