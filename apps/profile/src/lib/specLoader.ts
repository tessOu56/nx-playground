/**
 * Spec (PRD) 載入器
 * 從 specs/ 目錄讀取產品規格文件
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import type { ProjectSpec } from '../types/projectData';

import type { SupportedLocale } from './i18n/LocaleRouter';
import { APP_IDS, LIB_IDS } from './projectList';

/**
 * Fetch Spec 檔案
 * 由於 Vite glob 無法跨越專案 root，改用 fetch API
 */
async function fetchSpec(
  type: 'apps' | 'libs',
  id: string,
  locale: SupportedLocale
): Promise<string | null> {
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  const url = `/specs/${type}/${id}/${fileName}`;

  console.log(`[Spec Loader] Fetching: ${url}`);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const fallbackFile = locale === 'zh-TW' ? 'en.md' : 'zh-TW.md';
      const fallbackUrl = `/specs/${type}/${id}/${fallbackFile}`;
      console.log(`[Spec Loader] Trying fallback: ${fallbackUrl}`);

      const fallbackResponse = await fetch(fallbackUrl);
      if (!fallbackResponse.ok) {
        return null;
      }
      return await fallbackResponse.text();
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching spec for ${type}/${id}:`, error);
    return null;
  }
}

/**
 * 解析 Spec 檔案
 */
async function parseSpec(
  filePath: string,
  content: string
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
      id: data.id ?? '',
      version: data.version ?? '0.0.0',
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

  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  return parseSpec(`/specs/apps/${appId}/${fileName}`, content);
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

  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  return parseSpec(`/specs/libs/${libId}/${fileName}`, content);
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
      console.warn(`Error loading spec for app ${appId}:`, error);
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
      console.warn(`Error loading spec for lib ${libId}:`, error);
    }
  }

  return specs.sort((a, b) => a.id.localeCompare(b.id));
}
