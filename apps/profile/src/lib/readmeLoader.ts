/**
 * README 載入器
 * 從各專案的 README.md 和 README.zh-TW.md 讀取技術文檔
 */

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

import type { ProjectReadme } from '../types/projectData';

import type { SupportedLocale } from './i18n/LocaleRouter';

/**
 * 動態載入所有 README 檔案
 */
const appsReadmeModules = import.meta.glob<string>(
  ['/apps/*/README.md', '/apps/*/README.zh-TW.md'],
  { query: '?raw', import: 'default' }
);

const libsReadmeModules = import.meta.glob<string>(
  ['/libs/*/README.md', '/libs/*/README.zh-TW.md'],
  { query: '?raw', import: 'default' }
);

/**
 * 解析 README 檔案
 */
async function parseReadme(
  filePath: string,
  content: string
): Promise<ProjectReadme | null> {
  try {
    const { data, content: markdownContent } = matter(content);

    // 轉換 Markdown 為 HTML
    const processedContent = await remark().use(html).process(markdownContent);
    const htmlContent = processedContent.toString();

    return {
      id: data.id ?? '',
      name: data.name ?? '',
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
  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';
  const filePath = `/apps/${appId}/${fileName}`;

  const loader = appsReadmeModules[filePath];
  if (!loader) {
    // Fallback 到另一個語言
    const fallbackFile = locale === 'zh-TW' ? 'README.md' : 'README.zh-TW.md';
    const fallbackPath = `/apps/${appId}/${fallbackFile}`;
    const fallbackLoader = appsReadmeModules[fallbackPath];

    if (!fallbackLoader) {
      console.warn(`README not found for app: ${appId}`);
      return null;
    }

    const content = await fallbackLoader();
    return parseReadme(fallbackPath, content);
  }

  const content = await loader();
  return parseReadme(filePath, content);
}

/**
 * 載入單一 Lib 的 README
 */
export async function loadLibReadme(
  libId: string,
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme | null> {
  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';
  const filePath = `/libs/${libId}/${fileName}`;

  const loader = libsReadmeModules[filePath];
  if (!loader) {
    // Fallback
    const fallbackFile = locale === 'zh-TW' ? 'README.md' : 'README.zh-TW.md';
    const fallbackPath = `/libs/${libId}/${fallbackFile}`;
    const fallbackLoader = libsReadmeModules[fallbackPath];

    if (!fallbackLoader) {
      console.warn(`README not found for lib: ${libId}`);
      return null;
    }

    const content = await fallbackLoader();
    return parseReadme(fallbackPath, content);
  }

  const content = await loader();
  return parseReadme(filePath, content);
}

/**
 * 載入所有 Apps 的 README
 */
export async function loadAllAppsReadmes(
  locale: SupportedLocale = 'en'
): Promise<ProjectReadme[]> {
  const readmes: ProjectReadme[] = [];
  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';

  for (const [path, loader] of Object.entries(appsReadmeModules)) {
    if (!path.endsWith(fileName)) continue;

    try {
      const content = await loader();
      const readme = await parseReadme(path, content);
      if (readme?.id) {
        readmes.push(readme);
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
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
  const fileName = locale === 'zh-TW' ? 'README.zh-TW.md' : 'README.md';

  for (const [path, loader] of Object.entries(libsReadmeModules)) {
    if (!path.endsWith(fileName)) continue;

    try {
      const content = await loader();
      const readme = await parseReadme(path, content);
      if (readme?.id) {
        readmes.push(readme);
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  return readmes.sort((a, b) => a.name.localeCompare(b.name));
}
