import type { NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

function parseAllowedEmails(): Set<string> {
  const raw = process.env.ALLOWED_ORGANIZER_EMAILS?.trim() ?? '';
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map(email => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

/**
 * Injects organizer permissions for CMS-protected routes (users, stats).
 * CMS sends X-Organizer-Email after Kratos session; optional bearer token for hosted.
 */
export class OrganizerAuthMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    if (req.user) {
      next();
      return;
    }

    const apiToken = process.env.CMS_ORGANIZER_API_TOKEN?.trim();
    const authHeader = req.headers.authorization?.trim() ?? '';
    if (apiToken && authHeader === `Bearer ${apiToken}`) {
      req.user = { id: 'cms-token', role: 'admin' };
      next();
      return;
    }

    const emailHeader = req.headers['x-organizer-email'];
    const email =
      typeof emailHeader === 'string' ? emailHeader.trim().toLowerCase() : '';

    if (email) {
      const devAuth = process.env.EVENT_STACK_CMS_DEV_AUTH === 'true';
      const allowed = parseAllowedEmails();
      if (
        devAuth ||
        process.env.NODE_ENV !== 'production' ||
        allowed.has(email)
      ) {
        req.user = { id: email, role: 'admin' };
        next();
        return;
      }
    }

    next();
  }
}
