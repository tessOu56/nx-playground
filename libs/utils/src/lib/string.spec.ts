import { describe, it, expect } from 'vitest';

import {
  truncate,
  slugify,
  capitalize,
  capitalizeWords,
  camelToKebab,
  kebabToCamel,
  sanitizeHtml,
  getInitials,
  randomString,
  isEmpty,
  maskString,
} from './string';

describe('String Utilities', () => {
  describe('truncate', () => {
    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('He...');
    });

    it('should not truncate short strings', () => {
      expect(truncate('Hi', 5)).toBe('Hi');
    });

    it('should use custom suffix', () => {
      expect(truncate('Hello World', 5, '…')).toBe('Hell…');
    });
  });

  describe('slugify', () => {
    it('should convert to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Hello World!')).toBe('hello-world');
      expect(slugify('  Hello  World  ')).toBe('hello-world');
    });

    it('should handle special characters', () => {
      expect(slugify('Hello @#$ World')).toBe('hello-world');
    });

    it('should handle underscores', () => {
      expect(slugify('hello_world')).toBe('hello-world');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('capitalizeWords', () => {
    it('should capitalize each word', () => {
      expect(capitalizeWords('hello world')).toBe('Hello World');
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('helloWorld')).toBe('hello-world');
      expect(camelToKebab('myVariableName')).toBe('my-variable-name');
    });
  });

  describe('kebabToCamel', () => {
    it('should convert kebab-case to camelCase', () => {
      expect(kebabToCamel('hello-world')).toBe('helloWorld');
      expect(kebabToCamel('my-variable-name')).toBe('myVariableName');
    });
  });

  describe('sanitizeHtml', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeHtml('<script>alert("xss")</script>')).toBe('alert("xss")');
      expect(sanitizeHtml('<p>Hello <b>World</b></p>')).toBe('Hello World');
    });
  });

  describe('getInitials', () => {
    it('should extract initials', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('John Michael Doe', 3)).toBe('JMD');
    });
  });

  describe('randomString', () => {
    it('should generate random string of specified length', () => {
      const result = randomString(10);
      expect(result.length).toBe(10);
      expect(/^[a-zA-Z0-9]+$/.test(result)).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty strings', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('   ')).toBe(true);
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty strings', () => {
      expect(isEmpty('hello')).toBe(false);
    });
  });

  describe('maskString', () => {
    it('should mask middle part of string', () => {
      // 'user@example.com' length = 16
      // visible = 4 on each side
      // middle = 16 - 8 = 8 chars masked
      expect(maskString('user@example.com', 4)).toBe('user********.com');
    });

    it('should not mask short strings', () => {
      expect(maskString('hi', 3)).toBe('hi');
    });
  });
});

