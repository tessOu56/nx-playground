#!/bin/bash
# 自動同步 OpenAPI 規格到前端

set -e

echo "🔄 Syncing OpenAPI spec..."

# 設置資料庫 URL（絕對路徑）
export DATABASE_URL="file:$(pwd)/apps/api-server/prisma/dev.db"

# 1. 構建 API server
echo "📦 Building API server..."
pnpm exec nx build @nx-playground/api-server

# 2. 啟動 NestJS server (background)
echo "🚀 Starting API server..."
node dist/apps/api-server/main.js &
SERVER_PID=$!

# 3. 等待 server 啟動
echo "⏳ Waiting for server to start..."
sleep 5

# 4. 檢查 server 是否運行
if ! curl -f http://localhost:3001/api/events > /dev/null 2>&1; then
  echo "❌ Server failed to start"
  kill $SERVER_PID 2>/dev/null || true
  exit 1
fi

# 5. 下載 OpenAPI JSON
echo "📥 Downloading OpenAPI spec..."
curl http://localhost:3001/api-json -o openapi.json

# 6. 複製到 api-client
echo "📋 Copying to libs/api-client/specs/..."
mkdir -p libs/api-client/specs
cp openapi.json libs/api-client/specs/server.json

# 7. 運行 orval 生成 hooks
echo "⚙️  Generating React Query hooks..."
cd libs/api-client
pnpm orval || echo "Note: orval config may need updates"
cd ../..

# 8. 停止 server
echo "🛑 Stopping server..."
kill $SERVER_PID 2>/dev/null || true
sleep 1

echo "✅ OpenAPI sync completed!"
echo "📄 Generated files:"
echo "  - openapi.json"
echo "  - libs/api-client/specs/server.json"
echo "  - libs/api-client/src/server/**/* (React Query hooks)"
