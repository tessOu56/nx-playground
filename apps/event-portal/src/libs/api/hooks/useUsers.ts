import { useQuery } from '@tanstack/react-query';

import { mockUsers } from '../../mock/users';

import type { User } from '@/types';

// 獲取所有用戶
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => mockUsers,
    staleTime: 5 * 60 * 1000,
  });
}

// 根據 ID 獲取用戶
export function useUser(userId: string) {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => mockUsers.find(user => user.id === userId),
    staleTime: 5 * 60 * 1000,
    enabled: !!userId,
  });
}

// 向後兼容的輔助函數（用於非 React 組件）
export function getUserById(userId: string): User | null {
  const user = mockUsers.find(u => u.id === userId);
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    avatar: user.avatar,
    bio: user.bio,
    joinedDate: user.joinedDate,
    lineId: user.lineId,
  };
}

export function getAllUsers(): User[] {
  return mockUsers.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    avatar: user.avatar,
    bio: user.bio,
    joinedDate: user.joinedDate,
    lineId: user.lineId,
  }));
}

// 用戶名稱查找工具函數（用於組件中）
export function createGetUserName(users?: User[]) {
  return (userId: string) => {
    const user = users?.find(u => u.id === userId);
    return user?.name ?? '載入中...';
  };
}

// 向後兼容的同步函數
export function getUserName(userId: string): string {
  const user = getUserById(userId);
  return user?.name ?? '未知用戶';
}

export function getUserEmail(userId: string): string {
  const user = getUserById(userId);
  return user?.email ?? '';
}

export function getUserPhone(userId: string): string {
  const user = getUserById(userId);
  return user?.phone ?? '';
}

export function getUserAvatar(userId: string): string {
  const user = getUserById(userId);
  return user?.avatar ?? '';
}

// 根據 LINE ID 查找用戶
export function getUserByLineId(lineId: string): User | undefined {
  return mockUsers.find(user => user.lineId === lineId);
}

// 檢查用戶是否為主辦方（基於 bio 或其他邏輯）
export function isUserOrganizer(lineId: string): boolean {
  const user = getUserByLineId(lineId);
  // 暫時基於 email domain 或 bio 來判斷（實際應用中會有專門的權限系統）
  return !!(
    user &&
    (user?.email?.includes('@nx-playground.local') ||
      user?.bio?.includes('主辦') ||
      user?.bio?.includes('策劃'))
  );
}
