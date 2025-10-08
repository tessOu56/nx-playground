# NX Playground

實驗性 Nx Monorepo 專案

## 🚀 快速開始

```bash
make setup      # 首次設置
make dev-events # 啟動 Events 服務
make dev-console # 啟動 Console 服務
```

## 📋 常用命令

| 命令               | 說明                   |
| ------------------ | ---------------------- |
| `make setup`       | 首次設置開發環境       |
| `make dev`         | 啟動所有服務           |
| `make dev-events`  | 啟動 Events 服務       |
| `make dev-console` | 啟動 Console 服務      |
| `make dev-vue`     | 啟動 Vue Motion 服務   |
| `make dev-angular` | 啟動 Angular Dashboard |
| `make stop`        | 停止所有服務           |
| `make logs`        | 查看日誌               |
| `make help`        | 查看所有命令           |

## 🌐 服務網址

- **Events**: http://localhost:3000
- **Console**: http://localhost:3002
- **Vue Motion**: http://localhost:8080
- **Angular Dashboard**: http://localhost:4200

## 📦 專案結構

```
nx-playground/
├── apps/
│   ├── auth/              # 認證服務 (React + Vite)
│   ├── console/           # 控制台 (React + Vite)
│   ├── events/            # 活動管理 (Next.js)
│   └── angular-dashboard/ # Angular Dashboard
├── libs/
│   ├── api-client/        # API 客戶端
│   ├── auth-client/       # 認證客戶端
│   ├── design-system/     # 設計系統
│   ├── hooks/             # React Hooks
│   ├── i18n/              # 國際化
│   ├── ui-components/     # UI 組件
│   └── vue-motion/        # Vue 動畫效果庫
```
