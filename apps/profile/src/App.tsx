import { Routes, Route } from 'react-router-dom';

import { Layout } from './components/Layout';
import { ApiIntegrationPage } from './pages/ApiIntegrationPage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { HomePage } from './pages/HomePage';
import { NxShowcasePage } from './pages/NxShowcasePage';
import { PerformancePage } from './pages/PerformancePage';
import { ReactShowcasePage } from './pages/ReactShowcasePage';
import { StateManagementPage } from './pages/StateManagementPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/nx' element={<NxShowcasePage />} />
        <Route path='/react' element={<ReactShowcasePage />} />
        <Route path='/design-system' element={<DesignSystemPage />} />
        <Route path='/api' element={<ApiIntegrationPage />} />
        <Route path='/state' element={<StateManagementPage />} />
        <Route path='/performance' element={<PerformancePage />} />
      </Routes>
    </Layout>
  );
}

export default App;
