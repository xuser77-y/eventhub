import { z } from 'zod';
const email = z.string().trim().toLowerCase().email().max(255);
const password = z.string().min(12).max(255);
const fullName = z.string().trim().min(1).max(150);
const role = z.enum(['admin', 'staff']);
export const userIdSchema = z.object({ id: z.string().uuid() });
export const createUserSchema = z.object({ fullName, email, password, role });
export const updateUserSchema = z.object({ fullName: fullName.optional(), email: email.optional(), password: password.optional(), role: role.optional() }).refine((v) => Object.keys(v).length > 0, { message: 'At least one field must be provided.' });
