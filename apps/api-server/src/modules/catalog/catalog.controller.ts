import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

import { CatalogService } from './catalog.service';
import type { components } from './contract/catalog.contract';

type CatalogItem = components['schemas']['CatalogItem'];
type CatalogItemPage = components['schemas']['CatalogItemPage'];
type CreateCatalogItem = components['schemas']['CreateCatalogItem'];
type ItemType = components['schemas']['ItemType'];

/**
 * Catalog API — implements the TypeSpec contract (libs/contracts/main.tsp).
 * Return types are derived from the SAME OpenAPI the frontend consumes,
 * so any drift between this implementation and the contract fails to compile.
 */
@Controller('catalog/items')
@ApiTags('catalog')
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get()
  @ApiOperation({ summary: 'List catalog items with type filter and pagination' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  list(
    @Query('type') type?: ItemType,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 20,
  ): CatalogItemPage {
    return this.catalog.list({ type, page: Number(page), pageSize: Number(pageSize) });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a catalog item by id' })
  @ApiParam({ name: 'id', type: String })
  read(@Param('id') id: string): CatalogItem {
    return this.catalog.read(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a catalog item' })
  create(@Body() body: CreateCatalogItem): CatalogItem {
    return this.catalog.create(body);
  }
}
