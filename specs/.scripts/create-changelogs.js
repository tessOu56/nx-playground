#!/usr/bin/env node
/**
 * 為專案建立 CHANGELOG.md 模板
 * 遵循 Keep a Changelog 標準
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../..');

/**
 * CHANGELOG 模板
 */
function getChangelogTemplate(projectName, version) {
  return `# Changelog

All notable changes to ${projectName} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 待新增的功能...

## [${version}] - ${new Date().toISOString().split('T')[0]}

### Added
- 初始版本發布

### Changed
- N/A

### Fixed
- N/A

### Breaking Changes
- N/A

---

## Version History

- **[${version}]** - ${new Date().toISOString().split('T')[0]} - 初始版本
`;
}

/**
 * 讀取 package.json 獲取版本號
 */
function getProjectVersion(type, projectId) {
  const pkgPath = path.join(rootDir, type, projectId, 'package.json');
  if (!fs.existsSync(pkgPath)) {
    return '1.0.0';
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    return pkg.version || '1.0.0';
  } catch (error) {
    return '1.0.0';
  }
}

/**
 * 建立單一專案的 CHANGELOG
 */
function createChangelog(type, projectId) {
  const changelogPath = path.join(rootDir, type, projectId, 'CHANGELOG.md');

  // 如果已存在，跳過
  if (fs.existsSync(changelogPath)) {
    console.log(`✓  ${type}/${projectId} - CHANGELOG 已存在`);
    return;
  }

  const version = getProjectVersion(type, projectId);
  const projectName = projectId;
  const content = getChangelogTemplate(projectName, version);

  fs.writeFileSync(changelogPath, content);
  console.log(`✅ 建立: ${type}/${projectId}/CHANGELOG.md (v${version})`);
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
  console.log('📝 建立 CHANGELOG 模板...\n');

  // Apps
  console.log('📱 Apps:');
  const apps = scanProjects('apps');
  apps.forEach(appId => createChangelog('apps', appId));

  console.log('');

  // Libs
  console.log('📚 Libs:');
  const libs = scanProjects('libs');
  libs.forEach(libId => createChangelog('libs', libId));

  console.log('');
  console.log('✅ 完成！');
  console.log('');
  console.log('📝 下一步:');
  console.log('   1. 檢查生成的 CHANGELOG.md');
  console.log('   2. 根據實際開發歷史更新版本記錄');
  console.log('   3. Commit CHANGELOG 檔案');
}

main();

