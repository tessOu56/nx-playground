# ==================== NX Playground 本地開發環境管理 Makefile ====================

.PHONY: help dev dev-event-portal dev-event-cms dev-api dev-api-mock dev-auth setup seed db-up stop restart logs clean build status prod test test-mock test-react test-i18n test-coverage test-watch test-affected

# 預設目標
.DEFAULT_GOAL := help

# 顏色定義
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

# 幫助信息
help: ## 顯示此幫助信息
	@echo "$(BLUE)NX Playground 本地開發環境管理工具$(NC)"
	@echo ""
	@echo "$(YELLOW)🚀 開發命令:$(NC)"
	@echo "  dev               啟動所有服務 (Event Portal + Event CMS)"
	@echo "  dev-event-portal  僅啟動 Event Portal 服務 (http://localhost:3000)"
	@echo "  dev-event-cms     僅啟動 Event CMS 服務 (http://localhost:3002)"
	@echo "  dev-api           僅啟動 API Server 服務 (http://localhost:3001)"
	@echo "  dev-api-mock      僅啟動契約 mock (http://localhost:3011)"
	@echo "  dev-auth          僅啟動 Auth 服務 (http://localhost:3004)"
	@echo "  dev-profile       僅啟動 Profile 服務 (http://localhost:3003)"
	@echo "  dev-vue           僅啟動 Vue Motion 服務 (http://localhost:8080)"
	@echo "  dev-enterprise    僅啟動 Enterprise Admin 服務 (http://localhost:4200)"
	@echo "  dev-api           僅啟動 API Server 服務 (http://localhost:3001)"
	@echo "  setup        設置開發環境 (安裝依賴、環境變數)"
	@echo "  seed         Prisma migrate deploy + seed from libs/api-fixtures"
	@echo "  db-up        Start local Postgres on :5433 (docker compose.event-db)"
	@echo "  stop         停止當前開發站台"
	@echo "  restart      重啟所有開發服務"
	@echo "  logs         查看服務日誌"
	@echo "  status       檢查服務狀態"
	@echo ""
	@echo "$(YELLOW)🧪 測試命令:$(NC)"
	@echo "  test         執行所有 Jest 測試"
	@echo "  test-mock    執行 Mock 資料測試"
	@echo "  test-react   執行 React 組件測試"
	@echo "  test-i18n    執行 i18n 測試"
	@echo "  test-coverage 執行測試並生成覆蓋率報告"
	@echo "  test-watch   監聽模式執行測試"
	@echo "  test-affected 執行受影響檔案的測試"
	@echo ""
	@echo "$(YELLOW)🔧 進階命令:$(NC)"
	@echo "  clean        清理開發環境"
	@echo "  build        清理、重新安裝依賴並建置所有專案"
	@echo ""
	@echo "$(YELLOW)🐳 Docker 命令:$(NC)"
	@echo "  docker-build     建置 Docker 映像檔"
	@echo "  docker-up        啟動 Docker 服務 (背景執行)"
	@echo "  docker-up-build  建置並啟動 Docker 服務 (背景執行)"
	@echo "  docker-stop      停止 Docker 服務"
	@echo "  docker-restart   重啟 Docker 服務"
	@echo "  docker-logs      查看 Docker 服務日誌"
	@echo "  docker-status    檢查 Docker 服務狀態"
	@echo "  docker-clean     清理 Docker 環境"
	@echo "  docker-test      在 Docker 環境中執行測試"
	@echo ""
	@echo ""
	@echo "$(YELLOW)🏭 生產環境命令:$(NC)"
	@echo "  prod         啟動生產環境 (docker compose up --build)"
	@echo "  help         顯示此幫助信息"
	@echo ""
	@echo "$(GREEN)💡 快速開始:$(NC)"
	@echo "  本地開發:"
	@echo "    1. 首次使用: make setup (設置環境)"
	@echo "    2. 啟動開發: make dev (或 make dev-event-portal / make dev-event-cms)"
	@echo "    3. 查看日誌: make logs"
	@echo "    4. 停止服務: make stop"
	@echo "  Docker 開發:"
	@echo "    1. 建置並啟動: make docker-up-build"
	@echo "    2. 查看日誌: make docker-logs"
	@echo "    3. 停止服務: make docker-stop"
	@echo ""
	@echo "$(BLUE)📖 注意事項:$(NC)"
	@echo "  - 本地開發: 需要 Node.js 18+ 和 pnpm"
	@echo "  - Docker 開發: 需要 Docker 和 Docker Compose (使用優化版本)"
	@echo "  - 服務網址: Event Portal (http://localhost:3000), Event CMS (http://localhost:3002)"
	@echo "  - Docker 版本: 已優化建構流程，支援靜態導出和智能啟動"

