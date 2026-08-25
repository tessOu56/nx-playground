#!/usr/bin/env bash
# Render build/start for Nest event-stack API (STOP-015). Not a fifth Vercel project.
# Build = install + compile only. Migrate runs at start so a missing DATABASE_URL
# does not mask a successful Nest webpack build (and fails with a clear message).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cmd="${1:-}"
case "$cmd" in
  build)
    export HUSKY=0
    pnpm install --no-frozen-lockfile
    pnpm exec prisma generate --schema=apps/api-server/prisma/schema.prisma
    pnpm exec nx build @nx-playground/api-server --configuration=production
    ;;
  start)
    if [[ -z "${DATABASE_URL:-}" ]]; then
      echo "DATABASE_URL is empty. Paste Neon event-stack direct/unpooled DSN in Render → Environment, then Manual Deploy." >&2
      exit 1
    fi
    pnpm exec prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma
    exec node dist/apps/api-server/main.js
    ;;
  *)
    echo "Usage: $0 build|start" >&2
    exit 2
    ;;
esac
