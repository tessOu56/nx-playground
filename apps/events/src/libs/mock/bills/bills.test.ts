/**
 * Bills Mock Data Jest Tests
 *
 * 使用 Jest 測試框架測試 bills mock 資料的完整性和正確性
 */

// 直接導入相對路徑避免路徑解析問題
const { mockBills } = require('./data');
const { generateBill, generateMultipleBills } = require('./generate');

describe('Bills Mock Data', () => {
  describe('mockBills', () => {
    it('should have valid bills data', () => {
      expect(mockBills).toBeDefined();
      expect(Array.isArray(mockBills)).toBe(true);
      expect(mockBills.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each bill', () => {
      const requiredFields = [
        'id',
        'orderId',
        'eventId',
        'userId',
        'amount',
        'status',
        'paymentMethod',
        'dueDate',
        'createdAt',
        'updatedAt',
        'qrCode',
      ];

      mockBills.forEach((bill: any) => {
        requiredFields.forEach(field => {
          expect(bill).toHaveProperty(field);
          expect(bill[field]).toBeDefined();
        });
      });
    });

    it('should have valid amounts', () => {
      mockBills.forEach((bill: any) => {
        expect(typeof bill.amount).toBe('number');
        expect(bill.amount).toBeGreaterThan(0);
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['pending', 'paid', 'cancelled'];

      mockBills.forEach((bill: any) => {
        expect(validStatuses).toContain(bill.status);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockBills.map((b: any) => b.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have valid date formats', () => {
      mockBills.forEach((bill: any) => {
        expect(() => new Date(bill.createdAt)).not.toThrow();
        expect(() => new Date(bill.updatedAt)).not.toThrow();
        expect(() => new Date(bill.dueDate)).not.toThrow();

        if (bill.paidAt) {
          expect(() => new Date(bill.paidAt)).not.toThrow();
        }
      });
    });
  });

  describe('generateBill', () => {
    it('should generate valid bill', () => {
      const bill = generateBill(
        'test-bill-1',
        'test-order-1',
        'test-event-1',
        'test-user-1',
        1000,
        'pending',
        'cash'
      );

      expect(bill.id).toBe('test-bill-1');
      expect(bill.orderId).toBe('test-order-1');
      expect(bill.eventId).toBe('test-event-1');
      expect(bill.userId).toBe('test-user-1');
      expect(bill.amount).toBe(1000);
      expect(bill.status).toBe('pending');
      expect(bill.paymentMethod).toBe('cash');
      expect(bill.qrCode).toBe('qr-code-test-bill-1');
    });

    it('should set paidAt when status is paid', () => {
      const bill = generateBill(
        'test-bill-2',
        'test-order-2',
        'test-event-2',
        'test-user-2',
        2000,
        'paid',
        'atm'
      );

      expect(bill.status).toBe('paid');
      expect(bill.paidAt).toBeDefined();
    });
  });

  describe('generateMultipleBills', () => {
    it('should generate specified number of bills', () => {
      const bills = generateMultipleBills(5);
      expect(bills).toHaveLength(5);
    });

    it('should generate bills with valid structure', () => {
      const bills = generateMultipleBills(3);

      bills.forEach((bill: any) => {
        expect(bill.id).toMatch(/^bill-\d{3}$/);
        expect(bill.orderId).toMatch(/^order-\d{3}$/);
        expect(bill.amount).toBeGreaterThan(0);
      });
    });
  });
});
