import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { isLineAttendeeUserId, stubLineAttendeeUser } from './attendee-user';
import { ticketSpecsFromOrderData } from '../tickets/issue-tickets';

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
    let user = isLineAttendeeUserId(userId)
      ? await this.prisma.user.upsert({
          where: { id: userId },
          create: stubLineAttendeeUser(userId),
          update: {},
        })
      : await this.prisma.user.findUnique({ where: { id: userId } });
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

  async findAll(query: { userId?: string; page?: number; limit?: number }) {
    const { userId, page = 1, limit = 10 } = query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    const where = userId ? { userId } : {};

    const [rows, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items: rows.map(toOrderEntity),
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.max(1, Math.ceil(total / limitNum)),
    };
  }

  async findOne(id: string): Promise<Order> {
    const row = await this.prisma.order.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return toOrderEntity(row);
  }

  async confirm(id: string): Promise<Order> {
    const existing = await this.prisma.order.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    if (existing.status === 'confirmed') {
      return toOrderEntity(existing);
    }

    const specs = ticketSpecsFromOrderData(parseOrderData(existing.data));
    const row = await this.prisma.$transaction(async tx => {
      const updated = await tx.order.update({
        where: { id },
        data: { status: 'confirmed' },
      });
      for (const spec of specs) {
        for (let i = 0; i < spec.quantity; i += 1) {
          await tx.ticket.create({
            data: {
              orderId: existing.id,
              eventId: existing.eventId,
              type: spec.type,
              status: 'issued',
            },
          });
        }
      }
      return updated;
    });
    return toOrderEntity(row);
  }
}
