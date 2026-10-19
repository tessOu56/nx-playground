export const MOC_EXHIBITION_URL =
  'https://cloud.culture.tw/frontsite/trans/SearchShowAction.do?method=doFindTypeJ&category=6';

const UA =
  'nx-playground-taipei-collector/1.0 (+https://github.com/tessOu56/nx-playground)';

export async function fetchMocExhibitions(
  url = MOC_EXHIBITION_URL,
  fetchImpl: typeof fetch = fetch
): Promise<unknown> {
  const response = await fetchImpl(url, {
    headers: { Accept: 'application/json', 'User-Agent': UA },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`MoC open data HTTP ${response.status}`);
  }
  return response.json();
}
