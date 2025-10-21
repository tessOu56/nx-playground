/**
 * 專案載入器
 * 合併 README、Spec 和 CHANGELOG 的資料
 */

import type { AppData, LibData, ProjectData } from '../types/projectData';

import { loadProjectChangelog } from './changelogLoader';
import type { SupportedLocale } from './i18n/LocaleRouter';
import {
  loadAppReadme,
  loadLibReadme,
  loadAllAppsReadmes,
  loadAllLibsReadmes,
} from './readmeLoader';
import {
  loadAppSpec,
  loadLibSpec,
  loadAllAppsSpecs,
  loadAllLibsSpecs,
} from './specLoader';

/**
 * 合併 README 和 Spec 資料
 */
function mergeProjectData(
  readme: any,
  spec: any,
  locale: SupportedLocale
): ProjectData {
  return {
    // README 欄位
    id: readme?.id ?? spec?.id ?? '',
    name: readme?.name ?? spec?.id ?? '',
    version: readme?.version ?? spec?.version ?? '0.0.0',
    description: readme?.description ?? '',
    techStack: readme?.techStack ?? [],
    features: readme?.features ?? [],
    readmeContent: readme?.readmeContent ?? '',
    demoUrl: readme?.demoUrl,
    repoUrl: readme?.repoUrl,
    lastUpdated: readme?.lastUpdated ?? spec?.specLastUpdated,
    author: readme?.author,
    license: readme?.license,

    // Spec 欄位
    category: spec?.category ?? 'react',
    status: spec?.status ?? 'development',
    published: spec?.published !== false,
    shortDesc: spec?.shortDesc ?? readme?.description ?? '',
    purpose: spec?.purpose ?? '',
    highlights: spec?.highlights ?? [],
    useCases: spec?.useCases,
    targetAudience: spec?.targetAudience,
    specLastUpdated: spec?.specLastUpdated ?? '',
    reviewer: spec?.reviewer,
    reviewedAt: spec?.reviewedAt,
    updateFrequency: spec?.updateFrequency,
    nextReview: spec?.nextReview,
    draftStatus: spec?.draftStatus,
    approvalStatus: spec?.approvalStatus,
    changesSince: spec?.changesSince,
    relatedDocs: spec?.relatedDocs,
    stats: spec?.stats,
    specContent: spec?.specContent,
    lastSync: spec?.lastSync,

    // 其他
    locale,
  };
}

/**
 * 載入單一 App 的完整資料
 */
export async function loadApp(
  appId: string,
  locale: SupportedLocale = 'en'
): Promise<AppData | null> {
  try {
    const [readme, spec, changelog] = await Promise.all([
      loadAppReadme(appId, locale),
      loadAppSpec(appId, locale),
      loadProjectChangelog('app', appId),
    ]);

    if (!readme && !spec) {
      console.warn(`No data found for app: ${appId}`);
      return null;
    }

    const projectData = mergeProjectData(readme, spec, locale);

    return {
      ...projectData,
      changelog: changelog.releases.length > 0 ? changelog : undefined,
    } as AppData;
  } catch (error) {
    console.error(`Error loading app ${appId}:`, error);
    return null;
  }
}

/**
 * 載入單一 Lib 的完整資料
 */
export async function loadLib(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<LibData | null> {
  try {
    const [readme, spec, changelog] = await Promise.all([
      loadLibReadme(libId, locale),
      loadLibSpec(libId, locale),
      loadProjectChangelog('lib', libId),
    ]);

    if (!readme && !spec) {
      console.warn(`No data found for lib: ${libId}`);
      return null;
    }

    const projectData = mergeProjectData(readme, spec, locale);

    return {
      ...projectData,
      changelog: changelog.releases.length > 0 ? changelog : undefined,
    } as LibData;
  } catch (error) {
    console.error(`Error loading lib ${libId}:`, error);
    return null;
  }
}

/**
 * 載入所有 Apps
 */
export async function loadAllApps(
  locale: SupportedLocale = 'en'
): Promise<AppData[]> {
  try {
    const [readmes, specs] = await Promise.all([
      loadAllAppsReadmes(locale),
      loadAllAppsSpecs(locale),
    ]);

    // 建立 ID 映射
    const readmeMap = new Map(readmes.map(r => [r.id, r]));
    const specMap = new Map(specs.map(s => [s.id, s]));

    // 合併所有專案
    const allIds = new Set([...readmeMap.keys(), ...specMap.keys()]);
    const apps: AppData[] = [];

    for (const id of allIds) {
      const readme = readmeMap.get(id);
      const spec = specMap.get(id);

      // 只顯示已發布的專案
      if (spec && !spec.published) continue;

      const projectData = mergeProjectData(readme, spec, locale);

      // 載入 CHANGELOG（可選）
      try {
        const changelog = await loadProjectChangelog('app', id);
        if (changelog.releases.length > 0) {
          (projectData as any).changelog = changelog;
        }
      } catch (_error) {
        console.warn(`No changelog for ${id}`);
      }

      apps.push(projectData as AppData);
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading all apps:', error);
    return [];
  }
}

/**
 * 載入所有 Libs
 */
export async function loadAllLibs(
  locale: SupportedLocale = 'en'
): Promise<LibData[]> {
  try {
    const [readmes, specs] = await Promise.all([
      loadAllLibsReadmes(locale),
      loadAllLibsSpecs(locale),
    ]);

    // 建立 ID 映射
    const readmeMap = new Map(readmes.map(r => [r.id, r]));
    const specMap = new Map(specs.map(s => [s.id, s]));

    // 合併所有專案
    const allIds = new Set([...readmeMap.keys(), ...specMap.keys()]);
    const libs: LibData[] = [];

    for (const id of allIds) {
      const readme = readmeMap.get(id);
      const spec = specMap.get(id);

      // 只顯示已發布的專案
      if (spec && !spec.published) continue;

      const projectData = mergeProjectData(readme, spec, locale);

      // 載入 CHANGELOG（可選）
      try {
        const changelog = await loadProjectChangelog('lib', id);
        if (changelog.releases.length > 0) {
          (projectData as any).changelog = changelog;
        }
      } catch (_error) {
        console.warn(`No changelog for ${id}`);
      }

      libs.push(projectData as LibData);
    }

    return libs.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading all libs:', error);
    return [];
  }
}
