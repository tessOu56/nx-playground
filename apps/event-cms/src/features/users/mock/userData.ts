import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '張小明',
    email: 'zhang@example.com',
    role: 'admin',
    status: 'active',
    avatar: null,
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2023-12-01T09:00:00Z',
    phone: '0912-345-678',
    bio: '系統管理員，負責平台維護和用戶管理。',
    permissions: ['users.read', 'users.write', 'events.write', 'settings.write'],
  },
  {
    id: '2',
    name: '李小華',
    email: 'li@example.com',
    role: 'user',
    status: 'pending',
    avatar: null,
    lastLogin: null,
    createdAt: '2024-01-10T14:20:00Z',
    phone: '0923-456-789',
    bio: '新註冊用戶，待審核中。',
    permissions: ['events.read'],
  },
  {
    id: '3',
    name: '王大明',
    email: 'wang@example.com',
    role: 'user',
    status: 'active',
    avatar: null,
    lastLogin: '2024-01-14T16:45:00Z',
    createdAt: '2023-11-15T11:30:00Z',
    phone: '0934-567-890',
    bio: '活動愛好者，經常參與各種活動。',
    permissions: ['events.read', 'events.register'],
  },
  {
    id: '4',
    name: '陳小美',
    email: 'chen@example.com',
    role: 'moderator',
    status: 'inactive',
    avatar: null,
    lastLogin: '2024-01-05T08:15:00Z',
    createdAt: '2023-10-20T13:45:00Z',
    phone: '0945-678-901',
    bio: '活動版主，協助管理活動內容。',
    permissions: ['events.read', 'events.write', 'events.moderate'],
  },
  {
    id: '5',
    name: '林志明',
    email: 'lin@example.com',
    role: 'user',
    status: 'active',
    avatar: null,
    lastLogin: '2024-01-16T14:20:00Z',
    createdAt: '2024-01-01T10:00:00Z',
    phone: '0956-789-012',
    bio: '新加入的活動參與者。',
    permissions: ['events.read', 'events.register'],
  },
];

// Mock API functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const updateUser = (id: string, data: Partial<User>): User | null => {
  const user = getUserById(id);
  if (!user) return null;
  return { ...user, ...data };
};

export const createUser = (data: Omit<User, 'id' | 'createdAt'>): User => {
  return {
    ...data,
    id: String(mockUsers.length + 1),
    createdAt: new Date().toISOString(),
  };
};

