import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { scheduleEventEmbedding } from '../embeddings/pipeline';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import type { ExhibitionRegion } from './exhibition-region';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: {
    status?: string;
    region?: ExhibitionRegion;
    page?: number;
    limit?: number;
  }) {
    const { status, region, page = 1, limit = 10 } = query;
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where = {
      ...(status ? { status } : {}),
      ...(region ? { region } : {}),
    };

    const [items, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      items,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    };
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { form: true, orders: true },
    });

    if (!event) {
      throw new NotFoundException(`Event ${id} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto) {
    const event = await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        description: createEventDto.description,
        location: createEventDto.location,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        maxAttendees: createEventDto.maxAttendees,
        status: createEventDto.status,
        formId: createEventDto.formId,
        data:
          createEventDto.data === undefined
            ? undefined
            : (createEventDto.data as object),
        region: createEventDto.region,
        timezone: createEventDto.timezone,
        source: createEventDto.source,
        sourceUrl: createEventDto.sourceUrl,
        externalId: createEventDto.externalId,
        contentHash: createEventDto.contentHash,
        tags: createEventDto.tags,
        priceText: createEventDto.priceText,
        lastSeenAt: createEventDto.lastSeenAt
          ? new Date(createEventDto.lastSeenAt)
          : undefined,
      },
    });
    if (event.status === 'published') {
      scheduleEventEmbedding(this.prisma, event);
    }
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    await this.findOne(id); // 確保存在

    const event = await this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        startDate: updateEventDto.startDate
          ? new Date(updateEventDto.startDate)
          : undefined,
        endDate: updateEventDto.endDate
          ? new Date(updateEventDto.endDate)
          : undefined,
        data:
          updateEventDto.data === undefined
            ? undefined
            : (updateEventDto.data as object),
        lastSeenAt: updateEventDto.lastSeenAt
          ? new Date(updateEventDto.lastSeenAt)
          : undefined,
      },
    });
    if (event.status === 'published') {
      scheduleEventEmbedding(this.prisma, event);
    }
    return event;
  }

  async remove(id: string) {
    await this.findOne(id); // 確保存在

    await this.prisma.event.delete({
      where: { id },
    });

    return { message: 'Event deleted successfully', id };
  }
}
