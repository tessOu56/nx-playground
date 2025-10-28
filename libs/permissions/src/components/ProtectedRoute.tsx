/**
 * Protected Route component
 */

import type { ReactNode } from 'react';
import type { Permission, UserWithRole } from '../types/permissions';
import type { Role } from '../types/roles';
import { hasPermission, hasAnyPermission, hasRole } from '../core/permissions';

interface ProtectedRouteProps {
  children: ReactNode;
  user: UserWithRole | null;
  requiredPermissions?: Permission[];
  requiredRoles?: Role[];
  requireAll?: boolean; // If true, user must have ALL permissions/roles
  fallback?: ReactNode;
  onUnauthorized?: () => void;
}

export function ProtectedRoute({
  children,
  user,
  requiredPermissions = [],
  requiredRoles = [],
  requireAll = false,
  fallback = <div>Unauthorized</div>,
  onUnauthorized,
}: ProtectedRouteProps) {
  // Check roles
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAll
      ? requiredRoles.every((role) => hasRole(user, role))
      : requiredRoles.some((role) => hasRole(user, role));

    if (!hasRequiredRoles) {
      onUnauthorized?.();
      return <>{fallback}</>;
    }
  }

  // Check permissions
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAll
      ? requiredPermissions.every((perm) => hasPermission(user, perm))
      : hasAnyPermission(user, requiredPermissions);

    if (!hasRequiredPermissions) {
      onUnauthorized?.();
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
}

