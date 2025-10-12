import { useAsync } from '@nx-playground/hooks';
import { Button } from '@nx-playground/ui-components';
import { useState } from 'react';

export function ApiIntegrationPage() {
  const [userId, setUserId] = useState('1');

  const { execute, data, isLoading, error, isSuccess } = useAsync(
    async (id: string) => {
      // 模擬 API 調用
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'Developer',
      };
    }
  );

  return (
    <div className='px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        API Integration 展示
      </h1>

      <div className='space-y-8'>
        {/* React Query Integration */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-blue-600 mb-4'>
            📡 React Query 整合
          </h2>
          <p className='text-gray-700 mb-4'>
            使用 @tanstack/react-query 進行數據獲取和快取管理
          </p>
          <div className='bg-gray-50 p-4 rounded space-y-2'>
            <pre className='text-sm overflow-x-auto'>
              {`import { useQuery } from '@tanstack/react-query';

function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (error) return <Error />;
  return <div>{data.name}</div>;
}`}
            </pre>
          </div>
        </div>

        {/* useAsync Hook Demo */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-green-600 mb-4'>
            🎣 useAsync Hook 演示
          </h2>
          <p className='text-gray-700 mb-4'>
            自定義 useAsync hook 簡化異步操作處理
          </p>

          <div className='space-y-4'>
            <div className='flex gap-4 items-center'>
              <input
                type='text'
                value={userId}
                onChange={e => setUserId(e.target.value)}
                placeholder='輸入 User ID'
                className='px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <Button
                variant='primary'
                onClick={() => execute(userId)}
                disabled={isLoading}
              >
                {isLoading ? '載入中...' : '獲取用戶'}
              </Button>
            </div>

            {isLoading && (
              <div className='bg-blue-50 border border-blue-200 p-4 rounded'>
                <p className='text-blue-700'>🔄 正在載入數據...</p>
              </div>
            )}

            {error && (
              <div className='bg-red-50 border border-red-200 p-4 rounded'>
                <p className='text-red-700'>❌ 錯誤: {error.message}</p>
              </div>
            )}

            {isSuccess && data && (
              <div className='bg-green-50 border border-green-200 p-4 rounded'>
                <p className='text-green-700 font-semibold mb-2'>
                  ✅ 數據載入成功
                </p>
                <div className='text-sm space-y-1'>
                  <p>ID: {data.id}</p>
                  <p>Name: {data.name}</p>
                  <p>Email: {data.email}</p>
                  <p>Role: {data.role}</p>
                </div>
              </div>
            )}
          </div>

          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <p className='text-xs text-gray-600 font-semibold mb-2'>
              Hook 使用範例:
            </p>
            <pre className='text-xs overflow-x-auto'>
              {`const { execute, data, isLoading, error } = useAsync(
  async (id) => {
    const res = await fetch(\`/api/users/\${id}\`);
    return res.json();
  }
);

// 觸發執行
execute(userId);`}
            </pre>
          </div>
        </div>

        {/* API Client */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>
            🔌 API Client 配置
          </h2>
          <p className='text-gray-700 mb-4'>
            使用 @nx-playground/api-client 統一管理 API 調用
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`import { apiClient } from '@nx-playground/api-client';

// 自動處理認證
apiClient.defaults.headers.common['Authorization'] = \`Bearer \${token}\`;

// 請求攔截器
apiClient.interceptors.request.use((config) => {
  console.log('Request:', config.url);
  return config;
});

// 響應攔截器
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 處理未授權
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);`}
            </pre>
          </div>
        </div>

        {/* Error Handling */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-orange-600 mb-4'>
            ⚠️ 錯誤處理
          </h2>
          <p className='text-gray-700 mb-4'>統一的錯誤處理策略</p>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded'>
              <p className='font-semibold mb-2'>錯誤類型識別</p>
              <pre className='text-sm overflow-x-auto'>
                {`import { isApiError, getErrorMessage } from '@nx-playground/api-client';

try {
  await apiCall();
} catch (error) {
  if (isApiError(error)) {
    // API 錯誤
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  } else {
    // 一般錯誤
    console.error(getErrorMessage(error));
  }
}`}
              </pre>
            </div>

            <div className='bg-gray-50 p-4 rounded'>
              <p className='font-semibold mb-2'>全局錯誤處理</p>
              <pre className='text-sm overflow-x-auto'>
                {`// 使用 React Query 的全局錯誤處理
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        toast.error('載入失敗', getErrorMessage(error));
      },
    },
    mutations: {
      onError: (error) => {
        toast.error('操作失敗', getErrorMessage(error));
      },
    },
  },
});`}
              </pre>
            </div>
          </div>
        </div>

        {/* Caching Strategy */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-cyan-600 mb-4'>💾 快取策略</h2>
          <ul className='space-y-2 text-gray-700'>
            <li>
              ✅ <strong>staleTime</strong> - 數據保鮮時間
            </li>
            <li>
              ✅ <strong>cacheTime</strong> - 快取保留時間
            </li>
            <li>
              ✅ <strong>refetchOnWindowFocus</strong> - 視窗聚焦重新獲取
            </li>
            <li>
              ✅ <strong>refetchInterval</strong> - 定期重新獲取
            </li>
            <li>
              ✅ <strong>Optimistic Updates</strong> - 樂觀更新
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
