import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Registration from './pages/SignUp';
import RegistrationForm from './pages/SignUp/form';
import RegistrationVerify from './pages/SignUp/verification';
import SignIn from './pages/SignIn';
import SignInForm from './pages/SignIn/form';
import Recovery from './pages/Recovery';
import RecoveryForm from './pages/Recovery/form';
import RecoveryVerify from './pages/Recovery/verification';
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
              <Registration />
            </Layout>
          }
        />
        <Route
          path='/registration/form'
          element={
            <Layout openBack>
              <RegistrationForm flowId='' onSuccess={() => {}} />
            </Layout>
          }
        />
        <Route
          path='/verification'
          element={
            <Layout openBack>
              <RegistrationVerify />
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
          path='/login/form'
          element={
            <Layout openBack>
              <SignInForm />
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
          path='/verify'
          element={
            <Layout openBack>
              <RecoveryVerify />
            </Layout>
          }
        />
        <Route
          path='/settings'
          element={
            <Layout openBack>
              <RecoveryForm flowId='' onSuccess={() => {}} />
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
