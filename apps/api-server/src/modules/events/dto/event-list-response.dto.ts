import { ApiProperty } from '@nestjs/swagger';

import { Event } from '../entities/event.entity';

export class EventListResponse {
  @ApiProperty({ type: [Event] })
  items: Event[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
