import { describe, it, expect } from 'vitest';

import {
  emailSchema,
  passwordSchema,
  phoneSchema,
  slugSchema,
  uuidSchema,
  localeSchema,
  paginationLimitSchema,
} from './common';

describe('Common Schemas', () => {
  describe('emailSchema', () => {
    it('should accept valid emails', () => {
      expect(emailSchema.parse('user@example.com')).toBe('user@example.com');
      expect(emailSchema.parse('test.user+tag@domain.co.uk')).toBe(
        'test.user+tag@domain.co.uk'
      );
    });

    it('should reject invalid emails', () => {
      expect(() => emailSchema.parse('invalid')).toThrow();
      expect(() => emailSchema.parse('user@')).toThrow();
      expect(() => emailSchema.parse('@domain.com')).toThrow();
    });

    it('should trim and lowercase emails', () => {
      expect(emailSchema.parse('  USER@EXAMPLE.COM  ')).toBe(
        'user@example.com'
      );
    });
  });

  describe('passwordSchema', () => {
    it('should accept valid passwords', () => {
      expect(passwordSchema.parse('Password123')).toBe('Password123');
      expect(passwordSchema.parse('MyP@ssw0rd')).toBe('MyP@ssw0rd');
    });

    it('should reject passwords without uppercase', () => {
      expect(() => passwordSchema.parse('password123')).toThrow('uppercase');
    });

    it('should reject passwords without lowercase', () => {
      expect(() => passwordSchema.parse('PASSWORD123')).toThrow('lowercase');
    });

    it('should reject passwords without numbers', () => {
      expect(() => passwordSchema.parse('Password')).toThrow('number');
    });

    it('should reject short passwords', () => {
      expect(() => passwordSchema.parse('Pass1')).toThrow(
        'at least 8 characters'
      );
    });
  });

  describe('phoneSchema', () => {
    it('should accept valid phone numbers', () => {
      expect(phoneSchema.parse('+886912345678')).toBe('+886912345678');
      expect(phoneSchema.parse('+12025551234')).toBe('+12025551234');
    });

    it('should reject invalid phone numbers', () => {
      expect(() => phoneSchema.parse('abc')).toThrow();
      expect(() => phoneSchema.parse('+0123456789')).toThrow(); // Starts with 0 after +
    });
  });

  describe('slugSchema', () => {
    it('should accept valid slugs', () => {
      expect(slugSchema.parse('hello-world')).toBe('hello-world');
      expect(slugSchema.parse('my-blog-post-2024')).toBe('my-blog-post-2024');
    });

    it('should reject invalid slugs', () => {
      expect(() => slugSchema.parse('Hello World')).toThrow(); // spaces
      expect(() => slugSchema.parse('hello_world')).toThrow(); // underscore
      expect(() => slugSchema.parse('HELLO')).toThrow(); // uppercase
    });
  });

  describe('uuidSchema', () => {
    it('should accept valid UUIDs', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      expect(uuidSchema.parse(uuid)).toBe(uuid);
    });

    it('should reject invalid UUIDs', () => {
      expect(() => uuidSchema.parse('not-a-uuid')).toThrow();
      expect(() => uuidSchema.parse('123')).toThrow();
    });
  });

  describe('localeSchema', () => {
    it('should accept valid locales', () => {
      expect(localeSchema.parse('en')).toBe('en');
      expect(localeSchema.parse('zh-TW')).toBe('zh-TW');
    });

    it('should reject invalid locales', () => {
      expect(() => localeSchema.parse('fr')).toThrow();
      expect(() => localeSchema.parse('zh-CN')).toThrow();
    });
  });

  describe('paginationLimitSchema', () => {
    it('should accept valid limits', () => {
      expect(paginationLimitSchema.parse(10)).toBe(10);
      expect(paginationLimitSchema.parse(50)).toBe(50);
    });

    it('should use default value', () => {
      expect(paginationLimitSchema.parse(undefined)).toBe(20);
    });

    it('should reject limits out of range', () => {
      expect(() => paginationLimitSchema.parse(0)).toThrow('at least 1');
      expect(() => paginationLimitSchema.parse(101)).toThrow('not exceed 100');
    });
  });
});
