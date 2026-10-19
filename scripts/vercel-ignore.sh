#!/usr/bin/env bash
# Vercel Ignored Build Step. Exit 0 = skip this deployment; exit 1 = build.
set -u

prod_url="${VERCEL_PROJECT_PRODUCTION_URL:-}"
preview_url="${VERCEL_URL:-}"
ref="${VERCEL_GIT_COMMIT_REF:-}"

# Both Git-connected Hobby projects currently share Root Directory = repo root
# and the Next.js portal vercel.json. Nest lives on Render. Skip the duplicate.
if [[ "$prod_url" == *nx-event-stack-api* || "$preview_url" == *nx-event-stack-api* ]]; then
  echo "vercel-ignore: skip nx-event-stack-api (not the live frontend; API is Render)"
  exit 0
fi

if [[ "$ref" == dependabot/* || "$ref" == ci/* ]]; then
  echo "vercel-ignore: skip CI-only branch ${ref}"
  exit 0
fi

echo "vercel-ignore: build nx-event-portal (${ref:-unknown})"
exit 1
