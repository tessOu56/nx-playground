import { OpsPage } from '../../features';
import { DashboardLayout } from '../../layouts';

export const opsRoutes = [
  {
    path: '/ops',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <OpsPage />,
      },
    ],
  },
];
