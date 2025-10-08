/**
 * Users Mock Data Jest Tests
 */

const { mockUsers } = require('./data');
const { generateUser, generateMultipleUsers } = require('./generate');

describe('Users Mock Data', () => {
  describe('mockUsers', () => {
    it('should have valid users data', () => {
      expect(mockUsers).toBeDefined();
      expect(Array.isArray(mockUsers)).toBe(true);
      expect(mockUsers.length).toBeGreaterThan(0);
    });

    it('should have all required fields for each user', () => {
      const requiredFields = [
        'id',
        'name',
        'avatar',
        'email',
        'lineId',
        'joinedDate',
        'registeredEvents',
      ];

      mockUsers.forEach((user: any) => {
        requiredFields.forEach(field => {
          expect(user).toHaveProperty(field);
          expect(user[field]).toBeDefined();
        });
      });
    });

    it('should have valid email formats', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      mockUsers.forEach((user: any) => {
        expect(emailRegex.test(user.email)).toBe(true);
      });
    });

    it('should have valid LINE IDs', () => {
      mockUsers.forEach((user: any) => {
        expect(user.lineId).toMatch(/^U[a-f0-9]+$/);
      });
    });

    it('should have valid avatars', () => {
      mockUsers.forEach((user: any) => {
        expect(user.avatar).toMatch(/^https:\/\/picsum\.photos/);
      });
    });

    it('should have unique IDs', () => {
      const ids = mockUsers.map((u: any) => u.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have unique LINE IDs', () => {
      const lineIds = mockUsers.map((u: any) => u.lineId);
      const uniqueLineIds = new Set(lineIds);
      expect(lineIds.length).toBe(uniqueLineIds.size);
    });

    it('should have valid date formats', () => {
      mockUsers.forEach((user: any) => {
        expect(() => new Date(user.createdAt)).not.toThrow();
        expect(() => new Date(user.updatedAt)).not.toThrow();
      });
    });
  });

  describe('generateUser', () => {
    it('should generate valid user with default values', () => {
      const user = generateUser(
        'test-user-1',
        'Test User 1',
        'testuser1@example.com',
        '0912-345-678',
        'Test bio',
        'U1234567890abcdef1234567890abcdef1'
      );

      expect(user.id).toBe('test-user-1');
      expect(user.name).toBe('Test User 1');
      expect(user.email).toBe('testuser1@example.com');
      expect(user.lineId).toBe('U1234567890abcdef1234567890abcdef1');
      expect(user.avatar).toMatch(/^https:\/\/picsum\.photos/);
    });

    it('should generate user with custom values', () => {
      const user = generateUser(
        'custom-user-1',
        'Custom Name',
        'custom@example.com',
        '0987-654-321',
        'Custom bio',
        'U00000000000000000000000000000000'
      );

      expect(user.name).toBe('Custom Name');
      expect(user.email).toBe('custom@example.com');
      expect(user.lineId).toBe('U00000000000000000000000000000000');
    });
  });

  describe('generateMultipleUsers', () => {
    it('should generate specified number of users', () => {
      const users = generateMultipleUsers(5);
      expect(users).toHaveLength(5);
    });

    it('should generate users with valid structure', () => {
      const users = generateMultipleUsers(3);

      users.forEach((user: any) => {
        expect(user.id).toMatch(/^user-\d+$/);
        expect(user.name).toBeDefined();
        expect(user.email).toBeDefined();
        expect(user.lineId).toMatch(/^U[a-f0-9]+$/);
        expect(user.avatar).toMatch(/^https:\/\/picsum\.photos/);
      });
    });

    it('should generate unique LINE IDs', () => {
      const users = generateMultipleUsers(10);
      const lineIds = users.map((u: any) => u.lineId);
      const uniqueLineIds = new Set(lineIds);
      expect(lineIds.length).toBe(uniqueLineIds.size);
    });
  });
});
