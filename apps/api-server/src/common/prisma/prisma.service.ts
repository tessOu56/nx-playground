import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import { assertPostgresUrl } from './postgres-url';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    assertPostgresUrl(process.env.DATABASE_URL);
    await this.$connect();
    console.log('✅ Prisma connected to postgres');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Prisma disconnected from database');
  }
}
