export function isBlockedHostname(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.arpa')
  ) {
    return true;
  }

  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 198 && (b === 18 || b === 19)) return true;
  }

  if (host.includes(':')) {
    if (host === '::1' || host === '::') return true;
    if (host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) {
      return true;
    }
  }
  return false;
}

export function publicWebUrl(
  raw: string,
  protocols: Set<string>
): string | undefined {
  try {
    const url = new URL(raw);
    if (!protocols.has(url.protocol)) return undefined;
    if (url.username || url.password) return undefined;
    if (isBlockedHostname(url.hostname)) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

export function httpsImageUrl(raw: unknown): string | undefined {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return undefined;
  return publicWebUrl(value, new Set(['https:']));
}

export function httpUrl(raw: unknown): string | undefined {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return undefined;
  return publicWebUrl(value, new Set(['http:', 'https:']));
}

export function assertAllowlistedHttpsUrl(
  url: string,
  allowedHosts: ReadonlySet<string>,
  label = 'Collector URL'
): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`${label} is invalid`);
  }
  if (parsed.protocol !== 'https:') {
    throw new Error(`${label} must be https`);
  }
  if (parsed.username || parsed.password) {
    throw new Error(`${label} must not include credentials`);
  }
  if (!allowedHosts.has(parsed.hostname.toLowerCase())) {
    throw new Error(`${label} host is not allowlisted`);
  }
  return parsed.toString();
}

export async function fetchAllowlisted(
  url: string,
  allowedHosts: ReadonlySet<string>,
  options: {
    accept: string;
    userAgent: string;
    label?: string;
    timeoutMs?: number;
    fetchImpl?: typeof fetch;
  }
): Promise<Response> {
  const safeUrl = assertAllowlistedHttpsUrl(url, allowedHosts, options.label);
  const fetchImpl = options.fetchImpl ?? fetch;
  const response = await fetchImpl(safeUrl, {
    headers: { Accept: options.accept, 'User-Agent': options.userAgent },
    signal: AbortSignal.timeout(options.timeoutMs ?? 30_000),
    redirect: 'error',
  });
  if (!response.ok) {
    throw new Error(
      `${options.label ?? 'Collector'} HTTP ${response.status}`
    );
  }
  return response;
}
