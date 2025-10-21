import { I18nProvider } from '@nx-playground/i18n';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/Layout';
import { AppDetailPage, AppsPage } from './features/apps';
import { BlogListPage, BlogPostPage } from './features/blog';
import { HomePage } from './features/home';
import { LibsPage } from './features/libs';
import { LocaleRouter } from './lib/i18n';

function App() {
  return (
    <I18nProvider>
      <Routes>
        {/* Redirect root to default locale */}
        <Route path='/' element={<Navigate to='/zh-TW' replace />} />

        {/* Locale-based routes */}
        <Route
          path='/:locale/*'
          element={
            <LocaleRouter>
              <Layout>
                <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='/apps' element={<AppsPage />} />
                  <Route path='/apps/:appId' element={<AppDetailPage />} />
                  <Route path='/libs' element={<LibsPage />} />
                  <Route path='/blog' element={<BlogListPage />} />
                  <Route path='/blog/:slug' element={<BlogPostPage />} />
                </Routes>
              </Layout>
            </LocaleRouter>
          }
        />

        {/* Fallback to default locale */}
        <Route path='*' element={<Navigate to='/zh-TW' replace />} />
      </Routes>
    </I18nProvider>
  );
}

export default App;
