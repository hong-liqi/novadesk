# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY website/package.json ./website/
RUN pnpm install --frozen-lockfile --filter @novadesk/website...

FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
ARG NEXT_PUBLIC_HELPDESK_URL=
ARG NEXT_PUBLIC_ANALYTICS_URL=
ARG NEXT_PUBLIC_ADMIN_URL=
ARG NEXT_PUBLIC_CHAT_URL=
ARG NEXT_PUBLIC_SITE_URL=
ARG NEXT_PUBLIC_API_URL=
ENV NEXT_PUBLIC_HELPDESK_URL=$NEXT_PUBLIC_HELPDESK_URL
ENV NEXT_PUBLIC_ANALYTICS_URL=$NEXT_PUBLIC_ANALYTICS_URL
ENV NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL
ENV NEXT_PUBLIC_CHAT_URL=$NEXT_PUBLIC_CHAT_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY website ./website
COPY docs/case-studies ./website/content/case-studies
COPY --from=deps /app/website/node_modules ./website/node_modules
RUN pnpm turbo run build --filter=@novadesk/website

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3013
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/website/public ./website/public
COPY --from=build --chown=node:node /app/website/.next/standalone ./
COPY --from=build --chown=node:node /app/website/.next/static ./website/.next/static
USER node
EXPOSE 3013
CMD ["node", "website/server.js"]
