import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntent {
  @ApiProperty()
  id: string;

  @ApiProperty()
  orderId: string;

  @ApiProperty({ enum: ['mock', 'ecpay-sandbox'] })
  provider: string;

  @ApiProperty({ enum: ['created', 'paid', 'failed'] })
  status: string;

  @ApiProperty()
  merchantTradeNo: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({
    description: 'Redirect target. Never a card form hosted by this API.',
  })
  checkoutUrl: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
