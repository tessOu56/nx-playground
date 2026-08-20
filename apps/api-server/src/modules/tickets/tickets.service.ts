import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

import { Ticket } from './entities/ticket.entity';

function toTicketEntity(row: {
  id: string;
  orderId: string;
  eventId: string;
  type: string;
  status: string;
  checkedInAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): Ticket {
  return {
    id: row.id,
    orderId: row.orderId,
    eventId: row.eventId,
    type: row.type,
    status: row.status,
    checkedInAt: row.checkedInAt ?? undefined,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async listByOrder(orderId: string): Promise<{ items: Ticket[] }> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    const rows = await this.prisma.ticket.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' },
    });
    return { items: rows.map(toTicketEntity) };
  }

  async findOne(id: string): Promise<Ticket> {
    const row = await this.prisma.ticket.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    return toTicketEntity(row);
  }

  async verify(id: string) {
    const row = await this.prisma.ticket.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    const [order, event] = await Promise.all([
      this.prisma.order.findUnique({ where: { id: row.orderId } }),
      this.prisma.event.findUnique({ where: { id: row.eventId } }),
    ]);
    if (!order || !event) {
      throw new NotFoundException(`Ticket ${id} not found`);
    }
    const ticket = toTicketEntity(row);
    let orderData: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(order.data || '{}') as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        orderData = parsed as Record<string, unknown>;
      }
    } catch {
      orderData = {};
    }
    return {
      ticket,
      event,
      order: {
        id: order.id,
        eventId: order.eventId,
        userId: order.userId,
        status: order.status,
        data: orderData,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      isValid: ticket.status === 'issued' && order.status === 'confirmed',
      verificationTime: new Date(),
    };
  }

  async checkIn(id: string): Promise<Ticket> {
    const verified = await this.verify(id);
    if (!verified.isValid) {
      throw new BadRequestException(`Ticket ${id} cannot be checked in`);
    }
    const row = await this.prisma.ticket.update({
      where: { id },
      data: { status: 'used', checkedInAt: new Date() },
    });
    return toTicketEntity(row);
  }
}
