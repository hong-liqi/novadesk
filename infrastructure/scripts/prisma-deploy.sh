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

PRISMA="./node_modules/.bin/prisma"
if [ ! -x "$PRISMA" ]; then
  echo "[prisma-deploy] prisma CLI not found at $PRISMA" >&2
  exit 1
fi

export PRISMA_CLI_BINARY_TARGETS="${PRISMA_CLI_BINARY_TARGETS:-linux-musl-openssl-3.0.x}"

log_database_target() {
  db_name=$(printf '%s' "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
  echo "[prisma-deploy] Target database: ${db_name:-unknown}"
}

has_migrations() {
  [ -d "prisma/migrations" ] && find prisma/migrations -name 'migration.sql' -print -quit | grep -q .
}

reset_public_schema() {
  echo "[prisma-deploy] Resetting public schema (orphan objects without migration history)..."
  $PRISMA db execute --stdin <<'SQL'
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;
SQL
}

run_migrate_deploy() {
  deploy_status=0
  deploy_output=$($PRISMA migrate deploy 2>&1) || deploy_status=$?
  printf '%s\n' "$deploy_output"

  if [ "$deploy_status" -eq 0 ]; then
    return 0
  fi

  if printf '%s\n' "$deploy_output" | grep -qE 'P3005|P3009'; then
    if [ "${PRISMA_DEPLOY_ALLOW_SCHEMA_RESET:-true}" = "false" ]; then
      echo "[prisma-deploy] Migration conflict (P3005/P3009) and PRISMA_DEPLOY_ALLOW_SCHEMA_RESET=false — cannot auto-reset." >&2
      return 1
    fi
    echo "[prisma-deploy] P3005/P3009: migration conflict — resetting public schema and retrying..."
    reset_public_schema
    $PRISMA migrate deploy
    return $?
  fi

  return 1
}

run_deploy() {
  if has_migrations; then
    echo "[prisma-deploy] Running prisma migrate deploy..."
    run_migrate_deploy
    return $?
  fi

  echo "[prisma-deploy] Running prisma db push..."
  $PRISMA db push --skip-generate --accept-data-loss
}

attempt=1
max_attempts=10
delay_seconds=3

log_database_target

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
