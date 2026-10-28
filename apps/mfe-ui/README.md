# mfe-ui

Nx Module Federation **remote** that exposes the shared Button from tessOu56/micro_frontends (`@my-org/ui`).

See [mfe-host provenance](../mfe-host/PROVENANCE.md).

```bash
pnpm exec nx serve mfe-ui    # http://localhost:5174
pnpm exec nx test mfe-ui
pnpm exec nx build mfe-ui
```

Exposes:

- `mfe-ui/Button` — original `UI:Click Me` button
- `mfe-ui/Module` — standalone remote preview app
