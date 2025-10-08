import { Navigate } from 'react-router-dom';

export const systemRoutes = [
  // Root redirect
  {
    path: '/',
    element: <Navigate to='/dashboard' replace />,
  },

  // Catch all
  {
    path: '*',
    element: <Navigate to='/dashboard' replace />,
  },
];
