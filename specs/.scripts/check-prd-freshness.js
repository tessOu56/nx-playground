#!/usr/bin/env node
/**
 * PRD 新鮮度檢查腳本
 * 檢查最近變更的專案，其 PRD 是否在 24 小時內更新過
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '../..');
const specsRoot = path.join(__dirname, '..');

/**
 * 從 git diff 檢測變更的專案
 */
function detectChangedApps() {
  try {
    // 獲取 staged changes
    const diffOutput = execSync('git diff --cached --name-only', {
      cwd: rootDir,
      encoding: 'utf-8',
    });

    const changedFiles = diffOutput.split('\n').filter(Boolean);
    const changedApps = new Set();

    changedFiles.forEach(file => {
      // apps/profile/src/...  → profile
      const appMatch = file.match(/^apps\/([^/]+)\//);
      if (appMatch) {
        changedApps.add(appMatch[1]);
      }
    });

    return Array.from(changedApps);
  } catch (error) {
    // 如果不是 git repo 或沒有 staged changes
    return [];
  }
}

/**
 * 檢查 PRD 是否在 24 小時內更新過
 */
function checkPRDFreshness(appId) {
  const prdPath = path.join(specsRoot, 'apps', appId, 'zh-TW.md');

  if (!fs.existsSync(prdPath)) {
    return true; // PRD 不存在，不強制要求
  }

  try {
    const { data } = matter.read(prdPath);
    const lastUpdated = new Date(data.lastUpdated);
    const now = new Date();
    const hoursDiff = (now - lastUpdated) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  } catch (error) {
    console.error(`Error reading ${prdPath}:`, error.message);
    return true;
  }
}

/**
 * 主程式
 */
function main() {
  const changedApps = detectChangedApps();

  if (changedApps.length === 0) {
    console.log('✅ 沒有檢測到專案變更');
    process.exit(0);
  }

  console.log(`🔍 檢測到 ${changedApps.length} 個專案有變更：`);
  changedApps.forEach(app => console.log(`   - ${app}`));
  console.log('');

  const stalePRDs = changedApps.filter(app => !checkPRDFreshness(app));

  if (stalePRDs.length === 0) {
    console.log('✅ 所有相關 PRD 都是最新的');
    process.exit(0);
  }

  console.log('⚠️  以下專案的 PRD 需要檢查是否更新：');
  stalePRDs.forEach(app => {
    console.log(`   - ${app}`);
    console.log(`     PRD: specs/apps/${app}/zh-TW.md`);
  });
  console.log('');
  console.log('💡 如果此 commit 不涉及功能變更，可以繼續');
  console.log('💡 如果新增功能，建議先更新 PRD');

  // 不強制退出，只是提醒
  process.exit(0);
}

main();

