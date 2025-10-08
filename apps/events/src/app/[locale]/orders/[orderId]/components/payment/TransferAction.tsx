'use client';

import { Input, Button } from '@nx-playground/ui-components';
import { useState } from 'react';

import { shareToLine } from '@/libs';
import type { Order, Bill } from '@/types';

interface TransferActionProps {
  order: Order;
  bill?: Bill;
}

export function TransferAction({ order, bill }: TransferActionProps) {
  // 轉帳確認表單狀態
  const [transferForm, setTransferForm] = useState({
    lastFiveDigits: '',
    transferAmount: bill?.amount?.toString() ?? order.totalAmount.toString(),
    note: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 處理表單輸入變化
  const handleFormChange = (field: string, value: string) => {
    setTransferForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // 處理轉帳確認提交
  const handleTransferConfirmation = async () => {
    if (!transferForm.lastFiveDigits || !transferForm.transferAmount) {
      alert('請填寫完整的轉帳資訊');
      return;
    }

    setIsSubmitting(true);
    try {
      const message = `
轉帳確認通知

訂單編號：${order.id}
匯款後五碼：${transferForm.lastFiveDigits}
轉帳金額：NT$ ${parseInt(transferForm.transferAmount).toLocaleString()}
應付金額：NT$ ${(bill?.amount ?? order.totalAmount).toLocaleString()}
聯絡備註：${transferForm.note ?? '無'}

請協助確認轉帳並處理訂單。
      `.trim();

      await shareToLine(message);

      // 可以在這裡添加成功提示
      alert('轉帳確認已發送至主辦方！');
    } catch (error) {
      console.error('發送轉帳確認失敗:', error);
      alert('發送失敗，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-gray-50 rounded-lg p-4 space-y-4'>
      <h4 className='text-md font-semibold text-gray-900 mb-3'>轉帳確認資訊</h4>

      <div className='space-y-3'>
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            匯款後五碼 *
          </label>
          <Input
            type='text'
            placeholder='請輸入匯款後五碼'
            value={transferForm.lastFiveDigits}
            onChange={e => handleFormChange('lastFiveDigits', e.target.value)}
            maxLength={5}
            className='w-full'
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            轉帳金額 *
          </label>
          <Input
            type='number'
            placeholder='轉帳金額'
            value={transferForm.transferAmount}
            onChange={e => handleFormChange('transferAmount', e.target.value)}
            className='w-full'
          />
          <p className='text-xs text-gray-500 mt-1'>
            應付金額：NT$ {(bill?.amount ?? order.totalAmount).toLocaleString()}
          </p>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            聯絡主辦方備註
          </label>
          <Input
            type='text'
            placeholder='有任何問題或備註請填寫（選填）'
            value={transferForm.note}
            onChange={e => handleFormChange('note', e.target.value)}
            className='w-full'
          />
        </div>
      </div>

      <Button
        onClick={handleTransferConfirmation}
        disabled={
          isSubmitting ||
          !transferForm.lastFiveDigits ||
          !transferForm.transferAmount
        }
        className='w-full bg-green-600 hover:bg-green-700'
      >
        {isSubmitting ? '發送中...' : '確認轉帳'}
      </Button>
    </div>
  );
}
