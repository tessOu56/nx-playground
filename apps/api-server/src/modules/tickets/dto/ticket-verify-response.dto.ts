import { ApiProperty } from '@nestjs/swagger';

import { Event } from '../../events/entities/event.entity';
import { Order } from '../../orders/entities/order.entity';
import { Ticket } from '../entities/ticket.entity';

export class TicketVerifyResponse {
  @ApiProperty({ type: Ticket })
  ticket: Ticket;

  @ApiProperty({ type: Event })
  event: Event;

  @ApiProperty({ type: Order })
  order: Order;

  @ApiProperty()
  isValid: boolean;

  @ApiProperty()
  verificationTime: Date;
}
