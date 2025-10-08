import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { IconContext } from 'react-icons';
import { Toaster, toast } from 'sonner';
import { ErrorBoundary } from './api/ErrorBoundary';
import './main.css';
import App from './route';
// 設定全域錯誤監聽
window.onerror = function (message, source, lineno, colno, error) {
  toast.error(`錯誤：${message}`, { duration: Infinity, closeButton: true });
  if (typeof message === 'string' && message.includes('跨域')) {
    toast.warning('⚠️ 嘗試跳轉，但發生跨域錯誤！', {
      duration: Infinity,
      closeButton: true,
    });
  }
};
const originalWarn = console.warn;
console.warn = function (...args) {
  originalWarn.apply(console, args); // 保持原本的 `console.warn()` 功能
  toast.warning(`⚠️ ${args.join(' ')}`, {
    duration: Infinity,
    closeButton: true,
  }); // 用 sonner 顯示警告
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <IconContext.Provider value={{ size: '20', color: 'black' }}>
    <React.StrictMode>
      <ErrorBoundary>
        <Toaster
          position='top-left'
          richColors
          toastOptions={{
            className: 'whitespace-pre-line',
          }}
        />
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  </IconContext.Provider>
);
