import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to NX Playground
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          探索 Nx Monorepo 和現代前端技術
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Nx Showcase Card */}
        <Link
          to="/nx"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              Nx
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-900">Nx Features</h2>
          </div>
          <p className="text-gray-600">
            了解 Nx 的強大功能：依賴圖、快取、增量構建、affected 等
          </p>
        </Link>

        {/* React Showcase Card */}
        <Link
          to="/react"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              ⚛️
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-900">React 19</h2>
          </div>
          <p className="text-gray-600">
            探索 React 19 的新功能：Hooks、Suspense、Server Components 等
          </p>
        </Link>

        {/* Design System Card */}
        <Link
          to="/design-system"
          className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              🎨
            </div>
            <h2 className="ml-4 text-2xl font-bold text-gray-900">Design System</h2>
          </div>
          <p className="text-gray-600">
            查看設計系統組件、主題配置和 Tailwind CSS 整合
          </p>
        </Link>
      </div>

      {/* Tech Stack Section */}
      <div className="mt-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          技術棧
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">Nx 21</div>
            <div className="text-sm text-gray-600">Monorepo Tools</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-2">React 19</div>
            <div className="text-sm text-gray-600">UI Framework</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">TypeScript</div>
            <div className="text-sm text-gray-600">Type Safety</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-orange-600 mb-2">Vite 6</div>
            <div className="text-sm text-gray-600">Build Tool</div>
          </div>
        </div>
      </div>
    </div>
  );
}
