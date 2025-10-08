#!/bin/bash

# NX Playground - Finish React App Setup
# 自動更新 tsconfig.base.json 和 root package.json

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ -z "$1" ]; then
    echo -e "${RED}[ERROR]${NC} 請提供專案名稱"
    echo -e "${YELLOW}使用方式:${NC} ./scripts/finish-setup.sh <project-name> [port]"
    exit 1
fi

PROJECT_NAME=$1
PORT=${2:-3004}

echo -e "${BLUE}[INFO]${NC} 完成 ${PROJECT_NAME} 專案設置..."
echo ""

# 1. 更新 tsconfig.base.json
echo -e "${BLUE}[STEP 1/2]${NC} 更新 tsconfig.base.json..."

# 使用 Node.js 來安全地更新 JSON
node -e "
const fs = require('fs');
const path = 'tsconfig.base.json';
const config = JSON.parse(fs.readFileSync(path, 'utf8'));

config.compilerOptions.paths['@nx-playground/${PROJECT_NAME}'] = ['apps/${PROJECT_NAME}/src'];

fs.writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
console.log('✅ tsconfig.base.json updated');
"

# 2. 更新 root package.json
echo -e "${BLUE}[STEP 2/2]${NC} 更新 package.json..."

node -e "
const fs = require('fs');
const path = 'package.json';
const pkg = JSON.parse(fs.readFileSync(path, 'utf8'));

pkg.scripts['dev:${PROJECT_NAME}'] = 'NX_CLOUD_NO_TIMEOUTS=true nx serve @nx-playground/${PROJECT_NAME}';

// 保持排序
const sortedScripts = {};
Object.keys(pkg.scripts).sort().forEach(key => {
  sortedScripts[key] = pkg.scripts[key];
});
pkg.scripts = sortedScripts;

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + '\n');
console.log('✅ package.json updated');
"

echo ""
echo -e "${GREEN}[SUCCESS]${NC} 專案設置完成！"
echo ""
echo -e "${YELLOW}🚀 啟動專案:${NC}"
echo -e "  ${GREEN}pnpm dev:${PROJECT_NAME}${NC}"
echo -e "  ${GREEN}nx serve @nx-playground/${PROJECT_NAME}${NC}"
echo ""
echo -e "${YELLOW}🌐 服務網址:${NC}"
echo -e "  http://localhost:${PORT}"
echo ""
