# 契約鏈狀態 — spec → Orval → React Query

> 對應 `docs/EXECUTION-PLAN-2026H2.md` M1。2026-06-26 打通並驗證。

## 鏈路

```
api-server (NestJS swagger)  ─generate-openapi.js─▶  specs/*.openapi.yaml
specs/<module>.openapi.yaml  ─orval.config.ts──────▶  src/generated/<module>/<env>/  (React Query hooks + schemas)
```

## 本次修正（orval.config.ts）

1. **專案鍵加引號**：`nx-playground:` → `'nx-playground':`（連字號物件鍵須加引號）。
2. **支援無環境後綴的 spec**：`findApiSpec` 候選清單新增 `<module>.openapi.yaml` / `<module>.yaml`，
   讓現有 `event.openapi.yaml`、`media.openapi.yaml` 能被解析（原本只找 `<module>-<env>.openapi.yaml`，
   找不到就 fallback 到不存在的 `openapi.yaml` 而報錯）。

## 重現（在已 `pnpm install` 的環境）

```bash
pnpm generate:api:event:dev    # → src/generated/event/dev
pnpm generate:api:media:dev    # → src/generated/media/dev
```

驗證結果（2026-06-26）：event + media 兩模組共產生 **42 個 .ts 檔**，全部通過語法解析；
產出含 `useEventServiceGetEventList`、`useEventServiceCreateEvent`、`usePublicEventServiceSearchEvents`
等型別化 React Query hooks，型別取自 `./model`，HTTP 走 `../../../lib/api-client` 的 `customInstance`。

## 已知缺口（待補）

- `generate:api:all` 與 package.json 腳本引用模組 **form / identity / community / tickets**，
  但 `specs/` 目前**只有 event、media**。在補上這些 spec（或從 api-server 產生）前，
  `generate:api:all` 會在第一個 `form` 模組失敗。
- `afterAllFilesWrite: 'prettier --write'` 需環境有 prettier；缺少時僅警告，產出仍有效（未格式化）。
- 下一步（M1 收尾）：由 api-server 跑 `node scripts/generate-openapi.js` 產生 `server.json`，
  再評估導入 **TypeSpec → OpenAPI** 作單一契約來源（T-2026-018）。

## src/generated 為建置產物

`libs/api-client/src/generated/` 已被 `.gitignore` 忽略；以上產出為本地驗證，正式環境由腳本重生。

---

## 更新 2026-06-26 — TypeSpec 成為契約 SSOT（T-2026-018 完成）

`catalog` 模組已示範完整管線：**TypeSpec → OpenAPI 3.1 → 前端(Orval React Query) + 後端(openapi-typescript + NestJS)**。
詳見 [`docs/CONTRACT-PIPELINE.md`](../../docs/CONTRACT-PIPELINE.md)。

一鍵重現：`pnpm contracts:wire`（contracts:build + generate:api:catalog:dev + api-server gen:contract-types）。

`catalog.openapi.yaml` 由 `libs/contracts/main.tsp` 編譯產生，請勿手改；改契約改 `main.tsp`。
