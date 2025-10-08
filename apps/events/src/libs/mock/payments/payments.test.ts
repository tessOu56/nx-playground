/**
 * Payments Mock Data Jest Tests
 */

const { mockPayments } = require('./data');
const { generatePayment, generateMultiplePayments } = require('./generate');

describe('Payments Mock Data', () => {
  describe('mockPayments', () => {
    it('should have valid payments data', () => {
      expect(mockPayments).toBeDefined();
      expect(Array.isArray(mockPayments)).toBe(true);
      expect(mockPayments.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each payment', () => {
      const requiredFields = [
        'id',
        'billId',
        'orderId',
        'eventId',
        'userId',
        'amount',
        'status',
        'paymentMethod',
        'createdAt',
        'updatedAt',
      ];

      mockPayments.forEach((payment: any) => {
        requiredFields.forEach(field => {
          expect(payment).toHaveProperty(field);
          expect(payment[field]).toBeDefined();
        });
      });
    });

    it('should have valid amounts', () => {
      mockPayments.forEach((payment: any) => {
        expect(typeof payment.amount).toBe('number');
        expect(payment.amount).toBeGreaterThan(0);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = [
        'pending',
        'processing',
        'completed',
        'failed',
        'cancelled',
        'refunded',
        'partial_refunded',
      ];

      mockPayments.forEach((payment: any) => {
        expect(validStatuses).toContain(payment.status);
      });
    });

    it('should have valid payment methods', () => {
      const validPaymentMethods = ['cash', 'atm'];

      mockPayments.forEach((payment: any) => {
        expect(validPaymentMethods).toContain(payment.paymentMethod);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockPayments.map((p: any) => p.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid date formats', () => {
      mockPayments.forEach((payment: any) => {
        expect(() => new Date(payment.createdAt)).not.toThrow();
        expect(() => new Date(payment.updatedAt)).not.toThrow();

        if (payment.processedAt) {
          expect(() => new Date(payment.processedAt)).not.toThrow();
        }
        if (payment.failedAt) {
          expect(() => new Date(payment.failedAt)).not.toThrow();
        }
      });
    });
  });

  describe('generatePayment', () => {
    it('should generate valid payment with default values', () => {
      const payment = generatePayment(
        'test-payment-1',
        'test-bill-1',
        'test-order-1',
        'test-event-1',
        'test-user-1',
        1000
      );

      expect(payment.id).toBe('test-payment-1');
      expect(payment.billId).toBe('test-bill-1');
      expect(payment.orderId).toBe('test-order-1');
      expect(payment.eventId).toBe('test-event-1');
      expect(payment.userId).toBe('test-user-1');
      expect(payment.amount).toBe(1000);
      expect(payment.status).toBe('pending');
      expect(payment.paymentMethod).toBe('cash');
    });

    it('should generate payment with custom status', () => {
      const payment = generatePayment(
        'test-payment-2',
        'test-bill-2',
        'test-order-2',
        'test-event-2',
        'test-user-2',
        2000,
        'completed',
        'atm'
      );

      expect(payment.status).toBe('completed');
      expect(payment.paymentMethod).toBe('atm');
      expect(payment.processedAt).toBeDefined();
    });
  });

  describe('generateMultiplePayments', () => {
    it('should generate specified number of payments', () => {
      const payments = generateMultiplePayments(5);
      expect(payments).toHaveLength(5);
    });

    it('should generate payments with valid structure', () => {
      const payments = generateMultiplePayments(3);

      payments.forEach((payment: any) => {
        expect(payment.id).toMatch(/^payment-\d{3}$/);
        expect(payment.billId).toMatch(/^bill-\d{3}$/);
        expect(payment.orderId).toMatch(/^order-\d{3}$/);
        expect(payment.amount).toBeGreaterThan(0);
      });
    });
  });
});
