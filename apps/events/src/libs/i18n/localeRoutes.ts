/**
 * 為路徑加上 locale 前綴
 * @param path 原始路徑
 * @param locale 語言代碼，如果不提供則使用當前 locale
 * @returns 包含 locale 的完整路徑
 */
export function withLocale(path: string, locale?: string): string {
  // 移除開頭的斜線
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 如果路徑已經包含 locale，直接返回
  if (cleanPath.startsWith('zh-TW/') || cleanPath.startsWith('en/')) {
    return `/${cleanPath}`;
  }

  // 加上 locale 前綴
  const localePrefix = locale ?? 'zh-TW'; // 預設使用 zh-TW
  return `/${localePrefix}/${cleanPath}`;
}

/**
 * 從路徑中移除 locale 前綴
 * @param path 包含 locale 的完整路徑
 * @returns 移除 locale 後的原始路徑
 */
export function withoutLocale(path: string): string {
  // 移除開頭的斜線
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // 移除 locale 前綴
  if (cleanPath.startsWith('zh-TW/')) {
    return `/${cleanPath.slice(6)}`;
  }
  if (cleanPath.startsWith('en/')) {
    return `/${cleanPath.slice(3)}`;
  }

  return `/${cleanPath}`;
}

/**
 * 檢查路徑是否包含 locale
 * @param path 路徑
 * @returns 是否包含 locale
 */
export function hasLocale(path: string): boolean {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath.startsWith('zh-TW/') || cleanPath.startsWith('en/');
}

/**
 * 從路徑中提取 locale
 * @param path 包含 locale 的完整路徑
 * @returns locale 代碼或 null
 */
export function extractLocale(path: string): string | null {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  if (cleanPath.startsWith('zh-TW/')) {
    return 'zh-TW';
  }
  if (cleanPath.startsWith('en/')) {
    return 'en';
  }

  return null;
}
