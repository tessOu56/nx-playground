import { Users } from '../../features';
import { DashboardLayout } from '../../layouts';

export const usersRoutes = [
  {
    path: '/users',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Users />,
      },
    ],
  },
];
