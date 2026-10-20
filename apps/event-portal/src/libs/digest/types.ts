export const DIGEST_CITIES = ['TAIPEI', 'TOKYO'] as const;
export const DIGEST_LOCALES = ['zh', 'ja', 'en'] as const;

export type DigestCity = (typeof DIGEST_CITIES)[number];
export type DigestLocale = (typeof DIGEST_LOCALES)[number];

/** Channel ids. Only Discord is implemented; Threads/X are reserved. */
export type DigestPublisherId = 'discord' | 'threads' | 'x';

export type DigestExhibition = {
  id: string;
  title: string;
  city: DigestCity;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  location?: string | null;
};

export type DigestCitySection = {
  city: DigestCity;
  upcoming: DigestExhibition[];
  newlyAdded: DigestExhibition[];
};

export type WeeklyDigest = {
  now: Date;
  weekStart: Date;
  weekEnd: Date;
  lookbackStart: Date;
  cities: DigestCitySection[];
};

export type DigestMessage = {
  locale: DigestLocale;
  text: string;
};

export type PublishStatus = 'published' | 'skipped' | 'failed';

export type PublishResult = {
  publisher: DigestPublisherId;
  status: PublishStatus;
  /** Stable machine reason. Must never contain webhook URLs or secrets. */
  reason?: string;
  posted?: number;
};

/**
 * Outbound channel. Add Threads/X later by implementing this — do not
 * special-case those networks in the generator.
 */
export type DigestPublisher = {
  readonly id: DigestPublisherId;
  publish(messages: readonly DigestMessage[]): Promise<PublishResult>;
};
