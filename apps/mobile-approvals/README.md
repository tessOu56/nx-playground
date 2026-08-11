# mobile-approvals (Mobile line M0)

T-2026-070 scaffold: a minimal Expo app for the approvals mock flow — **list → confirm → result**.
Mock data mirrors the portal `access-request` contract shape (`pending_approval` / `approved` /
`denied`, `decision_id`, `auditLogged`). No auth, no store submission, no governance/policy logic —
decisioning stays owned by the portal policy layer; this app only demonstrates the interaction.

## Run locally

```bash
cd apps/mobile-approvals
pnpm install          # or from repo root: pnpm install --filter @nx-playground/mobile-approvals...
pnpm exec nx run @nx-playground/mobile-approvals:start   # Expo Go / simulator
# or
pnpm exec nx run @nx-playground/mobile-approvals:web     # browser (metro web bundler)
```

Scan the QR code with Expo Go (iOS/Android), or press `i` / `a` in the Expo CLI to launch a
simulator/emulator if installed locally.

## Smoke test

The M0 scope keeps the smoke test to pure state-transition logic (`applyDecision`) rather than a
full React Native component-renderer test, to stay inside the ≤4h/week capacity constraint:

```bash
pnpm exec nx run @nx-playground/mobile-approvals:test
```

## Flow

1. **List** (`ApprovalListScreen`) — pending requests (`status: pending_approval`).
2. **Confirm** (`ConfirmScreen`) — requester/resource/reason detail, Approve/Deny buttons.
3. **Result** (`ResultScreen`) — shows the resulting `decision_id` and `auditLogged: true`.

## Explicitly out of scope for M0

- No custom auth (Expo Go / local only).
- No app store submission / EAS build config.
- No governance/policy logic reimplemented on mobile — decisions are local mocks only; the real
  policy layer lives in the portal (see `planning/projects/nx-playground.md`).
