import {
  canReadEventRecord,
  eventListStatusForCaller,
} from './public-event-read';

describe('public event read scope', () => {
  it('forces published for anonymous list and ignores status=draft', () => {
    expect(eventListStatusForCaller(false, 'draft')).toBe('published');
    expect(eventListStatusForCaller(false, undefined)).toBe('published');
  });

  it('lets an organizer or machine caller pass through the requested status', () => {
    expect(eventListStatusForCaller(true, 'draft')).toBe('draft');
    expect(eventListStatusForCaller(true, undefined)).toBe(undefined);
  });

  it('hides unpublished records from anonymous callers', () => {
    expect(canReadEventRecord(false, 'published')).toBe(true);
    expect(canReadEventRecord(false, 'draft')).toBe(false);
    expect(canReadEventRecord(true, 'draft')).toBe(true);
  });
});
