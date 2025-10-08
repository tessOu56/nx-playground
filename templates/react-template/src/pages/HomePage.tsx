import { Button } from '@nx-playground/ui-components';

export function HomePage() {
  return (
    <div className="px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to {{PROJECT_TITLE}}
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Start building your amazing React application
        </p>
        <Button variant="primary" size="lg">
          Get Started
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Quick Start
          </h2>
          <div className="space-y-4 text-gray-700">
            <p>
              This project is built with <strong>React 19</strong>, <strong>TypeScript</strong>, 
              and <strong>Vite</strong> in an <strong>Nx Monorepo</strong>.
            </p>
            <p>
              You have access to all shared libraries:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>@nx-playground/ui-components</code> - UI component library</li>
              <li><code>@nx-playground/design-system</code> - Design tokens & themes</li>
              <li><code>@nx-playground/i18n</code> - Internationalization</li>
              <li><code>@nx-playground/hooks</code> - Custom React hooks</li>
              <li><code>@nx-playground/api-client</code> - API client</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
