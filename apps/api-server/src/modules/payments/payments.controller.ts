import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';

import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import {
  PaymentIntentListResponse,
  PaymentWebhookResponse,
} from './dto/payment-intent-list-response.dto';
import { PaymentWebhookDto } from './dto/payment-webhook.dto';
import { PaymentIntent } from './entities/payment-intent.entity';
import {
  mockCompleteHtml,
  portalOrderReturnUrl,
  publicApiBaseFromRequest,
} from './payment-gateway';
import { PaymentsService } from './payments.service';

@Controller('payments')
@ApiTags('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('intents')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a payment intent (no card data in this API)',
  })
  @ApiResponse({ status: 201, type: PaymentIntent })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async create(
    @Body() dto: CreatePaymentIntentDto,
    @Headers('host') host?: string
  ) {
    return this.paymentsService.create(
      dto.orderId,
      publicApiBaseFromRequest(host)
    );
  }

  @Get('intents')
  @ApiOperation({ summary: 'List payment intents for an order' })
  @ApiQuery({ name: 'orderId', required: true })
  @ApiResponse({ status: 200, type: PaymentIntentListResponse })
  async list(@Query('orderId') orderId: string) {
    return this.paymentsService.listByOrder(orderId);
  }

  @Get('intents/:id')
  @ApiOperation({ summary: 'Get a payment intent' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: PaymentIntent })
  @ApiResponse({ status: 404, description: 'Payment intent not found' })
  async findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post('webhook')
  @ApiOperation({
    summary: 'Payment webhook / callback (idempotent; no card data)',
  })
  @ApiResponse({ status: 200, type: PaymentWebhookResponse })
  async webhook(@Body() dto: PaymentWebhookDto) {
    return this.paymentsService.applyWebhook({
      merchantTradeNo: dto.merchantTradeNo || dto.MerchantTradeNo,
      rtnCode: dto.rtnCode ?? dto.RtnCode,
    });
  }

  @Get('mock-complete/:id')
  @ApiOperation({
    summary: 'Mock checkout chooser (used when ECPay sandbox keys are absent)',
  })
  @ApiParam({ name: 'id', type: String })
  async mockComplete(
    @Param('id') id: string,
    @Query('outcome') outcome: string | undefined,
    @Res() res: Response
  ) {
    const intent = await this.paymentsService.findOne(id);
    if (intent.provider !== 'mock') {
      res.status(400).json({
        message: 'Mock checkout is only for the mock provider',
      });
      return;
    }
    if (outcome === 'paid' || outcome === 'failed') {
      await this.paymentsService.applyWebhook({
        merchantTradeNo: intent.merchantTradeNo,
        rtnCode: outcome === 'paid' ? '1' : '0',
      });
      res.redirect(portalOrderReturnUrl(intent.orderId, outcome));
      return;
    }
    res
      .status(200)
      .type('html')
      .send(mockCompleteHtml({ orderId: intent.orderId, amount: intent.amount }));
  }
}
