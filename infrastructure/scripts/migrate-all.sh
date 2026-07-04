#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Applying Prisma schemas..."

cd "$ROOT/services/auth-service"
pnpm db:push

cd "$ROOT/services/notification-service"
pnpm db:push

cd "$ROOT/services/helpdesk-api"
pnpm db:push

cd "$ROOT/services/analytics-api"
pnpm db:push

cd "$ROOT/services/realtime-chat"
pnpm db:push

echo "All database schemas applied."
