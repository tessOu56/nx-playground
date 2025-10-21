#!/usr/bin/env node
/**
 * i18n 同步檢查腳本
 * 檢查 zh-TW 和 en 版本的 PRD 是否同步
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const specsRoot = path.join(__dirname, '..');

/**
 * 檢查單一專案的 i18n 同步狀態
 */
function checkI18nSync(type, projectId) {
  const zhTWPath = path.join(specsRoot, type, projectId, 'zh-TW.md');
  const enPath = path.join(specsRoot, type, projectId, 'en.md');

  if (!fs.existsSync(zhTWPath)) {
    console.log(`⚠️  ${type}/${projectId}: zh-TW.md 不存在`);
    return false;
  }

  if (!fs.existsSync(enPath)) {
    console.log(`⚠️  ${type}/${projectId}: en.md 不存在`);
    return false;
  }

  const zhTW = matter.read(zhTWPath);
  const en = matter.read(enPath);

  const zhVersion = zhTW.data.version;
  const enVersion = en.data.version;
  const zhLastUpdated = zhTW.data.lastUpdated;
  const enLastUpdated = en.data.lastUpdated;

  if (zhVersion !== enVersion) {
    console.log(`❌ ${type}/${projectId}: 版本不一致`);
    console.log(`   zh-TW: v${zhVersion} (${zhLastUpdated})`);
    console.log(`   en:    v${enVersion} (${enLastUpdated})`);
    return false;
  }

  const syncDate = new Date().toISOString().split('T')[0];

  // 更新 lastSync
  if (en.data.lastSync !== syncDate) {
    en.data.lastSync = syncDate;
    fs.writeFileSync(enPath, matter.stringify(en.content, en.data));
    console.log(`✅ ${type}/${projectId}: i18n 已同步 (v${zhVersion})`);
  } else {
    console.log(`✅ ${type}/${projectId}: i18n 已是最新 (v${zhVersion})`);
  }

  return true;
}

/**
 * 掃描所有專案
 */
function scanProjects(type) {
  const typeDir = path.join(specsRoot, type);
  if (!fs.existsSync(typeDir)) {
    console.log(`⚠️  ${type} 目錄不存在`);
    return [];
  }

  const projects = fs
    .readdirSync(typeDir)
    .filter(name => {
      const projectPath = path.join(typeDir, name);
      return fs.statSync(projectPath).isDirectory();
    });

  return projects;
}

/**
 * 主程式
 */
function main() {
  console.log('🔍 檢查 PRD i18n 同步狀態...\n');

  let allSynced = true;

  // 檢查 Apps
  console.log('📱 Apps:');
  const apps = scanProjects('apps');
  apps.forEach(appId => {
    const synced = checkI18nSync('apps', appId);
    if (!synced) allSynced = false;
  });

  console.log('');

  // 檢查 Libs
  console.log('📚 Libs:');
  const libs = scanProjects('libs');
  libs.forEach(libId => {
    const synced = checkI18nSync('libs', libId);
    if (!synced) allSynced = false;
  });

  console.log('');

  if (allSynced) {
    console.log('✅ 所有 PRD i18n 已同步！');
    process.exit(0);
  } else {
    console.log('❌ 部分 PRD i18n 未同步，請更新');
    process.exit(1);
  }
}

main();

