#!/usr/bin/env node
/**
 * Front Matter 驗證腳本
 * 檢查 README 和 PRD 的 Front Matter 是否完整
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const specsRoot = path.join(__dirname, '..');

/**
 * README 必填欄位
 */
const readmeRequiredFields = ['id', 'name', 'version', 'description', 'techStack', 'features'];

/**
 * PRD 必填欄位
 */
const prdRequiredFields = [
  'id',
  'version',
  'category',
  'status',
  'published',
  'shortDesc',
  'purpose',
  'highlights',
];

/**
 * 驗證 Front Matter
 */
function validateFrontMatter(filePath, data, requiredFields, type) {
  const missing = requiredFields.filter(field => !data[field]);

  if (missing.length > 0) {
    console.log(`❌ ${filePath}: 缺少必填欄位`);
    missing.forEach(field => console.log(`   - ${field}`));
    return false;
  }

  console.log(`✅ ${path.relative(specsRoot, filePath)}: Front Matter 完整`);
  return true;
}

/**
 * 掃描並驗證檔案
 */
function validateFiles(baseDir, requiredFields, type) {
  let allValid = true;

  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // 跳過 STANDARDS 和隱藏目錄
        if (item === 'STANDARDS' || item.startsWith('.')) return;
        scanDir(itemPath);
      } else if (item.endsWith('.md') && item !== 'CHANGELOG.md' && item !== 'README.md') {
        try {
          const { data } = matter.read(itemPath);
          const valid = validateFrontMatter(itemPath, data, requiredFields, type);
          if (!valid) allValid = false;
        } catch (error) {
          console.log(`❌ ${itemPath}: 解析錯誤`);
          console.error(error.message);
          allValid = false;
        }
      }
    });
  }

  scanDir(baseDir);
  return allValid;
}

/**
 * 主程式
 */
function main() {
  console.log('🔍 驗證 Front Matter...\n');

  let allValid = true;

  // 驗證 PRD (specs/)
  console.log('📝 PRD Front Matter:');
  const specsValid = validateFiles(specsRoot, prdRequiredFields, 'PRD');
  if (!specsValid) allValid = false;

  console.log('');

  // TODO: 驗證 README（需要掃描 apps/ 和 libs/）
  // 暫時跳過，因為 README 可能尚未添加 Front Matter

  if (allValid) {
    console.log('✅ 所有 Front Matter 驗證通過！');
    process.exit(0);
  } else {
    console.log('❌ 部分 Front Matter 驗證失敗');
    process.exit(1);
  }
}

main();

