import type { CatalogQuery } from '../api/catalog-query';
import { labelledDemoPortalEvent } from '../api/labelled-demo-catalog';

import {
  exhibitionSearchFromCatalog,
  getExhibitionById,
  hitToPortalEvent,
  hitToPortalEventDetail,
  searchExhibitions,
} from './index';

export async function loadPortalCatalog(query?: CatalogQuery) {
  const result = await searchExhibitions(
    exhibitionSearchFromCatalog(
      query ?? { q: '', city: 'all', dates: 'all', category: '' },
      new Date(),
      48
    )
  );
  return result.items.map(hitToPortalEvent);
}

export async function loadPortalExhibition(eventId: string) {
  const found = await getExhibitionById(eventId);
  if (found) return hitToPortalEventDetail(found.item);
  return labelledDemoPortalEvent(eventId);
}
