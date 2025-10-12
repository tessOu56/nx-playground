/**
 * Orders Mock Data Jest Tests
 */

const { mockOrders } = require('./data');
const { generateOrder, generateMultipleOrders } = require('./generate');

describe('Orders Mock Data', () => {
  describe('mockOrders', () => {
    it('should have valid orders data', () => {
      expect(mockOrders).toBeDefined();
      expect(Array.isArray(mockOrders)).toBe(true);
      expect(mockOrders.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each order', () => {
      const requiredFields = [
        'id',
        'eventId',
        'userId',
        'quantity',
        'totalAmount',
        'status',
        'paymentMethod',
        'createdAt',
        'updatedAt',
      ];

      mockOrders.forEach((order: any) => {
        requiredFields.forEach(field => {
          expect(order).toHaveProperty(field);
          expect(order[field]).toBeDefined();
        });
      });
    });

    it('should have valid quantities and amounts', () => {
      mockOrders.forEach((order: any) => {
        expect(typeof order.quantity).toBe('number');
        expect(order.quantity).toBeGreaterThan(0);
        expect(typeof order.totalAmount).toBe('number');
        expect(order.totalAmount).toBeGreaterThan(0);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['pending', 'confirmed', 'cancelled'];

      mockOrders.forEach((order: any) => {
        expect(validStatuses).toContain(order.status);
        // paymentStatus 檢查已移到 Bill 測試中
      });
    });

    it('should have unique IDs', () => {
      const ids = mockOrders.map((o: any) => o.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe('generateOrder', () => {
    it('should generate valid order with default values', () => {
      const order = generateOrder(
        'test-order-1',
        'test-event-1',
        'test-user-1',
        2,
        1500
      );

      expect(order.id).toBe('test-order-1');
      expect(order.eventId).toBe('test-event-1');
      expect(order.userId).toBe('test-user-1');
      expect(order.quantity).toBe(2);
      expect(order.totalAmount).toBe(1500);
      expect(order.status).toBe('pending');
      expect(order.paymentMethod).toBe('cash');
      // paymentStatus 已移到 Bill 中
    });

    it('should generate order with custom status', () => {
      const order = generateOrder(
        'test-order-2',
        'test-event-2',
        'test-user-2',
        1,
        750,
        'confirmed',
        'atm'
      );

      expect(order.status).toBe('confirmed');
      expect(order.paymentMethod).toBe('atm');
      // paymentStatus 已移到 Bill 中
      expect(order.confirmedAt).toBeDefined();
    });
  });

  describe('generateMultipleOrders', () => {
    it('should generate specified number of orders', () => {
      const orders = generateMultipleOrders(3);
      expect(orders).toHaveLength(3);
    });

    it('should generate orders with valid structure', () => {
      const orders = generateMultipleOrders(2);

      orders.forEach((order: any) => {
        expect(order.id).toMatch(/^order-\d{3}$/);
        expect(order.quantity).toBeGreaterThan(0);
        expect(order.totalAmount).toBeGreaterThan(0);
      });
    });
  });
});
