export interface Vendor {
  id: string;
  events: number;
  email: string;
  // LINE 官方帳號 ID，用於前端呼叫 LINE API 獲取設定
  lineOfficialAccountId: string;
  // 轉帳預設帳戶資訊
  defaultBankAccount: {
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
}
