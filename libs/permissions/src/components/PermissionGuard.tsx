/**
 * Permission Guard component (inline conditional rendering)
 */

import type { ReactNode } from 'react';
import type { Permission, UserWithRole } from '../types/permissions';
import { hasPermission } from '../core/permissions';

interface PermissionGuardProps {
  children: ReactNode;
  user: UserWithRole | null;
  permission: Permission;
  fallback?: ReactNode;
}

/**
 * Conditionally render children based on permission
 * 
 * @example
 * ```tsx
 * <PermissionGuard user={user} permission="events:create">
 *   <CreateEventButton />
 * </PermissionGuard>
 * ```
 */
export function PermissionGuard({
  children,
  user,
  permission,
  fallback = null,
}: PermissionGuardProps) {
  if (!hasPermission(user, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

