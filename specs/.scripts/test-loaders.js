#!/usr/bin/env node
/**
 * 測試載入器是否正常工作（Node.js 環境）
 * 注意：這只是基本測試，實際載入器在瀏覽器環境中使用 Vite 的 import.meta.glob
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rootDir = path.join(__dirname, '../..');

console.log('🧪 測試載入器邏輯...\n');

// 測試 README 讀取
console.log('📖 測試 README 讀取:');
const readmePath = path.join(rootDir, 'apps/profile/README.md');
if (fs.existsSync(readmePath)) {
  const { data } = matter.read(readmePath);
  console.log('  ✅ Profile README:');
  console.log(`     ID: ${data.id}`);
  console.log(`     Name: ${data.name}`);
  console.log(`     Version: ${data.version}`);
  console.log(`     Tech Stack: ${data.techStack?.length || 0} 項`);
} else {
  console.log('  ❌ Profile README 不存在');
}

console.log('');

// 測試 PRD 讀取
console.log('📋 測試 PRD 讀取:');
const prdPath = path.join(rootDir, 'specs/apps/profile/zh-TW.md');
if (fs.existsSync(prdPath)) {
  const { data } = matter.read(prdPath);
  console.log('  ✅ Profile PRD:');
  console.log(`     ID: ${data.id}`);
  console.log(`     Category: ${data.category}`);
  console.log(`     Status: ${data.status}`);
  console.log(`     Published: ${data.published}`);
  console.log(`     Highlights: ${data.highlights?.length || 0} 項`);
} else {
  console.log('  ❌ Profile PRD 不存在');
}

console.log('');

// 測試檔案數量
console.log('📊 檔案統計:');

function countFiles(pattern) {
  const { execSync } = require('child_process');
  try {
    const count = execSync(`find ${rootDir} -path "${pattern}" | wc -l`, {
      encoding: 'utf-8',
    }).trim();
    return parseInt(count);
  } catch (error) {
    return 0;
  }
}

const readmeCount = countFiles('*/*/README.md');
const prdCount = countFiles('specs/*/*/*.md');

console.log(`  READMEs: ${readmeCount} 個`);
console.log(`  PRDs: ${prdCount} 個`);

console.log('');
console.log('✅ 基本測試完成！');
console.log('');
console.log('💡 實際測試需要在 Profile app 中運行:');
console.log('   pnpm dev:profile');
console.log('   然後訪問 /apps 或 /libs 頁面');

