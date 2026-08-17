export const eventRecordSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'title', 'startDate', 'endDate', 'status'],
  properties: {
    id: { type: 'string', minLength: 1 },
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    location: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    maxAttendees: { type: 'integer' },
    status: { enum: ['draft', 'published', 'cancelled'] },
    formId: { type: 'string' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
} as const;

export const createEventSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'startDate', 'endDate'],
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    location: { type: 'string' },
    startDate: { type: 'string' },
    endDate: { type: 'string' },
    maxAttendees: { type: 'integer' },
    status: { enum: ['draft', 'published'] },
    formId: { type: 'string' },
  },
} as const;

export const createOrderSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['eventId'],
  properties: {
    eventId: { type: 'string', minLength: 1 },
    userId: { type: 'string' },
    status: { enum: ['pending', 'confirmed', 'cancelled'] },
    data: { type: 'object' },
  },
} as const;

export const orderRecordSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['id', 'eventId', 'userId', 'status', 'data'],
  properties: {
    id: { type: 'string', minLength: 1 },
    eventId: { type: 'string', minLength: 1 },
    userId: { type: 'string', minLength: 1 },
    status: { enum: ['pending', 'confirmed', 'cancelled'] },
    data: { type: 'object' },
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' },
  },
} as const;
