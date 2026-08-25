import type { DataApplication } from '../types';

/** In-memory labelled mock only — no Nest blob, quota, or file microservice (T-2026-283). */
export const MOCK_DATA_APPLICATIONS: DataApplication[] = [
  {
    id: 'app-mock-001',
    requester: 'studio.ops@example.test',
    purpose: 'Export attendee emails for a labelled demo campaign',
    asset: 'event_attendees.email',
    status: 'pending',
    submittedAt: '2026-08-20T09:00:00.000Z',
    labelledMock: true,
  },
  {
    id: 'app-mock-002',
    requester: 'host.lin@example.test',
    purpose: 'Download session check-in CSV for rehearsal',
    asset: 'tickets.checkin_log',
    status: 'approved',
    submittedAt: '2026-08-18T14:30:00.000Z',
    labelledMock: true,
  },
  {
    id: 'app-mock-003',
    requester: 'vendor.demo@example.test',
    purpose: 'Request cover-image blob quota',
    asset: 'events.cover_image',
    status: 'rejected',
    submittedAt: '2026-08-12T08:15:00.000Z',
    labelledMock: true,
  },
];
