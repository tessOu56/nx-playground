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
  '/apps/*/README.md',
  { query: '?raw', import: 'default', eager: false }
);

const appsReadmeModulesZh = import.meta.glob<string>(
  '/apps/*/README.zh-TW.md',
  { query: '?raw', import: 'default', eager: false }
);

const libsReadmeModules = import.meta.glob<string>(
  '/libs/*/README.md',
  { query: '?raw', import: 'default', eager: false }
);

const libsReadmeModulesZh = import.meta.glob<string>(
  '/libs/*/README.zh-TW.md',
  { query: '?raw', import: 'default', eager: false }
);

const allAppsReadmes = { ...appsReadmeModules, ...appsReadmeModulesZh };
const allLibsReadmes = { ...libsReadmeModules, ...libsReadmeModulesZh };

console.log(
  '[README Loader] Found apps readmes:',
  Object.keys(allAppsReadmes).length
);
console.log('[README Loader] Apps paths:', Object.keys(allAppsReadmes));
console.log(
  '[README Loader] Found libs readmes:',
  Object.keys(allLibsReadmes).length
);
console.log('[README Loader] Libs paths:', Object.keys(allLibsReadmes));

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

  console.log(`[README Loader] Loading app README: ${filePath}`);

  const loader = allAppsReadmes[filePath];
  if (!loader) {
    const fallbackFile = locale === 'zh-TW' ? 'README.md' : 'README.zh-TW.md';
    const fallbackPath = `/apps/${appId}/${fallbackFile}`;
    const fallbackLoader = allAppsReadmes[fallbackPath];

    if (!fallbackLoader) {
      console.warn(
        `README not found for app: ${appId}, tried: ${filePath}, ${fallbackPath}`
      );
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

  console.log(`[README Loader] Loading lib README: ${filePath}`);

  const loader = allLibsReadmes[filePath];
  if (!loader) {
    const fallbackFile = locale === 'zh-TW' ? 'README.md' : 'README.zh-TW.md';
    const fallbackPath = `/libs/${libId}/${fallbackFile}`;
    const fallbackLoader = allLibsReadmes[fallbackPath];

    if (!fallbackLoader) {
      console.warn(
        `README not found for lib: ${libId}, tried: ${filePath}, ${fallbackPath}`
      );
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

  console.log(`[README Loader] loadAllAppsReadmes for locale: ${locale}`);

  for (const [path, loader] of Object.entries(allAppsReadmes)) {
    if (!path.endsWith(fileName)) continue;

    console.log(`[README Loader] Loading: ${path}`);
    try {
      const content = await loader();
      const readme = await parseReadme(path, content);
      if (readme?.id) {
        console.log(`[README Loader] Loaded app: ${readme.id} - ${readme.name}`);
        readmes.push(readme);
      } else {
        console.warn(`[README Loader] No ID found in ${path}`);
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  console.log(`[README Loader] Total apps loaded: ${readmes.length}`);
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

  console.log(`[README Loader] loadAllLibsReadmes for locale: ${locale}`);

  for (const [path, loader] of Object.entries(allLibsReadmes)) {
    if (!path.endsWith(fileName)) continue;

    console.log(`[README Loader] Loading: ${path}`);
    try {
      const content = await loader();
      const readme = await parseReadme(path, content);
      if (readme?.id) {
        console.log(`[README Loader] Loaded lib: ${readme.id} - ${readme.name}`);
        readmes.push(readme);
      } else {
        console.warn(`[README Loader] No ID found in ${path}`);
      }
    } catch (error) {
      console.error(`Error loading ${path}:`, error);
    }
  }

  console.log(`[README Loader] Total libs loaded: ${readmes.length}`);
  return readmes.sort((a, b) => a.name.localeCompare(b.name));
}
