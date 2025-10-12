/**
 * Vendors Mock Data Jest Tests
 */

const { mockVendors } = require('./data');
const { generateVendor, generateMultipleVendors } = require('./generate');

describe('Vendors Mock Data', () => {
  describe('mockVendors', () => {
    it('should have valid vendors data', () => {
      expect(mockVendors).toBeDefined();
      expect(Array.isArray(mockVendors)).toBe(true);
      expect(mockVendors.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each vendor', () => {
      const requiredFields = [
        'id',
        'events',
        'email',
        'lineOfficialAccountId',
        'defaultBankAccount',
      ];

      mockVendors.forEach((vendor: any) => {
        requiredFields.forEach(field => {
          expect(vendor).toHaveProperty(field);
          expect(vendor[field]).toBeDefined();
        });
      });
    });

    it('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      mockVendors.forEach((vendor: any) => {
        expect(emailRegex.test(vendor.email)).toBe(true);
      });
    });

    it('should have valid bank account information', () => {
      mockVendors.forEach((vendor: any) => {
        expect(vendor.defaultBankAccount).toBeDefined();
        expect(vendor.defaultBankAccount.bankCode).toBeDefined();
        expect(vendor.defaultBankAccount.accountNumber).toBeDefined();
        expect(vendor.defaultBankAccount.accountName).toBeDefined();
      });
    });

    it('should have valid LINE official account IDs', () => {
      mockVendors.forEach((vendor: any) => {
        expect(vendor.lineOfficialAccountId).toMatch(/^@/);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockVendors.map((v: any) => v.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have unique contact emails', () => {
      const emails = mockVendors.map((v: any) => v.email);
      const uniqueEmails = new Set(emails);
      expect(emails.length).toBe(uniqueEmails.size);
    });
  });

  describe('generateVendor', () => {
    it('should generate valid vendor with default values', () => {
      const vendor = generateVendor('test-vendor-1');

      expect(vendor.id).toBe('test-vendor-1');
      expect(vendor.email).toMatch(/^contact@testvendor-1\.com$/);
      expect(vendor.lineOfficialAccountId).toBe('@testvendor-1');
      expect(vendor.defaultBankAccount).toBeDefined();
      expect(typeof vendor.events).toBe('number');
    });

    it('should generate vendor with custom values', () => {
      const vendor = generateVendor('custom-vendor-1', {
        email: 'custom@vendor.com',
        bankCode: '013',
        accountNumber: '1234567890',
        accountName: 'Custom Account',
        events: 10,
      });

      expect(vendor.id).toBe('custom-vendor-1');
      expect(vendor.email).toBe('custom@vendor.com');
      expect(vendor.defaultBankAccount.bankCode).toBe('013');
      expect(vendor.defaultBankAccount.accountNumber).toBe('1234567890');
      expect(vendor.defaultBankAccount.accountName).toBe('Custom Account');
      expect(vendor.events).toBe(10);
    });
  });

  describe('generateMultipleVendors', () => {
    it('should generate specified number of vendors', () => {
      const vendors = generateMultipleVendors(5);
      expect(vendors).toHaveLength(5);
    });

    it('should generate vendors with valid structure', () => {
      const vendors = generateMultipleVendors(3);

      vendors.forEach((vendor: any) => {
        expect(vendor.id).toMatch(/^vendor-\d+$/);
        expect(vendor.email).toMatch(/^contact@vendor\d+\.com$/);
        expect(vendor.lineOfficialAccountId).toMatch(/^@vendor\d+$/);
        expect(vendor.defaultBankAccount).toBeDefined();
        expect(typeof vendor.events).toBe('number');
      });
    });

    it('should generate unique contact emails', () => {
      const vendors = generateMultipleVendors(10);
      const emails = vendors.map((v: any) => v.email);
      const uniqueEmails = new Set(emails);
      expect(emails.length).toBe(uniqueEmails.size);
    });
  });
});
