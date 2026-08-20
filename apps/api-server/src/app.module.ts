import { Module } from '@nestjs/common';

import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EventsModule } from './modules/events/events.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    EventsModule,
    OrdersModule,
    PaymentsModule,
    TicketsModule,
    UsersModule,
    CatalogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
