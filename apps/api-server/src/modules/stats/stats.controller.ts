import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { RequirePermissions } from '../../decorators/permissions.decorator';
import { PermissionsGuard } from '../../guards/permissions.guard';

import { StatsService } from './stats.service';

@Controller('stats')
@ApiTags('stats')
@UseGuards(PermissionsGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @RequirePermissions('users:read')
  @ApiOperation({ summary: 'Dashboard aggregate counts from Postgres' })
  @ApiResponse({ status: 200 })
  getSummary() {
    return this.statsService.getSummary();
  }
}
