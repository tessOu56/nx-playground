# @nx-playground/contracts — 契約來源 (TypeSpec)

單一契約來源 (SSOT)。每個模組一個 `.tsp`，各自宣告 `@service` namespace；
`tsp compile main.tsp` 由 openapi3 emitter **每個 service 產一份** OpenAPI 3.1 到
`../api-client/specs/<service>.openapi.yaml`，前端 (Orval) 與後端 (openapi-typescript) 都從這裡衍生。

## 模組

| 檔案 | service | 產出 | 來源 |
|------|---------|------|------|
| `catalog.tsp` | catalog | `catalog.openapi.yaml` | 新契約（對齊 portal CatalogApiRow / py Ex02） |
| `event.tsp` | event | `event.openapi.yaml` | 由舊 protobuf 衍生 spec 收斂為 TypeSpec |
| `media.tsp` | media | `media.openapi.yaml` | 由舊 protobuf 衍生 spec 收斂為 TypeSpec |

`main.tsp` 只負責 `import` 三個模組。新增模組：建 `<name>.tsp`（`@service namespace <name>`）→ 在 main.tsp import → 重編譯。

## 指令

```bash
pnpm --dir libs/contracts install      # @typespec/compiler|http|openapi3
pnpm --dir libs/contracts run build    # main.tsp → 三份 OpenAPI 3.1
# 或 repo 根目錄一鍵：
pnpm contracts:wire                    # build 契約 → 產前端 client → 產後端 types
pnpm generate:api:all                  # 重生三模組的 React Query client
```

## 各司其職

- **契約 (本套件)**：唯一事實來源。改 API 改這裡的 `.tsp`。
- **前端 (api-client)**：Orval 由 OpenAPI 產型別化 React Query hooks，只消費。
- **後端 (api-server)**：openapi-typescript 由同一 OpenAPI 產 server 型別，NestJS 實作並型別綁定。
