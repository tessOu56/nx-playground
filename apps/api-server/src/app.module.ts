import { Module } from '@nestjs/common';

import { AppOrganizerAuthModule } from './app-organizer-auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EventsModule } from './modules/events/events.module';
import { StatsModule } from './modules/stats/stats.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    EventsModule,
    UsersModule,
    StatsModule,
    CatalogModule,
    AppOrganizerAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
