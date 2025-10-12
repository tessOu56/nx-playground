import { createBrowserRouter } from 'react-router-dom';

import {
  publicRoutes,
  dashboardRoutes,
  componentsRoutes,
  eventsRoutes,
  usersRoutes,
  formsRoutes,
  settingsRoutes,
  demoRoutes,
  systemRoutes,
} from './routes';

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter(
    [
      ...publicRoutes,
      ...dashboardRoutes,
      ...componentsRoutes,
      ...eventsRoutes,
      ...usersRoutes,
      ...formsRoutes,
      ...settingsRoutes,
      ...demoRoutes,
      ...systemRoutes,
    ],
    {
      future: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        v7_relativeSplatPath: true,
      },
    }
  );
