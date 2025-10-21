#!/usr/bin/env node
/**
 * 修復英文版 PRD 的 Front Matter
 * 從中文版複製缺少的欄位
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const specsRoot = path.join(__dirname, '..');

function fixEnFrontMatter(type, projectId) {
  const zhPath = path.join(specsRoot, type, projectId, 'zh-TW.md');
  const enPath = path.join(specsRoot, type, projectId, 'en.md');

  if (!fs.existsSync(zhPath) || !fs.existsSync(enPath)) {
    return;
  }

  const zh = matter.read(zhPath);
  const en = matter.read(enPath);

  // 從中文版複製缺少的欄位到英文版
  const fieldsToSync = [
    'id',
    'version',
    'category',
    'status',
    'published',
    'reviewer',
    'updateFrequency',
    'lastUpdated',
    'stats',
  ];

  let updated = false;
  fieldsToSync.forEach(field => {
    if (zh.data[field] !== undefined && en.data[field] === undefined) {
      en.data[field] = zh.data[field];
      updated = true;
    }
  });

  if (updated) {
    fs.writeFileSync(enPath, matter.stringify(en.content, en.data));
    console.log(`✅ 修復: ${type}/${projectId}/en.md`);
  } else {
    console.log(`✓  ${type}/${projectId}/en.md - 已是最新`);
  }
}

function scanProjects(type) {
  const typeDir = path.join(specsRoot, type);
  if (!fs.existsSync(typeDir)) return [];

  return fs.readdirSync(typeDir).filter(name => {
    const projectPath = path.join(typeDir, name);
    return (
      fs.statSync(projectPath).isDirectory() &&
      !name.startsWith('.') &&
      name !== 'STANDARDS'
    );
  });
}

function main() {
  console.log('🔧 修復英文版 Front Matter...\n');

  // Apps
  console.log('📱 Apps:');
  const apps = scanProjects('apps');
  apps.forEach(appId => fixEnFrontMatter('apps', appId));

  console.log('');

  // Libs
  console.log('📚 Libs:');
  const libs = scanProjects('libs');
  libs.forEach(libId => fixEnFrontMatter('libs', libId));

  console.log('');
  console.log('✅ 完成！');
}

main();

