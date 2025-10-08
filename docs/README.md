# NX Playground 開發文件

這個資料夾包含 NX Playground 項目的開發相關文件。

## 資料夾結構

- `console-dev/` - Console (後台管理系統) 開發文件
- `events-dev/` - Events (前台活動系統) 開發文件
- `libs-dev/` - Libs 庫開發文件
  - `tokens/` - Design System 開發文件 (對照 `libs/design-system`)
  - `ui/` - UI 組件庫開發文件 (對照 `libs/ui-components`)
  - `api/` - API 客戶端開發文件 (對照 `libs/api-client`)
  - `i18n/` - 國際化開發文件 (對照 `libs/i18n`)

## 快速開始

### 本地開發環境設置

1. 初始化環境：

   ```bash
   make setup
   ```

2. 啟動所有服務：

   ```bash
   make dev
   ```

3. 或分別啟動單一服務：
   ```bash
   make dev-console  # 後台管理 (http://localhost:3002)
   make dev-events   # 前台活動 (http://localhost:3000)
   ```

### Docker 開發環境

```bash
make docker-up-build  # 建置並啟動 Docker 服務
make docker-logs      # 查看日誌
make docker-stop      # 停止服務
```

## 技術架構

- **前台 (Events)**: Next.js + React + TypeScript
- **後台 (Console)**: Vite + React + TypeScript
- **Libs 庫系統**:
  - **Design System**: Style Dictionary + Vanilla Extract + Tailwind CSS
  - **UI Components**: React + TypeScript + Storybook
  - **API Client**: Orval + OpenAPI + React Query
  - **i18n**: next-intl + 多語系管理
- **包管理**: pnpm + Nx monorepo
- **容器化**: Docker + Docker Compose

## 開發指南

請參考各自資料夾內的 README 文件獲取詳細的開發指南和說明。
