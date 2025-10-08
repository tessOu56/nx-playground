import { generateVendor, generateMultipleVendors } from '../generate';

import type { Vendor } from '@/types';

// 使用生成器創建特定的 mock vendors，保留原有的業務邏輯資料
const specificVendors = [
  {
    ...generateVendor('vendor-1', {
      email: 'hello@nx-playground.local',
      bankCode: '013',
      accountNumber: '1234567890123',
      accountName: 'NX Playground',
      events: 4,
    }),
    lineOfficialAccountId: '@nx_playground',
  },
  {
    ...generateVendor('vendor-2', {
      email: 'events@nx-playground.com',
      bankCode: '822',
      accountNumber: '9876543210987',
      accountName: 'NX Playground 官方',
      events: 12,
    }),
    lineOfficialAccountId: '@nx-playground_official',
  },
  {
    ...generateVendor('vendor-3', {
      email: 'info@guting-community.org',
      bankCode: '700',
      accountNumber: '5555666677778',
      accountName: '古亭社區基金會',
      events: 6,
    }),
    lineOfficialAccountId: '@guting_community',
  },
];

// 合併特定的 vendors
export const mockVendors: Vendor[] = [...specificVendors];
