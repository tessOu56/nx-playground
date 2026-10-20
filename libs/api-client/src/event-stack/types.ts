export type ExhibitionRegion = 'TAIPEI' | 'TOKYO';

export interface CreateEventDto {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate: string;
  maxAttendees?: number;
  status?: 'draft' | 'published';
  formId?: string;
  data?: Record<string, unknown>;
  region?: ExhibitionRegion;
  timezone?: string;
  source?: string;
  sourceUrl?: string;
  externalId?: string;
  contentHash?: string;
  tags?: string[];
  priceText?: string;
  lastSeenAt?: string;
}

export interface EventStackEvent {
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

export interface EventListResponse {
  items: EventStackEvent[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStackUser {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  role: 'admin' | 'organizer' | 'user';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: EventStackUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EventStackStats {
  events: number;
  users: number;
  activeUsers: number;
}
