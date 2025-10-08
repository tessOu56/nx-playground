import { Button } from '@nx-playground/ui-components';

export function DesignSystemPage() {
  return (
    <div className="px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Design System</h1>

      <div className="space-y-8">
        {/* Buttons */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-20 bg-blue-500 rounded"></div>
              <p className="text-sm font-medium">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-purple-500 rounded"></div>
              <p className="text-sm font-medium">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-green-500 rounded"></div>
              <p className="text-sm font-medium">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-20 bg-red-500 rounded"></div>
              <p className="text-sm font-medium">Danger</p>
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Typography</h2>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <p className="text-base">Body text - Regular paragraph</p>
            <p className="text-sm">Small text</p>
            <p className="text-xs">Extra small text</p>
          </div>
        </div>

        {/* Spacing */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Spacing</h2>
          <p className="text-gray-700 mb-4">
            使用 Tailwind CSS 的間距系統，保持設計一致性。
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500"></div>
              <span className="text-sm">gap-2 (0.5rem)</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 bg-blue-500"></div>
              <span className="text-sm">gap-4 (1rem)</span>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-8 h-8 bg-blue-500"></div>
              <span className="text-sm">gap-8 (2rem)</span>
            </div>
          </div>
        </div>

        {/* Design Tokens */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Design Tokens</h2>
          <p className="text-gray-700 mb-4">
            使用 Style Dictionary 生成的設計令牌，支援多主題切換。
          </p>
          <div className="bg-gray-50 p-4 rounded">
            <code className="text-sm">
              @nx-playground/design-system/tokens
            </code>
            <ul className="mt-4 text-sm space-y-1">
              <li>✅ Base Theme - 基礎主題</li>
              <li>✅ Enterprise Theme - 企業主題</li>
              <li>✅ Monochrome Theme - 單色主題</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
