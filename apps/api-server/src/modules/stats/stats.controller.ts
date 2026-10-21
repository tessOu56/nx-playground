import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../decorators/roles.decorator';
import { IdentityGuard } from '../../guards/identity.guard';
import { RolesGuard } from '../../guards/roles.guard';

import { StatsService } from './stats.service';

@Controller('stats')
@ApiTags('stats')
@UseGuards(IdentityGuard, RolesGuard)
@Roles('organizer', 'admin')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({ summary: 'Dashboard aggregate counts from Postgres' })
  @ApiResponse({ status: 200 })
  getSummary() {
    return this.statsService.getSummary();
  }
}
