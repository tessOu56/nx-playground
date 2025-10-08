/**
 * Line Settings Mock Data Jest Tests
 */

const { mockLineSettings } = require('./data');
const {
  generateLineSettings,
  generateMultipleLineSettings,
} = require('./generate');

describe('Line Settings Mock Data', () => {
  describe('mockLineSettings', () => {
    it('should have valid line settings data', () => {
      expect(mockLineSettings).toBeDefined();
      expect(typeof mockLineSettings).toBe('object');
      expect(Object.keys(mockLineSettings).length).toBeGreaterThan(0);
    });

    it('should have all required fields for each setting', () => {
      const requiredFields = [
        'officialAccountId',
        'description',
        'displayName',
      ];

      Object.values(mockLineSettings).forEach((setting: any) => {
        requiredFields.forEach(field => {
          expect(setting).toHaveProperty(field);
          expect(setting[field]).toBeDefined();
        });
      });
    });

    it('should have valid official account IDs', () => {
      Object.values(mockLineSettings).forEach((setting: any) => {
        expect(typeof setting.officialAccountId).toBe('string');
        expect(setting.officialAccountId).toMatch(/^@/);
      });
    });

    it('should have valid display names', () => {
      Object.values(mockLineSettings).forEach((setting: any) => {
        expect(typeof setting.displayName).toBe('string');
        expect(setting.displayName.length).toBeGreaterThan(0);
      });
    });

    it('should have valid descriptions', () => {
      Object.values(mockLineSettings).forEach((setting: any) => {
        expect(typeof setting.description).toBe('string');
        expect(setting.description.length).toBeGreaterThan(0);
      });
    });

    it('should have unique official account IDs', () => {
      const accountIds = Object.values(mockLineSettings).map(
        (s: any) => s.officialAccountId
      );
      const uniqueAccountIds = new Set(accountIds);
      expect(accountIds.length).toBe(uniqueAccountIds.size);
    });
  });

  describe('generateLineSettings', () => {
    it('should generate valid line settings', () => {
      const setting = generateLineSettings('@test-vendor');

      expect(setting.officialAccountId).toBe('@test-vendor');
      expect(setting.displayName).toBeDefined();
      expect(setting.description).toBeDefined();
      expect(typeof setting.displayName).toBe('string');
      expect(typeof setting.description).toBe('string');
    });

    it('should generate line settings with custom values', () => {
      const setting = generateLineSettings('@custom-vendor', {
        displayName: 'Custom Vendor',
        description: 'Custom description',
        statusMessage: 'Custom status message',
        pictureUrl: 'https://custom.picture.com',
      });

      expect(setting.officialAccountId).toBe('@custom-vendor');
      expect(setting.displayName).toBe('Custom Vendor');
      expect(setting.description).toBe('Custom description');
      expect(setting.statusMessage).toBe('Custom status message');
      expect(setting.pictureUrl).toBe('https://custom.picture.com');
    });
  });

  describe('generateMultipleLineSettings', () => {
    it('should generate specified number of line settings', () => {
      const accountIds = [
        '@vendor1',
        '@vendor2',
        '@vendor3',
        '@vendor4',
        '@vendor5',
      ];
      const settings = generateMultipleLineSettings(accountIds);
      expect(Object.keys(settings)).toHaveLength(5);
    });

    it('should generate line settings with valid structure', () => {
      const accountIds = ['@vendor1', '@vendor2', '@vendor3'];
      const settings = generateMultipleLineSettings(accountIds);

      Object.entries(settings).forEach(([key, setting]: [string, any]) => {
        expect(key).toMatch(/^@vendor\d+$/);
        expect(setting.officialAccountId).toBe(key);
        expect(typeof setting.displayName).toBe('string');
        expect(typeof setting.description).toBe('string');
      });
    });

    it('should generate unique official account IDs', () => {
      const accountIds = [
        '@vendor1',
        '@vendor2',
        '@vendor3',
        '@vendor4',
        '@vendor5',
        '@vendor6',
        '@vendor7',
        '@vendor8',
        '@vendor9',
        '@vendor10',
      ];
      const settings = generateMultipleLineSettings(accountIds);
      const accountIdsFromSettings = Object.values(settings).map(
        (s: any) => s.officialAccountId
      );
      const uniqueAccountIds = new Set(accountIdsFromSettings);
      expect(accountIdsFromSettings.length).toBe(uniqueAccountIds.size);
    });
  });
});
