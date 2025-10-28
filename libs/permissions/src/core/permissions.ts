/**
 * Core permission checking functions
 */

import type { Permission, UserWithRole } from '../types/permissions';
import type { Role } from '../types/roles';
import { ROLES } from '../types/roles';

/**
 * Get all permissions for a role (including inherited)
 */
export function getRolePermissions(role: Role): Permission[] {
  const roleConfig = ROLES[role];
  if (!roleConfig) return [];

  const permissions = [...roleConfig.permissions];

  // Handle inherited roles
  if (roleConfig.inherits) {
    for (const inheritedRole of roleConfig.inherits) {
      permissions.push(...getRolePermissions(inheritedRole));
    }
  }

  return [...new Set(permissions)]; // Remove duplicates
}

/**
 * Check if permission matches pattern
 * Supports wildcards: "events:*", "*:read", "*:*"
 */
export function matchesPermission(
  userPermission: Permission,
  requiredPermission: Permission
): boolean {
  // Exact match
  if (userPermission === requiredPermission) return true;

  // Wildcard match
  if (userPermission === '*:*') return true;

  const [userResource, userAction] = userPermission.split(':');
  const [reqResource, reqAction] = requiredPermission.split(':');

  // Resource wildcard
  if (userResource === '*' && userAction === reqAction) return true;

  // Action wildcard
  if (userResource === reqResource && userAction === '*') return true;

  return false;
}

/**
 * Check if user has permission
 */
export function hasPermission(
  user: UserWithRole | null,
  permission: Permission
): boolean {
  if (!user) return false;

  // Get all user permissions
  const roles = Array.isArray(user.role) ? user.role : [user.role];
  const userPermissions: Permission[] = [];

  // Collect permissions from roles
  for (const role of roles) {
    userPermissions.push(...getRolePermissions(role));
  }

  // Add custom permissions
  if (user.customPermissions) {
    userPermissions.push(...user.customPermissions);
  }

  // Check if any permission matches
  return userPermissions.some((userPerm) =>
    matchesPermission(userPerm, permission)
  );
}

/**
 * Check if user has ANY of the permissions
 */
export function hasAnyPermission(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(user, permission));
}

/**
 * Check if user has ALL permissions
 */
export function hasAllPermissions(
  user: UserWithRole | null,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(user, permission));
}

/**
 * Check if user has specific role
 */
export function hasRole(user: UserWithRole | null, role: Role): boolean {
  if (!user) return false;

  const roles = Array.isArray(user.role) ? user.role : [user.role];
  return roles.includes(role);
}

/**
 * Check if user has ANY of the roles
 */
export function hasAnyRole(user: UserWithRole | null, roles: Role[]): boolean {
  return roles.some((role) => hasRole(user, role));
}

/**
 * Check if user has ALL roles
 */
export function hasAllRoles(user: UserWithRole | null, roles: Role[]): boolean {
  return roles.every((role) => hasRole(user, role));
}

