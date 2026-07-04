# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/realtime-chat/package.json ./services/realtime-chat/
RUN pnpm install --frozen-lockfile --filter @novadesk/realtime-chat-service...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/realtime-chat ./services/realtime-chat
COPY --from=deps /app/services/realtime-chat/node_modules ./services/realtime-chat/node_modules
RUN pnpm turbo run build --filter=@novadesk/realtime-chat-service

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
COPY --from=build --chown=node:node /app/services/realtime-chat/dist ./dist
COPY --from=build --chown=node:node /app/services/realtime-chat/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
USER node
ENV NODE_ENV=production
EXPOSE 3005
CMD ["node", "dist/main.js"]
