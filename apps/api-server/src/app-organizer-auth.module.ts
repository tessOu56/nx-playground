import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { OrganizerAuthMiddleware } from './middleware/organizer-auth.middleware';

/**
 * Applies organizer auth middleware to CMS-protected API paths.
 */
@Module({})
export class AppOrganizerAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(OrganizerAuthMiddleware)
      .forRoutes('users', 'stats');
  }
}
