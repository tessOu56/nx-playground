import { type Metadata } from 'next';
import { Suspense } from 'react';

import { CheckoutLayoutSkeleton } from './components';
import { CheckoutClient } from './components/layout/CheckoutClient';

import { mockEvents } from '@/libs/mock/events';
import type { PaymentMethod } from '@/types';

// 生成靜態參數
export async function generateStaticParams() {
  return mockEvents.map(event => ({
    eventId: event.id,
  }));
}

// 固定 metadata
export const metadata: Metadata = {
  title: '選擇票券 | NX Playground',
  description: '選擇您想要的票券類型和付款方式',
  robots: 'noindex, nofollow',
};

// 靜態付款方式配置
const paymentMethods = [
  {
    value: 'cash' as PaymentMethod,
    label: '現場付款',
    description:
      '選擇現場付款後，系統會生成 QR Code。請到現場出示給店員掃描並支付現金。',
  },
  {
    value: 'atm' as PaymentMethod,
    label: 'ATM 轉帳',
    description:
      '選擇 ATM 轉帳後，系統會提供轉帳帳號和金額。請在 24 小時內完成轉帳。',
  },
  {
    value: 'third_party' as PaymentMethod,
    label: '第三方支付',
    description: '使用信用卡或其他第三方支付平台進行付款。',
    disabled: true, // 活動不支援此付款方式
  },
];

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <>
      {/* 互動功能 - Client Component 處理，會從 layout 的快取讀取事件資料 */}
      <Suspense fallback={<CheckoutLayoutSkeleton />}>
        <CheckoutClient eventId={eventId} paymentMethods={paymentMethods} />
      </Suspense>
    </>
  );
}
