/**
 * Permission type definitions
 */

import type { Role } from './roles';

/**
 * Permission string format: "resource:action"
 * Examples: "events:create", "users:delete", "admin:read"
 */
export type Permission = string;

/**
 * User with role information
 */
export interface UserWithRole {
  id: string;
  role: Role | Role[];
  customPermissions?: Permission[];
}

/**
 * Permission check result
 */
export interface PermissionCheckResult {
  granted: boolean;
  reason?: string;
}

/**
 * Permission context for React
 */
export interface PermissionContext {
  user: UserWithRole | null;
  can: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  hasAnyRole: (roles: Role[]) => boolean;
  hasAllRoles: (roles: Role[]) => boolean;
}

