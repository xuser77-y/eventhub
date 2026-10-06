import { z } from 'zod';
import { REGISTRATION_STATUSES } from '../utils/constants.js';

export const createRegistrationSchema = z.object({ eventId: z.string().uuid(), participantId: z.string().uuid() });
export const registrationIdSchema = z.object({ id: z.string().uuid() });
export const registrationListQuerySchema = z.object({ eventId: z.string().uuid().optional(), status: z.enum(REGISTRATION_STATUSES).optional() });
export const registrationStatusSchema = z.object({ status: z.enum(['confirmed', 'cancelled']) });
