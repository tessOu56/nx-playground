'use client';

import { useToast } from '@/components';
import { useState, useEffect } from 'react';

import { useLiff } from '@/libs';
import { useTicketVerification, useTicketCheckIn } from '@/libs/api/hooks';
import { useLocalizedRouter } from '@/libs/i18n';
import type { Ticket } from '@/types';

interface TicketVerifyClientProps {
  params: Promise<{ ticketId: string }>;
}

export function TicketVerifyClient({ params }: TicketVerifyClientProps) {
  const [ticketId, setTicketId] = useState<string>('');

  useEffect(() => {
    params.then(({ ticketId }) => {
      setTicketId(ticketId);
    });
  }, [params]);
  const router = useLocalizedRouter();
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    message: string;
    ticket?: Ticket;
    event?: Event;
  } | null>(null);

  // 票券銷票 mutation
  const checkInMutation = useTicketCheckIn();

  // 獲取 LIFF 狀態
  const { userInfo, isInitialized } = useLiff();

  // Toast 通知
  const { addToast } = useToast();

  // 驗證票券
  const {
    data: ticketData,
    isLoading,
    error,
  } = useTicketVerification(ticketId);
  const ticket = ticketData?.ticket;
  const event = ticketData?.event;

  // 檢查用戶是否為主辦方
  const isOrganizer = userInfo?.lineId ? true : false; // 暫時：有 lineId 就視為主辦方

  useEffect(() => {
    if (ticketData) {
      setVerificationResult({
        isValid: ticket?.status === 'issued',
        message:
          ticket?.status === 'issued'
            ? '票券有效，可以報到'
            : ticket?.status === 'used'
            ? '票券已使用'
            : '票券無效',
        ticket,
        event,
      });
    }
  }, [ticketData, ticket]);

  // 載入中狀態
  if (isLoading || !isInitialized || !ticketId) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>
            {!isInitialized ? '正在初始化認證系統...' : '正在驗證票券...'}
          </p>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error || !ticket || !event) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>驗證失敗</h3>
          <p className='text-gray-600 mb-4'>無法找到指定的票券或活動資料</p>
          <button
            onClick={() => router.push('/')}
            className='w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  // 如果用戶不是主辦方，導向活動資訊頁
  if (!isOrganizer) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='text-center'>
          <div className='text-6xl mb-4'>權限不足</div>
          <h3 className='text-xl font-semibold text-gray-900 mb-2'>權限不足</h3>
          <p className='text-gray-600 mb-4'>只有活動主辦方才能進行票券驗證</p>
          <button
            onClick={() => router.push(`/events/${event.id}`)}
            className='w-full h-12 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
          >
            查看活動資訊
          </button>
        </div>
      </div>
    );
  }

  const handleCheckIn = async () => {
    if (!ticket || ticket.status !== 'issued') return;

    try {
      // 使用 React Query mutation 進行銷票
      await checkInMutation.mutateAsync(ticket.id);

      // 更新驗證結果
      setVerificationResult({
        isValid: false,
        message: '票券已成功報到',
        ticket: { ...ticket, status: 'used' },
        event,
      });

      addToast({
        message: '票券報到成功！',
        type: 'success',
        duration: 3000,
      });
    } catch (_error) {
      addToast({
        message: '報到失敗，請重試',
        type: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <div className='space-y-6'>
      {/* 頁面標題 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>票券驗證</h1>
        <p className='text-gray-600'>主辦方專用 • 票券 #{ticket.id}</p>
      </div>

      {/* 票券資訊 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>票券資訊</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-600'>票券編號</p>
            <p className='font-medium text-gray-900'>{ticket.id}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>票券類型</p>
            <p className='font-medium text-gray-900'>{ticket.type}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>活動名稱</p>
            <p className='font-medium text-gray-900'>{event.title}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>活動日期</p>
            <p className='font-medium text-gray-900'>{event.date}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>活動地點</p>
            <p className='font-medium text-gray-900'>{event.location}</p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>票券狀態</p>
            <p
              className={`font-medium ${
                ticket.status === 'issued'
                  ? 'text-green-600'
                  : ticket.status === 'used'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}
            >
              {ticket.status === 'issued'
                ? '可使用'
                : ticket.status === 'used'
                ? '已使用'
                : '未知狀態'}
            </p>
          </div>
        </div>
      </div>

      {/* 驗證結果 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>驗證結果</h2>
        <div className='text-center'>
          <div
            className={`text-8xl mb-4 ${
              verificationResult?.isValid ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {verificationResult?.isValid ? '可使用' : '已使用'}
          </div>
          <h3
            className={`text-2xl font-bold mb-2 ${
              verificationResult?.isValid ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {verificationResult?.message}
          </h3>
          <p className='text-gray-600'>
            {verificationResult?.isValid
              ? '此票券可以進行報到'
              : '此票券無法使用'}
          </p>
        </div>
      </div>

      {/* 操作按鈕 */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex flex-col sm:flex-row gap-3 mb-4'>
          {verificationResult?.isValid && ticket.status === 'issued' ? (
            <button
              onClick={handleCheckIn}
              disabled={checkInMutation.isPending}
              className='flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50'
            >
              {checkInMutation.isPending ? '處理中...' : '確認報到'}
            </button>
          ) : (
            <button
              onClick={() => router.push(`/events/${event.id}`)}
              className='flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors'
            >
              查看活動資訊
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className='flex-1 bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-700 transition-colors'
          >
            返回首頁
          </button>
        </div>

        {/* 使用說明 */}
        <div className='border-t pt-4'>
          <h4 className='text-lg font-semibold text-gray-900 mb-2'>驗證說明</h4>
          <ul className='text-sm text-gray-600 space-y-1'>
            <li>• 只有活動主辦方才能進行票券驗證</li>
            <li>• 確認票券有效後，點擊「確認報到」完成銷票</li>
            <li>• 每張票券只能報到一次</li>
            <li>• 報到後票券狀態會更新為「已使用」</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
