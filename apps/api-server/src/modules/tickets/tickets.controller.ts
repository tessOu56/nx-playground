import { Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { TicketListResponse } from './dto/ticket-list-response.dto';
import { TicketVerifyResponse } from './dto/ticket-verify-response.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@ApiTags('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':id/verify')
  @ApiOperation({ summary: 'Verify a ticket for check-in' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: TicketVerifyResponse })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async verify(@Param('id') id: string) {
    return this.ticketsService.verify(id);
  }

  @Post(':id/check-in')
  @ApiOperation({ summary: 'Check in a ticket' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Ticket })
  @ApiResponse({ status: 400, description: 'Ticket cannot be checked in' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async checkIn(@Param('id') id: string) {
    return this.ticketsService.checkIn(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: Ticket })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(id);
  }
}
