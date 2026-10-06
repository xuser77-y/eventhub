import { z } from 'zod';

const fields = {
  fullName: z.string().trim().min(1).max(150),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().min(1).max(30).nullable().optional()
};

export const createParticipantSchema = z.object(fields);
export const updateParticipantSchema = z.object({
  fullName: fields.fullName.optional(),
  email: fields.email.optional(),
  phone: fields.phone.optional()
}).refine((value) => Object.keys(value).length > 0, { message: 'At least one field must be provided.' });
export const participantIdSchema = z.object({ id: z.string().uuid() });
export const participantListQuerySchema = z.object({ search: z.string().trim().max(255).optional() });
