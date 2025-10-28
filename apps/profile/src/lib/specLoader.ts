/**
 * Spec (PRD) 載入器
 * 從 specs/ 目錄讀取產品規格文件
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import type { ProjectSpec } from '../types/projectData';

import type { SupportedLocale } from './i18n/LocaleRouter';
import { APP_IDS, LIB_IDS, idToDir } from './projectList';

/**
 * Fetch Spec 檔案
 * 由於 Vite glob 無法跨越專案 root，改用 fetch API
 */
async function fetchSpec(
  type: 'apps' | 'libs',
  id: string,
  locale: SupportedLocale
): Promise<string | null> {
  // 將顯示用 id 轉換為實體目錄名稱
  const dirName = idToDir(id);

  // Try locale-specific version first, fallback to English
  const url = `/specs/${type}/${dirName}/${locale}.md`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // If zh-TW not found, fallback to English
      if (locale === 'zh-TW') {
        logger.warn(`Spec not found for locale, falling back to en`, {
          type,
          id: dirName,
          locale,
        });
        const fallbackUrl = `/specs/${type}/${dirName}/en.md`;
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) {
          return null;
        }
        return await fallbackResponse.text();
      }
      return null;
    }
    return await response.text();
  } catch (error) {
    logger.error(`Failed to fetch spec`, error, { type, id: dirName, locale });
    return null;
  }
}

/**
 * 解析 Spec 檔案
 */
async function parseSpec(
  filePath: string,
  content: string,
  displayId?: string
): Promise<ProjectSpec | null> {
  try {
    const { data, content: markdownContent } = matter(content);

    // 轉換 Markdown 為 HTML（可選）
    let htmlContent: string | undefined;
    if (markdownContent.trim()) {
      const processedContent = await remark()
        .use(html)
        .process(markdownContent);
      htmlContent = processedContent.toString();
    }

    return {
      // Basic Info (使用顯示 id 如果有提供)
      id: displayId ?? data.id ?? '',
      name: data.name ?? data.id ?? '',
      version: data.version ?? '0.0.0',
      description: data.description ?? data.shortDesc ?? '',
      techStack: data.techStack ?? [],
      features: data.features ?? [],

      // Spec Fields
      category: data.category ?? '',
      status: data.status ?? 'development',
      published: data.published !== false,
      shortDesc: data.shortDesc ?? '',
      purpose: data.purpose ?? '',
      highlights: data.highlights ?? [],
      useCases: data.useCases,
      targetAudience: data.targetAudience,
      specLastUpdated:
        data.lastUpdated ?? new Date().toISOString().split('T')[0],
      lastSync: data.lastSync,
      reviewer: data.reviewer,
      reviewedAt: data.reviewedAt,
      updateFrequency: data.updateFrequency,
      nextReview: data.nextReview,
      draftStatus: data.draftStatus,
      approvalStatus: data.approvalStatus,
      changesSince: data.changesSince,
      relatedDocs: data.relatedDocs,
      stats: data.stats,
      specContent: htmlContent,

      // URLs (optional)
      demoUrl: data.demoUrl,
      repoUrl: data.repoUrl,
      lastUpdated: data.lastUpdated,
    };
  } catch (_error) {
    // Silent fail for missing specs
    return null;
  }
}

/**
 * 載入單一 App 的 Spec
 */
export async function loadAppSpec(
  appId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec | null> {
  const content = await fetchSpec('apps', appId, locale);
  if (!content) return null;

  const dirName = idToDir(appId);
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  // 傳入 appId 作為顯示 id
  return parseSpec(`/specs/apps/${dirName}/${fileName}`, content, appId);
}

/**
 * 載入單一 Lib 的 Spec
 */
export async function loadLibSpec(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec | null> {
  const content = await fetchSpec('libs', libId, locale);
  if (!content) return null;

  const dirName = idToDir(libId);
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  // 傳入 libId 作為顯示 id
  return parseSpec(`/specs/libs/${dirName}/${fileName}`, content, libId);
}

/**
 * 載入所有 Apps 的 Spec
 */
export async function loadAllAppsSpecs(
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec[]> {
  const specs: ProjectSpec[] = [];

  for (const appId of APP_IDS) {
    try {
      const spec = await loadAppSpec(appId, locale);
      if (spec?.id && spec.published) {
        specs.push(spec);
      }
    } catch (error) {
      logger.warn(`Failed to load app spec`, {
        appId,
        locale,
        error: (error as Error).message,
      });
    }
  }

  return specs.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * 載入所有 Libs 的 Spec
 */
export async function loadAllLibsSpecs(
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec[]> {
  const specs: ProjectSpec[] = [];

  for (const libId of LIB_IDS) {
    try {
      const spec = await loadLibSpec(libId, locale);
      if (spec?.id && spec.published) {
        specs.push(spec);
      }
    } catch (error) {
      logger.warn(`Failed to load lib spec`, {
        libId,
        locale,
        error: (error as Error).message,
      });
    }
  }

  return specs.sort((a, b) => a.id.localeCompare(b.id));
}
