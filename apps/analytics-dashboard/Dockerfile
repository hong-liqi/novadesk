# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/analytics-dashboard/package.json ./apps/analytics-dashboard/
RUN pnpm install --frozen-lockfile --filter @novadesk/analytics-dashboard...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/analytics-dashboard ./apps/analytics-dashboard
RUN pnpm turbo run build --filter=@novadesk/analytics-dashboard

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S nodejs && adduser -S node -u 1001 -G nodejs
ENV NODE_ENV=production
ENV PORT=3011
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/analytics-dashboard/public ./apps/analytics-dashboard/public
COPY --from=build --chown=node:nodejs /app/apps/analytics-dashboard/.next/standalone ./
COPY --from=build --chown=node:nodejs /app/apps/analytics-dashboard/.next/static ./apps/analytics-dashboard/.next/static
USER node
EXPOSE 3011
CMD ["node", "apps/analytics-dashboard/server.js"]
