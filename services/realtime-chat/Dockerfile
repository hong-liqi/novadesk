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
RUN npm install -g prisma@5.22.0
COPY infrastructure/scripts/prisma-deploy.sh infrastructure/scripts/service-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/prisma-deploy.sh /usr/local/bin/service-entrypoint.sh
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/services/realtime-chat/dist ./services/realtime-chat/dist
COPY --from=build --chown=node:node /app/services/realtime-chat/package.json ./services/realtime-chat/package.json
COPY --from=build --chown=node:node /app/services/realtime-chat/node_modules ./services/realtime-chat/node_modules
COPY --from=build --chown=node:node /app/services/realtime-chat/prisma ./services/realtime-chat/prisma
WORKDIR /app/services/realtime-chat
USER node
ENV NODE_ENV=production
EXPOSE 3005
ENTRYPOINT ["service-entrypoint.sh"]
CMD ["node", "dist/main.js"]
