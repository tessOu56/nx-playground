/**
 * 共用回應信封（able_api 風格，跨服務約定）。
 * 信封欄位為 snake_case；result 內的領域 payload 維持各自命名（catalog 為 camelCase）。
 */

@doc("成功回應信封")
model SuccessMessage<T> {
  is_success: boolean;
  datetime: string;
  result: T;
}

@error
@doc("錯誤回應信封")
model ErrorMessage {
  is_success: boolean;
  datetime: string;
  error_code: string;
  error_type: string;
  error_message: string;
}
