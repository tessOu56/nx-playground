import { getVendorAvatarUrl } from '../../../utils/imageUtils';

import type { User, FullUserInfo } from '@/types';
import type { LiffUserInfo } from '@/types/line';

/**
 * 生成 Mock User 資料
 *
 * @param id - User ID
 * @param name - 用戶名稱
 * @param email - 電子郵件
 * @param phone - 電話號碼
 * @param bio - 個人簡介
 * @param lineId - LINE ID
 * @param isOrganizer - 是否為主辦方
 * @param vendorId - 主辦方 ID (如果是主辦方)
 * @returns 生成的 User 物件
 */
export function generateUser(
  id: string,
  name: string,
  email: string,
  phone: string,
  bio: string,
  lineId: string
): User {
  const [joinedDate] = new Date(
    Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split('T');

  const baseUser: User = {
    id,
    name,
    avatar: getVendorAvatarUrl(id),
    email,
    phone,
    bio,
    joinedDate,
    lineId,
  };

  return {
    ...baseUser,
  };
}

/**
 * 生成 Mock LiffUserInfo 資料
 *
 * @param lineId - LINE ID
 * @param displayName - 顯示名稱
 * @returns 生成的 LiffUserInfo 物件
 */
export function generateLiffUserInfo(
  lineId: string,
  displayName: string
): LiffUserInfo {
  const pictureUrl = `https://via.placeholder.com/150/4F46E5/FFFFFF?text=${displayName.charAt(
    0
  )}`;

  return {
    profile: {
      userId: lineId,
      displayName,
      pictureUrl,
      statusMessage: '今天天氣真好！',
    },
    idToken: `mock_id_token_${lineId.slice(-12)}`,
    accessToken: `mock_access_token_${lineId.slice(-12)}`,
    decodedIdToken: {
      sub: lineId,
      name: displayName,
      picture: pictureUrl,
      iss: 'https://access.line.me',
      aud: '2007835339',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    lineId,
  };
}

/**
 * 生成多個 Mock Users
 *
 * @param count - 生成數量
 * @param baseId - 基礎 ID
 * @param organizerRatio - 主辦方比例 (0-1)
 * @returns 生成的 User 陣列
 */
export function generateMultipleUsers(count: number, baseId = 'user'): User[] {
  const names = [
    '張小明',
    '李小華',
    '王大雄',
    '陳美玲',
    '林志強',
    '黃淑芬',
    '吳建國',
    '鄭雅婷',
  ];
  const domains = ['example.com', 'test.com', 'demo.org'];

  return Array.from({ length: count }, (_, index) => {
    const id = `${baseId}-${String(index + 1).padStart(2, '0')}`;
    const name =
      names[index % names.length] +
      (index >= names.length ? `-${index + 1}` : '');
    const email = `user${index + 1}@${domains[index % domains.length]}`;
    const phone = `09${String(Math.floor(Math.random() * 100000000)).padStart(
      8,
      '0'
    )}`;
    const bio = `這是用戶 ${name} 的個人簡介，熱愛參與各種活動。`;
    const lineId = `U${Array.from({ length: 33 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    return generateUser(id, name, email, phone, bio, lineId);
  });
}

/**
 * 生成多個 Mock LiffUserInfos
 *
 * @param users - User 陣列
 * @returns 生成的 LiffUserInfo Record
 */
export function generateLiffUserInfos(
  users: User[]
): Record<string, LiffUserInfo> {
  const result: Record<string, LiffUserInfo> = {};

  users.forEach(user => {
    result[user.lineId] = generateLiffUserInfo(user.lineId, user.name);
  });

  return result;
}

/**
 * 生成完整的用戶資訊 (包含 LINE 資訊)
 *
 * @param users - User 陣列
 * @param liffUserInfos - LiffUserInfo Record
 * @returns 生成的 FullUserInfo 陣列
 */
export function generateFullUserInfos(
  users: User[],
  liffUserInfos: Record<string, LiffUserInfo>
): FullUserInfo[] {
  return users.map(user => ({
    ...user,
    lineInfo: liffUserInfos[user.lineId] ?? {
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
}
