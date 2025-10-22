import { I18nProvider } from '@nx-playground/i18n';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout';
import { AppsPage } from './features/apps';
import { BlogListPage, BlogPostPage } from './features/blogs';
import { AppDetailPage, LibDetailPage } from './features/detail';
import { HomePage } from './features/home';
import { LibsPage } from './features/libs';
import { LocaleRouter } from './lib/i18n';

function App() {
  return (
    <I18nProvider>
      <Routes>
        {/* Redirect root to default locale (en) */}
        <Route path='/' element={<Navigate to='/en' replace />} />

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
                  <Route path='/libs/:libId' element={<LibDetailPage />} />
                  <Route path='/blogs' element={<BlogListPage />} />
                  <Route path='/blogs/:slug' element={<BlogPostPage />} />
                </Routes>
              </Layout>
            </LocaleRouter>
          }
        />

        {/* Fallback to default locale (en) */}
        <Route path='*' element={<Navigate to='/en' replace />} />
      </Routes>
    </I18nProvider>
  );
}

export default App;
