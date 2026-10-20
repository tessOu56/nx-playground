export const ROUTES = {
  HOME: '/',
  EVENTS: '/events',
} as const;

export type RouteKey = keyof typeof ROUTES;
