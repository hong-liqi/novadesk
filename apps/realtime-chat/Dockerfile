# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/realtime-chat/package.json ./apps/realtime-chat/
RUN pnpm install --frozen-lockfile --filter @novadesk/realtime-chat...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/realtime-chat ./apps/realtime-chat
COPY --from=deps /app/apps/realtime-chat/node_modules ./apps/realtime-chat/node_modules
RUN pnpm turbo run build --filter=@novadesk/realtime-chat

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3014
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/apps/realtime-chat/public ./apps/realtime-chat/public
COPY --from=build --chown=node:node /app/apps/realtime-chat/.next/standalone ./
COPY --from=build --chown=node:node /app/apps/realtime-chat/.next/static ./apps/realtime-chat/.next/static
USER node
EXPOSE 3014
CMD ["node", "apps/realtime-chat/server.js"]
