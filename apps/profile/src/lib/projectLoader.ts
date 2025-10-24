/**
 * 專案載入器
 * Spec 為單一資料來源（不再載入 README）
 */

import type { AppData, LibData } from '../types/projectData';

import { loadProjectChangelog } from './changelogLoader';
import type { SupportedLocale } from './i18n/LocaleRouter';
import {
  loadAppSpec,
  loadLibSpec,
  loadAllAppsSpecs,
  loadAllLibsSpecs,
} from './specLoader';

/**
 * 載入單一 App 的完整資料
 * Spec 為單一資料來源
 */
export async function loadApp(
  appId: string,
  locale: SupportedLocale = 'en'
): Promise<AppData | null> {
  try {
    const [spec, changelog] = await Promise.all([
      loadAppSpec(appId, locale),
      loadProjectChangelog('app', appId),
    ]);

    if (!spec) {
      console.warn(`No spec found for app: ${appId}`);
      return null;
    }

    return {
      ...spec,
      locale,
      changelog: changelog.releases.length > 0 ? changelog : undefined,
    } as AppData;
  } catch (error) {
    console.error(`Error loading app ${appId}:`, error);
    return null;
  }
}

/**
 * 載入單一 Lib 的完整資料
 * Spec 為單一資料來源
 */
export async function loadLib(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<LibData | null> {
  try {
    const [spec, changelog] = await Promise.all([
      loadLibSpec(libId, locale),
      loadProjectChangelog('lib', libId),
    ]);

    if (!spec) {
      console.warn(`No spec found for lib: ${libId}`);
      return null;
    }

    return {
      ...spec,
      locale,
      changelog: changelog.releases.length > 0 ? changelog : undefined,
    } as LibData;
  } catch (error) {
    console.error(`Error loading lib ${libId}:`, error);
    return null;
  }
}

/**
 * 載入所有 Apps
 * 僅從 Spec 載入
 */
export async function loadAllApps(
  locale: SupportedLocale = 'en'
): Promise<AppData[]> {
  try {
    const specs = await loadAllAppsSpecs(locale);

    const apps: AppData[] = [];

    for (const spec of specs) {
      // 只顯示已發布的專案
      if (spec.published === false) continue;

      // 載入 CHANGELOG（可選）
      try {
        const changelog = await loadProjectChangelog('app', spec.id);
        if (changelog.releases.length > 0) {
          apps.push({
            ...spec,
            locale,
            changelog,
          } as AppData);
        } else {
          apps.push({
            ...spec,
            locale,
          } as AppData);
        }
      } catch (_error) {
        apps.push({
          ...spec,
          locale,
        } as AppData);
      }
    }

    return apps.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading all apps:', error);
    return [];
  }
}

/**
 * 載入所有 Libs
 * 僅從 Spec 載入
 */
export async function loadAllLibs(
  locale: SupportedLocale = 'en'
): Promise<LibData[]> {
  try {
    const specs = await loadAllLibsSpecs(locale);

    const libs: LibData[] = [];

    for (const spec of specs) {
      // 只顯示已發布的專案
      if (spec.published === false) continue;

      // 載入 CHANGELOG（可選）
      try {
        const changelog = await loadProjectChangelog('lib', spec.id);
        if (changelog.releases.length > 0) {
          libs.push({
            ...spec,
            locale,
            changelog,
          } as LibData);
        } else {
          libs.push({
            ...spec,
            locale,
          } as LibData);
        }
      } catch (_error) {
        libs.push({
          ...spec,
          locale,
        } as LibData);
      }
    }

    return libs.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading all libs:', error);
    return [];
  }
}
