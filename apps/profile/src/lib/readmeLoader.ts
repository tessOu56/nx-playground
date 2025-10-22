/**
 * README 載入器
 * 從各專案的 README.md 和 README.zh-TW.md 讀取技術文檔
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import type { ProjectReadme } from '../types/projectData';

import type { SupportedLocale } from './i18n/LocaleRouter';
import { APP_IDS, LIB_IDS } from './projectList';

/**
 * Fetch README 檔案
 * 由於 Vite glob 無法跨越專案 root，改用 fetch API
 */
async function fetchReadme(
  type: 'apps' | 'libs',
  id: string,
  locale: SupportedLocale
): Promise<string | null> {
  // Always use English version (only en maintained)
  const url = `/${type}/${id}/README.md`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`README not found for ${type}/${id}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching README for ${type}/${id}:`, error);
    return null;
  }
}

/**
 * 解析 README 檔案
 */
async function parseReadme(
  filePath: string,
  content: string
): Promise<ProjectReadme | null> {
  try {
    const { data, content: markdownContent } = matter(content);

    if (!data.id) {
      console.warn(`[README Loader] No ID in front matter for ${filePath}`);
      return null;
    }

    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = processedContent.toString();

    const result = {
      id: data.id,
      name: data.name ?? data.id,
      version: data.version ?? '0.0.0',
      description: data.description ?? '',
      techStack: data.techStack ?? [],
      features: data.features ?? [],
      readmeContent: htmlContent,
      demoUrl: data.demoUrl,
      repoUrl: data.repoUrl,
      lastUpdated: data.lastUpdated,
      author: data.author,
      license: data.license,
    };

    return result;
  } catch (error) {
    console.error(`Error parsing README ${filePath}:`, error);
    return null;
  }
}

/**
 * 載入單一 App 的 README
 */
export async function loadAppReadme(
  appId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme | null> {
  const content = await fetchReadme('apps', appId, locale);
  if (!content) return null;

  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';
  return parseReadme(`/apps/${appId}/${fileName}`, content);
}

/**
 * 載入單一 Lib 的 README
 */
export async function loadLibReadme(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme | null> {
  const content = await fetchReadme('libs', libId, locale);
  if (!content) return null;

  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';
  return parseReadme(`/libs/${libId}/${fileName}`, content);
}

/**
 * 載入所有 Apps 的 README
 */
export async function loadAllAppsReadmes(
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme[]> {

  const readmes: ProjectReadme[] = [];

  for (const appId of APP_IDS) {
    try {
      const readme = await loadAppReadme(appId, locale);
      if (readme?.id) {
        readmes.push(readme);
      }
    } catch (error) {
      console.error(`Error loading app ${appId}:`, error);
    }
  }

  return readmes.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 載入所有 Libs 的 README
 */
export async function loadAllLibsReadmes(
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme[]> {

  const readmes: ProjectReadme[] = [];

  for (const libId of LIB_IDS) {
    try {
      const readme = await loadLibReadme(libId, locale);
      if (readme?.id) {
        readmes.push(readme);
      }
    } catch (error) {
      console.error(`Error loading lib ${libId}:`, error);
    }
  }

  return readmes.sort((a, b) => a.name.localeCompare(b.name));
}
