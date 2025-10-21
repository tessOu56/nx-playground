#!/usr/bin/env node
/**
 * 版本一致性檢查腳本
 * 檢查 package.json、README 和 PRD 的版本是否一致
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const rootDir = path.join(__dirname, '../..');

/**
 * 讀取 package.json 版本
 */
function getPackageVersion(type, projectId) {
  const packagePath = path.join(rootDir, type, projectId, 'package.json');
  if (!fs.existsSync(packagePath)) {
    return null;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    return pkg.version;
  } catch (error) {
    return null;
  }
}

/**
 * 讀取 README 版本
 */
function getReadmeVersion(type, projectId) {
  const readmePath = path.join(rootDir, type, projectId, 'README.zh-TW.md');
  if (!fs.existsSync(readmePath)) {
    return null;
  }

  try {
    const { data } = matter.read(readmePath);
    return data.version;
  } catch (error) {
    return null;
  }
}

/**
 * 讀取 PRD 版本
 */
function getPRDVersion(type, projectId) {
  const prdPath = path.join(rootDir, 'specs', type, projectId, 'zh-TW.md');
  if (!fs.existsSync(prdPath)) {
    return null;
  }

  try {
    const { data } = matter.read(prdPath);
    return data.version;
  } catch (error) {
    return null;
  }
}

/**
 * 檢查專案版本一致性
 */
function checkProjectVersion(type, projectId) {
  const pkgVersion = getPackageVersion(type, projectId);
  const readmeVersion = getReadmeVersion(type, projectId);
  const prdVersion = getPRDVersion(type, projectId);

  console.log(`\n📦 ${type}/${projectId}:`);
  console.log(`   package.json: ${pkgVersion || '無'}`);
  console.log(`   README:       ${readmeVersion || '無'}`);
  console.log(`   PRD:          ${prdVersion || '無'}`);

  const versions = [pkgVersion, readmeVersion, prdVersion].filter(Boolean);
  const allSame = versions.every(v => v === versions[0]);

  if (allSame && versions.length > 0) {
    console.log(`   ✅ 版本一致: v${versions[0]}`);
    return true;
  } else {
    console.log(`   ❌ 版本不一致！`);
    return false;
  }
}

/**
 * 掃描專案
 */
function scanProjects(type) {
  const typeDir = path.join(rootDir, type);
  if (!fs.existsSync(typeDir)) return [];

  return fs.readdirSync(typeDir).filter(name => {
    const projectPath = path.join(typeDir, name);
    return fs.statSync(projectPath).isDirectory() && name !== 'node_modules';
  });
}

/**
 * 主程式
 */
function main() {
  console.log('🔍 檢查版本一致性...');

  let allConsistent = true;

  // 檢查 Apps
  console.log('\n📱 Apps:');
  const apps = scanProjects('apps');
  apps.forEach(appId => {
    const consistent = checkProjectVersion('apps', appId);
    if (!consistent) allConsistent = false;
  });

  // 檢查 Libs
  console.log('\n\n📚 Libs:');
  const libs = scanProjects('libs');
  libs.forEach(libId => {
    const consistent = checkProjectVersion('libs', libId);
    if (!consistent) allConsistent = false;
  });

  console.log('\n');

  if (allConsistent) {
    console.log('✅ 所有專案版本一致！');
    process.exit(0);
  } else {
    console.log('❌ 部分專案版本不一致，請更新');
    process.exit(1);
  }
}

main();

