# Ecosystem — nx-playground hub

## Role

**Hub** in the personal platform ecosystem. Satellite repos sync from this monorepo.

| Satellite | Sync source | Rule |
|-----------|-------------|------|
| [vue-motion-sandbox](https://github.com/tessOu56/vue-motion-sandbox) | `apps/vue-motion` | No new features in satellite |
| [angular-dashboard-sandbox](https://github.com/tessOu56/angular-dashboard-sandbox) | `apps/enterprise-admin` | E2E may stay in satellite only |

## Upstream / downstream

```text
platform-command (registry, tickets, inbox)
    ↓ distribute-inbox
nx-playground (this repo)
    ↓ promote motion
ai-search-portal labs/motion/
    ↓ API contract
polyglot-labs
    ↓ specs
develop-md
```

## Sync ritual (hub → satellite)

1. Change and commit in `apps/vue-motion` or `apps/enterprise-admin`.
2. Copy tree to satellite repo (exclude `node_modules`, `.env`, `dist`).
3. Commit satellite; optional WATCH entry in platform-command.

## Registry

`platform-command/registry/projects.json` — deploy.url stays null until Cloudflare STOP lifted.
