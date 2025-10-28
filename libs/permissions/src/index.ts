/**
 * @nx-playground/permissions
 *
 * Role-Based Access Control (RBAC) library
 * Provides role definitions, permission checks, and protected routes
 *
 * @example
 * ```typescript
 * import { hasPermission, ProtectedRoute, usePermissions } from '@nx-playground/permissions';
 *
 * // Check permissions
 * if (hasPermission(user, 'events:create')) {
 *   return <CreateEventButton />;
 * }
 *
 * // Protected routes
 * <ProtectedRoute requiredPermissions={['admin:read']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 *
 * // React hook
 * const { can } = usePermissions();
 * if (can('events:delete')) {
 *   return <DeleteButton />;
 * }
 * ```
 */

// Types
export * from './types/permissions';
export * from './types/roles';

// Core functions
export * from './core/permissions';
export * from './core/roles';

// React hooks
export * from './hooks/usePermissions';

// React components
export * from './components/ProtectedRoute';
export * from './components/PermissionGuard';
