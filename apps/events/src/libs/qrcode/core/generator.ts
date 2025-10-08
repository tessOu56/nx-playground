// 導入類型定義
import type {
  QRCodeData,
  OrderQRCodeData,
  TicketQRCodeData,
  QRCodeGeneratorConfig,
} from '@/types/qrcode';

// QR Code 生成器類
export class QRCodeGenerator {
  private config: QRCodeGeneratorConfig;

  constructor(config: QRCodeGeneratorConfig) {
    this.config = config;
  }

  // 生成訂單 QR Code
  generateOrderQRCode(
    orderId: string,
    eventId: string,
    amount: number,
    timestamp?: number
  ): string {
    const qrData: OrderQRCodeData = {
      type: 'order',
      orderId,
      eventId,
      amount,
      timestamp: timestamp ?? this.config.timestamp ?? Date.now(),
      signature: this.config.signature,
    };

    return JSON.stringify(qrData);
  }

  // 生成票券 QR Code
  generateTicketQRCode(
    ticketId: string,
    orderId: string,
    eventId: string,
    timestamp?: number
  ): string {
    const qrData: TicketQRCodeData = {
      type: 'ticket',
      ticketId,
      orderId,
      eventId,
      timestamp: timestamp ?? this.config.timestamp ?? Date.now(),
      signature: this.config.signature,
    };

    return JSON.stringify(qrData);
  }

  // 解析 QR Code 資料
  parseQRCode(qrCodeString: string): QRCodeData | null {
    try {
      const data = JSON.parse(qrCodeString);

      // 驗證基本結構
      if (!data.type || !data.timestamp || !data.signature) {
        return null;
      }

      // 根據類型驗證特定欄位
      if (data.type === 'order') {
        if (!data.orderId || !data.eventId || typeof data.amount !== 'number') {
          return null;
        }
        return data as OrderQRCodeData;
      } else if (data.type === 'ticket') {
        if (!data.ticketId || !data.orderId || !data.eventId) {
          return null;
        }
        return data as TicketQRCodeData;
      }

      return null;
    } catch (_error) {
      return null;
    }
  }

  // 驗證 QR Code 簽名
  validateSignature(qrData: QRCodeData): boolean {
    try {
      // 這裡可以實現更複雜的簽名驗證邏輯
      // 目前使用簡單的簽名比較
      return qrData.signature === this.config.signature;
    } catch (_error) {
      return false;
    }
  }

  // 檢查 QR Code 是否過期（可選）
  isExpired(qrData: QRCodeData, maxAge: number = 24 * 60 * 60 * 1000): boolean {
    const now = Date.now();
    return now - qrData.timestamp > maxAge;
  }
}

// 預設 QR Code 生成器實例
export const defaultQRCodeGenerator = new QRCodeGenerator({
  signature: 'temp-signature', // 在生產環境中應該使用更安全的簽名
});

// 便利函數
export const generateOrderQRCode = (
  orderId: string,
  eventId: string,
  amount: number,
  timestamp?: number
): string => {
  return defaultQRCodeGenerator.generateOrderQRCode(
    orderId,
    eventId,
    amount,
    timestamp
  );
};

export const generateTicketQRCode = (
  ticketId: string,
  orderId: string,
  eventId: string,
  timestamp?: number
): string => {
  return defaultQRCodeGenerator.generateTicketQRCode(
    ticketId,
    orderId,
    eventId,
    timestamp
  );
};

export const parseQRCode = (qrCodeString: string): QRCodeData | null => {
  return defaultQRCodeGenerator.parseQRCode(qrCodeString);
};

export const validateQRCodeSignature = (qrData: QRCodeData): boolean => {
  return defaultQRCodeGenerator.validateSignature(qrData);
};
