#!/bin/sh
set -e

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[prisma-deploy] DATABASE_URL not set — skipping."
  exit 0
fi

if [ ! -f "prisma/schema.prisma" ]; then
  echo "[prisma-deploy] prisma/schema.prisma not found — skipping."
  exit 0
fi

has_migrations() {
  [ -d "prisma/migrations" ] && find prisma/migrations -name 'migration.sql' -print -quit | grep -q .
}

run_deploy() {
  if has_migrations; then
    prisma migrate deploy
  else
    prisma db push --skip-generate
  fi
}

attempt=1
max_attempts=10
delay_seconds=3

while [ "$attempt" -le "$max_attempts" ]; do
  echo "[prisma-deploy] Applying schema (attempt ${attempt}/${max_attempts})..."

  if run_deploy; then
    echo "[prisma-deploy] Schema applied successfully."
    exit 0
  fi

  attempt=$((attempt + 1))
  if [ "$attempt" -le "$max_attempts" ]; then
    sleep "$delay_seconds"
  fi
done

echo "[prisma-deploy] Failed after ${max_attempts} attempts."
exit 1
