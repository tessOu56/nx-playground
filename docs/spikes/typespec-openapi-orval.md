# Spike — TypeSpec → OpenAPI → Orval (T-2026-018)

**Status**: W2 landed CI; full orval regen remains incremental.

## Current path (Nest swagger-jsdoc)

- `apps/api-server` exposes OpenAPI via Nest decorators at runtime.
- `libs/api-client` uses Orval against checked-in YAML under `specs/`.

## TypeSpec spine (SSOT)

- Source: `libs/contracts/*.tsp` → `tsp compile` → `libs/api-client/specs/*.openapi.yaml`
- CI: `.github/workflows/contracts-ci.yml` runs tsp compile + artifact verify; Spectral config in `.spectral.yaml` (strict CI → T-2026-029).

## Comparison

| Aspect | TypeSpec spine | Nest swagger-jsdoc |
|--------|----------------|---------------------|
| SSOT | Single `.tsp` module per service | Runtime decorators + drift risk |
| Consumer | Orval / Spectral / py-able contract tests | Same, but YAML hand-maintained |
| Backend sync | Requires emit step in build or CI gate | Automatic from running server |
| Migration | Incremental: one service at a time (catalog first) | Keep until emit covers API surface |

## Next (W3+)

- Wire `pnpm contracts:build` at monorepo root; fail CI if generated specs differ from committed.
- Portal OpenAPI alignment ticket (Stream A W2 follow-up).
