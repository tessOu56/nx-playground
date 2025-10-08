import { getVendorAvatarUrl } from '../../../utils/imageUtils';

import type { User, FullUserInfo } from '@/types';
import type { LiffUserInfo } from '@/types/line';

// 統一的用戶列表（包含一般用戶和主辦方用戶）
export const mockUsers: User[] = [
  // 一般用戶（只有參與者身份）
  {
    id: 'user-001',
    name: 'Emily',
    avatar: getVendorAvatarUrl('emily'),
    email: 'emily@nx-playground.com',
    phone: '0912-345-678',
    bio: '產品企劃，主要 Demo 者，熱愛旅遊和攝影。',
    joinedDate: '2024-01-15',
    lineId: 'U1234567890abcdef1234567890abcdef1',
  },
  {
    id: 'user-002',
    name: 'Eugine',
    avatar: getVendorAvatarUrl('eugine'),
    email: 'eugine@oosa.life',
    phone: '0923-456-789',
    bio: 'OOSA 戶外活動愛好者，專注於戶外活動推廣。',
    joinedDate: '2024-01-20',
    lineId: 'U2345678901bcdef1234567890abcdef12',
  },
  {
    id: 'user-003',
    name: 'Olyver',
    avatar: getVendorAvatarUrl('olyver'),
    email: 'olyver@outdoor.com',
    phone: '0934-567-890',
    bio: '戶外活動愛好者，專精陽明山健行和登山運動。',
    joinedDate: '2024-02-01',
    lineId: 'U3456789012cdef1234567890abcdef123',
  },
  {
    id: 'user-004',
    name: 'Yenyu',
    avatar: getVendorAvatarUrl('yenyu'),
    email: 'yenyu@wellness.com',
    phone: '0945-678-901',
    bio: '健康生活愛好者，專注於野餐和瑜伽活動。',
    joinedDate: '2024-02-10',
    lineId: 'U456789013def1234567890123def123',
  },
  // 其他主辦方用戶（對 Emily 來說是隱藏的，之後社群功能才會開放）
];

// LINE 用戶資訊（模擬從 LIFF 獲取）
export const mockLineUserInfos: Record<string, LiffUserInfo> = {
  U1234567890abcdef1234567890abcdef1: {
    profile: {
      userId: 'U1234567890abcdef1234567890abcdef1',
      displayName: 'Emily',
      pictureUrl: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=E',
      statusMessage: '產品企劃，熱愛旅遊！',
    },
    idToken: 'mock_id_token_emily_1234567890abcdef',
    accessToken: 'mock_access_token_emily_1234567890abcdef',
    decodedIdToken: {
      sub: 'U1234567890abcdef1234567890abcdef1',
      name: 'Emily',
      picture: 'https://via.placeholder.com/150/4F46E5/FFFFFF?text=E',
      iss: 'https://access.line.me',
      aud: '2007835339',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    lineId: 'U1234567890abcdef1234567890abcdef1',
  },
  U2345678901bcdef1234567890abcdef12: {
    profile: {
      userId: 'U2345678901bcdef1234567890abcdef12',
      displayName: 'Eugine',
      pictureUrl: 'https://via.placeholder.com/150/059669/FFFFFF?text=Eu',
      statusMessage: 'OOSA 戶外活動推廣',
    },
    idToken: 'mock_id_token_eugine_2345678901bcdef',
    accessToken: 'mock_access_token_eugine_2345678901bcdef',
    decodedIdToken: {
      sub: 'U2345678901bcdef1234567890abcdef12',
      name: 'Eugine',
      picture: 'https://via.placeholder.com/150/059669/FFFFFF?text=Eu',
      iss: 'https://access.line.me',
      aud: '2007835339',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    lineId: 'U2345678901bcdef1234567890abcdef12',
  },
  U3456789012cdef1234567890abcdef123: {
    profile: {
      userId: 'U3456789012cdef1234567890abcdef123',
      displayName: 'Olyver',
      pictureUrl: 'https://via.placeholder.com/150/DC2626/FFFFFF?text=O',
      statusMessage: '陽明山健行專家',
    },
    idToken: 'mock_id_token_olyver_3456789012cdef',
    accessToken: 'mock_access_token_olyver_3456789012cdef',
    decodedIdToken: {
      sub: 'U3456789012cdef1234567890abcdef123',
      name: 'Olyver',
      picture: 'https://via.placeholder.com/150/DC2626/FFFFFF?text=O',
      iss: 'https://access.line.me',
      aud: '2007835339',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    lineId: 'U3456789012cdef1234567890abcdef123',
  },
  U456789013def1234567890123def123: {
    profile: {
      userId: 'U456789013def1234567890123def123',
      displayName: 'Yenyu',
      pictureUrl: 'https://via.placeholder.com/150/7C3AED/FFFFFF?text=Y',
      statusMessage: '健康生活，野餐瑜伽',
    },
    idToken: 'mock_id_token_yenyu_456789013def',
    accessToken: 'mock_access_token_yenyu_456789013def',
    decodedIdToken: {
      sub: 'U456789013def1234567890123def123',
      name: 'Yenyu',
      picture: 'https://via.placeholder.com/150/7C3AED/FFFFFF?text=Y',
      iss: 'https://access.line.me',
      aud: '2007835339',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    lineId: 'U456789013def1234567890123def123',
  },
};

// 完整的用戶資訊（包含 LINE 資訊）
export const mockFullUserInfos: FullUserInfo[] = mockUsers.map(user => ({
  ...user,
  lineInfo: mockLineUserInfos[user.lineId] ?? {
    profile: {
      userId: user.lineId,
      displayName: user.name,
      pictureUrl: user.avatar,
      statusMessage: '',
    },
    idToken: null,
    accessToken: null,
    decodedIdToken: null,
    lineId: user.lineId,
  },
  lastLoginAt: new Date().toISOString(),
  isActive: true,
}));

// LINE ID 相關函數已移至 useUsers.ts hooks

// 根據 LINE ID 查找完整用戶資訊（保留用於 mock 資料內部使用）
export const getFullUserInfoByLineId = (
  lineId: string
): FullUserInfo | undefined => {
  return mockFullUserInfos.find(user => user.lineId === lineId);
};
