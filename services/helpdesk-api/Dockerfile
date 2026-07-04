# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/helpdesk-api/package.json ./services/helpdesk-api/
RUN pnpm install --frozen-lockfile --filter @portfolio/helpdesk-api...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/helpdesk-api ./services/helpdesk-api
RUN pnpm --filter @portfolio/helpdesk-api db:generate
RUN pnpm turbo run build --filter=@portfolio/helpdesk-api

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S node -u 1001 -G nodejs
COPY --from=build --chown=node:nodejs /app/services/helpdesk-api/dist ./dist
COPY --from=build --chown=node:nodejs /app/services/helpdesk-api/package.json ./package.json
COPY --from=build --chown=node:nodejs /app/node_modules ./node_modules
USER node
ENV NODE_ENV=production
EXPOSE 3003
CMD ["node", "dist/main.js"]
