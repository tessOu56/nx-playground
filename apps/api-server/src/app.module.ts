import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EventsModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    EventsModule,
    OrdersModule,
    UsersModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
