# nx-playground — 執行計畫 2026 H2（契約鏈樞紐）

> 策略 SSOT：[platform-command/planning/EXECUTION-PLAN-2026H2.md](https://github.com/tessOu56/platform-command/blob/main/planning/EXECUTION-PLAN-2026H2.md)
> 階段 SSOT：本 repo [`docs/PROJECT-PLAN.md`](./PROJECT-PLAN.md)（Phase 0–3，不變）
> 中央規劃：platform-command `planning/projects/nx-playground.md` · 技術雷達：`planning/EXECUTION-PLAN-2026H2-tech-radar.md`

nx-playground 是整條產品線的**契約鏈與設計系統樞紐**：`libs/api-client`（Orval + React Query）、`libs/design-system`（Style Dictionary）、`libs/validation`（Zod）、`apps/enterprise-admin/e2e`（Playwright）。本計畫把這些散落的能力收斂成「可被其他 repo 消費的一致基準」。

## 1. 在產品線中的角色

**契約鏈與設計系統樞紐**。對外賣點：**一份 OpenAPI 契約驅動型別、客戶端、mock 與文件；一份 DTCG token 驅動所有前端視覺**。也是動效（→ vue-motion / portal labs）與多框架（React/Next/Angular/Vue）能力的展示中心。

## 2. 互動作品里程碑

| 里程碑 | 內容 | 對應 ticket |
|--------|------|-------------|
| M1 契約鏈打通 | **TypeSpec → OpenAPI 3.1 → Orval v8 → React Query** 端到端；目前 `orval.config.ts` 指向尚不存在的 `openapi.json`，補上由 api-server（NestJS swagger）或 TypeSpec 產生的 spec | T-2026-018 |
| M2 設計 token pipeline | `libs/design-system`：**DTCG 2025.10 JSON → Style Dictionary → CSS 變數 → Tailwind v4 `@theme`**，輸出版本化套件供 profile/event-portal/vue-motion 消費 | T-2026-009 衍生 |
| M3 charts 儀表板 | `libs/charts` 接 event mock；enterprise-admin dashboard 一頁，作為 Angular + 圖表展品 | T-2026-009 |
| M4 動效 lab | `apps/profile`（React 19）用 GSAP（已免費）/ motion 重做 particle 場景，作為 promote 至 portal `labs/motion/` 的起點 | T-2026-010 |
| M5 Playwright 模式複製 | `enterprise-admin/e2e` 的審批流程 E2E 模式抽象成可複製範本，供 portal T-2026-015 套用 | — |

## 3. 技術選型（趨勢對齊）

- Monorepo：**Nx 21.4（評估升 Nx 22）+ pnpm 10**；導入 **catalogs** 統一關鍵版本。
- 契約：**TypeSpec 1.x → OpenAPI 3.1**；client 用 **Orval v8 + TanStack Query v5**（tags-split + Zod + MSW mock）；**跨 repo 釘死 Orval 版本**。
- 驗證：`libs/validation` 升 **Zod 4**（走 Standard Schema）。
- 設計：**Style Dictionary v4 + DTCG 2025.10 + Tailwind v4 `@theme`**。
- 前端：React 19 + Vite 8（評估，現為 Vite 6）；Next.js（event-portal）、Angular 20（enterprise-admin）、Vue 3.5（vue-motion）。
- 治理閘：spec 變更跑 **Spectral + oasdiff**。

## 4. 串接點（樞紐輸出）

- **→ ai-search-portal**：promote 動效進 `labs/motion/`；Playwright E2E 模式複製；契約鏈方法論對齊。
- **→ vue-motion-sandbox / angular-dashboard-sandbox**：作為唯一開發源，sync 至兩個衛星 mirror。
- **→ polyglot-labs**：api-server 契約子集（events/metrics）對齊 `docs/api-contract.md`。
- **→ 全生態**：`libs/design-system` token 套件、`libs/api-client` 生成模式作為共用基準。
- **登錄**：registry capability 更新（Orval、Design Tokens、E2E）。

## 5. 部署 / STOP

- 現況：本地 `make setup` + 各 `pnpm dev:*`；profile 已有 Cloudflare workflow（STOP-optional）。
- 解 STOP 後：profile/event-portal 上 **Cloudflare Workers + Static Assets**。

## 6. 不做

- 不與 ai-search-portal monorepo 合併（document only）。
- 不複製 portal UI / agent-core 進本 repo。
- 不在衛星 mirror（vue-motion-sandbox、angular-dashboard-sandbox）平行開發同一功能。
