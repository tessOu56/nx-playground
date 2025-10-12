import { Settings } from '../../features';
import { DashboardLayout } from '../../layouts';

export const settingsRoutes = [
  {
    path: '/settings',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Settings />,
      },
    ],
  },
];
