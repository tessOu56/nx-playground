import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

export interface EventStackStats {
  events: number;
  users: number;
  activeUsers: number;
}

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async getSummary(): Promise<EventStackStats> {
    const [events, users, activeUsers] = await Promise.all([
      this.prisma.event.count(),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: 'active' } }),
    ]);

    return { events, users, activeUsers };
  }
}
