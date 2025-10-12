#!/bin/bash

echo "🚀 啟動 Events App 開發環境..."
echo "📍 端口: 3000"
echo "🌐 本地訪問: http://localhost:3000"
echo "🌍 生產環境: https://frontend.nx-playground.local"
echo ""

# 檢查端口是否被佔用
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  端口 3000 已被佔用，正在停止現有進程..."
    pkill -f "next dev"
    sleep 2
fi

# 啟動開發服務器
echo "✅ 啟動開發服務器..."
pnpm dev
