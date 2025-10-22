import { I18nProvider } from '@nx-playground/i18n';
import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from './components/layout';
import { NotFoundPage } from './features/404';
import { AppsPage } from './features/apps';
import { BlogListPage, BlogPostPage } from './features/blogs';
import { AppDetailPage, LibDetailPage } from './features/detail';
import { HomePage } from './features/home';
import { LibsPage } from './features/libs';
import { SearchPage } from './features/search';
import { useScrollToTop } from './hooks/useScrollToTop';
import { LocaleRouter } from './lib/i18n';

function AppContent() {
  useScrollToTop();
  
  return (
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
                <Route path='/search' element={<SearchPage />} />
                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </LocaleRouter>
        }
      />

      {/* Fallback to default locale (en) */}
      <Route path='*' element={<Navigate to='/en' replace />} />
    </Routes>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
}

export default App;
