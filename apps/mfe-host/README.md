# mfe-host

Nx Module Federation **host** for the micro_frontends Web3 demo. Loads `Button` from the `mfe-ui` remote at runtime.

Source idea: [`tessOu56/micro_frontends`](https://github.com/tessOu56/micro_frontends) at `85f1b64`. See [PROVENANCE.md](./PROVENANCE.md). The satellite was a host + workspace package (not federation); this pair is the Nx MF reimplementation.

## Run

```bash
pnpm exec nx serve mfe-host   # http://localhost:5173 (also serves mfe-ui :5174)
pnpm exec nx test mfe-host
pnpm exec nx build mfe-host
pnpm exec nx lint mfe-host
```

Remote-only preview: `pnpm exec nx serve mfe-ui` → http://localhost:5174

## Pages

Production host `baseHref` is `/nx-playground/mfe-host/`. The remote is loaded from `/nx-playground/mfe-ui/`.
