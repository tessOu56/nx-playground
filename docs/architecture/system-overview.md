# System Overview — nx-playground event stack

> Ecosystem node: `nx-playground`（role: practice / event product mainline）— 跨專案關係見 platform-command `dashboards/GRAPH.md`；文件慣例見 platform-command `docs/architecture-doc-convention.md`。

Nx monorepo，主線是**活動 + 電商整合 stack**：`event-portal`、`event-cms`、`api-server`（NestJS 公開 API）、`auth`。契約優先（TypeSpec → OpenAPI），Postgres 為真理來源，`api-mock` 為 CI / Nest-off 用的 in-memory 對照。

## 元件圖（Components）與埠

```mermaid
flowchart TB
  subgraph fe [Frontend apps]
    Portal["event-portal (Next.js 15, :3000)"]
    CMS["event-cms (React 19, :3002)"]
  end
  subgraph be [Backend]
    Nest["api-server NestJS (:3001, /api/docs)"]
    Mock["api-mock in-memory (:3011, CI / Nest-off)"]
    Auth["auth Kratos organizer UI (:3004)"]
  end
  subgraph data [Data]
    PG[("Postgres (Neon or make db-up :5433)")]
  end
  subgraph design [Design system]
    DS["libs/design-system (adapter for explore-design-sdk)"]
  end
  Portal -->|"NEXT_PUBLIC_API_BASE_URL"| Nest
  CMS --> Nest
  Portal -. mock path .-> Mock
  Nest --> PG
  Auth --> PG
  Portal --> DS
  CMS --> DS
```

## 主要流程（Primary flow）— contract-first

```mermaid
flowchart LR
  TS["TypeSpec source"]
  OAS["OpenAPI spec"]
  Nest["api-server (Nest handlers)"]
  Mock["api-mock (same OpenAPI, in-memory)"]
  Client["typed API client"]
  UI["event-portal / event-cms"]
  TS --> OAS
  OAS --> Nest
  OAS --> Mock
  OAS --> Client
  Client --> UI
  UI -->|"HTTP /api"| Nest
```

同一份 OpenAPI 同時餵 Nest（產品路徑）與 api-mock（CI / 無 Nest 時），確保前端對兩者形狀一致。

## 對外整合（Integrations）

- **資料**：Postgres（Neon event-stack 或 `make db-up` → `postgresql://event:event@127.0.0.1:5433/event_stack`）。SQLite 不允許。後端設計（Supabase Mode S + NestJS hybrid：RLS、Realtime、Edge Functions）見 [specs/BACKEND/ARCHITECTURE.md](../../specs/BACKEND/ARCHITECTURE.md)。
- **身份**：雙身份 — Kratos（主辦，`auth` :3004）／LIFF（參加者）。
- **契約**：TypeSpec → OpenAPI（見 [docs/CONTRACT-PIPELINE.md](../CONTRACT-PIPELINE.md)）。
- **Design system**：consume `explore-design-sdk`；`libs/design-system` 為其中一個 adapter。

## 邊界與不變式（Boundaries）

- `api-mock`（:3011）是 CI / Nest-off 對照，**非金流路徑**；產品路徑一律 Nest（:3001）。
- 真金流卡在 human STOP（ECPay 特約）；程式 `ECPAY_MODE=live` 僅在 STOP 清除後開。
- 事件 stack 是主線；`profile`／`vue-motion`／`enterprise-admin`／`mobile-approvals` 仍在磁碟但不加新功能（見 AGENTS.md Forbidden）。
- 鏡像：Angular／Vue 獨立 repo，勿雙寫（見 [docs/ECOSYSTEM.md](../ECOSYSTEM.md)）。

## 相關

- 執行/示範：[docs/EVENT-STACK-DEMO.md](../EVENT-STACK-DEMO.md)、[docs/DEV-ENVIRONMENT.md](../DEV-ENVIRONMENT.md)
- 後端細節：[specs/BACKEND/ARCHITECTURE.md](../../specs/BACKEND/ARCHITECTURE.md)

*Created 2026-09-17 — 依 platform-command architecture-doc-convention。*
