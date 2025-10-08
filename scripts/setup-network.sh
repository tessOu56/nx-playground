#!/bin/bash

# ==================== 設置 NX Playground 網路腳本 ====================
# 用於檢查和創建 nx-playground-network 外部網路

set -e

echo "🔧 檢查和設置 NX Playground 網路..."

# 檢查 nx-playground-network 是否存在
if docker network ls | grep -q "nx-playground-network"; then
    echo "✅ NX Playground 網路已存在: nx-playground-network"
else
    echo "📡 創建 NX Playground 網路..."
    docker network create --driver bridge nx-playground-network
    echo "✅ NX Playground 網路創建成功: nx-playground-network"
fi

# 顯示網路信息
echo ""
echo "📋 網路信息:"
docker network ls | grep -E "(nx-playground)"

echo ""
echo "🌐 網路詳細信息:"
docker network inspect nx-playground-network --format='{{.Name}}: {{.Driver}} - {{.Scope}}' 2>/dev/null || echo "❌ 無法獲取網路詳細信息"

echo ""
echo "✅ 網路設置完成！"
