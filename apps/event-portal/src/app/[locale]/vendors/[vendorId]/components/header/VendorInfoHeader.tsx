'use client';

import { Image, LineOfficialButton } from '@/components';
import type { Vendor } from '@/types';
import type { LineSettings } from '@/types/line';

interface VendorInfoHeaderProps {
  vendor: Vendor;
  lineSettings: LineSettings | null;
}

export function VendorInfoHeader({
  vendor,
  lineSettings,
}: VendorInfoHeaderProps) {
  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <div className='flex items-start space-x-4'>
        <div className='w-16 h-16 rounded-full overflow-hidden bg-gray-200'>
          <Image
            src={lineSettings?.pictureUrl ?? ''}
            alt={`${lineSettings?.displayName ?? '主辦方'} 頭像`}
            width={64}
            height={64}
            className='w-full h-full object-cover'
            fallback=''
          />
        </div>
        <div className='flex-1'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            {lineSettings?.displayName ?? '主辦方'}
          </h2>
          <p className='text-gray-600 mb-4'>
            {lineSettings?.description ?? ''}
          </p>
        </div>
      </div>

      {/* 聯絡資訊 */}
      <div className='bg-gray-50 rounded-lg p-4 flex items-center space-x-6'>
        <div className='flex items-center'>
          <span className='text-sm text-gray-500 w-8'>信箱</span>
          <span className='text-sm text-gray-700'>
            {vendor.email ?? 'contact@example.com'}
          </span>
        </div>
        <div className='flex items-center'>
          <span className='text-sm text-gray-500 w-16'>轉帳帳戶</span>
          <span className='text-sm text-gray-700'>
            {vendor.defaultBankAccount.bankCode} -{' '}
            {vendor.defaultBankAccount.accountNumber}
          </span>
        </div>
        <div className='flex items-center'>
          <span className='text-sm text-gray-500 w-10'>戶名</span>
          <span className='text-sm text-gray-700'>
            {vendor.defaultBankAccount.accountName}
          </span>
        </div>
        {/* LINE 加入官方頻道按鈕 */}
        {lineSettings && (
          <LineOfficialButton
            officialAccountId={lineSettings.officialAccountId}
          />
        )}
      </div>
    </div>
  );
}
