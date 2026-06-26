import { Injectable, NotFoundException } from '@nestjs/common';

import type { components } from './contract/catalog.contract';

type CatalogItem = components['schemas']['CatalogItem'];
type CatalogItemPage = components['schemas']['CatalogItemPage'];
type CreateCatalogItem = components['schemas']['CreateCatalogItem'];
type ItemType = components['schemas']['ItemType'];

const now = new Date().toISOString();

// Seed data shaped by the contract type — drift is a compile error.
const SEED: CatalogItem[] = [
  { id: '1', name: 'AI Search Portal', itemType: 'app', status: 'published', createdAt: now, updatedAt: now },
  { id: '2', name: 'Catalog Dataset', itemType: 'dataset', status: 'published', createdAt: now, updatedAt: now },
  { id: '3', name: 'Ranking Model', itemType: 'model', status: 'draft', createdAt: now, updatedAt: now },
  { id: '4', name: 'Embedding Service', itemType: 'service', status: 'published', createdAt: now, updatedAt: now },
];

@Injectable()
export class CatalogService {
  private items: CatalogItem[] = [...SEED];

  list(params: { type?: ItemType; page: number; pageSize: number }): CatalogItemPage {
    const { type, page, pageSize } = params;
    const filtered = type ? this.items.filter((i) => i.itemType === type) : this.items;
    const start = (page - 1) * pageSize;
    return {
      items: filtered.slice(start, start + pageSize),
      page,
      pageSize,
      total: filtered.length,
    };
  }

  read(id: string): CatalogItem {
    const item = this.items.find((i) => i.id === id);
    if (!item) throw new NotFoundException({ code: 'not_found', message: `Catalog item ${id} not found` });
    return item;
  }

  create(body: CreateCatalogItem): CatalogItem {
    const item: CatalogItem = {
      id: String(this.items.length + 1),
      name: body.name,
      itemType: body.itemType,
      description: body.description,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.push(item);
    return item;
  }
}
