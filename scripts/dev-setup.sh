#!/bin/bash

# --- 載入配置 ---
# 載入統一配置
source "$(dirname "$0")/config.sh"

# --- 顏色輸出 ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# --- 函數定義 ---
print_step() {
    echo -e "${BLUE}--- $1 ---${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# --- 參數解析 ---
while [[ $# -gt 0 ]]; do
    case $1 in
        --help)
            echo "用法: $0 [選項]"
            echo "選項:"
            echo "  --help              顯示此說明"
            exit 0
            ;;
        *)
            print_error "未知參數: $1"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}--- NX Playground 本地開發環境設置 ---${NC}"

# --- 1. 檢查 Node.js 環境 ---
print_step "檢查 Node.js 環境"

if ! command -v node &> /dev/null; then
    print_error "Node.js 未安裝，請安裝 Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if ! node -e "process.exit(require('semver').gte('$NODE_VERSION', '$REQUIRED_VERSION') ? 0 : 1)" 2>/dev/null; then
    print_error "Node.js 版本過低，需要 18+，當前版本: $NODE_VERSION"
    exit 1
fi

print_success "Node.js 版本正確: $NODE_VERSION"

# --- 2. 檢查和安裝 pnpm ---
print_step "檢查 pnpm 版本"

if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm 未安裝，正在安裝..."
    npm install -g pnpm@$PNPM_VERSION
fi

CURRENT_PNPM_VERSION=$(pnpm --version)
if [ "$CURRENT_PNPM_VERSION" != "$PNPM_VERSION" ]; then
    print_warning "pnpm 版本不匹配，正在更新..."
    npm uninstall -g pnpm 2>/dev/null || true
    npm install -g pnpm@$PNPM_VERSION
fi

print_success "pnpm 版本正確: $(pnpm --version)"

# --- 3. 安裝依賴 ---
print_step "安裝專案依賴"

if [ -f "pnpm-lock.yaml" ]; then
    print_warning "檢測到 lockfile，使用 --frozen-lockfile 安裝"
    pnpm install --frozen-lockfile
else
    print_warning "未檢測到 lockfile，執行完整安裝"
    pnpm install
fi

print_success "依賴安裝完成"

# --- 4. 設置環境變數 ---
print_step "設置環境變數"

if [ -f "scripts/env-setup.sh" ]; then
    ./scripts/env-setup.sh
    print_success "環境變數設置完成"
else
    print_warning "env-setup.sh 不存在，跳過環境變數設置"
fi

# --- 5. 清理和重置 Nx 快取 ---
print_step "清理 Nx 快取"

if command -v nx &> /dev/null; then
    pnpm nx reset
    print_success "Nx 快取已重置"
else
    print_warning "Nx 未安裝，跳過快取重置"
fi

# --- 6. 建置依賴庫 ---
print_step "建置共享依賴庫"

pnpm exec nx run-many --target=build --projects=tag:type:lib
print_success "依賴庫建置完成"

# --- 完成 ---
print_success "本地開發環境設置完成！"
echo ""
echo -e "${GREEN}🎉 設置完成！現在可以使用以下命令：${NC}"
echo -e "${YELLOW}  make dev         - 啟動所有服務${NC}"
echo -e "${YELLOW}  make dev-events  - 僅啟動 Events 服務${NC}"
echo -e "${YELLOW}  make dev-console - 僅啟動 Console 服務${NC}"
echo ""
echo -e "${BLUE}📱 服務網址：${NC}"
echo -e "${YELLOW}  Events:  http://localhost:3000${NC}"
echo -e "${YELLOW}  Console: http://localhost:3002${NC}"
