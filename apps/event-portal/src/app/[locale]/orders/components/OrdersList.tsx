'use client';

import { Input, Button } from '@nx-playground/ui-components';
import { useState, useEffect } from 'react';

import { OrderCard } from './OrderCard';

import { CoreSelect } from '@/components';
import {
  useUsers,
  useLocalizedRouter,
  useOrdersListByUser,
  createGetUserName,
} from '@/libs';
import type { OrderListItem } from '@/types';

export function OrdersList() {
  const router = useLocalizedRouter();
  const [filteredOrders, setFilteredOrders] = useState<OrderListItem[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 使用新的聚合資料 hooks
  const { data: orders, isLoading, error } = useOrdersListByUser('user-001');
  const { data: users } = useUsers();

  // 使用工具函數創建用戶名稱查找函數
  const getUserName = createGetUserName(users);

  useEffect(() => {
    // 過濾訂單
    let filtered = orders ?? [];

    // 根據狀態過濾（支援訂單狀態和帳單狀態）
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        (order: OrderListItem) =>
          order.status === selectedStatus || order.billStatus === selectedStatus
      );
    }

    // 根據搜尋詞過濾（包含活動標題）
    if (searchTerm) {
      filtered = filtered.filter(
        (order: OrderListItem) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ??
          order.eventId.toLowerCase().includes(searchTerm.toLowerCase()) ??
          order.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ??
          false ??
          getUserName(order.userId)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  }, [orders, selectedStatus, searchTerm, getUserName]);

  // 處理載入狀態
  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>載入中...</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>
            載入中...
          </h3>
          <p className='text-gray-600'>正在載入您的訂單資訊</p>
        </div>
      </div>
    );
  }

  // 處理錯誤狀態
  if (error) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>載入失敗</h3>
          <p className='text-red-600 mb-4'>無法載入訂單資訊，請稍後再試</p>
          <Button
            onClick={() => window.location.reload()}
            variant='destructive'
            className='w-full'
          >
            重新載入
          </Button>
        </div>
      </div>
    );
  }

  // 如果沒有訂單
  if (!orders || orders.length === 0) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>暫無訂單</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>暫無訂單</h3>
          <p className='text-gray-600 mb-4'>您還沒有任何活動訂單</p>
          <Button
            onClick={() => router.push('/')}
            variant='primary'
            className='w-full'
          >
            瀏覽活動
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6 text-gray-700'>
      {/* 頁面標題 */}
      <h1 className='text-3xl font-bold text-center text-gray-900 m-0'>
        我的訂單
      </h1>
      <p className='text-gray-600 my-0 text-center'>
        歡迎回來，{getUserName(orders[0].userId)}！這裡是您的所有活動訂單
      </p>

      {/* 篩選和搜尋 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              搜尋訂單
            </label>
            <Input
              type='text'
              placeholder='搜尋訂單編號、活動ID或客戶姓名...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='sm:w-48'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              付款狀態
            </label>
            <CoreSelect
              value={selectedStatus}
              onValueChange={setSelectedStatus}
              options={[
                { value: 'all', label: '全部狀態' },
                { value: 'pending', label: '待付款' },
                { value: 'confirmed', label: '已確認' },
                { value: 'completed', label: '已完成' },
                { value: 'cancelled', label: '已取消' },
              ]}
              placeholder='選擇狀態'
            />
          </div>
        </div>
      </div>

      {/* 訂單列表 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          訂單列表 ({filteredOrders.length} 筆)
        </h2>

        {filteredOrders.length === 0 ? (
          <div className='text-center py-8'>
            <div className='text-4xl mb-2'>沒有找到符合條件的訂單</div>
            <p className='text-gray-500'>沒有找到符合條件的訂單</p>
          </div>
        ) : (
          <div className='space-y-4'>
            {filteredOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                getUserName={getUserName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
