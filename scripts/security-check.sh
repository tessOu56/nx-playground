#!/bin/bash

# ==================== 安全檢查腳本 ====================
# 用於 CI/CD 流程中的安全性檢查

set -e

echo "🔒 開始安全性檢查..."

# 檢查 pnpm 版本
echo "📦 檢查 pnpm 版本..."
pnpm --version

# 檢查 lockfile 是否存在
if [ ! -f "pnpm-lock.yaml" ]; then
    echo "❌ 缺少 pnpm-lock.yaml 文件"
    echo "請先執行: pnpm install"
    exit 1
fi

# 檢查 lockfile 是否是最新的
echo "🔍 檢查 lockfile 是否最新..."
if ! pnpm install --frozen-lockfile --dry-run > /dev/null 2>&1; then
    echo "❌ lockfile 不是最新的"
    echo "請執行: pnpm install"
    exit 1
fi

# 執行安全審計
echo "🛡️  執行安全審計..."
if ! pnpm audit --audit-level moderate; then
    echo "⚠️  發現安全漏洞"
    echo "請執行: pnpm audit --fix"
    exit 1
fi

# 檢查過時的套件
echo "📋 檢查過時的套件..."
pnpm outdated || true

# 檢查是否有惡意套件
echo "🔍 檢查可疑套件..."
if pnpm list | grep -E "(eval|exec|require|process)" > /dev/null; then
    echo "⚠️  發現可疑套件，請檢查"
    pnpm list | grep -E "(eval|exec|require|process)"
fi

# 檢查套件完整性
echo "🔐 檢查套件完整性..."
if ! pnpm install --frozen-lockfile --verify-store-integrity; then
    echo "❌ 套件完整性檢查失敗"
    exit 1
fi

echo "✅ 安全性檢查完成！"
