import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';
import { EventsModule } from './modules/events/events.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
