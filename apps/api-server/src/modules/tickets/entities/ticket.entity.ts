import { ApiProperty } from '@nestjs/swagger';

export class Ticket {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty()
  eventId: string;

  @ApiProperty()
  type: string;

  @ApiProperty({ enum: ['issued', 'used', 'cancelled'] })
  status: string;

  @ApiProperty({ required: false })
  checkedInAt?: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
