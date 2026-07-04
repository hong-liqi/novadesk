# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/auth-service/package.json ./services/auth-service/
RUN pnpm install --frozen-lockfile --filter @novadesk/auth-service...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/auth-service ./services/auth-service
RUN pnpm turbo run build --filter=@novadesk/auth-service

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S node -u 1001 -G nodejs
COPY --from=build --chown=node:nodejs /app/services/auth-service/dist ./dist
COPY --from=build --chown=node:nodejs /app/services/auth-service/package.json ./package.json
COPY --from=build --chown=node:nodejs /app/node_modules ./node_modules
USER node
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
