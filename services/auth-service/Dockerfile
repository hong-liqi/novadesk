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
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/auth-service ./services/auth-service
COPY --from=deps /app/services/auth-service/node_modules ./services/auth-service/node_modules
RUN pnpm turbo run build --filter=@novadesk/auth-service

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/services/auth-service/dist ./services/auth-service/dist
COPY --from=build --chown=node:node /app/services/auth-service/package.json ./services/auth-service/package.json
COPY --from=build --chown=node:node /app/services/auth-service/node_modules ./services/auth-service/node_modules
WORKDIR /app/services/auth-service
USER node
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "dist/main.js"]
