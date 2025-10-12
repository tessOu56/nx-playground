import { Dashboard, FormsDemo } from '../../features';
import { DashboardLayout } from '../../layouts';

export const dashboardRoutes = [
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'forms-demo',
        element: <FormsDemo />,
      },
    ],
  },
];
