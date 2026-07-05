# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/admin-panel/package.json ./apps/admin-panel/
RUN pnpm install --frozen-lockfile --filter @novadesk/admin-panel...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/admin-panel ./apps/admin-panel
COPY --from=deps /app/apps/admin-panel/node_modules ./apps/admin-panel/node_modules
RUN pnpm turbo run build --filter=@novadesk/admin-panel

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3012
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/admin-panel/public ./apps/admin-panel/public
COPY --from=build --chown=node:node /app/apps/admin-panel/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/admin-panel/.next/static ./apps/admin-panel/.next/static
USER node
EXPOSE 3012
CMD ["node", "apps/admin-panel/server.js"]
