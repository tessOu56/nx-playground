export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export function mapKratosWhoami(body: {
  identity?: {
    id?: string;
    traits?: { email?: string; name?: string };
  };
}): AuthUser | null {
  const id = body.identity?.id;
  const email = body.identity?.traits?.email;
  if (!id || !email) return null;
  return {
    id,
    email,
    name: body.identity?.traits?.name ?? email,
  };
}

export async function fetchKratosSession(
  kratosPublicUrl: string,
): Promise<AuthUser | null> {
  const base = kratosPublicUrl.replace(/\/$/, '');
  const response = await fetch(`${base}/sessions/whoami`, {
    credentials: 'include',
  });
  if (response.status === 401) return null;
  if (!response.ok) return null;
  return mapKratosWhoami(await response.json());
}

export async function createKratosLogoutUrl(
  kratosPublicUrl: string,
): Promise<string | null> {
  const base = kratosPublicUrl.replace(/\/$/, '');
  const response = await fetch(`${base}/self-service/logout/browser`, {
    credentials: 'include',
  });
  if (!response.ok) return null;
  const body = (await response.json()) as { logout_url?: string };
  return body.logout_url ?? null;
}
