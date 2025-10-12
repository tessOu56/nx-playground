'use client';

import { useLocalizedRouter } from '@/libs/i18n';

export function NotFoundActions() {
  const router = useLocalizedRouter();

  const handleGoHome = () => {
    router.push('/');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col sm:flex-row gap-3 justify-center'>
        <button
          onClick={handleGoHome}
          className='flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          回到首頁
        </button>
        <button
          onClick={handleGoBack}
          className='flex-1 sm:flex-none px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
        >
          ← 返回上一頁
        </button>
      </div>

      <div className='text-sm text-gray-500 mt-6'>
        <p>如果您認為這是一個錯誤，請聯繫我們</p>
      </div>
    </div>
  );
}
