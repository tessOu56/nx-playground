/**
 * User mock data generators
 */

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer' | 'user';
  avatar?: string;
  createdAt: Date;
}

export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: 'user-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    avatar: 'https://picsum.photos/200',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
}

export function createMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: `user-${i + 1}`,
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
    })
  );
}

