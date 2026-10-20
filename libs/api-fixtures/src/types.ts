export const DEMO_USER_ID = 'user_demo';

export type ExhibitionRegion = 'TAIPEI' | 'TOKYO';

export interface EventRecord {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status: string;
  formId?: string;
  data?: Record<string, unknown>;
  region?: ExhibitionRegion | null;
  timezone?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  externalId?: string | null;
  contentHash?: string | null;
  tags?: string[];
  priceText?: string | null;
  lastSeenAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export interface EventListResponse {
  items: EventRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status?: string;
  formId?: string;
  data?: Record<string, unknown>;
  region?: ExhibitionRegion | null;
  timezone?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  externalId?: string | null;
  contentHash?: string | null;
  tags?: string[];
  priceText?: string | null;
  lastSeenAt?: string | null;
}
