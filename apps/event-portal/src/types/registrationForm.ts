// 報名表模板類型定義
export interface EventRegistrationTemplate {
  id: string;
  name: string;
  description?: string;
  fields: FormField[]; // 表單欄位定義
  createdAt: string;
  updatedAt: string;
}

// 報名表類型定義
export interface RegistrationForm {
  id: string;
  templateId: string; // 表單模版ID
  templateName: string; // 表單模版名稱
  orderId: string; // 關聯的訂單ID
  orderItemId: string; // 關聯的訂單項目ID
  ticketId?: string; // 關聯的票券ID（新結構）
  fields?: FormField[]; // 表單欄位陣列（向後兼容）
  formData?: Record<string, any>; // 表單資料（新結構）
  status: RegistrationFormStatus; // 報名表狀態
  submittedAt?: string; // 提交時間
  isCompleted?: boolean; // 是否已完成填寫（向後兼容）
  completedAt?: string; // 完成時間（向後兼容）
}

export type RegistrationFormStatus =
  | 'pending' // 待填寫
  | 'completed' // 已完成
  | 'cancelled'; // 已取消

// 表單欄位類型
export interface FormField {
  id: string;
  name: string; // 欄位名稱
  label: string; // 顯示標籤
  type: FieldType; // 欄位類型
  required: boolean; // 是否必填
  placeholder?: string; // 佔位符文字
  options?: FieldOption[]; // 選項（用於單選、多選、下拉）
  value?: any; // 欄位值
  validation?: FieldValidation; // 驗證規則
}

// 欄位類型
export type FieldType =
  | 'text' // 文字輸入
  | 'email' // 郵箱輸入
  | 'phone' // 電話輸入
  | 'tel' // 電話輸入（HTML5 type）
  | 'number' // 數字輸入
  | 'textarea' // 多行文字
  | 'select' // 下拉選擇
  | 'radio' // 單選
  | 'checkbox' // 多選
  | 'date' // 日期選擇
  | 'time' // 時間選擇
  | 'file'; // 檔案上傳

// 欄位選項
export interface FieldOption {
  id: string;
  value: string;
  label: string;
  description?: string;
}

// 欄位驗證規則
export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string; // 正則表達式
  min?: number;
  max?: number;
  customMessage?: string;
}
