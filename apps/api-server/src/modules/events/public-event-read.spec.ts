import {
  canReadEventRecord,
  eventListStatusForCaller,
} from './public-event-read';

describe('public event read scope', () => {
  const token = 'event-admin-token';
  const original = process.env.ADMIN_API_TOKEN;

  beforeEach(() => {
    process.env.ADMIN_API_TOKEN = token;
  });

  afterEach(() => {
    if (original === undefined) {
      delete process.env.ADMIN_API_TOKEN;
    } else {
      process.env.ADMIN_API_TOKEN = original;
    }
  });

  it('forces published for anonymous list and ignores status=draft', () => {
    expect(eventListStatusForCaller(undefined, 'draft')).toBe('published');
    expect(eventListStatusForCaller('Bearer wrong', undefined)).toBe(
      'published'
    );
  });

  it('lets an admin bearer pass through the requested status', () => {
    expect(eventListStatusForCaller(`Bearer ${token}`, 'draft')).toBe('draft');
    expect(eventListStatusForCaller(`Bearer ${token}`, undefined)).toBe(
      undefined
    );
  });

  it('hides unpublished records from anonymous callers', () => {
    expect(canReadEventRecord(undefined, 'published')).toBe(true);
    expect(canReadEventRecord(undefined, 'draft')).toBe(false);
    expect(canReadEventRecord(`Bearer ${token}`, 'draft')).toBe(true);
  });
});
