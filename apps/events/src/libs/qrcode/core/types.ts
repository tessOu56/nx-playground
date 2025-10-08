// QR Code 主題類型
export type QRCodeTheme = 'order' | 'checkin';

// QR Code 操作動作
export interface QRCodeAction {
  id: string;
  label: string;
  loadingLabel?: string;
  onClick: () => void | Promise<void>;
  variant?: 'primary' | 'secondary' | 'outline' | 'default';
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

// QR Code Modal Props
export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: string;
  theme: QRCodeTheme;
  title?: string;
}

// QR Code Section Props
export interface QRCodeSectionProps {
  /** QR Code 數據 */
  data: string;
  /** QR Code 主題 */
  theme: QRCodeTheme;
  /** Modal 標題 */
  modalTitle: string;
  /** QR Code 尺寸 */
  size?: number;
  /** 描述文字 */
  description?: string;
  /** 提示文字 */
  hint?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 操作按鈕配置 */
  actions: QRCodeAction[];
  /** 是否可點擊放大 */
  clickToEnlarge?: boolean;
  /** 自定義樣式類名 */
  className?: string;
}

// QR Code 主題顏色配置
export interface QRCodeThemeColors {
  dots: string;
  background: string;
  corners: string;
}
