import { ApiProperty } from '@nestjs/swagger';

export class Order {
  @ApiProperty()
  id: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ enum: ['pending', 'confirmed', 'cancelled'] })
  status: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: true,
    description: 'Parsed checkout JSON',
  })
  data: Record<string, unknown>;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
