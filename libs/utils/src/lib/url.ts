/**
 * URL manipulation utilities
 */

/**
 * Build URL with query parameters
 * @example buildUrl('/api/users', {page: 1, limit: 20}) => '/api/users?page=1&limit=20'
 */
export function buildUrl(
  baseUrl: string,
  params?: Record<string, string | number | boolean | null | undefined>
): string {
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  if (!queryString) return baseUrl;

  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}${queryString}`;
}

/**
 * Parse query string to object
 * @example parseQuery('?page=1&limit=20') => {page: '1', limit: '20'}
 */
export function parseQuery(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Get query parameter value
 * @example getQueryParam('?page=1&limit=20', 'page') => '1'
 */
export function getQueryParam(
  queryString: string,
  key: string
): string | null {
  const params = new URLSearchParams(queryString);
  return params.get(key);
}

/**
 * Extract domain from URL
 * @example getDomain('https://example.com/path') => 'example.com'
 */
export function getDomain(url: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return null;
  }
}

/**
 * Check if URL is absolute
 * @example isAbsoluteUrl('https://example.com') => true
 */
export function isAbsoluteUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Join URL paths
 * @example joinPaths('/api', 'users', '123') => '/api/users/123'
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, index) => {
      // Remove leading slash from all except first
      if (index > 0 && path.startsWith('/')) {
        path = path.slice(1);
      }
      // Remove trailing slash from all except last
      if (index < paths.length - 1 && path.endsWith('/')) {
        path = path.slice(0, -1);
      }
      return path;
    })
    .filter(Boolean)
    .join('/');
}

/**
 * Normalize URL (remove trailing slash, lowercase)
 * @example normalizeUrl('https://Example.com/Path/') => 'https://example.com/path'
 */
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    urlObj.hostname = urlObj.hostname.toLowerCase();
    urlObj.pathname = urlObj.pathname.replace(/\/$/, ''); // Remove trailing slash
    return urlObj.toString();
  } catch {
    return url;
  }
}

