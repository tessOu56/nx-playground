import { I18nDemo } from '../../components/I18nDemo';
import { DashboardLayout } from '../../layouts';

export const demoRoutes = [
  {
    path: '/i18n-demo',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <I18nDemo />,
      },
    ],
  },
];