# ==================== 本地開發命令 ====================

dev: ## 啟動所有服務 (Event Portal + Event CMS + Profile)
	@echo "$(BLUE)[INFO]$(NC) 啟動 NX Playground 開發環境..."
	@$(MAKE) setup
	@echo "$(BLUE)[INFO]$(NC) 啟動 Event Portal, Event CMS 和 Profile 服務..."
	@$(MAKE) dev-event-portal &
	@sleep 3
	@$(MAKE) dev-event-cms &
	@sleep 3
	@$(MAKE) dev-profile &
	@echo "$(GREEN)[SUCCESS]$(NC) 所有服務已啟動！"
	@echo "$(YELLOW)📱 服務網址:$(NC)"
	@echo "  Event Portal: http://localhost:3000"
	@echo "  Event CMS:    http://localhost:3002"
	@echo "  Profile:      http://localhost:3003"

dev-event-portal: ## 僅啟動 Event Portal 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Event Portal 服務 (http://localhost:3000)..."
	@pnpm exec nx serve @nx-playground/event-portal

dev-event-cms: ## 僅啟動 Event CMS 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Event CMS 服務 (http://localhost:3002)..."
	@pnpm exec nx serve @nx-playground/event-cms

dev-vue: ## 僅啟動 Vue Motion 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Vue Motion 服務 (http://localhost:8080)..."
	@pnpm exec nx serve vue-motion

dev-enterprise: ## 僅啟動 Enterprise Admin 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Enterprise Admin 服務 (http://localhost:4200)..."
	@pnpm exec nx serve enterprise-admin

dev-profile: ## 僅啟動 Profile 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Profile 服務 (http://localhost:3003)..."
	@pnpm exec nx serve @nx-playground/profile

dev-api: ## 僅啟動 API Server 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 API Server 服務 (http://localhost:3001)..."
	@pnpm exec nx serve @nx-playground/api-server

dev-api-mock: ## 僅啟動 event-stack 契約 mock
	@echo "$(BLUE)[INFO]$(NC) 啟動 api-mock (http://localhost:3011)..."
	@pnpm exec nx serve @nx-playground/api-mock

dev-auth: ## 僅啟動 Auth 服務
	@echo "$(BLUE)[INFO]$(NC) 啟動 Auth 服務 (http://localhost:3004)..."
	@pnpm exec nx serve @nx-playground/auth

setup: ## 設置開發環境
	@echo "$(BLUE)[INFO]$(NC) 設置 NX Playground 開發環境..."
	@echo "$(BLUE)[INFO]$(NC) 檢查 Node.js 版本..."
	@node --version || (echo "$(RED)[ERROR]$(NC) 請安裝 Node.js 18+" && exit 1)
	@echo "$(BLUE)[INFO]$(NC) 檢查 pnpm 版本..."
	@pnpm --version || (echo "$(RED)[ERROR]$(NC) 請安裝 pnpm" && exit 1)
	@echo "$(BLUE)[INFO]$(NC) 安裝依賴..."
	@pnpm install --no-frozen-lockfile
	@echo "$(BLUE)[INFO]$(NC) 設置環境變數..."
	@./scripts/env-setup.sh
	@echo "$(GREEN)[SUCCESS]$(NC) 開發環境設置完成！"

seed: ## Prisma migrate deploy + seed from libs/api-fixtures (postgres only)
	@echo "$(BLUE)[INFO]$(NC) prisma generate + migrate deploy + seed..."
	@npx prisma generate --schema=apps/api-server/prisma/schema.prisma
	@npx prisma migrate deploy --schema=apps/api-server/prisma/schema.prisma
	@pnpm exec nx run @nx-playground/api-server:prisma-seed
	@echo "$(GREEN)[SUCCESS]$(NC) seed from libs/api-fixtures"

db-up: ## Local Postgres for Nest (port 5433). Hosted product DB is existing Neon.
	@echo "$(BLUE)[INFO]$(NC) starting event-stack-db on :5433..."
	@docker compose -f docker-compose.event-db.yml up -d
	@echo "$(GREEN)[SUCCESS]$(NC) DATABASE_URL=postgresql://event:event@127.0.0.1:5433/event_stack"

