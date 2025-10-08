import type { Vendor } from '@/types';

// 銀行代碼列表
const bankCodes = [
  '012', // 台北富邦銀行
  '004', // 台灣銀行
  '005', // 土地銀行
  '006', // 合作金庫
  '007', // 第一銀行
  '008', // 華南銀行
  '009', // 彰化銀行
  '011', // 上海銀行
  '013', // 國泰世華銀行
  '016', // 高雄銀行
];

/**
 * 生成隨機的 Vendor
 */
export function generateVendor(
  vendorId: string,
  options: {
    email?: string;
    bankCode?: string;
    accountNumber?: string;
    accountName?: string;
    events?: number;
  } = {}
): Vendor {
  const {
    email = `contact@${vendorId.replace('-', '')}.com`,
    bankCode = bankCodes[Math.floor(Math.random() * bankCodes.length)],
    accountNumber = Math.floor(Math.random() * 9000000000) + 1000000000,
    accountName = `主辦方${vendorId.replace('-', '')}`,
    events = Math.floor(Math.random() * 50) + 5,
  } = options;

  // 生成 LINE 官方帳號 ID
  const lineOfficialAccountId = `@${vendorId.replace('-', '')}`;

  return {
    id: vendorId,
    events,
    email,
    lineOfficialAccountId,
    defaultBankAccount: {
      bankCode,
      accountNumber: accountNumber.toString(),
      accountName,
    },
  };
}

/**
 * 批量生成多個主辦方
 */
export function generateMultipleVendors(
  vendorCount: number,
  options: {
    prefix?: string;
    eventsRange?: [number, number];
  } = {}
): Vendor[] {
  const { prefix = 'vendor', eventsRange = [5, 50] } = options;

  const vendors: Vendor[] = [];

  for (let i = 1; i <= vendorCount; i++) {
    const vendorId = `${prefix}-${i}`;
    const events =
      eventsRange[0] +
      Math.floor(Math.random() * (eventsRange[1] - eventsRange[0]));

    const vendor = generateVendor(vendorId, { events });
    vendors.push(vendor);
  }

  return vendors;
}
