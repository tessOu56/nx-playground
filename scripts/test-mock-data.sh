#!/bin/bash

# Mock 資料測試腳本
# 用於在 commit 前檢查 mock 資料的完整性

echo "🧪 Running mock data tests..."

# 進入 events app 目錄
cd apps/events

# 創建一個簡單的測試腳本來驗證 mock 資料
cat > temp_test.js << 'EOF'
// 簡單的 mock 資料驗證腳本
try {
  // 檢查 mock 資料是否存在
  const fs = require('fs');
  const path = require('path');

  const mockFiles = [
    'src/lib/mock/bills/data/index.ts',
    'src/lib/mock/orders/data/index.ts',
    'src/lib/mock/payments/data/index.ts',
    'src/lib/mock/registrationForms/data/index.ts',
    'src/lib/mock/tickets/data/index.ts',
    'src/lib/mock/users/data/index.ts',
    'src/lib/mock/vendors/data/index.ts',
    'src/lib/mock/lineSettings/data/index.ts',
    'src/lib/mock/events/data/index.ts'
  ];

  console.log('📁 檢查 mock 資料檔案...');

  let allFilesExist = true;
  mockFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    console.log('❌ Mock 資料檔案檢查失敗');
    process.exit(1);
  }

  console.log('✅ Mock 資料檔案檢查通過');
  console.log('📝 注意: 完整的測試需要 TypeScript 環境');
  console.log('💡 建議: 在開發環境中手動執行完整測試');

} catch (error) {
  console.error('❌ 測試執行失敗:', error.message);
  process.exit(1);
}
EOF

# 執行簡單測試
if ! node temp_test.js; then
    echo "❌ Mock data tests failed"
    rm -f temp_test.js
    exit 1
fi

# 清理臨時檔案
rm -f temp_test.js

echo "✅ Mock data tests passed!"
exit 0
