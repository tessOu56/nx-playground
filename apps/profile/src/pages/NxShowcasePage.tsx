export function NxShowcasePage() {
  return (
    <div className='px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        Nx Monorepo Features
      </h1>

      <div className='space-y-8'>
        {/* Feature: Dependency Graph */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-blue-600 mb-4'>
            📊 依賴圖 (Dependency Graph)
          </h2>
          <p className='text-gray-700 mb-4'>
            Nx 自動分析專案之間的依賴關係，生成可視化的依賴圖。
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <code className='text-sm'>nx graph</code>
            <p className='text-xs text-gray-600 mt-2'>
              在瀏覽器中查看完整的專案依賴關係
            </p>
          </div>
        </div>

        {/* Feature: Caching */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-green-600 mb-4'>
            ⚡ 智能快取 (Caching)
          </h2>
          <p className='text-gray-700 mb-4'>
            Nx 會快取構建、測試和 lint 的結果，避免重複執行相同的任務。
          </p>
          <div className='bg-gray-50 p-4 rounded space-y-2'>
            <div>
              <code className='text-sm'>nx build profile</code>
              <p className='text-xs text-gray-600'>第一次執行會構建並快取</p>
            </div>
            <div>
              <code className='text-sm'>nx build profile</code>
              <p className='text-xs text-gray-600'>第二次執行直接使用快取 🚀</p>
            </div>
          </div>
        </div>

        {/* Feature: Affected */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>
            🎯 受影響檢測 (Affected)
          </h2>
          <p className='text-gray-700 mb-4'>
            Nx 只構建、測試受影響的專案，大幅提升 CI/CD 速度。
          </p>
          <div className='bg-gray-50 p-4 rounded space-y-2'>
            <div>
              <code className='text-sm'>nx affected:build</code>
              <p className='text-xs text-gray-600'>只構建受變更影響的專案</p>
            </div>
            <div>
              <code className='text-sm'>nx affected:test</code>
              <p className='text-xs text-gray-600'>只測試受變更影響的專案</p>
            </div>
          </div>
        </div>

        {/* Feature: Workspace */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-orange-600 mb-4'>
            🏗️ Workspace 管理
          </h2>
          <p className='text-gray-700 mb-4'>
            統一管理多個應用程式和函式庫，共享依賴和配置。
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <ul className='text-sm space-y-1'>
              <li>✅ apps/auth - 認證服務</li>
              <li>✅ apps/console - 控制台</li>
              <li>✅ apps/events - 活動管理</li>
              <li>✅ apps/profile - 技術展示</li>
              <li>✅ apps/angular-dashboard - Angular 應用</li>
              <li>✅ libs/* - 共享函式庫</li>
            </ul>
          </div>
        </div>

        {/* Feature: Generators */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-pink-600 mb-4'>
            ⚙️ 代碼生成器 (Generators)
          </h2>
          <p className='text-gray-700 mb-4'>
            快速生成新的應用程式、函式庫或組件。
          </p>
          <div className='bg-gray-50 p-4 rounded space-y-2'>
            <div>
              <code className='text-sm'>nx g @nx/react:app my-app</code>
              <p className='text-xs text-gray-600'>生成新的 React 應用</p>
            </div>
            <div>
              <code className='text-sm'>nx g @nx/react:lib my-lib</code>
              <p className='text-xs text-gray-600'>生成新的函式庫</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
