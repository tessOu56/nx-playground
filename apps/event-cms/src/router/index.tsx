import { createBrowserRouter } from 'react-router-dom';

import {
  publicRoutes,
  dashboardRoutes,
  componentsRoutes,
  eventsRoutes,
  usersRoutes,
  formsRoutes,
  opsRoutes,
  settingsRoutes,
  demoRoutes,
  systemRoutes,
} from './routes';

export const router: ReturnType<typeof createBrowserRouter> =
  createBrowserRouter([
    ...publicRoutes,
    ...dashboardRoutes,
    ...componentsRoutes,
    ...eventsRoutes,
    ...usersRoutes,
    ...formsRoutes,
    ...opsRoutes,
    ...settingsRoutes,
    ...demoRoutes,
    ...systemRoutes,
  ]);
