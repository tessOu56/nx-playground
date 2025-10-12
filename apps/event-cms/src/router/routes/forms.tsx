import {
  FormTemplateEditPage,
  FormTemplateListPage,
} from '../../features/form';
import { DashboardLayout, TopbarOnlyLayout } from '../../layouts';

export const formsRoutes = [
  {
    path: '/forms',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <FormTemplateListPage />,
      },
    ],
  },
  {
    path: '/forms/create',
    element: <TopbarOnlyLayout />,
    children: [
      {
        index: true,
        element: <FormTemplateEditPage />,
      },
    ],
  },
  {
    path: '/forms/edit/:id',
    element: <TopbarOnlyLayout />,
    children: [
      {
        index: true,
        element: <FormTemplateEditPage />,
      },
    ],
  },
];
