# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/helpdesk-saas/package.json ./apps/helpdesk-saas/
RUN pnpm install --frozen-lockfile --filter @novadesk/helpdesk-saas...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
ARG NEXT_PUBLIC_BASE_PATH=
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/helpdesk-saas ./apps/helpdesk-saas
COPY --from=deps /app/apps/helpdesk-saas/node_modules ./apps/helpdesk-saas/node_modules
RUN pnpm turbo run build --filter=@novadesk/helpdesk-saas

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3010
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/helpdesk-saas/public ./apps/helpdesk-saas/public
COPY --from=build --chown=node:node /app/apps/helpdesk-saas/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/helpdesk-saas/.next/static ./apps/helpdesk-saas/.next/static
USER node
EXPOSE 3010
CMD ["node", "apps/helpdesk-saas/server.js"]
