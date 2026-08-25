/**
 * Node/Nest entry — types + core checks only.
 * The package barrel also exports React hooks/components; webpack Nest
 * must not load that graph (or require prebuilt dist/out-tsc .d.ts).
 */
export type {
  Permission,
  UserWithRole,
  PermissionCheckResult,
} from './types/permissions';
export type { Role, RoleConfig } from './types/roles';
export { ROLES } from './types/roles';
export {
  getRolePermissions,
  matchesPermission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from './core/permissions';
export {
  getRole,
  getAllRoles,
  isValidRole,
  getRoleHierarchy,
  isRoleHigherOrEqual,
} from './core/roles';
