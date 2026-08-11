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

## Contracts / TypeSpec

**T-2026-028 (done 2026-08-11):** `pnpm-lock.yaml` is reconciled (includes `apps/vue-motion` pinia)
and `pnpm install --frozen-lockfile` passes on `ubuntu-latest`. `.github/workflows/contracts-ci.yml`
now runs the standard root frozen install (via `pnpm/action-setup`) instead of an isolated
per-package npm toolchain.

Fallback path — if a future lockfile drift blocks root install again, use the isolated toolchain
until the lockfile is refreshed:

```powershell
cd libs/contracts
npm install --no-save @typespec/compiler@^1.13.0 @typespec/http@^1.13.0 @typespec/openapi3@^1.13.0
npx tsp compile main.tsp --config tspconfig.yaml
```

Lockfile-only refresh when a full Windows install fails (`ENOENT` on deep `node_modules` renames):

```powershell
pnpm install --lockfile-only   # refresh pnpm-lock.yaml without materializing node_modules
pnpm install                   # then do the real install
```

## Planning follow-ups

- **T-2026-029** — Spectral strict rules + TypeSpec operationId naming
- **T-2026-030** — Portfolio dev-environment control (platform-command)
