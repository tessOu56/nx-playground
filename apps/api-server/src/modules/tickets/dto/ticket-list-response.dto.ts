import { ApiProperty } from '@nestjs/swagger';

import { Ticket } from '../entities/ticket.entity';

export class TicketListResponse {
  @ApiProperty({ type: [Ticket] })
  items: Ticket[];
}
