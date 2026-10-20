export type LineAuthNoticeKind = 'cancelled' | 'failed' | 'outside';

type SearchReader = {
  get(name: string): string | null;
  has(name: string): boolean;
};

export function parseLineAuthNotice(
  search: SearchReader | null | undefined,
  options?: { isInClient?: boolean }
): LineAuthNoticeKind | null {
  if (!search) return null;

  const error = search.get('error');
  if (error === 'access_denied') return 'cancelled';
  if (error) return 'failed';

  const liffHint =
    search.has('liff.state') ||
    search.has('liffClientId') ||
    search.has('liffId') ||
    search.get('openExternalBrowser') === '1';

  if (liffHint && options?.isInClient === false) {
    return 'outside';
  }

  return null;
}

export function lineAuthNoticeParams(): string[] {
  return [
    'error',
    'error_description',
    'error_reason',
    'liff.state',
    'liffClientId',
    'liffId',
    'openExternalBrowser',
  ];
}
