#!/bin/bash

# ==================== Cloudflare 隧道啟動腳本 ====================
# 用於啟動 Cloudflare 隧道服務，支援本地開發域名

set -e

echo "🚀 啟動 Cloudflare 隧道服務..."

# 檢查 cloudflared 是否安裝
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared 未安裝"
    echo "請先安裝 cloudflared:"
    echo "  macOS: brew install cloudflared"
    echo "  Linux: 參考 docs/CLOUDFLARE_SETUP.md"
    echo "  Windows: choco install cloudflared"
    exit 1
fi

# 檢查是否已安裝服務
if ! sudo systemctl list-unit-files | grep -q "cloudflared.service"; then
    echo "⚠️  Cloudflare 隧道服務未安裝"
    echo "請先安裝服務:"
    echo "sudo cloudflared service install eyJhIjoiNjllOTY2OGJiMDAzNjM0MjQ2MGVkMDcwMzdhN2FlMjQiLCJ0IjoiZjQ4YTMxNWEtNGNlZC00NWEwLTliNjktN2Q1MTY2ZmFlZDQzIiwicyI6Ik5HWmtabUprTkRrdFpHWmxZaTAwTmpVeUxXRTFZMkl0WW1ReE0yWmhaV0V6TVRkaSJ9"
    exit 1
fi

# 啟動服務
echo "✅ 啟動 Cloudflare 隧道服務..."
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
if sudo systemctl is-active --quiet cloudflared; then
    echo "✅ 服務已啟動"
    echo "🌐 域名: https://frontend.nx-playground.local"
    echo "🔗 本地: http://localhost:3000"
    echo ""
    echo "服務已在背景運行，按 Ctrl+C 退出"
    echo ""
    echo "查看服務日誌: sudo journalctl -u cloudflared -f"
    echo "停止服務: sudo systemctl stop cloudflared"
else
    echo "❌ 服務啟動失敗"
    echo "查看日誌: sudo journalctl -u cloudflared -n 20"
    exit 1
fi
