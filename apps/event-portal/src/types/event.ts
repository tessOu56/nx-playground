import type { LineSettings } from './line';
import type { Vendor } from './vendor';

export interface Session {
  id: string;
  eventId: string;
  name: string;
  date: string;
  time: string;
  capacity: number;
  currentAttendees: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tickets: SessionTicket[]; // 該場次提供的票券類型
}

export interface SessionTicket {
  id: string;
  sessionId: string;
  name: string;
  description?: string;
  price: number;
  totalQuantity: number; // 總票數上限
  availableQuantity: number; // 可售票數
  status: 'selling' | 'sold_out' | 'stopped'; // 售票狀態：發售、售完、停售
  saleStartTime: string; // 售票開始時間
  saleEndTime: string; // 售票結束時間
  type?: 'regular' | 'vip' | 'student' | 'early-bird';
}

// 活動內容區塊類型 - 匹配後端數據結構
export interface EventContentBlock {
  type: // 標題類型
  | 'h2'
    | 'h2_italic'
    | 'h2_link'
    // 副標題類型
    | 'h3'
    | 'h3_italic'
    | 'h3_link'
    // 一般文字類型
    | 'text'
    | 'text_bold'
    | 'text_italic'
    | 'text_link'
    // 引言類型
    | 'quote'
    | 'quote_bold'
    | 'quote_italic'
    | 'quote_link'
    // 列表類型（自動偵測編號和樣式）
    | 'list'
    // 圖片類型
    | 'image';
  text_data?: string;
  image_data?: string;
}

// 常見問題類型
export interface EventFAQ {
  question: string;
  answer: string;
}

// 系統本身的 Event 類型（基本資料）
export interface Event {
  id: string;
  vendorId: string;
  title: string;
  description: string; // 活動簡介
  date: string;
  location: string;
  price: number;
  image: string; // 活動封面
  likes: number;
  attendees: number;
  capacity: number;
  category: string;
  tags: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  sessions: Session[]; // 活動場次陣列

  registrationFormTemplate?: import('./registrationForm').EventRegistrationTemplate;
}

// UI 顯示用的 Event 類型（包含完整資訊）
export interface EventDetail extends Event {
  vendor: Vendor; // 主辦方詳細資訊
  lineSettings: LineSettings; // LINE 設定資訊
  content: EventContentBlock[]; // 活動內容（編輯器內容）
  faq: EventFAQ[]; // 常見問題
}
