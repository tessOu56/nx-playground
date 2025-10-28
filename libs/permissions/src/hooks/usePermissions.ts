/**
 * React hook for permission checks
 */

import { useMemo, useCallback } from 'react';
import type { Permission, UserWithRole } from '../types/permissions';
import type { Role } from '../types/roles';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRole,
  hasAnyRole,
  hasAllRoles,
} from '../core/permissions';

export function usePermissions(user: UserWithRole | null) {
  const can = useCallback(
    (permission: Permission) => hasPermission(user, permission),
    [user]
  );

  const canAny = useCallback(
    (permissions: Permission[]) => hasAnyPermission(user, permissions),
    [user]
  );

  const canAll = useCallback(
    (permissions: Permission[]) => hasAllPermissions(user, permissions),
    [user]
  );

  const isRole = useCallback(
    (role: Role) => hasRole(user, role),
    [user]
  );

  const isAnyRole = useCallback(
    (roles: Role[]) => hasAnyRole(user, roles),
    [user]
  );

  const isAllRoles = useCallback(
    (roles: Role[]) => hasAllRoles(user, roles),
    [user]
  );

  return useMemo(
    () => ({
      can,
      canAny,
      canAll,
      isRole,
      isAnyRole,
      isAllRoles,
    }),
    [can, canAny, canAll, isRole, isAnyRole, isAllRoles]
  );
}

