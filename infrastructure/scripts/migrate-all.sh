#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

echo "Applying Prisma schemas..."

cd "$ROOT/services/auth-service"
pnpm db:deploy

cd "$ROOT/services/notification-service"
pnpm db:deploy

cd "$ROOT/services/helpdesk-api"
pnpm db:deploy

cd "$ROOT/services/analytics-api"
pnpm db:deploy

cd "$ROOT/services/realtime-chat"
pnpm db:deploy

echo "All database schemas applied."
