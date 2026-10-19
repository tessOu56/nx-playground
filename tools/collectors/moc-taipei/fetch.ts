export const MOC_EXHIBITION_URL =
  'https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6';

const UA =
  'nx-playground-taipei-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED_HOSTS = new Set(['cloud.culture.tw']);

export function assertMocOpenDataUrl(url: string): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('MoC URL is invalid');
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('MoC URL must be https');
  }
  if (parsed.username || parsed.password) {
    throw new Error('MoC URL must not include credentials');
  }
  if (!ALLOWED_HOSTS.has(parsed.hostname.toLowerCase())) {
    throw new Error('MoC URL host is not allowlisted');
  }
  return parsed.toString();
}

export async function fetchMocExhibitions(
  url = MOC_EXHIBITION_URL,
  fetchImpl: typeof fetch = fetch
): Promise<unknown> {
  const safeUrl = assertMocOpenDataUrl(url);
  const response = await fetchImpl(safeUrl, {
    headers: { Accept: 'application/json', 'User-Agent': UA },
    signal: AbortSignal.timeout(30_000),
    redirect: 'error',
  });
  if (!response.ok) {
    throw new Error(`MoC open data HTTP ${response.status}`);
  }
  return response.json();
}
