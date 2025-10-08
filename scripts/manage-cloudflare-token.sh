#!/bin/bash

# ==================== Cloudflare Token 管理腳本 ====================
# 用於安全地管理 Cloudflare 隧道 token

set -e

TOKEN_FILE="scripts/.cloudflare-token.enc"
ENCRYPTED_FILE="scripts/.cloudflare-token.encrypted"

# 簡單的加密函數（使用 base64 + 簡單混淆）
encrypt_token() {
    local token="$1"
    # 使用 base64 編碼並添加簡單混淆
    echo "$token" | base64 | tr 'A-Za-z' 'N-ZA-Mn-za-m' > "$ENCRYPTED_FILE"
    echo "✅ Token 已加密保存到: $ENCRYPTED_FILE"
}

# 解密函數
decrypt_token() {
    if [ -f "$ENCRYPTED_FILE" ]; then
        # 反向混淆 + base64 解碼
        cat "$ENCRYPTED_FILE" | tr 'N-ZA-Mn-za-m' 'A-Za-z' | base64 -d
    elif [ -f "$TOKEN_FILE" ]; then
        # 如果沒有加密文件，直接讀取原始文件
        cat "$TOKEN_FILE"
    else
        echo "❌ 找不到 token 文件"
        exit 1
    fi
}

# 安裝 Cloudflare 隧道服務
install_tunnel() {
    local token
    token=$(decrypt_token)

    if [ -z "$token" ]; then
        echo "❌ 無法獲取 token"
        exit 1
    fi

    echo "🔧 安裝 Cloudflare 隧道服務..."
    echo "sudo cloudflared service install $token"

    # 實際執行安裝
    sudo cloudflared service install "$token"

    if [ $? -eq 0 ]; then
        echo "✅ 隧道服務安裝成功"
    else
        echo "❌ 隧道服務安裝失敗"
        exit 1
    fi
}

# 顯示幫助信息
show_help() {
    echo "🔧 Cloudflare Token 管理腳本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  encrypt    - 加密 token 文件"
    echo "  decrypt    - 解密並顯示 token"
    echo "  install    - 安裝 Cloudflare 隧道服務"
    echo "  help       - 顯示此幫助信息"
    echo ""
    echo "範例:"
    echo "  $0 encrypt    # 加密 token"
    echo "  $0 install    # 安裝隧道服務"
    echo ""
    echo "注意: 請確保 $TOKEN_FILE 文件存在且包含有效的 token"
}

# 主邏輯
case "${1:-help}" in
    "encrypt")
        if [ -f "$TOKEN_FILE" ]; then
            encrypt_token "$(cat "$TOKEN_FILE")"
        else
            echo "❌ Token 文件不存在: $TOKEN_FILE"
            exit 1
        fi
        ;;
    "decrypt")
        decrypt_token
        ;;
    "install")
        install_tunnel
        ;;
    "help"|*)
        show_help
        ;;
esac
