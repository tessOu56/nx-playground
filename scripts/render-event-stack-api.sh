#!/usr/bin/env bash
# Render build/start for Nest event-stack API (STOP-015). Not a fifth Vercel project.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

cmd="${1:-}"
case "$cmd" in
  build)
    pnpm install --no-frozen-lockfile
    pnpm exec prisma generate --schema=apps/api-server/prisma/schema.prisma
    pnpm exec nx build @nx-playground/api-server --configuration=production
    pnpm exec prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma
    ;;
  start)
    exec node dist/apps/api-server/main.js
    ;;
  *)
    echo "Usage: $0 build|start" >&2
    exit 2
    ;;
esac
