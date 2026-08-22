import type { EventStackUser } from '@nx-playground/api-client';

import type { User } from '../types';

function mapNestRole(role: EventStackUser['role']): User['role'] {
  if (role === 'admin') return 'admin';
  if (role === 'organizer') return 'moderator';
  return 'user';
}

function mapNestStatus(status: EventStackUser['status']): User['status'] {
  if (status === 'active') return 'active';
  if (status === 'suspended') return 'inactive';
  return 'inactive';
}

export function mapNestUserToCms(row: EventStackUser): User {
  return {
    id: row.id,
    name: row.name || row.email,
    email: row.email,
    role: mapNestRole(row.role),
    status: mapNestStatus(row.status),
    avatar: row.avatar ?? null,
    lastLogin: null,
    createdAt: row.createdAt,
  };
}
