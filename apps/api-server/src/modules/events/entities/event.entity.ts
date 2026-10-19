import { ApiProperty } from '@nestjs/swagger';

import { EXHIBITION_REGIONS } from '../exhibition-region';

export class Event {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  location?: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ required: false })
  maxAttendees?: number;

  @ApiProperty({ enum: ['draft', 'published', 'cancelled'] })
  status: string;

  @ApiProperty({ required: false })
  formId?: string;

  @ApiProperty({
    required: false,
    type: 'object',
    additionalProperties: true,
    description: 'Catalog extras (sessions, tickets, content, speakers, venue). Nest persists JSON.',
  })
  data?: Record<string, unknown>;

  @ApiProperty({ enum: EXHIBITION_REGIONS, required: false })
  region?: (typeof EXHIBITION_REGIONS)[number];

  @ApiProperty({ required: false, example: 'Asia/Tokyo' })
  timezone?: string;

  @ApiProperty({ required: false })
  source?: string;

  @ApiProperty({ required: false })
  sourceUrl?: string;

  @ApiProperty({ required: false })
  externalId?: string;

  @ApiProperty({ required: false })
  contentHash?: string;

  @ApiProperty({ required: false, type: [String] })
  tags?: string[];

  @ApiProperty({ required: false })
  priceText?: string;

  @ApiProperty({ required: false })
  lastSeenAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
