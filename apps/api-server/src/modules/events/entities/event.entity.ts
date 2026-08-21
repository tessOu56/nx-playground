import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
