#!/usr/bin/env bash
# Demo organizer identity for local Kratos (T-241). Not production.
set -euo pipefail
ADMIN="${KRATOS_ADMIN_URL:-http://localhost:4434}"
PUBLIC="${KRATOS_PUBLIC_URL:-http://localhost:4433}"
EMAIL="${KRATOS_ORGANIZER_EMAIL:-organizer@nx-playground.local}"
PASSWORD="${KRATOS_ORGANIZER_PASSWORD:-Organizer123!}"

for i in $(seq 1 40); do
  if curl -sf "${PUBLIC}/health/ready" >/dev/null && curl -sf "${ADMIN}/health/ready" >/dev/null; then
    break
  fi
  if [ "$i" -eq 40 ]; then
    echo "Kratos is not ready on ${PUBLIC} / ${ADMIN}. Run: make kratos-up" >&2
    exit 1
  fi
  sleep 1
done

existing="$(curl -sf "${ADMIN}/admin/identities" || true)"
if echo "${existing}" | grep -q "${EMAIL}"; then
  echo "Organizer ${EMAIL} already exists."
  exit 0
fi

curl -sf -X POST "${ADMIN}/admin/identities" \
  -H 'Content-Type: application/json' \
  -d "$(cat <<EOF
{
  "schema_id": "organizer",
  "traits": { "email": "${EMAIL}", "name": "活動主辦人" },
  "credentials": {
    "password": {
      "config": { "password": "${PASSWORD}" }
    }
  }
}
EOF
)" >/dev/null

echo "Created organizer ${EMAIL} (local demo password only)."
