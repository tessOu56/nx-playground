// 統一的用戶介面（基本資訊）
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  bio?: string;
  joinedDate: string;
  lineId: string; // LINE ID 作為主要識別
}

// 完整的用戶資訊（包含 LINE 資訊）
export interface FullUserInfo extends User {
  lineInfo: import('./line').LiffUserInfo;
  lastLoginAt: string;
  isActive: boolean;
}
