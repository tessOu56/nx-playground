import { useState } from 'react';
import { useDebounce } from '@nx-playground/hooks';

export function ReactShowcasePage() {
  const [count, setCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);

  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">React 19 Showcase</h1>

      <div className="space-y-8">
        {/* Hooks Demo */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-cyan-600 mb-4">🪝 React Hooks</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">useState Example</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCount(count - 1)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  -
                </button>
                <span className="text-2xl font-bold">{count}</span>
                <button
                  onClick={() => setCount(count + 1)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Custom Hook: useDebounce</h3>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="輸入文字..."
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 text-sm">
                <p className="text-gray-600">即時輸入: {searchTerm}</p>
                <p className="text-gray-600">防抖後 (500ms): {debouncedSearch}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Component Composition */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">🧩 組件組合</h2>
          <p className="text-gray-700 mb-4">
            React 的組件化架構讓代碼更容易維護和重用。
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <pre className="text-sm overflow-x-auto">
{`// 從共享函式庫導入組件
import { Button } from '@nx-playground/ui-components';
import { useTranslation } from '@nx-playground/i18n';
import { useDebounce } from '@nx-playground/hooks';

// 組合成新的功能
function MyFeature() {
  const { t } = useTranslation();
  const [value, setValue] = useState('');
  const debounced = useDebounce(value, 300);
  
  return <Button>{t('submit')}</Button>;
}`}
            </pre>
          </div>
        </div>

        {/* Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-green-600 mb-4">⚡ 性能優化</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>React.memo</strong> - 組件記憶化</li>
            <li>✅ <strong>useMemo</strong> - 計算值快取</li>
            <li>✅ <strong>useCallback</strong> - 函數引用穩定</li>
            <li>✅ <strong>Lazy Loading</strong> - 動態導入組件</li>
            <li>✅ <strong>Code Splitting</strong> - Vite 自動代碼分割</li>
          </ul>
        </div>

        {/* State Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">🗃️ 狀態管理</h2>
          <p className="text-gray-700 mb-4">
            本專案使用多種狀態管理方案：
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Zustand</strong> - 輕量級全局狀態管理</li>
            <li>✅ <strong>React Query</strong> - 服務端狀態管理</li>
            <li>✅ <strong>Context API</strong> - 主題和認證</li>
            <li>✅ <strong>useState/useReducer</strong> - 本地狀態</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
