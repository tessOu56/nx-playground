import { usePageTracking } from '@nx-playground/analytics';
import { I18nProvider } from '@nx-playground/i18n';
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { Layout } from './components/layout';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useScrollToTop } from './hooks/useScrollToTop';
import { LocaleRouter } from './lib/i18n';

// Lazy load pages for code splitting
const HomePage = lazy(() =>
  import('./features/home').then(m => ({ default: m.HomePage }))
);
const ProjectsPage = lazy(() =>
  import('./features/projects').then(m => ({ default: m.ProjectsPage }))
);
const BlogListPage = lazy(() =>
  import('./features/blogs').then(m => ({ default: m.BlogListPage }))
);
const BlogPostPage = lazy(() =>
  import('./features/blogs').then(m => ({ default: m.BlogPostPage }))
);
const SearchPage = lazy(() =>
  import('./features/search').then(m => ({ default: m.SearchPage }))
);
const AppDetailPage = lazy(() =>
  import('./features/projects').then(m => ({ default: m.AppDetailPage }))
);
const LibDetailPage = lazy(() =>
  import('./features/projects').then(m => ({ default: m.LibDetailPage }))
);
const NotFoundPage = lazy(() =>
  import('./features/404').then(m => ({ default: m.NotFoundPage }))
);

function AppContent() {
  const location = useLocation();
  useScrollToTop();

  // Track page views automatically
  usePageTracking(location.pathname);

  return (
    <Routes>
      {/* Redirect root to default locale (en) */}
      <Route path='/' element={<Navigate to='/en' replace />} />

      {/* Locale-based routes */}
      <Route
        path='/:locale/*'
        element={
          <LocaleRouter>
            <Suspense
              fallback={
                <div className='min-h-screen flex items-center justify-center'>
                  <LoadingSpinner size='lg' color='purple' text='Loading...' />
                </div>
              }
            >
              <Routes>
                {/* Home - no footer in Layout */}
                <Route
                  path='/'
                  element={
                    <Layout showFooter={false}>
                      <HomePage />
                    </Layout>
                  }
                />
                {/* Search - no footer in Layout */}
                <Route
                  path='/search'
                  element={
                    <Layout showFooter={false}>
                      <SearchPage />
                    </Layout>
                  }
                />
                {/* Projects - show footer */}
                <Route
                  path='/projects'
                  element={
                    <Layout>
                      <ProjectsPage />
                    </Layout>
                  }
                />
                <Route
                  path='/projects/:projectId'
                  element={
                    <Layout>
                      <AppDetailPage />
                    </Layout>
                  }
                />
                {/* Blogs - show footer */}
                <Route
                  path='/blogs'
                  element={
                    <Layout>
                      <BlogListPage />
                    </Layout>
                  }
                />
                <Route
                  path='/blogs/:slug'
                  element={
                    <Layout>
                      <BlogPostPage />
                    </Layout>
                  }
                />
                {/* 404 - show footer */}
                <Route
                  path='*'
                  element={
                    <Layout>
                      <NotFoundPage />
                    </Layout>
                  }
                />
                {/* Legacy redirects */}
                <Route
                  path='/apps'
                  element={<Navigate to='/projects' replace />}
                />
                <Route
                  path='/libs'
                  element={<Navigate to='/projects' replace />}
                />
                <Route
                  path='/apps/:appId'
                  element={<Navigate to='/projects/:appId' replace />}
                />
                <Route
                  path='/libs/:libId'
                  element={<Navigate to='/projects/:libId' replace />}
                />
              </Routes>
            </Suspense>
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
