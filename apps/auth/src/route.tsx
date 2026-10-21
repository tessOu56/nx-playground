import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Recovery from './pages/Recovery';
import NotFound from './pages/NotFound';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <Router basename='/'>
      <Routes>
        <Route
          path='/'
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path='/registration'
          element={
            <Layout openBack>
              <SignUp />
            </Layout>
          }
        />
        <Route
          path='/login'
          element={
            <Layout openBack>
              <SignIn />
            </Layout>
          }
        />
        <Route
          path='/recovery'
          element={
            <Layout openBack>
              <Recovery />
            </Layout>
          }
        />
        <Route
          path='/error'
          element={
            <Layout openBack>
              <ErrorPage />
            </Layout>
          }
        />
        <Route
          path='/*'
          element={
            <Layout openBack>
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
