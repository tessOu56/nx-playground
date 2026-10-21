import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import { resolveOrganizerIdentity } from '../common/auth/organizer-identity';

/**
 * Injects organizer permissions for CMS-protected API paths (users, stats).
 * Production requires a verified Kratos session or ADMIN_API_TOKEN.
 */
export class OrganizerAuthMiddleware implements NestMiddleware {
  async use(req: Request, _res: Response, next: NextFunction): Promise<void> {
    if (req.user) {
      next();
      return;
    }

    const identity = await resolveOrganizerIdentity({
      authorizationHeader: req.headers.authorization,
      organizerEmailHeader: req.headers['x-organizer-email'],
      cookieHeader: req.headers.cookie,
      sessionTokenHeader: req.headers['x-session-token'],
      adminApiToken: process.env.ADMIN_API_TOKEN,
      allowedOrganizerEmails: process.env.ALLOWED_ORGANIZER_EMAILS,
      eventStackCmsDevAuth: process.env.EVENT_STACK_CMS_DEV_AUTH,
      nodeEnv: process.env.NODE_ENV,
      kratosPublicUrl: process.env.KRATOS_PUBLIC_URL,
    });
    if (identity) {
      req.user = identity;
    }
    next();
  }
}
