import type {
  CreateEventInput,
  EventListResponse,
  EventRecord,
} from '@nx-playground/api-fixtures';

export type EventStackRepo = {
  ready: () => Promise<void>;
  storage: 'postgres' | 'memory';
  listEvents: (query: {
    status?: string;
    region?: string;
    page?: number;
    limit?: number;
  }) => Promise<EventListResponse>;
  getEvent: (id: string) => Promise<EventRecord | undefined>;
  createEvent: (input: CreateEventInput) => Promise<EventRecord>;
  updateEvent: (
    id: string,
    input: Partial<CreateEventInput>
  ) => Promise<EventRecord | undefined>;
  deleteEvent: (id: string) => Promise<boolean>;
};
