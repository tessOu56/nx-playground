export type LocalizedText = {
  ja?: string;
  en?: string;
  zh?: string;
};

export type ExhibitionI18n = {
  title: LocalizedText;
  description: LocalizedText;
  location: LocalizedText;
};

export type NormalizedExhibition = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'published';
  region: 'TAIPEI' | 'TOKYO';
  timezone: 'Asia/Taipei' | 'Asia/Tokyo';
  source: string;
  sourceUrl: string;
  externalId: string;
  contentHash: string;
  tags: string[];
  priceText: string | null;
  lastSeenAt: Date;
  data: {
    kind: 'exhibition';
    image?: string;
    source: string;
    summaryOnly: true;
    venueName?: string;
    i18n: ExhibitionI18n;
  };
};

export type UpsertCounts = {
  created: number;
  updated: number;
  touched: number;
};

export type CollectorBatch = {
  source: string;
  fetched: number;
  events: NormalizedExhibition[];
};
