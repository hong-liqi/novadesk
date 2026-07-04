# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/gateway/package.json ./services/gateway/
RUN pnpm install --frozen-lockfile --filter @novadesk/gateway...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/gateway ./services/gateway
COPY --from=deps /app/services/gateway/node_modules ./services/gateway/node_modules
RUN pnpm turbo run build --filter=@novadesk/gateway

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build --chown=node:node /app/services/gateway/dist ./dist
COPY --from=build --chown=node:node /app/services/gateway/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
USER node
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]
