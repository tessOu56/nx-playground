import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order for an event' })
  @ApiResponse({ status: 201, type: Order })
  @ApiResponse({ status: 400, description: 'Invalid event or user' })
  async create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':id/confirm')
  @ApiOperation({ summary: 'Confirm an order' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Order })
  @ApiResponse({ status: 404, description: 'Order not found' })
  async confirm(@Param('id') id: string) {
    return this.ordersService.confirm(id);
  }
}
