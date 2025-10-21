/**
 * CHANGELOG 載入器
 * 從各專案的 CHANGELOG.md 讀取版本歷史
 */

import type { ProjectChangelog, Release } from '../types/projectData';

/**
 * 動態載入所有 CHANGELOG 檔案
 */
const changelogModules = import.meta.glob<string>(
  ['/apps/*/CHANGELOG.md', '/libs/*/CHANGELOG.md'],
  { query: '?raw', import: 'default' }
);

/**
 * 判斷版本類型
 */
function getVersionType(version: string): 'major' | 'minor' | 'patch' {
  const parts = version.split('.');
  const major = parseInt(parts[0] || '0');
  const minor = parseInt(parts[1] || '0');
  const patch = parseInt(parts[2] || '0');

  if (major > 0 && minor === 0 && patch === 0) return 'major';
  if (minor > 0 && patch === 0) return 'minor';
  return 'patch';
}

/**
 * 解析 CHANGELOG 內容
 */
function parseChangelog(content: string, appId: string): ProjectChangelog {
  const lines = content.split('\n');
  const releases: Release[] = [];
  let currentRelease: Release | null = null;
  let currentSection: keyof Release['changes'] | null = null;

  lines.forEach(line => {
    // 匹配版本號: ## [1.2.0] - 2025-10-21
    const versionMatch = line.match(/^##\s+\[([^\]]+)\]\s*-?\s*(.+)?/);
    if (versionMatch) {
      if (currentRelease) {
        releases.push(currentRelease);
      }

      const version = versionMatch[1];
      const date = versionMatch[2] || '';

      currentRelease = {
        version,
        date: date.trim(),
        type: getVersionType(version),
        changes: {},
        isUnreleased: version.toLowerCase() === 'unreleased',
      };
      currentSection = null;
      return;
    }

    // 匹配章節: ### Added
    const sectionMatch = line.match(/^###\s+(.+)/);
    if (sectionMatch && currentRelease) {
      const section = sectionMatch[1].toLowerCase().replace(/\s+/g, '');

      if (section === 'breakingchanges' || section === 'breaking') {
        currentSection = 'breaking';
      } else if (
        [
          'added',
          'changed',
          'fixed',
          'removed',
          'deprecated',
          'security',
        ].includes(section)
      ) {
        currentSection = section as keyof Release['changes'];
      }
      return;
    }

    // 匹配項目: - 新功能
    const itemMatch = line.match(/^-\s+(.+)/);
    if (itemMatch && currentRelease && currentSection) {
      if (!currentRelease.changes[currentSection]) {
        currentRelease.changes[currentSection] = [];
      }
      currentRelease.changes[currentSection]!.push(itemMatch[1].trim());
    }
  });

  // 加入最後一個 release
  if (currentRelease) {
    releases.push(currentRelease);
  }

  // 過濾 Unreleased
  const publishedReleases = releases.filter(r => !r.isUnreleased);

  return {
    appId,
    releases: publishedReleases,
    latest: publishedReleases[0] || null,
    major: publishedReleases.filter(r => r.type === 'major'),
  };
}

/**
 * 載入單一專案的 CHANGELOG
 */
export async function loadProjectChangelog(
  type: 'app' | 'lib',
  id: string
): Promise<ProjectChangelog> {
  const basePath = type === 'app' ? '/apps' : '/libs';
  const filePath = `${basePath}/${id}/CHANGELOG.md`;

  const loader = changelogModules[filePath];
  if (!loader) {
    return {
      appId: id,
      releases: [],
      latest: null,
      major: [],
    };
  }

  try {
    const content = await loader();
    return parseChangelog(content, id);
  } catch (error) {
    console.error(`Error loading changelog for ${id}:`, error);
    return {
      appId: id,
      releases: [],
      latest: null,
      major: [],
    };
  }
}

/**
 * 載入所有專案的 CHANGELOG
 */
export async function loadAllChangelogs(): Promise<ProjectChangelog[]> {
  const changelogs: ProjectChangelog[] = [];

  for (const [path, loader] of Object.entries(changelogModules)) {
    try {
      // 提取專案 ID: /apps/profile/CHANGELOG.md → profile
      const pathMatch = path.match(/\/(apps|libs)\/([^/]+)\/CHANGELOG\.md$/);
      if (!pathMatch) continue;

      const [, , id] = pathMatch;
      const content = await loader();
      const changelog = parseChangelog(content, id);

      if (changelog.releases.length > 0) {
        changelogs.push(changelog);
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  // 按最新版本日期排序
  return changelogs.sort((a, b) => {
    const aDate = a.latest?.date || '';
    const bDate = b.latest?.date || '';
    return bDate.localeCompare(aDate);
  });
}
