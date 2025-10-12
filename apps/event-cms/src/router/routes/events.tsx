import { CreateEventsPage } from '../../features';
import { DashboardLayout } from '../../layouts';

export const eventsRoutes = [
  {
    path: '/events',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <CreateEventsPage />,
      },
    ],
  },
];
