# Provenance — angular-dashboard

Imported from [`tessOu56/angular-dashboard-sandbox`](https://github.com/tessOu56/angular-dashboard-sandbox) as an Nx application.

| Field | Value |
| --- | --- |
| Source | https://github.com/tessOu56/angular-dashboard-sandbox |
| Source commit | `7395dc7a26b4307e0f7df3b9580d5e370fe80e88` (2026-10-20, `Upgrade Angular 20 LTS to 22.2 via ng update (#8)`) |
| Import method | Source copy (not `git subtree`) |
| Source repo | Left unmodified |

## Why not git subtree

Subtree would drop a standalone Angular CLI tree (`package.json`, `pnpm-lock.yaml`, `angular.json`, `.github/`) into `apps/angular-dashboard`. That does not integrate cleanly with this workspace:

- One lockfile / `apps/*` pnpm workspace (nested lockfile is forbidden)
- This monorepo is Angular **20.3.3** + TypeScript **5.9.3**; the satellite is Angular **22.2.3** + TypeScript **6.0.3**
- Nx `project.json` targets replace the CLI `angular.json` architect graph

The satellite stays canonical on GitHub at Angular 22. This app is the same product source compiled against the workspace Angular version (no monorepo downgrade; source repo not reverted).

## Alignment applied here

- Build/serve/test/lint via Nx (`@angular/build:application`, `@nx/jest:jest`, `@nx/eslint:lint`)
- `zone.js` polyfill + `provideZoneChangeDetection` (Angular 20)
- `CanMatchFn` is the Angular 20 two-argument form (`route`, `segments`); Angular 22 added a third snapshot argument
- Unit tests use `jest-preset-angular` (workspace test runner); `vi.*` fake timers mapped to `jest.*`
- GitHub Pages `baseHref` `/nx-playground/angular-dashboard/` (the satellite had no Pages site)

## Dependency added (required to build)

- `rxjs@~7.8.0` on `@nx-playground/angular-dashboard` (Angular peer; not previously a direct workspace dependency). Not a downgrade.
