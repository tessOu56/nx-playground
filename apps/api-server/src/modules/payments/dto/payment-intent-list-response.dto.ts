import { ApiProperty } from '@nestjs/swagger';

import { PaymentIntent } from '../entities/payment-intent.entity';

export class PaymentWebhookResponse {
  @ApiProperty({ type: PaymentIntent })
  intent: PaymentIntent;

  @ApiProperty()
  replayed: boolean;
}

export class PaymentIntentListResponse {
  @ApiProperty({ type: [PaymentIntent] })
  items: PaymentIntent[];
}
