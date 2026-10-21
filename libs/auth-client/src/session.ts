export type IdentityRole = 'user' | 'organizer' | 'admin';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  roles: IdentityRole[];
  lineId?: string | null;
}

const ELEVATED = new Set(['organizer', 'admin']);

export function isElevatedRole(value: unknown): value is 'organizer' | 'admin' {
  return value === 'organizer' || value === 'admin';
}

export function mapBetterAuthSession(body: unknown): AuthUser | null {
  if (!body || typeof body !== 'object') return null;
  const user = (body as { user?: Record<string, unknown> }).user;
  if (!user || typeof user.id !== 'string' || !user.id.trim()) return null;
  const roles = Array.isArray(user.roles)
    ? user.roles.filter(isElevatedRole)
    : [];
  return {
    id: user.id,
    email: typeof user.email === 'string' ? user.email : undefined,
    name: typeof user.name === 'string' ? user.name : undefined,
    roles,
    lineId: typeof user.lineId === 'string' ? user.lineId : null,
  };
}

export function hasOrganizerAccess(user: AuthUser | null | undefined): boolean {
  return Boolean(user?.roles.some(role => ELEVATED.has(role)));
}

export async function fetchBetterAuthSession(
  authUrl: string
): Promise<AuthUser | null> {
  const base = authUrl.replace(/\/$/, '');
  const response = await fetch(`${base}/api/auth/get-session`, {
    credentials: 'include',
  });
  if (response.status === 401) return null;
  if (!response.ok) return null;
  return mapBetterAuthSession(await response.json());
}

export async function signOutBetterAuth(authUrl: string): Promise<void> {
  const base = authUrl.replace(/\/$/, '');
  await fetch(`${base}/api/auth/sign-out`, {
    method: 'POST',
    credentials: 'include',
  });
}
