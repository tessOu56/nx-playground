import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { CreateEventDto } from './dto/create-event.dto';
import { EventListResponse } from './dto/event-list-response.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event.entity';
import { EventsService } from './events.service';
import { EXHIBITION_REGIONS, parseExhibitionRegion } from './exhibition-region';

@Controller('events')
@ApiTags('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({
    name: 'region',
    required: false,
    enum: EXHIBITION_REGIONS,
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, type: EventListResponse })
  async findAll(
    @Query('status') status?: string,
    @Query('region') region?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const parsedRegion = parseExhibitionRegion(region);
    if (parsedRegion === null) {
      throw new BadRequestException(
        `Invalid region. Expected ${EXHIBITION_REGIONS.join(' | ')}.`
      );
    }
    return this.eventsService.findAll({
      status,
      region: parsedRegion,
      page,
      limit,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new event' })
  @ApiResponse({ status: 201, type: Event })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update event' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Event })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Event deleted' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
