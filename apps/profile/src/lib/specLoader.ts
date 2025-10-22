/**
 * Spec (PRD) 載入器
 * 從 specs/ 目錄讀取產品規格文件
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import type { ProjectSpec } from '../types/projectData';

import type { SupportedLocale } from './i18n/LocaleRouter';

/**
 * 動態載入所有 Spec 檔案
 * Vite glob 從 project root 開始，所以 ../../ 會到 workspace root
 */
const specsModules = import.meta.glob('../../specs/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

console.log('[Spec Loader] Found specs:', Object.keys(specsModules).length);
console.log('[Spec Loader] Spec paths:', Object.keys(specsModules));

/**
 * 解析 Spec 檔案
 */
async function parseSpec(filePath: string, content: string): Promise<ProjectSpec | null> {
  try {
    const { data, content: markdownContent } = matter(content);

    // 轉換 Markdown 為 HTML（可選）
    let htmlContent: string | undefined;
    if (markdownContent.trim()) {
      const processedContent = await remark().use(html).process(markdownContent);
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
      specLastUpdated: data.lastUpdated ?? new Date().toISOString().split('T')[0],
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
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  const filePath = `../../specs/apps/${appId}/${fileName}`;

  console.log(`[Spec Loader] Loading app spec: ${filePath}`);

  const loader = specsModules[filePath];
  if (!loader) {
    const fallbackFile = locale === 'zh-TW' ? 'en.md' : 'zh-TW.md';
    const fallbackPath = `../../specs/apps/${appId}/${fallbackFile}`;
    const fallbackLoader = specsModules[fallbackPath];

    if (!fallbackLoader) {
      console.log(`Spec not found for app: ${appId}, tried: ${filePath}, ${fallbackPath}`);
      return null;
    }

    const content = await fallbackLoader();
    return parseSpec(fallbackPath, content);
  }

  const content = await loader();
  return parseSpec(filePath, content);
}

/**
 * 載入單一 Lib 的 Spec
 */
export async function loadLibSpec(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec | null> {
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';
  const filePath = `../../specs/libs/${libId}/${fileName}`;

  console.log(`[Spec Loader] Loading lib spec: ${filePath}`);

  const loader = specsModules[filePath];
  if (!loader) {
    const fallbackFile = locale === 'zh-TW' ? 'en.md' : 'zh-TW.md';
    const fallbackPath = `../../specs/libs/${libId}/${fallbackFile}`;
    const fallbackLoader = specsModules[fallbackPath];

    if (!fallbackLoader) {
      console.log(`Spec not found for lib: ${libId}, tried: ${filePath}, ${fallbackPath}`);
      return null;
    }

    const content = await fallbackLoader();
    return parseSpec(fallbackPath, content);
  }

  const content = await loader();
  return parseSpec(filePath, content);
}

/**
 * 載入所有 Apps 的 Spec
 */
export async function loadAllAppsSpecs(
  locale: SupportedLocale = 'en'
): Promise<ProjectSpec[]> {
  const specs: ProjectSpec[] = [];
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';

  for (const [path, loader] of Object.entries(specsModules)) {
    // 只載入 apps/ 下的檔案
    if (!path.includes('/specs/apps/')) continue;
    if (!path.endsWith(fileName)) continue;

    try {
      const content = await loader();
      const spec = await parseSpec(path, content);
      if (spec?.id && spec.published) {
        specs.push(spec);
      }
    } catch (_error) {
      // Silent fail
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
  const fileName = locale === 'zh-TW' ? 'zh-TW.md' : 'en.md';

  for (const [path, loader] of Object.entries(specsModules)) {
    // 只載入 libs/ 下的檔案
    if (!path.includes('/specs/libs/')) continue;
    if (!path.endsWith(fileName)) continue;

    try {
      const content = await loader();
      const spec = await parseSpec(path, content);
      if (spec?.id && spec.published) {
        specs.push(spec);
      }
    } catch (_error) {
      // Silent fail
    }
  }

  return specs.sort((a, b) => a.id.localeCompare(b.id));
}

