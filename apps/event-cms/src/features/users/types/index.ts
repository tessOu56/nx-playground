export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'pending' | 'inactive';
  avatar: string | null;
  lastLogin: string | null;
  createdAt: string;
  phone?: string;
  bio?: string;
  permissions?: string[];
}

export interface UserFormData {
  name: string;
  email: string;
  role: User['role'];
  status: User['status'];
  phone?: string;
  bio?: string;
}

export const ROLES = {
  admin: { label: '管理員', color: 'text-red-600 bg-red-100' },
  moderator: { label: '版主', color: 'text-blue-600 bg-blue-100' },
  user: { label: '一般用戶', color: 'text-gray-600 bg-gray-100' },
} as const;

export const STATUSES = {
  active: { label: '活躍', color: 'text-green-600 bg-green-100' },
  pending: { label: '待審核', color: 'text-yellow-600 bg-yellow-100' },
  inactive: { label: '停用', color: 'text-gray-600 bg-gray-100' },
} as const;

