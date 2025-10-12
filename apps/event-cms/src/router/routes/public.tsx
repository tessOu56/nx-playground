import { Public, PublicLayout } from '../../layouts';

export const publicRoutes = [
  {
    path: '/public',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Public />,
      },
    ],
  },
];
