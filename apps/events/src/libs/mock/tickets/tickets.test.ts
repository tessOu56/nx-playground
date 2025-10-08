/**
 * Tickets Mock Data Jest Tests
 */

const { mockTickets } = require('./data');
const { generateTicket, generateMultipleTickets } = require('./generate');

describe('Tickets Mock Data', () => {
  describe('mockTickets', () => {
    it('should have valid tickets data', () => {
      expect(mockTickets).toBeDefined();
      expect(Array.isArray(mockTickets)).toBe(true);
      expect(mockTickets.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each ticket', () => {
      const requiredFields = [
        'id',
        'orderId',
        'eventId',
        'type',
        'status',
        'createdAt',
        'updatedAt',
      ];

      mockTickets.forEach((ticket: any) => {
        requiredFields.forEach(field => {
          expect(ticket).toHaveProperty(field);
          expect(ticket[field]).toBeDefined();
        });
      });
    });

    it('should have valid ticket types', () => {
      const validTypes = ['standard', 'general', 'vip', 'early_bird'];

      mockTickets.forEach((ticket: any) => {
        expect(validTypes).toContain(ticket.type);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['issued', 'used', 'cancelled'];

      mockTickets.forEach((ticket: any) => {
        expect(validStatuses).toContain(ticket.status);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockTickets.map((t: any) => t.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid date formats', () => {
      mockTickets.forEach((ticket: any) => {
        expect(() => new Date(ticket.createdAt)).not.toThrow();
        expect(() => new Date(ticket.updatedAt)).not.toThrow();
      });
    });
  });

  describe('generateTicket', () => {
    it('should generate valid ticket with default values', () => {
      const ticket = generateTicket(
        'test-ticket-1',
        'test-order-1',
        'test-event-1'
      );

      expect(ticket.id).toBe('test-ticket-1');
      expect(ticket.orderId).toBe('test-order-1');
      expect(ticket.eventId).toBe('test-event-1');
      expect(ticket.type).toBe('general');
      expect(ticket.status).toBe('issued');
    });

    it('should generate ticket with custom type and status', () => {
      const ticket = generateTicket(
        'test-ticket-2',
        'test-order-2',
        'test-event-2',
        'vip',
        'used'
      );

      expect(ticket.type).toBe('vip');
      expect(ticket.status).toBe('used');
    });
  });

  describe('generateMultipleTickets', () => {
    it('should generate specified number of tickets', () => {
      const tickets = generateMultipleTickets(5);
      expect(tickets).toHaveLength(5);
    });

    it('should generate tickets with valid structure', () => {
      const tickets = generateMultipleTickets(3);

      tickets.forEach((ticket: any) => {
        expect(ticket.id).toMatch(/^ticket-\d+$/);
        expect(ticket.orderId).toMatch(/^order-\d+$/);
        expect(['general', 'vip', 'early_bird', 'standard']).toContain(
          ticket.type
        );
        expect(['issued', 'used', 'cancelled']).toContain(ticket.status);
      });
    });
  });
});
