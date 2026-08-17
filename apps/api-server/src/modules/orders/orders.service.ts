import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';

const DEMO_USER_ID = 'user_demo';

function parseOrderData(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return { value: parsed };
  } catch {
    return { raw };
  }
}

function toOrderEntity(row: {
  id: string;
  eventId: string;
  userId: string;
  status: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
}): Order {
  return {
    id: row.id,
    eventId: row.eventId,
    userId: row.userId,
    status: row.status,
    data: parseOrderData(row.data),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const event = await this.prisma.event.findUnique({
      where: { id: dto.eventId },
    });
    if (!event) {
      throw new BadRequestException(`Event ${dto.eventId} not found`);
    }

    const userId = dto.userId ?? DEMO_USER_ID;
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`User ${userId} not found`);
    }

    const row = await this.prisma.order.create({
      data: {
        eventId: dto.eventId,
        userId,
        status: dto.status ?? 'pending',
        data: JSON.stringify(dto.data ?? {}),
      },
    });

    return toOrderEntity(row);
  }

  async findOne(id: string): Promise<Order> {
    const row = await this.prisma.order.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return toOrderEntity(row);
  }

  async confirm(id: string): Promise<Order> {
    await this.findOne(id);
    const row = await this.prisma.order.update({
      where: { id },
      data: { status: 'confirmed' },
    });
    return toOrderEntity(row);
  }
}
