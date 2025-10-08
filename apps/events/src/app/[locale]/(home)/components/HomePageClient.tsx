'use client';

import { useState, useEffect, useCallback } from 'react';

import { Button, Image } from '@/components';
import { useLiff, isLineEnvironment, isLiffEnvironment } from '@/libs';
import { useLocalizedRouter } from '@/libs/i18n';

export function HomePageClient() {
  const router = useLocalizedRouter();
  const { isInitialized, login, logout, error, isLoggedIn, userInfo } =
    useLiff();

  // 導航處理函數
  const handleNavigation = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handleLineLogin = () => {
    if (isInitialized) {
      login();
    }
  };

  // 使用 useState 來避免 Hydration 錯誤
  const [envInfo, setEnvInfo] = useState({
    type: 'unknown',
    label: '未知環境',
    color: 'text-gray-600',
  });

  // 在客戶端渲染後更新環境信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isLiffEnvironment()) {
        setEnvInfo({
          type: 'liff',
          label: 'LINE 應用內',
          color: 'text-green-600',
        });
      } else if (isLineEnvironment()) {
        setEnvInfo({
          type: 'line',
          label: '普通瀏覽器',
          color: 'text-blue-600',
        });
      } else {
        setEnvInfo({
          type: 'unknown',
          label: '未知環境',
          color: 'text-gray-600',
        });
      }
    }
  }, []);

  // 如果 LIFF 初始化失敗，顯示簡化的錯誤狀態
  if (error) {
    return (
      <div className='text-center'>
        <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto'>
          <h3 className='text-lg font-semibold text-red-900 mb-2'>
            LINE 登入失敗
          </h3>
          <p className='text-sm text-red-700'>{error}</p>
        </div>
      </div>
    );
  }

  // 統一的容器結構，避免登入前後 CSS 不同
  return (
    <div className='text-center max-w-2xl mx-auto'>
      {/* 環境信息 - 始終顯示 */}
      <div className='bg-white rounded-lg p-4 mb-6 shadow-sm'>
        <div className='text-center'>
          <p className={`text-sm font-medium ${envInfo.color}`}>
            {envInfo.label}
          </p>
        </div>
      </div>

      {/* 登入狀態區域 */}
      {isLoggedIn && userInfo ? (
        // 已登入狀態
        <div className='bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8 mb-6 shadow-lg'>
          <div className='text-4xl mb-4'>歡迎</div>
          <h3 className='text-2xl font-bold text-green-900 mb-6'>歡迎回來！</h3>

          {/* 用戶基本信息 */}
          <div className='bg-white rounded-lg p-6 mb-6 shadow-sm'>
            <div className='flex items-center justify-center space-x-4 mb-6'>
              <Image
                src={
                  userInfo.profile?.pictureUrl ??
                  'https://via.placeholder.com/64'
                }
                alt='用戶頭像'
                width={64}
                height={64}
                className='w-16 h-16 rounded-full border-4 border-green-200'
              />
              <div className='text-left'>
                <p className='text-xl font-bold text-green-900'>
                  {userInfo.profile?.displayName ?? 'LINE 用戶'}
                </p>
                <p className='text-sm text-green-700'>
                  {userInfo.profile?.statusMessage ?? '歡迎使用 NX Playground Events'}
                </p>
              </div>
            </div>

            {/* 詳細用戶資訊 */}
            <div className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                <div className='bg-gray-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>用戶 ID：</span>
                  <span className='font-mono text-gray-900 break-all'>
                    {userInfo.profile?.userId ?? 'N/A'}
                  </span>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>顯示名稱：</span>
                  <span className='text-gray-900'>
                    {userInfo.profile?.displayName ?? 'N/A'}
                  </span>
                </div>
                <div className='bg-gray-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>環境：</span>
                  <span className={envInfo.color}>{envInfo.label}</span>
                </div>
              </div>

              {/* 狀態訊息 */}
              {userInfo.profile?.statusMessage && (
                <div className='bg-blue-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>狀態訊息：</span>
                  <span className='text-blue-900 ml-2'>
                    {userInfo.profile.statusMessage}
                  </span>
                </div>
              )}

              {/* Access Token 資訊 */}
              {userInfo.accessToken && (
                <div className='bg-yellow-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>
                    Access Token：
                  </span>
                  <div className='mt-1'>
                    <code className='text-xs text-yellow-800 bg-yellow-100 px-2 py-1 rounded break-all'>
                      {userInfo.accessToken.substring(0, 20)}...
                    </code>
                    <p className='text-xs text-yellow-700 mt-1'>
                      有效期：{userInfo.accessToken ? '已獲取' : '未獲取'}
                    </p>
                  </div>
                </div>
              )}

              {/* ID Token 資訊 */}
              {userInfo.idToken && (
                <div className='bg-purple-50 p-3 rounded-lg'>
                  <span className='text-gray-600 font-medium'>ID Token：</span>
                  <div className='mt-1'>
                    <code className='text-xs text-purple-800 bg-purple-100 px-2 py-1 rounded break-all'>
                      {userInfo.idToken.substring(0, 20)}...
                    </code>
                    <p className='text-xs text-purple-700 mt-1'>
                      身份驗證：已驗證
                    </p>
                  </div>
                </div>
              )}

              {/* 其他 LIFF 資訊 */}
              <div className='bg-gray-50 p-3 rounded-lg'>
                <span className='text-gray-600 font-medium'>LIFF 資訊：</span>
                <div className='mt-2 space-y-1 text-xs'>
                  <div>
                    <span className='text-gray-500'>初始化狀態：</span>
                    <span
                      className={
                        isInitialized ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {isInitialized ? '已初始化' : '未初始化'}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500'>登入狀態：</span>
                    <span
                      className={isLoggedIn ? 'text-green-600' : 'text-red-600'}
                    >
                      {isLoggedIn ? '已登入' : '未登入'}
                    </span>
                  </div>
                  <div>
                    <span className='text-gray-500'>環境類型：</span>
                    <span className='text-gray-900'>{envInfo.type}</span>
                  </div>
                </div>
              </div>

              {/* 完整的 UserInfo 物件顯示（開發用） */}
              <details className='bg-gray-50 p-3 rounded-lg'>
                <summary className='text-gray-600 font-medium cursor-pointer hover:text-gray-800'>
                  完整用戶資訊 (點擊展開)
                </summary>
                <div className='mt-3 bg-gray-100 p-3 rounded text-xs'>
                  <pre className='whitespace-pre-wrap break-all text-gray-800'>
                    {JSON.stringify(userInfo, null, 2)}
                  </pre>
                </div>
              </details>
            </div>
          </div>

          {/* 功能按鈕 */}
          <div className='grid grid-cols-1 sm:grid-cols-4 gap-3'>
            <Button
              onClick={() => handleNavigation('/orders')}
              variant='primary'
              className='bg-purple-600 hover:bg-purple-700'
            >
              我的訂單
            </Button>
            <Button onClick={logout} variant='destructive'>
              登出
            </Button>
          </div>
        </div>
      ) : (
        // 未登入狀態
        <div className='bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-xl'>
          <div className='text-6xl mb-6'>登入</div>
          <h3 className='text-2xl font-bold text-green-900 mb-4'>LINE 登入</h3>

          <p className='text-gray-600 mb-8'>
            使用您的 LINE 帳號登入，開始探索精彩活動
          </p>

          <Button
            onClick={handleLineLogin}
            disabled={!isInitialized}
            className='w-full px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105'
          >
            {isInitialized ? <>立即登入 LINE</> : <>初始化中...</>}
          </Button>

          {!isInitialized && (
            <p className='text-sm text-gray-500 mt-4'>
              正在準備登入環境，請稍候...
            </p>
          )}
        </div>
      )}
    </div>
  );
}