setup-lockfile-only: ## Windows 完整 install 失敗（深層 node_modules ENOENT）時：只刷新 lockfile 再安裝
	@echo "$(BLUE)[INFO]$(NC) pnpm install --lockfile-only（不落地 node_modules）..."
	@pnpm install --lockfile-only
	@echo "$(BLUE)[INFO]$(NC) 再執行實際安裝..."
	@pnpm install
	@echo "$(GREEN)[SUCCESS]$(NC) lockfile-only 刷新流程完成（見 docs/DEV-ENVIRONMENT.md）"

stop: ## 停止當前開發站台
	@echo "$(BLUE)[INFO]$(NC) 停止當前開發站台..."
	@pkill -f "nx serve" || true
	@pkill -f "next dev" || true
	@pkill -f "nx.js serve" || true
	@pkill -f "run-executor" || true
	@pkill -f "tasks-runner/fork" || true
	@echo "$(BLUE)[INFO]$(NC) 清理 Nx daemon..."
	@pnpm exec nx reset || true
	@echo "$(GREEN)[SUCCESS]$(NC) 開發站台已停止"

restart: ## 重啟所有開發服務
	@echo "$(BLUE)[INFO]$(NC) 重啟開發服務..."
	@$(MAKE) stop
	@sleep 2
	@$(MAKE) dev

logs: ## 查看服務日誌
	@echo "$(BLUE)[INFO]$(NC) 查看服務日誌..."
	@ps aux | grep "nx serve" | grep -v grep || echo "沒有運行中的服務"

status: ## 檢查服務狀態
	@echo "$(BLUE)[INFO]$(NC) 檢查服務狀態..."
	@echo "$(YELLOW)運行中的服務:$(NC)"
	@ps aux | grep "nx serve" | grep -v grep || echo "沒有運行中的服務"
	@echo ""
	@echo "$(YELLOW)端口使用狀況:$(NC)"
	@lsof -i :3000 -i :3002 || echo "端口 3000 和 3002 未被使用"

clean: ## 清理開發環境
	@echo "$(YELLOW)[WARNING]$(NC) 清理開發環境..."
	@$(MAKE) stop
	@echo "$(BLUE)[INFO]$(NC) 清理 node_modules..."
	@rm -rf node_modules
	@echo "$(BLUE)[INFO]$(NC) 清理建置快取..."
	@pnpm store prune
	@echo "$(GREEN)[SUCCESS]$(NC) 清理完成"

build: ## 清理、重新安裝依賴並建置所有專案
	@echo "$(BLUE)[INFO]$(NC) 開始完整建置流程..."
	@echo "$(BLUE)[INFO]$(NC) 步驟 1/3: 清理開發環境..."
	@$(MAKE) stop
	@echo "$(BLUE)[INFO]$(NC) 清理 node_modules..."
	@rm -rf node_modules
	@echo "$(BLUE)[INFO]$(NC) 清理建置快取..."
	@pnpm store prune
	@echo "$(BLUE)[INFO]$(NC) 步驟 2/3: 重新安裝依賴..."
	@pnpm install --no-frozen-lockfile
	@echo "$(BLUE)[INFO]$(NC) 步驟 3/3: 建置所有專案..."
	@pnpm exec nx run-many --target=build --all
	@echo "$(GREEN)[SUCCESS]$(NC) 完整建置流程完成！"

# ==================== Docker 環境命令 ====================

docker-build: ## 建置 Docker 映像檔 (優化版本)
	@echo "$(BLUE)[INFO]$(NC) 建置 NX Playground Docker 映像檔 (優化版本)..."
	@docker compose build
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 映像檔建置完成"

docker-up: ## 啟動 Docker 服務 (背景執行，優化版本)
	@echo "$(BLUE)[INFO]$(NC) 啟動 NX Playground Docker 服務 (優化版本)..."
	@docker compose up -d
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 服務已啟動"
	@echo "$(YELLOW)📱 服務網址:$(NC)"
	@echo "  Events:  http://localhost:3000"
	@echo "  Console: http://localhost:3002"

