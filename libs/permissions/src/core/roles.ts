/**
 * Role management functions
 */

import type { Role, RoleConfig } from '../types/roles';
import { ROLES } from '../types/roles';

/**
 * Get role configuration
 */
export function getRole(role: Role): RoleConfig | null {
  return ROLES[role] || null;
}

/**
 * Get all available roles
 */
export function getAllRoles(): Role[] {
  return Object.keys(ROLES) as Role[];
}

/**
 * Check if role exists
 */
export function isValidRole(role: string): role is Role {
  return role in ROLES;
}

/**
 * Get role hierarchy (from most to least privileged)
 */
export function getRoleHierarchy(): Role[] {
  return ['admin', 'editor', 'viewer', 'user', 'guest'];
}

/**
 * Compare roles (returns true if role1 >= role2 in hierarchy)
 */
export function isRoleHigherOrEqual(role1: Role, role2: Role): boolean {
  const hierarchy = getRoleHierarchy();
  const index1 = hierarchy.indexOf(role1);
  const index2 = hierarchy.indexOf(role2);

  return index1 <= index2;
}

