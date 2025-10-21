#!/usr/bin/env node
/**
 * 為專案 README 添加 Front Matter
 * 從 package.json 和現有內容提取資訊
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rootDir = path.join(__dirname, '../..');

/**
 * 讀取 package.json
 */
function getPackageInfo(type, projectId) {
  const pkgPath = path.join(rootDir, type, projectId, 'package.json');
  if (!fs.existsSync(pkgPath)) return null;

  try {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  } catch (error) {
    return null;
  }
}

/**
 * 從 PRD 讀取資訊
 */
function getPRDInfo(type, projectId) {
  const prdPath = path.join(rootDir, 'specs', type, projectId, 'zh-TW.md');
  if (!fs.existsSync(prdPath)) return null;

  try {
    const { data } = matter.read(prdPath);
    return data;
  } catch (error) {
    return null;
  }
}

/**
 * 提取 README 第一段作為 description
 */
function extractDescription(content) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // 跳過標題、引用、空行
    if (line && !line.startsWith('#') && !line.startsWith('>') && !line.startsWith('-')) {
      return line.replace(/\*\*/g, '').substring(0, 200);
    }
  }
  return '';
}

/**
 * 為 README 添加 Front Matter
 */
function addREADMEFrontMatter(type, projectId, locale) {
  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';
  const readmePath = path.join(rootDir, type, projectId, fileName);

  if (!fs.existsSync(readmePath)) {
    console.log(`⚠️  ${type}/${projectId}/${fileName} 不存在，跳過`);
    return;
  }

  const content = fs.readFileSync(readmePath, 'utf-8');

  // 檢查是否已有 Front Matter
  if (content.startsWith('---')) {
    console.log(`✓  ${type}/${projectId}/${fileName} - 已有 Front Matter`);
    return;
  }

  // 讀取專案資訊
  const pkg = getPackageInfo(type, projectId);
  const prd = getPRDInfo(type, projectId);

  // 建立 Front Matter
  const frontmatter = {
    id: projectId,
    name: pkg?.name?.split('/').pop() || projectId,
    version: pkg?.version || '1.0.0',
    description: extractDescription(content) || `${projectId} project`,
    techStack: prd?.highlights || [],
    features: [],
    lastUpdated: new Date().toISOString().split('T')[0],
  };

  // 添加可選欄位
  if (prd) {
    if (locale === 'zh-TW' && content.includes('localhost')) {
      // 開發環境連結
      const portMatch = content.match(/localhost:(\d+)/);
      if (portMatch) {
        frontmatter.demoUrl = `http://localhost:${portMatch[1]}`;
      }
    }
  }

  // 合併 Front Matter 和內容
  const newContent = matter.stringify(content, frontmatter);

  // 寫入檔案
  fs.writeFileSync(readmePath, newContent);
  console.log(`✅ 添加: ${type}/${projectId}/${fileName}`);
}

/**
 * 掃描專案
 */
function scanProjects(type) {
  const typeDir = path.join(rootDir, type);
  if (!fs.existsSync(typeDir)) return [];

  return fs.readdirSync(typeDir).filter(name => {
    const projectPath = path.join(typeDir, name);
    return (
      fs.statSync(projectPath).isDirectory() &&
      name !== 'node_modules' &&
      name !== 'dist'
    );
  });
}

/**
 * 主程式
 */
function main() {
  console.log('📝 為 README 添加 Front Matter...\n');

  // Apps
  console.log('📱 Apps:');
  const apps = scanProjects('apps');
  apps.forEach(appId => {
    addREADMEFrontMatter('apps', appId, 'zh-TW');
    addREADMEFrontMatter('apps', appId, 'en');
  });

  console.log('');

  // Libs
  console.log('📚 Libs:');
  const libs = scanProjects('libs');
  libs.forEach(libId => {
    addREADMEFrontMatter('libs', libId, 'zh-TW');
    addREADMEFrontMatter('libs', libId, 'en');
  });

  console.log('');
  console.log('✅ 完成！');
  console.log('');
  console.log('📝 下一步:');
  console.log('   1. 檢查生成的 Front Matter');
  console.log('   2. 手動調整 features 列表');
  console.log('   3. 執行 pnpm run prd:version 檢查版本');
}

main();

