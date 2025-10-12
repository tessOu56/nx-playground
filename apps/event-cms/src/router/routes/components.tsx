import { UIComponentsExample } from '../../features';
import { DashboardLayout } from '../../layouts';

export const componentsRoutes = [
  {
    path: '/components',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <UIComponentsExample />,
      },
    ],
  },
];
