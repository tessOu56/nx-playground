# Dev environment — nx-playground

Cross-platform notes for local setup. CI runs on **ubuntu-latest**; Windows dev may need extra steps.

## OS detection

```powershell
.\scripts\detect-platform.ps1        # windows | linux | darwin | unknown
.\scripts\detect-platform.ps1 -Json
```

```bash
sh scripts/detect-platform.sh
```

Use this in install/setup scripts before choosing package manager flags or paths.

## Known platform differences

| Topic | Linux / macOS (CI) | Windows (local) |
|-------|-------------------|-----------------|
| `pnpm install --frozen-lockfile` | Default in CI | `.npmrc` sets `frozen-lockfile=true`; use `pnpm install --no-frozen-lockfile` when lockfile intentionally updated |
| Broken `libs/contracts/node_modules` symlink | Rare | Delete folder if `EACCES` on `realpath` during install |
| TypeSpec (`tsp`) | Node **22+** required | Node 20 fails (`fs/promises` `glob`); use nvm/fnm 22 |
| Spectral `-r spectral:oas` | Built-in alias works in some versions | Treat as file path — use `libs/contracts/.spectral.yaml` + `@stoplight/spectral-rulesets` |
| Full monorepo install | Reliable in Actions | Large installs may hit `ENOENT` on deep `node_modules` renames — prefer `--lockfile-only` to refresh lock, then install |

## Contracts / TypeSpec (isolated)

When root `pnpm install` is blocked:

```powershell
cd libs/contracts
npm install --no-save @typespec/compiler@^1.13.0 @typespec/http@^1.13.0 @typespec/openapi3@^1.13.0
npx tsp compile main.tsp --config tspconfig.yaml
```

CI: `.github/workflows/contracts-ci.yml` (isolated npm until lockfile ritual is green everywhere).

## Planning follow-ups

- **T-2026-028** — Reconcile pnpm lockfile + restore monorepo frozen install in CI
- **T-2026-029** — Spectral strict rules + TypeSpec operationId naming
- **T-2026-030** — Portfolio dev-environment control (platform-command)
