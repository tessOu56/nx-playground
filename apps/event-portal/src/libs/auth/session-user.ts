import { isElevatedIdentityRole } from './roles';

export type PortalSessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roles: Array<'organizer' | 'admin'>;
  lineId: string | null;
};

export function readPortalSessionUser(value: unknown): PortalSessionUser | null {
  if (!value || typeof value !== 'object') return null;
  const user = value as Record<string, unknown>;
  if (typeof user.id !== 'string' || !user.id.trim()) return null;
  const roles = Array.isArray(user.roles)
    ? user.roles.filter(isElevatedIdentityRole)
    : [];
  return {
    id: user.id,
    name: typeof user.name === 'string' ? user.name : null,
    email: typeof user.email === 'string' ? user.email : null,
    image: typeof user.image === 'string' ? user.image : null,
    roles,
    lineId: typeof user.lineId === 'string' ? user.lineId : null,
  };
}
