#!/bin/bash

# ==================== CI/CD 自動化部署腳本 ====================
# 用於 GitHub Actions 等 CI/CD 環境，完全自動化，無手動交互

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 檢查必要的環境變數
check_required_env_vars() {
    log_info "檢查必要的環境變數..."

    local required_vars=(
        "NEXT_PUBLIC_LIFF_ID"
        "NEXT_PUBLIC_LINE_REDIRECT_URI"
        "NEXT_PUBLIC_LINE_CLIENT_ID"
        "LINE_CLIENT_SECRET"
        "NEXT_PUBLIC_API_URL"
        "NEXT_PUBLIC_CORS_ORIGIN"
    )

    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done

    if [ ${#missing_vars[@]} -gt 0 ]; then
        log_error "缺少必要的環境變數:"
        printf '  - %s\n' "${missing_vars[@]}"
        exit 1
    fi

    log_success "所有必要的環境變數都已設定"
}

# 創建 Docker 網路
setup_network() {
    log_info "設置 Docker 網路..."

    if ! docker network ls | grep -q "nx-playground-network"; then
        log_info "創建 nx-playground-network..."
        docker network create nx-playground-network
        log_success "網路創建成功"
    else
        log_info "網路已存在"
    fi
}

# 停止並清理舊容器
cleanup_containers() {
    log_info "清理舊容器..."

    local containers=("nx-playground-events" "nx-playground-console" "nx-playground-auth" "nx-playground-admin")

    for container in "${containers[@]}"; do
        if docker ps -q -f name="$container" | grep -q .; then
            log_info "停止容器: $container"
            docker stop "$container" || true
        fi

        if docker ps -aq -f name="$container" | grep -q .; then
            log_info "移除容器: $container"
            docker rm "$container" || true
        fi
    done

    log_success "容器清理完成"
}

# 構建映像檔
build_images() {
    log_info "構建 Docker 映像檔..."

    # 構建所有映像檔
    docker-compose build

    log_success "所有映像檔構建完成"
}

# 部署服務
deploy_services() {
    log_info "部署服務..."

    # Events 服務
    log_info "部署 Events 服務..."
    docker run -d \
        --name nx-playground-events \
        --network nx-playground-network \
        -p 3000:3000 \
        -e NEXT_PUBLIC_LIFF_ID="$NEXT_PUBLIC_LIFF_ID" \
        -e NEXT_PUBLIC_LINE_REDIRECT_URI="$NEXT_PUBLIC_LINE_REDIRECT_URI" \
        -e NEXT_PUBLIC_LINE_CLIENT_ID="$NEXT_PUBLIC_LINE_CLIENT_ID" \
        -e LINE_CLIENT_SECRET="$LINE_CLIENT_SECRET" \
        -e NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
        -e NEXT_PUBLIC_CORS_ORIGIN="$NEXT_PUBLIC_CORS_ORIGIN" \
        -e NEXT_PUBLIC_FRONTEND_URL="$NEXT_PUBLIC_FRONTEND_URL" \
        -e NEXT_PUBLIC_CONSOLE_URL="$NEXT_PUBLIC_CONSOLE_URL" \
        -e NEXT_PUBLIC_AUTH_URL="$NEXT_PUBLIC_AUTH_URL" \
        -e NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL="$NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL" \
        -e NEXT_PUBLIC_ADMIN_URL="$NEXT_PUBLIC_ADMIN_URL" \
        -e NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME" \
        -e NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION" \
        -e NEXT_PUBLIC_APP_ENV="$NEXT_PUBLIC_APP_ENV" \
        -e NODE_ENV=production \
        nx-playground-events:latest

    # Auth 服務
    log_info "部署 Auth 服務..."
    docker run -d \
        --name nx-playground-auth \
        --network nx-playground-network \
        -p 3003:3003 \
        -e NEXT_PUBLIC_LIFF_ID="$NEXT_PUBLIC_LIFF_ID" \
        -e NEXT_PUBLIC_LINE_REDIRECT_URI="$NEXT_PUBLIC_LINE_REDIRECT_URI" \
        -e NEXT_PUBLIC_LINE_CLIENT_ID="$NEXT_PUBLIC_LINE_CLIENT_ID" \
        -e LINE_CLIENT_SECRET="$LINE_CLIENT_SECRET" \
        -e NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
        -e NEXT_PUBLIC_CORS_ORIGIN="$NEXT_PUBLIC_CORS_ORIGIN" \
        -e NEXT_PUBLIC_FRONTEND_URL="$NEXT_PUBLIC_FRONTEND_URL" \
        -e NEXT_PUBLIC_CONSOLE_URL="$NEXT_PUBLIC_CONSOLE_URL" \
        -e NEXT_PUBLIC_AUTH_URL="$NEXT_PUBLIC_AUTH_URL" \
        -e NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL="$NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL" \
        -e NEXT_PUBLIC_ADMIN_URL="$NEXT_PUBLIC_ADMIN_URL" \
        -e NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME" \
        -e NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION" \
        -e NEXT_PUBLIC_APP_ENV="$NEXT_PUBLIC_APP_ENV" \
        -e NODE_ENV=production \
        nx-playground-auth:latest

    # Console Prototype 服務
    log_info "部署 Console Prototype 服務..."
    docker run -d \
        --name nx-playground-console \
        --network nx-playground-network \
        -p 3004:3004 \
        -e NEXT_PUBLIC_LIFF_ID="$NEXT_PUBLIC_LIFF_ID" \
        -e NEXT_PUBLIC_LINE_REDIRECT_URI="$NEXT_PUBLIC_LINE_REDIRECT_URI" \
        -e NEXT_PUBLIC_LINE_CLIENT_ID="$NEXT_PUBLIC_LINE_CLIENT_ID" \
        -e LINE_CLIENT_SECRET="$LINE_CLIENT_SECRET" \
        -e NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
        -e NEXT_PUBLIC_CORS_ORIGIN="$NEXT_PUBLIC_CORS_ORIGIN" \
        -e NEXT_PUBLIC_FRONTEND_URL="$NEXT_PUBLIC_FRONTEND_URL" \
        -e NEXT_PUBLIC_CONSOLE_URL="$NEXT_PUBLIC_CONSOLE_URL" \
        -e NEXT_PUBLIC_AUTH_URL="$NEXT_PUBLIC_AUTH_URL" \
        -e NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL="$NEXT_PUBLIC_CONSOLE_PROTOTYPE_URL" \
        -e NEXT_PUBLIC_ADMIN_URL="$NEXT_PUBLIC_ADMIN_URL" \
        -e NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME" \
        -e NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION" \
        -e NEXT_PUBLIC_APP_ENV="$NEXT_PUBLIC_APP_ENV" \
        -e NODE_ENV=production \
        nx-playground-console:latest

    log_success "所有服務部署完成"
}

# 健康檢查
health_check() {
    log_info "執行健康檢查..."

    # 等待服務啟動
    log_info "等待服務啟動..."
    sleep 30

    local services=(
        "http://localhost:3000/api/health"
        "http://localhost:3003/api/health"
        "http://localhost:3004/api/health"
    )

    local failed_checks=()

    for service in "${services[@]}"; do
        if curl -f -s "$service" > /dev/null; then
            log_success "健康檢查通過: $service"
        else
            log_error "健康檢查失敗: $service"
            failed_checks+=("$service")
        fi
    done

    if [ ${#failed_checks[@]} -gt 0 ]; then
        log_error "以下服務健康檢查失敗:"
        printf '  - %s\n' "${failed_checks[@]}"
        exit 1
    fi

    log_success "所有服務健康檢查通過！"
}

# 顯示部署狀態
show_status() {
    log_info "顯示部署狀態..."

    echo ""
    echo "🐳 容器狀態:"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

    echo ""
    echo "🌐 服務訪問地址:"
    echo "  - Events: http://localhost:3000"
    echo "  - Console: http://localhost:3002"
    echo "  - Auth: http://localhost:3003"
    echo "  - Console Prototype: http://localhost:3004"
    echo "  - Admin: http://localhost:3005"
}

# 主函數
main() {
    log_info "開始 CI/CD 自動化部署..."

    # 檢查環境變數
    check_required_env_vars

    # 設置網路
    setup_network

    # 清理舊容器
    cleanup_containers

    # 構建映像檔
    build_images

    # 部署服務
    deploy_services

    # 健康檢查
    health_check

    # 顯示狀態
    show_status

    log_success "部署完成！"
}

# 執行主函數
main "$@"