docker-up-build: ## 建置並啟動 Docker 服務 (背景執行，優化版本)
	@echo "$(BLUE)[INFO]$(NC) 建置並啟動 NX Playground Docker 服務 (優化版本)..."
	@docker compose up -d --build
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 服務已建置並啟動"
	@echo "$(YELLOW)📱 服務網址:$(NC)"
	@echo "  Events:  http://localhost:3000"
	@echo "  Console: http://localhost:3002"

docker-stop: ## 停止 Docker 服務
	@echo "$(BLUE)[INFO]$(NC) 停止 Docker 服務..."
	@docker compose down
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 服務已停止"

docker-restart: ## 重啟 Docker 服務
	@echo "$(BLUE)[INFO]$(NC) 重啟 Docker 服務..."
	@$(MAKE) docker-stop
	@sleep 2
	@$(MAKE) docker-up-build

docker-logs: ## 查看 Docker 服務日誌
	@echo "$(BLUE)[INFO]$(NC) 查看 Docker 服務日誌..."
	@docker compose logs -f

docker-status: ## 檢查 Docker 服務狀態
	@echo "$(BLUE)[INFO]$(NC) 檢查 Docker 服務狀態..."
	@echo "$(YELLOW)運行中的容器:$(NC)"
	@docker compose ps
	@echo ""
	@echo "$(YELLOW)端口使用狀況:$(NC)"
	@lsof -i :3000 -i :3002 || echo "端口 3000 和 3002 未被使用"

docker-clean: ## 清理 Docker 環境 (停止服務、清理映像檔、清理快取)
	@echo "$(YELLOW)[WARNING]$(NC) 清理 Docker 環境..."
	@$(MAKE) docker-stop
	@echo "$(BLUE)[INFO]$(NC) 清理 Docker 映像檔..."
	@docker compose down --rmi all --volumes --remove-orphans || true
	@echo "$(BLUE)[INFO]$(NC) 清理 Docker 系統快取..."
	@docker system prune -a -f
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 環境清理完成"

docker-test: ## 在 Docker 環境中執行測試
	@echo "$(BLUE)[INFO]$(NC) 在 Docker 環境中執行測試..."
	@docker compose exec events pnpm exec nx test @nx-playground/event-portal || true
	@docker compose exec console pnpm exec nx test @nx-playground/event-cms || true
	@echo "$(GREEN)[SUCCESS]$(NC) Docker 測試完成"

# ==================== 測試命令 ====================

test: ## 執行所有 Jest 測試
	@echo "$(BLUE)[INFO]$(NC) 執行所有 Jest 測試..."
	@pnpm test
	@echo "$(GREEN)[SUCCESS]$(NC) 所有測試執行完成"

test-mock: ## 執行 Mock 資料測試
	@echo "$(BLUE)[INFO]$(NC) 執行 Mock 資料測試..."
	@pnpm test:mock-data
	@echo "$(GREEN)[SUCCESS]$(NC) Mock 資料測試執行完成"

test-react: ## 執行 React 組件測試
	@echo "$(BLUE)[INFO]$(NC) 執行 React 組件測試..."
	@pnpm test:react
	@echo "$(GREEN)[SUCCESS]$(NC) React 組件測試執行完成"

test-i18n: ## 執行 i18n 測試
	@echo "$(BLUE)[INFO]$(NC) 執行 i18n 測試..."
	@pnpm test:i18n
	@echo "$(GREEN)[SUCCESS]$(NC) i18n 測試執行完成"

test-coverage: ## 執行測試並生成覆蓋率報告
	@echo "$(BLUE)[INFO]$(NC) 執行測試並生成覆蓋率報告..."
	@pnpm test:coverage
	@echo "$(GREEN)[SUCCESS]$(NC) 測試覆蓋率報告生成完成"
	@echo "$(YELLOW)[INFO]$(NC) 覆蓋率報告位置: ./coverage/index.html"

test-watch: ## 監聽模式執行測試
	@echo "$(BLUE)[INFO]$(NC) 啟動測試監聽模式..."
	@pnpm test:watch

test-affected: ## 執行受影響檔案的測試
	@echo "$(BLUE)[INFO]$(NC) 執行受影響檔案的測試..."
	@pnpm test:affected
	@echo "$(GREEN)[SUCCESS]$(NC) 受影響檔案測試執行完成"

# ==================== 生產環境命令 ====================

prod: ## 啟動生產環境 (docker compose up --build)
	@echo "$(BLUE)[INFO]$(NC) 啟動 NX Playground 生產環境..."
	@docker compose up --build
