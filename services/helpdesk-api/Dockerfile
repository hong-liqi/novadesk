# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY services/helpdesk-api/package.json ./services/helpdesk-api/
RUN pnpm install --frozen-lockfile --filter @novadesk/helpdesk-api...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY services/helpdesk-api ./services/helpdesk-api
COPY --from=deps /app/services/helpdesk-api/node_modules ./services/helpdesk-api/node_modules
RUN pnpm --filter @novadesk/helpdesk-api db:generate
RUN pnpm turbo run build --filter=@novadesk/helpdesk-api

FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache openssl
COPY infrastructure/scripts/prisma-deploy.sh infrastructure/scripts/service-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/prisma-deploy.sh /usr/local/bin/service-entrypoint.sh
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/packages ./packages
COPY --from=build --chown=node:node /app/services/helpdesk-api/dist ./services/helpdesk-api/dist
COPY --from=build --chown=node:node /app/services/helpdesk-api/package.json ./services/helpdesk-api/package.json
COPY --from=build --chown=node:node /app/services/helpdesk-api/node_modules ./services/helpdesk-api/node_modules
COPY --from=build --chown=node:node /app/services/helpdesk-api/prisma ./services/helpdesk-api/prisma
WORKDIR /app/services/helpdesk-api
USER node
ENV NODE_ENV=production
ENV PRISMA_CLI_BINARY_TARGETS=linux-musl-openssl-3.0.x
EXPOSE 3003
ENTRYPOINT ["service-entrypoint.sh"]
CMD ["node", "dist/main.js"]
