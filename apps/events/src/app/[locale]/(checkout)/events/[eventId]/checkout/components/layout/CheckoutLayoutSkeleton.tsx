import { OrderSkeleton } from '../order';
import { PaymentSkeleton } from '../payment';
import { SessionSkeleton } from '../session';
import { TicketSkeleton } from '../ticket';

export function CheckoutLayoutSkeleton() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='page-container'>
        <div className='space-y-6'>
          {/* 場次選擇骨架 */}
          <SessionSkeleton />

          {/* 票卷選擇骨架 */}
          <TicketSkeleton />

          {/* 總金額骨架 */}
          <OrderSkeleton />

          {/* 付款方式骨架 */}
          <PaymentSkeleton />

          {/* 按鈕骨架 */}
          <div className='text-center'>
            <div className='h-14 bg-gray-200 rounded animate-pulse mx-auto w-48' />
          </div>
        </div>
      </div>
    </div>
  );
}
