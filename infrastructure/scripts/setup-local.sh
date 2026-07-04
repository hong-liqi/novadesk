#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> NovaDesk local setup"

if ! command -v pnpm &>/dev/null; then
  echo "pnpm is required. Enable via: corepack enable"
  exit 1
fi

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

pnpm install
docker compose -f infrastructure/docker/docker-compose.yml up -d redis postgres-auth postgres-notification mailpit

echo "==> Setup complete. Run: pnpm turbo dev"
