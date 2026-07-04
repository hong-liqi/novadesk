#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Uso: $0 <POSTGRES_PASSWORD> [database] [host]"
  echo ""
  echo "Exemplo:"
  echo "  $0 'minha+senha#123' auth_db srv-captain--novadesk-postgres"
  exit 1
fi

PASSWORD="$1"
DATABASE="${2:-auth_db}"
HOST="${3:-srv-captain--novadesk-postgres}"
USER="${POSTGRES_USER:-novadesk}"

ENCODED_PASSWORD="$(node -e "console.log(encodeURIComponent(process.argv[1]))" "$PASSWORD")"

echo "Cole no CapRover (app do backend, ex.: novadesk-auth):"
echo ""
echo "DATABASE_URL=postgresql://${USER}:${ENCODED_PASSWORD}@${HOST}:5432/${DATABASE}"
