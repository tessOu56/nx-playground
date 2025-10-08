#!/bin/bash

# Nx Cloud 連接問題自動修復腳本
# 用於解決 "workspace is more than three days old and is not connected" 錯誤

set -e

echo "🔧 開始修復 Nx Cloud 連接問題..."

# 1. 重置 Nx 緩存
echo "📦 重置 Nx 緩存..."
pnpm exec nx reset

# 2. 清理 .nx 目錄中的 Cloud 相關文件
echo "🧹 清理 Nx Cloud 緩存..."
if [ -d ".nx/cache" ]; then
    rm -rf .nx/cache/*
    echo "   ✅ 已清理 .nx/cache"
fi

if [ -d ".nx/workspace-data" ]; then
    rm -rf .nx/workspace-data/*
    echo "   ✅ 已清理 .nx/workspace-data"
fi

# 3. 檢查並移除 nx.json 中的 Cloud 配置
echo "⚙️  檢查 nx.json 配置..."
if grep -q "nxCloudId\|nxCloudAccessToken" nx.json; then
    echo "   ⚠️  發現 Nx Cloud 配置，正在移除..."
    # 使用 sed 移除包含 nxCloud 的行
    sed -i '' '/nxCloudId\|nxCloudAccessToken/d' nx.json
    echo "   ✅ 已移除 Nx Cloud 配置"
else
    echo "   ✅ nx.json 中沒有 Nx Cloud 配置"
fi

# 4. 設置環境變數
export NX_CLOUD_NO_TIMEOUTS=true
export NX_CLOUD_ACCESS_TOKEN=disable

echo "🌐 已設置 Nx Cloud 禁用環境變數"

# 5. 驗證修復
echo "🔍 驗證修復結果..."
if pnpm exec nx --version > /dev/null 2>&1; then
    echo "   ✅ Nx 命令可用"
else
    echo "   ❌ Nx 命令不可用，請檢查安裝"
    exit 1
fi

echo ""
echo "🎉 Nx Cloud 問題修復完成！"
echo "💡 現在可以正常使用 nx 命令了"
echo ""
echo "📝 使用建議："
echo "   - 運行開發服務器：pnpm exec nx serve console"
echo "   - 構建項目：pnpm exec nx run-many -t build"
echo "   - 運行測試：pnpm exec nx run-many -t test"
echo ""
echo "🔧 如果問題再次出現，請運行：./scripts/fix-nx-cloud.sh"
