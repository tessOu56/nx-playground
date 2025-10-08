'use client';

import { useEffect, useRef } from 'react';

import { OrderInfoHeader } from '../order';
import { PaymentStatus } from '../payment';

import {
  useOrder,
  useOrderItems,
  useOrderTickets,
  useBillByOrder,
} from '@/libs';
import { getOrderScenario } from '@/libs/utils/orderUtils';
import type { Bill } from '@/types';

interface OrderDetailProps {
  orderId: string;
}

export function OrderDetail({ orderId }: OrderDetailProps) {
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  // 使用分離的 hooks 獲取各種資料
  const {
    data: order,
    isLoading: orderLoading,
    error: orderError,
  } = useOrder(orderId);
  const { data: orderItems, isLoading: itemsLoading } = useOrderItems(orderId);
  const { data: tickets, isLoading: ticketsLoading } = useOrderTickets(orderId);
  const { data: bill, isLoading: billLoading } = useBillByOrder(orderId);

  const isLoading =
    orderLoading ?? itemsLoading ?? ticketsLoading ?? billLoading;
  const error = orderError;

  // 使用工具函數決定訂單場景（需要在所有資料載入後）
  const scenario =
    order && bill ? getOrderScenario(order, bill, orderItems) : 'unknown';

  // 當訂單未付款時，自動滑動到 payment section
  useEffect(() => {
    if (order && bill && !isLoading) {
      const isUnpaid = bill.status === 'pending' || bill.status === 'verifying';

      if (isUnpaid && paymentSectionRef.current) {
        // 添加小延遲確保 DOM 已渲染
        setTimeout(() => {
          paymentSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      }
    }
  }, [order, bill, isLoading]);

  // 調試信息（開發時可啟用）
  console.log('OrderDetail Debug:', {
    orderId,
    order,
    orderItems,
    tickets,
    bill,
    isLoading,
    error: error?.message,
    hasOrder: !!order,
    hasBill: !!bill,
    orderItemsCount: orderItems?.length ?? 0,
    ticketsCount: tickets?.length ?? 0,
  });

  // 當訂單未付款時，自動滑動到 payment section
  useEffect(() => {
    if (order && bill && !isLoading) {
      const isUnpaid = bill.status === 'pending' || bill.status === 'verifying';

      if (isUnpaid && paymentSectionRef.current) {
        // 添加小延遲確保 DOM 已渲染
        setTimeout(() => {
          paymentSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 300);
      }
    }
  }, [order, bill, isLoading]);
  // 處理載入狀態
  if (isLoading) {
    return null; // 讓 skeleton 組件處理載入狀態
  }

  // 處理錯誤狀態
  if (error) {
    return (
      <div className='text-center'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-red-900 mb-2'>載入失敗</h3>
          <p className='text-red-700 mb-4'>無法載入訂單資訊：{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className='px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
          >
            重新載入
          </button>
        </div>
      </div>
    );
  }

  // 處理查詢未啟用或資料不存在的情況
  if (!order) {
    return (
      <div className='text-center'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-yellow-900 mb-2'>
            無法載入訂單
          </h3>
          <p className='text-yellow-700 mb-4'>
            訂單資料暫時無法載入，請稍後再試
          </p>
        </div>
      </div>
    );
  }

  // 處理訂單基本資料不存在的情況（這種情況應該很少發生，因為 useOrder 會 throw error）
  if (!order.id) {
    return (
      <div className='text-center'>
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-6'>
          <h3 className='text-xl font-semibold text-yellow-900 mb-2'>
            訂單不存在
          </h3>
          <p className='text-yellow-700 mb-4'>
            {`找不到指定的訂單，請檢查訂單編號 ${orderId} 是否正確`}
          </p>
        </div>
      </div>
    );
  }

  // 根據 P05a-P05g 狀態決定顯示內容
  const renderOrderContent = () => {
    return (
      <div className='space-y-6'>
        {/* Order Info Section, Order Item Section */}
        {/* Bill Section */}
        <div className='space-y-4'>
          <OrderInfoHeader
            order={order}
            scenario={scenario}
            orderItems={orderItems ?? []}
            bill={bill ?? ({} as Bill)}
          />
        </div>

        {/* Payment Section */}
        {bill && (
          <div ref={paymentSectionRef} className='space-y-4'>
            <PaymentStatus order={order} bill={bill} scenario={scenario} />
          </div>
        )}
      </div>
    );
  };

  return <div className='space-y-6'>{renderOrderContent()}</div>;
}
