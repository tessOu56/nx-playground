import type { ExhibitionRegion, UtcRange } from '../line/bot/time-window';
import type { DateFilter } from '../api/catalog-filters';

export type { ExhibitionRegion, UtcRange };

export type ExhibitionDateMode = DateFilter | 'window';

export type ExhibitionDocument = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  startDate: Date;
  endDate: Date;
  timezone: string | null;
  priceText: string | null;
  region: ExhibitionRegion | null;
  sourceUrl: string | null;
  source: string | null;
  tags: string[];
  imageUrl: string | null;
  category: string | null;
  organizerName: string | null;
  venueHint: string | null;
  status: string;
  sample: boolean;
  data?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ExhibitionHit = ExhibitionDocument & {
  rank: number;
};

export type ExhibitionSearchInput = {
  keyword: string;
  region?: ExhibitionRegion;
  dateMode?: ExhibitionDateMode;
  windows?: Partial<Record<ExhibitionRegion, UtcRange>>;
  category?: string;
  limit?: number;
  now?: Date;
};

export type ExhibitionSearchResult = {
  source: 'postgres' | 'sample';
  items: ExhibitionHit[];
};
