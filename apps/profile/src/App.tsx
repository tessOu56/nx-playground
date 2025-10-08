import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NxShowcasePage } from './pages/NxShowcasePage';
import { ReactShowcasePage } from './pages/ReactShowcasePage';
import { DesignSystemPage } from './pages/DesignSystemPage';
import { Layout } from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nx" element={<NxShowcasePage />} />
        <Route path="/react" element={<ReactShowcasePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
