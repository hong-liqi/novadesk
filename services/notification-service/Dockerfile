# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/notification-service/package.json ./services/notification-service/
RUN pnpm install --frozen-lockfile --filter @novadesk/notification-service...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/notification-service ./services/notification-service
COPY --from=deps /app/services/notification-service/node_modules ./services/notification-service/node_modules
RUN pnpm turbo run build --filter=@novadesk/notification-service

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
RUN npm install -g prisma@5.22.0
COPY infrastructure/scripts/prisma-deploy.sh infrastructure/scripts/service-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/prisma-deploy.sh /usr/local/bin/service-entrypoint.sh
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/services/notification-service/dist ./services/notification-service/dist
COPY --from=build --chown=node:node /app/services/notification-service/package.json ./services/notification-service/package.json
COPY --from=build --chown=node:node /app/services/notification-service/node_modules ./services/notification-service/node_modules
COPY --from=build --chown=node:node /app/services/notification-service/prisma ./services/notification-service/prisma
WORKDIR /app/services/notification-service
USER node
ENV NODE_ENV=production
EXPOSE 3002
ENTRYPOINT ["service-entrypoint.sh"]
CMD ["node", "dist/main.js"]
