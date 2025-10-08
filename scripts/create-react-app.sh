#!/bin/bash

# NX Playground - React App Generator
# 用於快速建立新的 React 應用

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 檢查參數
if [ -z "$1" ]; then
    echo -e "${RED}[ERROR]${NC} 請提供專案名稱"
    echo -e "${YELLOW}使用方式:${NC} ./scripts/create-react-app.sh <project-name> [port]"
    echo -e "${YELLOW}範例:${NC} ./scripts/create-react-app.sh my-app 3004"
    exit 1
fi

PROJECT_NAME=$1
PORT=${2:-3004}  # 預設 port 為 3004
TEMPLATE_DIR="templates/react-template"
TARGET_DIR="apps/${PROJECT_NAME}"

# 檢查專案是否已存在
if [ -d "$TARGET_DIR" ]; then
    echo -e "${RED}[ERROR]${NC} 專案 ${PROJECT_NAME} 已存在於 ${TARGET_DIR}"
    exit 1
fi

echo -e "${BLUE}[INFO]${NC} 開始建立 React 專案: ${PROJECT_NAME}"
echo -e "${BLUE}[INFO]${NC} Port: ${PORT}"
echo ""

# 1. 複製模板
echo -e "${BLUE}[STEP 1/5]${NC} 複製模板..."
cp -r "$TEMPLATE_DIR" "$TARGET_DIR"

# 2. 處理模板變數
echo -e "${BLUE}[STEP 2/5]${NC} 配置專案..."

# 將專案名稱轉換為 Pascal Case 作為顯示標題
PROJECT_TITLE=$(echo "$PROJECT_NAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')

# 替換 project.json.template
sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g; s/{{PORT}}/$PORT/g" \
    "$TARGET_DIR/project.json.template" > "$TARGET_DIR/project.json"
rm "$TARGET_DIR/project.json.template"

# 替換 package.json.template
sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g" \
    "$TARGET_DIR/package.json.template" > "$TARGET_DIR/package.json"
rm "$TARGET_DIR/package.json.template"

# 替換 vite.config.ts.template
sed "s/{{PROJECT_NAME}}/$PROJECT_NAME/g; s/{{PORT}}/$PORT/g" \
    "$TARGET_DIR/vite.config.ts.template" > "$TARGET_DIR/vite.config.ts"
rm "$TARGET_DIR/vite.config.ts.template"

# 替換 index.html.template
sed "s/{{PROJECT_TITLE}}/$PROJECT_TITLE/g; s/{{PROJECT_DESCRIPTION}}/A React application built with NX Playground/g" \
    "$TARGET_DIR/index.html.template" > "$TARGET_DIR/index.html"
rm "$TARGET_DIR/index.html.template"

# 替換源代碼中的模板變數
find "$TARGET_DIR/src" -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' "s/{{PROJECT_TITLE}}/$PROJECT_TITLE/g" {} +

# 3. 更新 tsconfig.base.json
echo -e "${BLUE}[STEP 3/5]${NC} 更新 TypeScript 配置..."
# 這部分需要手動更新或使用更複雜的 JSON 處理
echo -e "${YELLOW}[TODO]${NC} 請手動將以下內容添加到 tsconfig.base.json 的 paths:"
echo -e "  \"@nx-playground/${PROJECT_NAME}\": [\"apps/${PROJECT_NAME}/src\"]"

# 4. 更新 package.json scripts
echo -e "${BLUE}[STEP 4/5]${NC} 更新 root package.json..."
echo -e "${YELLOW}[TODO]${NC} 請手動將以下腳本添加到 root package.json:"
echo -e "  \"dev:${PROJECT_NAME}\": \"nx serve @nx-playground/${PROJECT_NAME}\","

# 5. 完成
echo ""
echo -e "${GREEN}[SUCCESS]${NC} React 專案建立成功！"
echo ""
echo -e "${YELLOW}📁 專案位置:${NC} ${TARGET_DIR}"
echo -e "${YELLOW}🌐 開發端口:${NC} http://localhost:${PORT}"
echo ""
echo -e "${BLUE}下一步:${NC}"
echo -e "  1. 更新 tsconfig.base.json 添加路徑映射"
echo -e "  2. 更新 root package.json 添加 dev 腳本"
echo -e "  3. 執行: ${GREEN}nx serve @nx-playground/${PROJECT_NAME}${NC}"
echo ""
echo -e "${BLUE}或執行自動配置:${NC}"
echo -e "  ${GREEN}./scripts/finish-setup.sh ${PROJECT_NAME} ${PORT}${NC}"
echo ""
