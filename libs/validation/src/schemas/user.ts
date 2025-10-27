/**
 * User validation schemas
 * For auth, profile, and user management
 */

import { z } from 'zod';

import { emailSchema, passwordSchema, phoneSchema, uuidSchema } from './common';

/**
 * User registration schema
 */
export const userRegisterSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must not exceed 50 characters')
    .trim(),
  phone: phoneSchema.optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export type UserRegister = z.infer<typeof userRegisterSchema>;

/**
 * User login schema
 */
export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type UserLogin = z.infer<typeof userLoginSchema>;

/**
 * User profile schema
 */
export const userProfileSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  displayName: z.string().min(2).max(50).trim(),
  avatar: z.string().url().optional().nullable(),
  phone: phoneSchema.optional().nullable(),
  bio: z.string().max(500, 'Bio must not exceed 500 characters').optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * User profile update schema (partial)
 */
export const userProfileUpdateSchema = userProfileSchema
  .pick({
    displayName: true,
    avatar: true,
    phone: true,
    bio: true,
  })
  .partial();

export type UserProfileUpdate = z.infer<typeof userProfileUpdateSchema>;

/**
 * Password change schema
 */
export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type PasswordChange = z.infer<typeof passwordChangeSchema>;

/**
 * Email verification schema
 */
export const emailVerificationSchema = z.object({
  email: emailSchema,
  code: z.string().length(6, 'Verification code must be 6 digits').regex(/^\d{6}$/, 'Invalid code format'),
});

export type EmailVerification = z.infer<typeof emailVerificationSchema>;

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password reset schema
 */
export const passwordResetSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type PasswordReset = z.infer<typeof passwordResetSchema>;

/**
 * User role enum
 */
export const userRoleSchema = z.enum(['user', 'admin', 'moderator'], {
  errorMap: () => ({ message: 'Invalid user role' }),
});

export type UserRole = z.infer<typeof userRoleSchema>;

