export type KratosSessionIdentity = {
  id: string;
  email: string;
};

function kratosWhoamiUrl(kratosPublicUrl: string | undefined): string | null {
  const trimmed = kratosPublicUrl?.trim() ?? '';
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return null;
    }
    return `${url.origin}${url.pathname.replace(/\/$/, '')}/sessions/whoami`;
  } catch {
    return null;
  }
}

function mapWhoami(body: unknown): KratosSessionIdentity | null {
  if (!body || typeof body !== 'object') return null;
  const { identity } = body as {
    identity?: { id?: unknown; traits?: { email?: unknown } };
  };
  const id = identity?.id;
  const email = identity?.traits?.email;
  if (typeof id !== 'string' || !id.trim()) return null;
  if (typeof email !== 'string' || !email.trim()) return null;
  return { id: id.trim(), email: email.trim().toLowerCase() };
}

/**
 * Server-side Kratos session proof. Fail closed on missing URL, missing
 * credentials, network errors, or a session without id+email.
 */
export async function verifyKratosSession(input: {
  kratosPublicUrl?: string;
  cookie?: string;
  sessionToken?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<KratosSessionIdentity | null> {
  const whoami = kratosWhoamiUrl(input.kratosPublicUrl);
  const cookie = input.cookie?.trim() ?? '';
  const sessionToken = input.sessionToken?.trim() ?? '';
  if (!whoami || (!cookie && !sessionToken)) {
    return null;
  }

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (cookie) headers.cookie = cookie;
  if (sessionToken) headers['x-session-token'] = sessionToken;

  const fetchImpl = input.fetchImpl ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs ?? 3000);
  try {
    const response = await fetchImpl(whoami, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return mapWhoami(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
