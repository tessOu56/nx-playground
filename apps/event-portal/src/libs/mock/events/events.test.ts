/**
 * Events Mock Data Jest Tests
 */

const { mockEvents, mockEventDetails } = require('./data');
const { generateEvent, generateMultipleEvents } = require('./generate');

describe('Events Mock Data', () => {
  describe('mockEvents', () => {
    it('should have valid events data', () => {
      expect(mockEvents).toBeDefined();
      expect(Array.isArray(mockEvents)).toBe(true);
      expect(mockEvents.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each event', () => {
      const requiredFields = [
        'id',
        'title',
        'description',
        'date',
        'location',
        'vendorId',
        'image',
        'status',
        'sessions',
      ];

      mockEvents.forEach((event: any) => {
        requiredFields.forEach(field => {
          expect(event).toHaveProperty(field);
          expect(event[field]).toBeDefined();
        });
      });
    });

    it('should have valid dates', () => {
      mockEvents.forEach((event: any) => {
        expect(() => new Date(event.date)).not.toThrow();
        expect(() => new Date(event.createdAt)).not.toThrow();
        expect(() => new Date(event.updatedAt)).not.toThrow();
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['upcoming', 'ongoing', 'completed', 'cancelled'];

      mockEvents.forEach((event: any) => {
        expect(validStatuses).toContain(event.status);
      });
    });

    it('should have valid cover images', () => {
      mockEvents.forEach((event: any) => {
        expect(event.image).toMatch(/^https:\/\/picsum\.photos/);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockEvents.map((e: any) => e.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid vendor IDs', () => {
      mockEvents.forEach((event: any) => {
        expect(event.vendorId).toMatch(/^vendor-\d+$/);
      });
    });
  });

  describe('mockEventDetails', () => {
    it('should have valid event details data', () => {
      expect(mockEventDetails).toBeDefined();
      expect(typeof mockEventDetails).toBe('object');
      expect(Object.keys(mockEventDetails).length).toBeGreaterThan(0);
    });

    it('should have sessions for each event detail', () => {
      Object.values(mockEventDetails).forEach((detail: any) => {
        expect(detail.sessions).toBeDefined();
        expect(Array.isArray(detail.sessions)).toBe(true);
        expect(detail.sessions.length).toBeGreaterThan(0);
      });
    });

    it('should have valid session structure', () => {
      Object.values(mockEventDetails).forEach((detail: any) => {
        detail.sessions.forEach((session: any) => {
          expect(session).toHaveProperty('id');
          expect(session).toHaveProperty('name');
          expect(session).toHaveProperty('date');
          expect(session).toHaveProperty('time');
          expect(session).toHaveProperty('tickets');
          expect(Array.isArray(session.tickets)).toBe(true);
        });
      });
    });

    it('should have valid ticket structure in sessions', () => {
      Object.values(mockEventDetails).forEach((detail: any) => {
        detail.sessions.forEach((session: any) => {
          session.tickets.forEach((ticket: any) => {
            expect(ticket).toHaveProperty('type');
            expect(ticket).toHaveProperty('price');
            expect(ticket).toHaveProperty('totalQuantity');
            expect(ticket).toHaveProperty('availableQuantity');
            expect(typeof ticket.price).toBe('number');
            expect(typeof ticket.totalQuantity).toBe('number');
            expect(typeof ticket.availableQuantity).toBe('number');
            expect(ticket.availableQuantity).toBeLessThanOrEqual(
              ticket.totalQuantity
            );
          });
        });
      });
    });
  });

  describe('generateEvent', () => {
    it('should generate valid event with default values', () => {
      const event = generateEvent(
        'test-event-1',
        'vendor-1',
        'Test Event 1',
        'Test description',
        '2024-12-31',
        'Test Location',
        1000,
        100
      );

      expect(event.id).toBe('test-event-1');
      expect(event.title).toBe('Test Event 1');
      expect(event.vendorId).toBe('vendor-1');
      expect(event.image).toMatch(/^\/images\/events\//);
      expect(['upcoming', 'ongoing', 'completed', 'cancelled']).toContain(
        event.status
      );
    });

    it('should generate event with custom values', () => {
      const event = generateEvent(
        'custom-event-1',
        'vendor-1',
        'Custom Event',
        'Custom description',
        '2024-12-31',
        'Custom Location',
        1500,
        200,
        { status: 'upcoming' }
      );

      expect(event.title).toBe('Custom Event');
      expect(event.description).toBe('Custom description');
      expect(event.date).toBe('2024-12-31');
      expect(event.location).toBe('Custom Location');
      expect(event.vendorId).toBe('vendor-1');
      expect(event.status).toBe('upcoming');
    });
  });

  describe('generateMultipleEvents', () => {
    it('should generate specified number of events', () => {
      const events = generateMultipleEvents(5, 'vendor-1');
      expect(events).toHaveLength(5);
    });

    it('should generate events with valid structure', () => {
      const events = generateMultipleEvents(3, 'vendor-1');

      events.forEach((event: any) => {
        expect(event.id).toMatch(/^generated-event-\d+$/);
        expect(event.title).toMatch(/^Generated Event \d+$/);
        expect(event.vendorId).toBe('vendor-1');
        expect(event.image).toMatch(/^\/images\/events\//);
        expect(['upcoming', 'ongoing', 'completed', 'cancelled']).toContain(
          event.status
        );
      });
    });

    it('should generate unique event IDs', () => {
      const events = generateMultipleEvents(10, 'vendor-1');
      const ids = events.map((e: any) => e.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});
