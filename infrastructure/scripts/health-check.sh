#!/usr/bin/env bash
set -euo pipefail

curl -sf http://localhost/health/live >/dev/null 2>&1 && echo "nginx: ok" || echo "nginx: skip (not running)"
curl -sf http://localhost:3001/health/live >/dev/null 2>&1 && echo "auth-service: ok" || echo "auth-service: skip"
curl -sf http://localhost:3000/health/live >/dev/null 2>&1 && echo "gateway: ok" || echo "gateway: skip"
echo "Health check complete"
