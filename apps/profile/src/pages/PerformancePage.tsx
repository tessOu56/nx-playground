import { Button } from '@nx-playground/ui-components';
import {
  memo,
  useMemo,
  useCallback,
  useState,
  lazy,
  Suspense,
  type ReactElement,
} from 'react';

// Lazy loaded component
const HeavyComponent = lazy(
  () =>
    new Promise<{ default: () => ReactElement }>(resolve => {
      setTimeout(() => {
        resolve({
          default: () => (
            <div className='bg-purple-50 p-4 rounded'>
              <p className='text-purple-700'>✅ Heavy Component 已載入！</p>
            </div>
          ),
        });
      }, 1000);
    })
);

// Memoized component
const ExpensiveComponent = memo(({ value }: { value: number }) => {
  console.log('ExpensiveComponent rendered');
  return (
    <div className='bg-blue-50 p-3 rounded'>
      <p className='text-sm text-blue-700'>Rendered value: {value}</p>
    </div>
  );
});
ExpensiveComponent.displayName = 'ExpensiveComponent';

export function PerformancePage() {
  const [count, setCount] = useState(0);
  const [input, setInput] = useState('');
  const [showHeavy, setShowHeavy] = useState(false);

  // useMemo - 計算值快取
  const expensiveCalculation = useMemo(() => {
    console.log('Running expensive calculation...');
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += i;
    }
    return result;
  }, [count]); // 只有 count 變化時才重新計算

  // useCallback - 函數引用穩定
  const handleClick = useCallback(() => {
    console.log('Button clicked');
  }, []); // 空依賴，函數引用永遠不變

  return (
    <div className='px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        Performance 優化展示
      </h1>

      <div className='space-y-8'>
        {/* React.memo */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-blue-600 mb-4'>
            🎯 React.memo - 組件記憶化
          </h2>
          <p className='text-gray-700 mb-4'>
            避免不必要的重新渲染，只在 props 變化時更新
          </p>
          <div className='space-y-4'>
            <div className='flex gap-4 items-center'>
              <Button onClick={() => setCount(count + 1)}>
                觸發 count: {count}
              </Button>
              <input
                type='text'
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder='輸入文字（不會觸發子組件重渲染）'
                className='px-4 py-2 border rounded'
              />
            </div>
            <ExpensiveComponent value={count} />
            <p className='text-sm text-gray-600'>
              💡 打開 Console 查看：輸入文字時，ExpensiveComponent 不會重新渲染
            </p>
          </div>
          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm'>
              {`const ExpensiveComponent = memo(({ value }) => {
  console.log('Rendered'); // 只在 value 變化時執行
  return <div>{value}</div>;
});`}
            </pre>
          </div>
        </div>

        {/* useMemo */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-green-600 mb-4'>
            🧮 useMemo - 計算值快取
          </h2>
          <p className='text-gray-700 mb-4'>
            快取昂貴的計算結果，避免每次渲染都重新計算
          </p>
          <div className='space-y-4'>
            <div className='bg-blue-50 border border-blue-200 p-4 rounded'>
              <p className='font-semibold text-blue-900'>計算結果</p>
              <p className='text-2xl font-bold text-blue-600'>
                {expensiveCalculation.toLocaleString()}
              </p>
            </div>
            <p className='text-sm text-gray-600'>
              💡 打開 Console：輸入文字時不會重新計算，只有 count 變化才會計算
            </p>
          </div>
          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm'>
              {`const result = useMemo(() => {
  // 昂貴的計算
  return heavyComputation(dependency);
}, [dependency]); // 只在 dependency 變化時重新計算`}
            </pre>
          </div>
        </div>

        {/* useCallback */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>
            🔗 useCallback - 函數引用穩定
          </h2>
          <p className='text-gray-700 mb-4'>
            避免子組件因為函數引用變化而重新渲染
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`const handleClick = useCallback(() => {
  console.log('Clicked');
}, []); // 函數引用永遠不變

// 傳給 memo 組件時，不會觸發重新渲染
<MemoizedChild onClick={handleClick} />`}
            </pre>
          </div>
        </div>

        {/* Lazy Loading */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-orange-600 mb-4'>
            ⚡ Lazy Loading - 動態導入
          </h2>
          <p className='text-gray-700 mb-4'>
            按需載入組件，減少初始 bundle 大小
          </p>
          <div className='space-y-4'>
            <Button variant='primary' onClick={() => setShowHeavy(!showHeavy)}>
              {showHeavy ? '隱藏' : '載入'} Heavy Component
            </Button>

            {showHeavy && (
              <Suspense
                fallback={
                  <div className='bg-gray-100 p-4 rounded'>
                    <p className='text-gray-600'>🔄 載入中...</p>
                  </div>
                }
              >
                <HeavyComponent />
              </Suspense>
            )}
          </div>

          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}`}
            </pre>
          </div>
        </div>

        {/* Code Splitting */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-cyan-600 mb-4'>
            📦 Code Splitting - 代碼分割
          </h2>
          <p className='text-gray-700 mb-4'>
            Vite 自動進行代碼分割，優化載入性能
          </p>
          <div className='space-y-4'>
            <div className='bg-gray-50 p-4 rounded'>
              <p className='font-semibold mb-2'>Vite 配置範例：</p>
              <pre className='text-sm overflow-x-auto'>
                {`// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('@radix-ui')) return 'vendor-radix';
            return 'vendor-other';
          }
          if (id.includes('/features/dashboard/')) {
            return 'feature-dashboard';
          }
        },
      },
    },
  },
});`}
              </pre>
            </div>

            <div className='bg-blue-50 border border-blue-200 p-4 rounded'>
              <p className='text-sm text-blue-700'>
                ✅ 本專案的 profile app 已配置代碼分割
                <br />
                ✅ vendor-react, vendor-radix, vendor-other 自動分離
                <br />
                ✅ ui-components, design-system 獨立 chunks
                <br />✅ 減少初始載入時間，按需載入
              </p>
            </div>
          </div>
        </div>

        {/* Virtualization */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-red-600 mb-4'>
            📜 Virtualization - 虛擬滾動
          </h2>
          <p className='text-gray-700 mb-4'>
            只渲染可見區域的項目，處理大量數據列表
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`import { useVirtualizer } from '@tanstack/react-virtual';

function LargeList({ items }) {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50, // 每項高度
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: virtualRow.size,
              transform: \`translateY(\${virtualRow.start}px)\`,
            }}
          >
            {items[virtualRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>

        {/* Best Practices */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            ✅ 性能優化最佳實踐
          </h2>
          <ul className='space-y-3 text-gray-700'>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>使用 React.memo</strong> - 避免不必要的重新渲染
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>useMemo 快取計算</strong> - 避免昂貴的重複計算
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>useCallback 穩定引用</strong> - 避免子組件重渲染
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>Lazy Loading</strong> - 按需載入組件
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>Code Splitting</strong> - 分割代碼包
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>Virtualization</strong> - 虛擬滾動處理大列表
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>避免內聯對象/函數</strong> - 減少不必要的重新創建
              </div>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-600 font-bold'>✓</span>
              <div>
                <strong>使用 key 優化列表</strong> - 幫助 React 識別變化
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
