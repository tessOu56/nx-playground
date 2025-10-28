/**
 * Event mock data generators
 */

export interface MockEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled';
}

export function createMockEvent(overrides: Partial<MockEvent> = {}): MockEvent {
  return {
    id: 'event-1',
    title: 'Test Event',
    description: 'This is a test event',
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-02'),
    location: 'Test Venue',
    capacity: 100,
    status: 'published',
    ...overrides,
  };
}

export function createMockEvents(count: number): MockEvent[] {
  return Array.from({ length: count }, (_, i) =>
    createMockEvent({
      id: `event-${i + 1}`,
      title: `Event ${i + 1}`,
    })
  );
}

