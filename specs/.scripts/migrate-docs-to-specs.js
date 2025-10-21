#!/usr/bin/env node
/**
 * 遷移 docs/ 到 specs/ 並重新組織結構
 * 
 * 舊結構: docs/apps/zh-TW/PROFILE.md
 * 新結構: specs/apps/profile/zh-TW.md
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rootDir = path.join(__dirname, '../..');
const docsDir = path.join(rootDir, 'docs');
const specsDir = path.join(rootDir, 'specs');

/**
 * 轉換檔名：PROFILE.md → profile
 */
function convertFileName(fileName) {
  return fileName
    .replace('.md', '')
    .toLowerCase()
    .replace(/_/g, '-');
}

/**
 * 添加 PRD Front Matter
 */
function addPRDFrontMatter(content, projectId, locale) {
  const { data, content: markdownContent } = matter(content);

  // 從現有 Front Matter 提取資訊
  const prdData = {
    id: projectId,
    version: data.version || '1.0.0',
    lastUpdated: data.date || new Date().toISOString().split('T')[0],
    category: determineCategoryFromTags(data.tags || []),
    status: 'production',
    published: data.published !== false,
    shortDesc: data.excerpt || data.description || '',
    purpose: extractPurpose(markdownContent),
    highlights: data.tags?.slice(0, 5) || [],
    reviewer: 'tessou',
    updateFrequency: 'per-feature',
  };

  return matter.stringify(markdownContent, prdData);
}

/**
 * 從標籤判斷分類
 */
function determineCategoryFromTags(tags) {
  if (tags.includes('React 19') || tags.includes('React')) return 'react';
  if (tags.includes('Angular 20') || tags.includes('Angular')) return 'angular';
  if (tags.includes('Vue 3') || tags.includes('Vue')) return 'vue';
  if (tags.includes('Next.js 15') || tags.includes('Next.js')) return 'nextjs';
  
  // Libs
  if (tags.includes('UI') || tags.includes('Design')) return 'ui';
  if (tags.includes('Data Layer') || tags.includes('State')) return 'data';
  
  return 'utils';
}

/**
 * 從內容提取 purpose
 */
function extractPurpose(content) {
  // 找第一段文字作為 purpose
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('-')) {
      return line;
    }
  }
  return '';
}

/**
 * 遷移單一檔案
 */
function migrateFile(type, locale, fileName) {
  const oldPath = path.join(docsDir, type, locale, fileName);
  
  if (!fs.existsSync(oldPath)) {
    console.log(`⚠️  檔案不存在: ${path.relative(rootDir, oldPath)}`);
    return;
  }

  const projectId = convertFileName(fileName);
  const newDir = path.join(specsDir, type, projectId);
  const newPath = path.join(newDir, `${locale}.md`);

  // 建立目錄
  if (!fs.existsSync(newDir)) {
    fs.mkdirSync(newDir, { recursive: true });
  }

  // 讀取並轉換內容
  const content = fs.readFileSync(oldPath, 'utf-8');
  const newContent = addPRDFrontMatter(content, projectId, locale);

  // 寫入新檔案
  fs.writeFileSync(newPath, newContent);

  console.log(`✅ 遷移: ${fileName} → ${projectId}/${locale}.md`);
}

/**
 * 主程式
 */
function main() {
  console.log('📦 開始遷移 docs/ → specs/...\n');

  // 遷移 Apps
  console.log('📱 遷移 Apps:');
  const appsZhTW = path.join(docsDir, 'apps', 'zh-TW');
  if (fs.existsSync(appsZhTW)) {
    const files = fs.readdirSync(appsZhTW).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      migrateFile('apps', 'zh-TW', file);
      migrateFile('apps', 'en', file); // 同時遷移英文版
    });
  }

  console.log('');

  // 遷移 Libs
  console.log('📚 遷移 Libs:');
  const libsZhTW = path.join(docsDir, 'libs', 'zh-TW');
  if (fs.existsSync(libsZhTW)) {
    const files = fs.readdirSync(libsZhTW).filter(f => f.endsWith('.md'));
    files.forEach(file => {
      migrateFile('libs', 'zh-TW', file);
      migrateFile('libs', 'en', file);
    });
  }

  console.log('');
  console.log('✅ 遷移完成！');
  console.log('');
  console.log('📝 下一步:');
  console.log('   1. 檢查生成的 Front Matter: specs/apps/*/zh-TW.md');
  console.log('   2. 手動調整 PRD 內容為產品導向');
  console.log('   3. 執行 pnpm run prd:sync 同步 i18n');
  console.log('   4. 執行 pnpm run prd:validate 驗證格式');
}

main();

