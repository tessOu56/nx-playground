import { OrganizerAuthMiddleware } from './organizer-auth.middleware';

describe('OrganizerAuthMiddleware', () => {
  const originalAdmin = process.env.ADMIN_API_TOKEN;
  const originalAllowlist = process.env.ALLOWED_ORGANIZER_EMAILS;
  const originalDevAuth = process.env.EVENT_STACK_CMS_DEV_AUTH;
  const originalNodeEnv = process.env.NODE_ENV;
  const originalKratos = process.env.KRATOS_PUBLIC_URL;

  afterEach(() => {
    if (originalAdmin === undefined) delete process.env.ADMIN_API_TOKEN;
    else process.env.ADMIN_API_TOKEN = originalAdmin;
    if (originalAllowlist === undefined) {
      delete process.env.ALLOWED_ORGANIZER_EMAILS;
    } else {
      process.env.ALLOWED_ORGANIZER_EMAILS = originalAllowlist;
    }
    if (originalDevAuth === undefined) delete process.env.EVENT_STACK_CMS_DEV_AUTH;
    else process.env.EVENT_STACK_CMS_DEV_AUTH = originalDevAuth;
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalKratos === undefined) delete process.env.KRATOS_PUBLIC_URL;
    else process.env.KRATOS_PUBLIC_URL = originalKratos;
  });

  it('does not grant admin from an allowlisted email header in production', async () => {
    process.env.NODE_ENV = 'production';
    process.env.ALLOWED_ORGANIZER_EMAILS = 'owner@example.com';
    delete process.env.ADMIN_API_TOKEN;
    delete process.env.KRATOS_PUBLIC_URL;

    const headers: Record<string, string> = {};
    headers['x-organizer-email'] = 'owner@example.com';
    const req: { headers: Record<string, string>; user?: unknown } = {
      headers,
    };
    const middleware = new OrganizerAuthMiddleware();
    await middleware.use(req as never, {} as never, () => undefined);
    expect(req.user).toBeUndefined();
  });
});
