import { useLocalStorage, useModal } from '@nx-playground/hooks';
import { Button } from '@nx-playground/ui-components';
import { useState } from 'react';

export function StateManagementPage() {
  const [count, setCount] = useState(0);
  const [settings, setSettings] = useLocalStorage('demo-settings', {
    theme: 'light',
    notifications: true,
  });
  const modal = useModal();

  return (
    <div className='px-4 py-8'>
      <h1 className='text-3xl font-bold text-gray-900 mb-8'>
        State Management 展示
      </h1>

      <div className='space-y-8'>
        {/* Local State */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-blue-600 mb-4'>
            🎯 Local State (useState)
          </h2>
          <p className='text-gray-700 mb-4'>
            組件內部狀態，最簡單的狀態管理方式
          </p>
          <div className='flex items-center gap-4'>
            <Button variant='outline' onClick={() => setCount(count - 1)}>
              -
            </Button>
            <span className='text-2xl font-bold'>{count}</span>
            <Button variant='primary' onClick={() => setCount(count + 1)}>
              +
            </Button>
            <Button variant='ghost' onClick={() => setCount(0)}>
              重置
            </Button>
          </div>
          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm'>
              {`const [count, setCount] = useState(0);
setCount(count + 1);`}
            </pre>
          </div>
        </div>

        {/* Persistent State */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-green-600 mb-4'>
            💾 Persistent State (useLocalStorage)
          </h2>
          <p className='text-gray-700 mb-4'>
            使用 localStorage 持久化狀態，重新整理後數據不丟失
          </p>
          <div className='space-y-4'>
            <div className='flex items-center gap-4'>
              <label className='font-medium'>主題:</label>
              <Button
                variant={settings.theme === 'light' ? 'primary' : 'outline'}
                onClick={() => setSettings({ ...settings, theme: 'light' })}
              >
                淺色
              </Button>
              <Button
                variant={settings.theme === 'dark' ? 'primary' : 'outline'}
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
              >
                深色
              </Button>
            </div>

            <div className='flex items-center gap-4'>
              <label className='font-medium'>通知:</label>
              <Button
                variant={settings.notifications ? 'primary' : 'outline'}
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: !settings.notifications,
                  })
                }
              >
                {settings.notifications ? '已開啟' : '已關閉'}
              </Button>
            </div>

            <div className='bg-blue-50 border border-blue-200 p-3 rounded'>
              <p className='text-sm text-blue-700'>
                💡 重新整理頁面，設定會保留！目前設定：theme={settings.theme},
                notifications={String(settings.notifications)}
              </p>
            </div>
          </div>

          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`const [settings, setSettings] = useLocalStorage('settings', {
  theme: 'light',
  notifications: true
});

// 數據自動保存到 localStorage
setSettings({ ...settings, theme: 'dark' });`}
            </pre>
          </div>
        </div>

        {/* Modal State */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-purple-600 mb-4'>
            🪟 Modal State (useModal)
          </h2>
          <p className='text-gray-700 mb-4'>簡化 Modal/Dialog 的開關狀態管理</p>
          <div className='space-y-4'>
            <div className='flex gap-4'>
              <Button variant='primary' onClick={modal.open}>
                打開 Modal
              </Button>
              <Button variant='outline' onClick={modal.toggle}>
                切換狀態
              </Button>
            </div>

            <div className='bg-gray-100 p-4 rounded'>
              <p className='text-sm'>
                Modal 狀態: <strong>{modal.isOpen ? '開啟' : '關閉'}</strong>
              </p>
            </div>

            {modal.isOpen && (
              <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                <div className='bg-white p-6 rounded-lg shadow-xl max-w-md w-full'>
                  <h3 className='text-xl font-bold mb-4'>演示 Modal</h3>
                  <p className='text-gray-600 mb-6'>
                    這是使用 useModal hook 管理的 Modal
                  </p>
                  <div className='flex justify-end gap-2'>
                    <Button variant='outline' onClick={modal.close}>
                      取消
                    </Button>
                    <Button variant='primary' onClick={modal.close}>
                      確定
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className='mt-4 bg-gray-50 p-4 rounded'>
            <pre className='text-sm'>
              {`const modal = useModal();

<Button onClick={modal.open}>開啟</Button>
<Dialog open={modal.isOpen} onOpenChange={modal.setOpen}>
  ...
</Dialog>`}
            </pre>
          </div>
        </div>

        {/* Zustand Global State */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-orange-600 mb-4'>
            🗃️ Global State (Zustand)
          </h2>
          <p className='text-gray-700 mb-4'>
            輕量級全局狀態管理，比 Redux 更簡單
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`import { create } from 'zustand';

interface AppStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// 在組件中使用
function UserProfile() {
  const { user, setUser, logout } = useAppStore();

  return (
    <div>
      {user ? (
        <>
          <p>{user.name}</p>
          <button onClick={logout}>登出</button>
        </>
      ) : (
        <button onClick={() => setUser(userData)}>登入</button>
      )}
    </div>
  );
}`}
            </pre>
          </div>
        </div>

        {/* Context API */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-2xl font-bold text-pink-600 mb-4'>
            🎭 Context API
          </h2>
          <p className='text-gray-700 mb-4'>
            React 內建的狀態共享機制，適合主題、認證等跨組件數據
          </p>
          <div className='bg-gray-50 p-4 rounded'>
            <pre className='text-sm overflow-x-auto'>
              {`import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedComponent() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <div>Current theme: {theme}</div>;
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
