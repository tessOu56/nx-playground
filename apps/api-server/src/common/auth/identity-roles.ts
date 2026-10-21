export const IDENTITY_ROLES = ['user', 'organizer', 'admin'] as const;
export type IdentityRole = (typeof IDENTITY_ROLES)[number];

export const ELEVATED_IDENTITY_ROLES = ['organizer', 'admin'] as const;
export type ElevatedIdentityRole = (typeof ELEVATED_IDENTITY_ROLES)[number];

export const AUTH_JWT_AUDIENCE = 'event-stack-api';

export type IdentityPrincipal = {
  kind: 'machine' | 'user';
  id: string;
  roles: IdentityRole[];
};

export type AccessTokenClaims = {
  sub: string;
  roles: IdentityRole[];
};

export function isIdentityRole(value: unknown): value is IdentityRole {
  return (
    value === 'user' || value === 'organizer' || value === 'admin'
  );
}

export function isElevatedIdentityRole(
  value: unknown
): value is ElevatedIdentityRole {
  return value === 'organizer' || value === 'admin';
}

export function parseIdentityRoles(value: unknown): IdentityRole[] {
  if (!Array.isArray(value)) return [];
  const roles: IdentityRole[] = [];
  for (const item of value) {
    if (isElevatedIdentityRole(item) && !roles.includes(item)) {
      roles.push(item);
    }
  }
  return roles;
}

export function hasAnyIdentityRole(
  principal: IdentityPrincipal | null | undefined,
  allowed: readonly IdentityRole[]
): boolean {
  if (!principal) return false;
  return principal.roles.some(role => allowed.includes(role));
}

export function canReadUnpublished(
  principal: IdentityPrincipal | null | undefined
): boolean {
  return hasAnyIdentityRole(principal, ELEVATED_IDENTITY_ROLES);
}

export function permissionRoleFor(
  principal: IdentityPrincipal
): 'admin' | 'editor' | 'user' {
  if (principal.roles.includes('admin')) return 'admin';
  if (principal.roles.includes('organizer')) return 'editor';
  return 'user';
}
