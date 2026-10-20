import { assertAllowlistedHttpsUrl, fetchAllowlisted } from '../shared/ssrf';

export const MOC_EXHIBITION_URL =
  'https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6';

const UA =
  'nx-playground-taipei-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

const ALLOWED_HOSTS = new Set(['cloud.culture.tw']);

export function assertMocOpenDataUrl(url: string): string {
  return assertAllowlistedHttpsUrl(url, ALLOWED_HOSTS, 'MoC URL');
}

export async function fetchMocExhibitions(
  url = MOC_EXHIBITION_URL,
  fetchImpl: typeof fetch = fetch
): Promise<unknown> {
  const response = await fetchAllowlisted(url, ALLOWED_HOSTS, {
    accept: 'application/json',
    userAgent: UA,
    label: 'MoC open data',
    fetchImpl,
  });
  return response.json();
}
