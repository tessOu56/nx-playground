#!/bin/bash

# ==================== Cloudflare 快速設置腳本 ====================
# 一鍵安裝和配置 Cloudflare 隧道

set -e

echo "🚀 Cloudflare 隧道快速設置..."

# 檢查是否為 macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo "❌ 此腳本目前只支援 macOS"
    echo "其他系統請參考 docs/CLOUDFLARE_SETUP.md"
    exit 1
fi

# 檢查 Homebrew
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew 未安裝"
    echo "請先安裝 Homebrew: https://brew.sh/"
    exit 1
fi

# 安裝 cloudflared
echo "📦 安裝 cloudflared..."
brew install cloudflared

# 安裝隧道服務
echo "🔧 安裝 Cloudflare 隧道服務..."
./scripts/manage-cloudflare-token.sh install

# 配置 hosts 文件
echo "📝 配置系統 hosts 文件..."
HOSTS_FILE="/etc/hosts"
HOSTS_ENTRIES=(
    "127.0.0.1 frontend.oosa.life"
    "::1 frontend.oosa.life"
)

# 檢查是否已經配置
for entry in "${HOSTS_ENTRIES[@]}"; do
    if ! grep -q "$entry" "$HOSTS_FILE"; then
        echo "添加: $entry"
        echo "$entry" | sudo tee -a "$HOSTS_FILE" > /dev/null
    else
        echo "已存在: $entry"
    fi
done

# 啟動服務
echo "🚀 啟動 Cloudflare 隧道服務..."
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# 檢查服務狀態
echo "🔍 檢查服務狀態..."
if sudo systemctl is-active --quiet cloudflared; then
    echo "✅ 設置完成！"
    echo ""
    echo "🌐 現在可以通過以下地址訪問:"
    echo "  - http://localhost:3000 (本地開發)"
    echo "  - https://frontend.oosa.life (生產域名)"
    echo ""
    echo "📋 常用命令:"
    echo "  - 啟動服務: pnpm cloudflare:start"
    echo "  - 查看日誌: sudo journalctl -u cloudflared -f"
    echo "  - 停止服務: sudo systemctl stop cloudflared"
    echo ""
    echo "🎉 設置完成！可以開始開發了"
else
    echo "❌ 服務啟動失敗"
    echo "查看日誌: sudo journalctl -u cloudflared -n 20"
    exit 1
fi
