import { describe, it, expect } from 'vitest';

import {
  userLoginSchema,
  userRegisterSchema,
  passwordChangeSchema,
  userProfileUpdateSchema,
} from './user';

describe('User Schemas', () => {
  describe('userLoginSchema', () => {
    it('should accept valid login data', () => {
      const data = {
        email: 'user@example.com',
        password: 'password123',
      };
      expect(userLoginSchema.parse(data)).toEqual({
        email: 'user@example.com',
        password: 'password123',
      });
    });

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => userLoginSchema.parse(data)).toThrow('email');
    });

    it('should reject empty password', () => {
      const data = {
        email: 'user@example.com',
        password: '',
      };
      expect(() => userLoginSchema.parse(data)).toThrow('required');
    });
  });

  describe('userRegisterSchema', () => {
    it('should accept valid registration data', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password123',
        displayName: 'John Doe',
        acceptTerms: true,
      };
      const result = userRegisterSchema.parse(data);
      expect(result.email).toBe('user@example.com');
      expect(result.displayName).toBe('John Doe');
    });

    it('should reject weak password', () => {
      const data = {
        email: 'user@example.com',
        password: 'weak',
        displayName: 'John Doe',
        acceptTerms: true,
      };
      expect(() => userRegisterSchema.parse(data)).toThrow();
    });

    it('should reject without accepting terms', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password123',
        displayName: 'John Doe',
        acceptTerms: false,
      };
      expect(() => userRegisterSchema.parse(data)).toThrow('accept the terms');
    });

    it('should trim display name', () => {
      const data = {
        email: 'user@example.com',
        password: 'Password123',
        displayName: '  John Doe  ',
        acceptTerms: true,
      };
      const result = userRegisterSchema.parse(data);
      expect(result.displayName).toBe('John Doe');
    });
  });

  describe('passwordChangeSchema', () => {
    it('should accept valid password change', () => {
      const data = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456',
      };
      expect(passwordChangeSchema.parse(data)).toEqual(data);
    });

    it('should reject when passwords do not match', () => {
      const data = {
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword456',
        confirmPassword: 'DifferentPassword789',
      };
      expect(() => passwordChangeSchema.parse(data)).toThrow('do not match');
    });

    it('should reject when new password is same as current', () => {
      const data = {
        currentPassword: 'Password123',
        newPassword: 'Password123',
        confirmPassword: 'Password123',
      };
      expect(() => passwordChangeSchema.parse(data)).toThrow('must be different');
    });
  });

  describe('userProfileUpdateSchema', () => {
    it('should accept partial updates', () => {
      const data = {
        displayName: 'New Name',
      };
      expect(userProfileUpdateSchema.parse(data)).toEqual(data);
    });

    it('should accept empty update', () => {
      const data = {};
      expect(userProfileUpdateSchema.parse(data)).toEqual(data);
    });

    it('should validate bio length', () => {
      const longBio = 'a'.repeat(501);
      const data = {
        bio: longBio,
      };
      expect(() => userProfileUpdateSchema.parse(data)).toThrow('not exceed 500');
    });
  });
});

