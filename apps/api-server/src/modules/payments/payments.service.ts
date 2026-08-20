import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';

import {
  amountFromOrderData,
  assertSandboxCheckoutUrl,
  checkoutUrlForProvider,
  newMerchantTradeNo,
  paymentProviderFromEnv,
  webhookStatusFromRtnCode,
} from './payment-gateway';
import { PaymentIntent } from './entities/payment-intent.entity';

function toIntentEntity(row: {
  id: string;
  orderId: string;
  provider: string;
  status: string;
  merchantTradeNo: string;
  amount: number;
  checkoutUrl: string;
  createdAt: Date;
  updatedAt: Date;
}): PaymentIntent {
  return {
    id: row.id,
    orderId: row.orderId,
    provider: row.provider,
    status: row.status,
    merchantTradeNo: row.merchantTradeNo,
    amount: row.amount,
    checkoutUrl: row.checkoutUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private ordersService: OrdersService
  ) {}

  async listByOrder(orderId: string): Promise<{ items: PaymentIntent[] }> {
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    const rows = await this.prisma.paymentIntent.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    return { items: rows.map(toIntentEntity) };
  }

  async findOne(id: string): Promise<PaymentIntent> {
    const row = await this.prisma.paymentIntent.findUnique({ where: { id } });
    if (!row) {
      throw new NotFoundException(`Payment intent ${id} not found`);
    }
    return toIntentEntity(row);
  }

  async create(
    orderId: string,
    publicApiBase: string
  ): Promise<PaymentIntent> {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }
    const existing = await this.prisma.paymentIntent.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
    const reusable = existing.find(
      row => row.status === 'created' || row.status === 'paid'
    );
    if (reusable) return toIntentEntity(reusable);

    let data: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(order.data || '{}') as unknown;
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        data = parsed as Record<string, unknown>;
      }
    } catch {
      data = {};
    }

    const provider = paymentProviderFromEnv();
    const id = `pay_${Date.now().toString(36)}${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    const checkoutUrl = checkoutUrlForProvider(provider, publicApiBase, id);
    assertSandboxCheckoutUrl(checkoutUrl);

    const row = await this.prisma.paymentIntent.create({
      data: {
        id,
        orderId,
        provider,
        status: 'created',
        merchantTradeNo: newMerchantTradeNo(),
        amount: amountFromOrderData(data),
        checkoutUrl,
      },
    });
    return toIntentEntity(row);
  }

  async applyWebhook(input: {
    merchantTradeNo?: string;
    rtnCode?: string | number;
  }): Promise<{ intent: PaymentIntent; replayed: boolean }> {
    const merchantTradeNo = input.merchantTradeNo?.trim();
    if (!merchantTradeNo) {
      throw new BadRequestException('merchantTradeNo is required');
    }
    const row = await this.prisma.paymentIntent.findUnique({
      where: { merchantTradeNo },
    });
    if (!row) {
      throw new NotFoundException(
        `Payment intent ${merchantTradeNo} not found`
      );
    }
    const nextStatus = webhookStatusFromRtnCode(input.rtnCode);
    if (row.status === nextStatus || row.status === 'paid') {
      return { intent: toIntentEntity(row), replayed: true };
    }
    const updated = await this.prisma.paymentIntent.update({
      where: { id: row.id },
      data: { status: nextStatus },
    });
    if (nextStatus === 'paid') {
      await this.ordersService.confirm(row.orderId);
    }
    return { intent: toIntentEntity(updated), replayed: false };
  }
}
