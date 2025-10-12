'use client';

import { useLocale } from 'next-intl';

import { Badge, Button, Card, CardContent } from '@/components';
import { getPageNumbersWithLocale } from '@/libs';

export function UserFlowSection() {
  const locale = useLocale();
  const pageNumbers = getPageNumbersWithLocale(locale);

  // 定義用戶流程頁面的順序
  const userFlowPages = [
    'home',
    'vendor-detail',
    'event-detail',
    'checkout',
    'order',
    'registration',
    'feedback',
    'ticket-detail',
  ];

  // 獲取用戶流程頁面配置
  const userFlowData = userFlowPages
    .map(key => ({ key, page: pageNumbers.allPages[key] }))
    .filter(({ page }) => page);

  return (
    <section className='py-24 bg-gray-50'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-2xl text-center'>
          <h2 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
            {locale === 'en' ? 'User Flow' : '用戶流程'}
          </h2>
          <p className='mt-4 text-lg leading-8 text-gray-600'>
            {locale === 'en'
              ? 'From discovering vendors to completing event check-in, we provide a complete event experience flow'
              : '從發現主辦方到完成活動報到，我們提供完整的活動體驗流程'}
          </p>
        </div>

        <div className='mt-16 space-y-6'>
          {userFlowData.map(({ key, page }) => (
            <Card
              key={key}
              className='border-0 shadow-md hover:shadow-lg transition-shadow'
            >
              <CardContent className='p-6'>
                <div className='flex items-center space-x-6'>
                  <div className='flex-shrink-0'>
                    <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center'>
                      <span className='text-xl font-bold text-blue-600'>
                        {page.number}
                      </span>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <h3 className='text-xl font-semibold text-gray-900'>
                        {page.title}
                      </h3>
                      <Badge>
                        {page.isPublic
                          ? locale === 'en'
                            ? 'Public'
                            : '公開'
                          : locale === 'en'
                          ? 'Login'
                          : '登入'}
                      </Badge>
                    </div>
                    <p className='text-gray-600 mb-3'>{page.description}</p>
                    <div className='flex items-center space-x-4 text-sm text-gray-500'>
                      <span>
                        {locale === 'en' ? 'Path' : '路徑'}: {page.path}
                      </span>
                      <span>•</span>
                      <span>
                        SEO:{' '}
                        {page.seo?.title ??
                          (locale === 'en' ? 'Not set' : '未設定')}
                      </span>
                    </div>
                  </div>
                  <div className='flex-shrink-0'>
                    <Button variant='outline' size='sm'>
                      {locale === 'en' ? 'View Details' : '查看詳情'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
