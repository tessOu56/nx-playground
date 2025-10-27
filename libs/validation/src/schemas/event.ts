/**
 * Event validation schemas
 * For event-cms and event-portal
 */

import { z } from 'zod';

import {
  dateStringSchema,
  localeSchema,
  nonNegativeIntSchema,
  positiveIntSchema,
  slugSchema,
  urlSchema,
  uuidSchema,
} from './common';

/**
 * Event status enum
 */
export const eventStatusSchema = z.enum(['draft', 'published', 'cancelled', 'completed'], {
  errorMap: () => ({ message: 'Invalid event status' }),
});

export type EventStatus = z.infer<typeof eventStatusSchema>;

/**
 * Event visibility enum
 */
export const eventVisibilitySchema = z.enum(['public', 'private', 'unlisted'], {
  errorMap: () => ({ message: 'Invalid event visibility' }),
});

export type EventVisibility = z.infer<typeof eventVisibilitySchema>;

/**
 * Event create schema
 */
export const eventCreateSchema = z
  .object({
    title: z
      .string()
      .min(3, 'Title must be at least 3 characters')
      .max(200, 'Title must not exceed 200 characters')
      .trim(),
    slug: slugSchema,
    description: z
      .string()
      .min(10, 'Description must be at least 10 characters')
      .max(5000, 'Description must not exceed 5000 characters')
      .trim(),
    startDate: dateStringSchema,
    endDate: dateStringSchema,
    location: z
      .string()
      .min(3, 'Location must be at least 3 characters')
      .max(200, 'Location must not exceed 200 characters')
      .trim()
      .optional(),
    venue: z.string().max(200, 'Venue must not exceed 200 characters').trim().optional(),
    capacity: positiveIntSchema.optional(),
    coverImage: urlSchema.optional(),
    status: eventStatusSchema.default('draft'),
    visibility: eventVisibilitySchema.default('public'),
    locale: localeSchema.default('en'),
    tags: z
      .array(
        z
          .string()
          .min(2, 'Tag must be at least 2 characters')
          .max(30, 'Tag must not exceed 30 characters')
      )
      .max(10, 'Maximum 10 tags allowed')
      .optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type EventCreate = z.infer<typeof eventCreateSchema>;

/**
 * Event update schema (partial)
 */
export const eventUpdateSchema = eventCreateSchema.partial();

export type EventUpdate = z.infer<typeof eventUpdateSchema>;

/**
 * Event schema (full)
 */
export const eventSchema = eventCreateSchema.extend({
  id: uuidSchema,
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
  publishedAt: dateStringSchema.optional().nullable(),
  registrationCount: nonNegativeIntSchema.default(0),
});

export type Event = z.infer<typeof eventSchema>;

/**
 * Event registration schema
 */
export const eventRegistrationSchema = z.object({
  eventId: uuidSchema,
  userId: uuidSchema.optional(), // Optional for guest registration
  displayName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  email: z.string().email('Invalid email format'),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  customFields: z.record(z.unknown()).optional(), // Dynamic form fields
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms' }),
  }),
});

export type EventRegistration = z.infer<typeof eventRegistrationSchema>;

/**
 * Event filter schema (for querying)
 */
export const eventFilterSchema = z.object({
  status: eventStatusSchema.optional(),
  visibility: eventVisibilitySchema.optional(),
  locale: localeSchema.optional(),
  tags: z.array(z.string()).optional(),
  startDateFrom: dateStringSchema.optional(),
  startDateTo: dateStringSchema.optional(),
  search: z.string().max(200).optional(), // Search in title/description
});

export type EventFilter = z.infer<typeof eventFilterSchema>;

/**
 * Event form field schema (for dynamic forms)
 */
export const eventFormFieldSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'radio', 'checkbox', 'date']),
  label: z.string().min(1).max(200),
  placeholder: z.string().max(200).optional(),
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // For select/radio/checkbox
  validation: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      pattern: z.string().optional(),
    })
    .optional(),
});

export type EventFormField = z.infer<typeof eventFormFieldSchema>;

/**
 * Event template schema
 */
export const eventTemplateSchema = z.object({
  id: uuidSchema,
  name: z.string().min(3).max(100).trim(),
  description: z.string().max(500).optional(),
  formFields: z.array(eventFormFieldSchema),
  createdAt: dateStringSchema,
  updatedAt: dateStringSchema,
});

export type EventTemplate = z.infer<typeof eventTemplateSchema>;

