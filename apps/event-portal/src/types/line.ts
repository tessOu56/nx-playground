// LINE 活動資訊介面
export interface EventInfo {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  image: string;
  registered: number;
  capacity: number;
  price: string;
  category: string;
  tags: string[];
}

// LIFF 用戶資訊介面（考慮 LINE login 回傳的完整資料）
export interface LiffUserInfo {
  profile: {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
  };
  idToken: string | null;
  accessToken: string | null;
  decodedIdToken: {
    sub: string; // LINE ID
    name: string;
    picture?: string;
    iss?: string;
    aud?: string;
    exp?: number;
    iat?: number;
  } | null;
  lineId: string | null;
}

// LIFF Context 介面
export interface LiffContextType {
  isInitialized: boolean;
  isInClient: boolean;
  isLoggedIn: boolean;
  profile: any;
  userInfo: LiffUserInfo | null;
  lineId: string | null;
  login: () => void;
  logout: () => void;
  context: any;
  error: string | null;
}

// LINE 官方帳號設定介面
export interface LineSettings {
  officialAccountId: string;
  description: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
