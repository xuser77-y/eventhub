import { z } from 'zod';
import { EVENT_STATUSES } from '../utils/constants.js';

const eventFields = {
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullable(),
  location: z.string().trim().min(1).max(255),
  eventDate: z.string().datetime({ offset: true }),
  maxParticipants: z.coerce.number().int().positive()
};

export const createEventSchema = z.object(eventFields);

export const updateEventSchema = z.object({
  title: eventFields.title.optional(),
  description: eventFields.description.optional(),
  location: eventFields.location.optional(),
  eventDate: eventFields.eventDate.optional(),
  maxParticipants: eventFields.maxParticipants.optional()
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field must be provided.'
});

export const eventIdSchema = z.object({
  id: z.string().uuid()
});

export const eventListQuerySchema = z.object({
  status: z.enum(EVENT_STATUSES).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected date in YYYY-MM-DD format.').optional()
});

export const eventStatusSchema = z.object({
  status: z.enum(['published', 'cancelled'])
});
