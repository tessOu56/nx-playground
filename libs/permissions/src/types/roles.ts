/**
 * Role definitions
 */

export type Role = 'admin' | 'editor' | 'viewer' | 'user' | 'guest';

export interface RoleConfig {
  id: Role;
  name: string;
  description: string;
  permissions: string[];
  inherits?: Role[];
}

/**
 * Predefined role configurations
 */
export const ROLES: Record<Role, RoleConfig> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['*:*'], // Wildcard for all permissions
  },
  editor: {
    id: 'editor',
    name: 'Editor',
    description: 'Can create and edit content',
    permissions: [
      'events:read',
      'events:create',
      'events:update',
      'users:read',
      'forms:read',
      'forms:create',
      'forms:update',
    ],
  },
  viewer: {
    id: 'viewer',
    name: 'Viewer',
    description: 'Read-only access',
    permissions: ['events:read', 'users:read', 'forms:read'],
  },
  user: {
    id: 'user',
    name: 'User',
    description: 'Regular user with basic access',
    permissions: ['events:read', 'orders:read', 'orders:create'],
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    description: 'Public access only',
    permissions: ['events:read'],
  },
};

